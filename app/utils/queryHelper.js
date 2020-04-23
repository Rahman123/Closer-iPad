import { smartstore } from 'react-native-force'
import RNFS from 'react-native-fs'
import throttle from 'lodash/throttle'

import Salesforce from './salesforce'

import soupConfig from './soupConfig'
export default class QueryHelper {
	static async init(progressCb, totalSizeCb) {
		const { userId } = await Salesforce.checkAndAuthenticate()
		const soupExists = await QueryHelper.checkForSoupAndCreate()
		if (!soupExists) {
			await QueryHelper.syncData(progressCb, totalSizeCb)
		}

		return userId
	}

	static async checkForSoupAndCreate(isResync) {
		const { isGlobalStore, soupName, indexSpecs } = soupConfig
		const { userId } = await Salesforce.checkAndAuthenticate()
		const soupExists = await Salesforce.soupExists(
			{ storeName: userId, isGlobalStore },
			soupName
		)
		if (!soupExists) {
			await Salesforce.registerSoup(
				{ storeName: userId, isGlobalStore },
				soupName,
				indexSpecs
			)
		}

		if (isResync) {
			Salesforce.clearSoup({ storeName: userId, isGlobalStore }, soupName)
		}

		return soupExists
	}

	static async syncData(progressCb = () => {}, totalSizeCb = () => {}) {
		await QueryHelper.checkForSoupAndCreate(true)

		const queryString = QueryHelper.buildSoql()
		const queryResults = await Salesforce.query(queryString)
		let contentVersionInfo = QueryHelper.extractContentVersionInfo(queryResults)
		const totalSize = QueryHelper.getTotalSize(contentVersionInfo)
		totalSizeCb(totalSize)

		const downloadResultPromises = await QueryHelper.loadAllContentToFiles(
			contentVersionInfo,
			progressCb
		)

		//Necessary to attach the complete handler to each promise as it resolves
		//for background downloading to work.
		for (let drp of downloadResultPromises) {
			await drp.promise
			RNFS.completeHandlerIOS(drp.jobId)
		}

		const allVersionDataIds = await QueryHelper.getContentAndImages(
			queryResults.records
		)
		return allVersionDataIds
	}

	static async logout() {
		Salesforce.logout()
	}

	static async emailContent(message) {
		const { accessToken, instanceUrl } = await Salesforce.getAuthCredentials()

		const url = `${instanceUrl}/services/apexrest/Closer/email-content/`
		const request = {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			body: JSON.stringify({ message })
		}

		const response = await fetch(url, request)
		return response
	}

	static async queryContactsOpportunitiesAndAccounts(queryPhrase) {
		//using fetch here because MobileSDK net.search returns error on SOSL ¯\_(ツ)_/¯
		const queryString = `FIND+{${queryPhrase}}+IN+Name+Fields+RETURNING+account(id,+name,+phone,+billingaddress),
    +contact(id,+name,+firstname,+accountid,+mailingaddress,+phone,+email),+opportunity(id,+name,+accountId)`

		const { accessToken, instanceUrl } = await Salesforce.getAuthCredentials()

		const url = `${instanceUrl}/services/data/v43.0/search?q=${queryString}`
		const request = {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			}
		}

		let response = await fetch(url, request)
		response = await response.json()
		return response
	}

	static async resetAllContent() {
		const { userId } = await Salesforce.getAuthCredentials()
		const exists = await RNFS.exists(`${RNFS.DocumentDirectoryPath}/${userId}`)
		if (exists) RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${userId}`)

		Salesforce.removeSoup(
			{ storeName: userId, isGlobalStore: false },
			'contentCategories'
		)
		Salesforce.removeSoup(
			{ storeName: userId, isGlobalStore: false },
			'contentData'
		)
	}

	static async getAllContentInfo() {
		try {
			const { soupName, isGlobalStore } = soupConfig
			const { userId } = await Salesforce.getAuthCredentials()
			let querySpec = Salesforce.buildSmartQuerySpec(
				`SELECT 
        {${soupName}:_soup}
        FROM {${soupName}} 
        ORDER BY {${soupName}:Name}`,
				500
			)

			const { currentPageOrderedEntries } = await Salesforce.runSmartQuery(
				{ storeName: userId, isGlobalStore },
				querySpec
			)

			let allContent = currentPageOrderedEntries.reduce(
				(a, [{ relatedContentInfo = [] } = {}]) => [
					...a,
					...relatedContentInfo
				],
				[]
			)
			return allContent
		} catch (e) {
			return []
		}
	}

	static uploadViewingInfo(viewingInfo) {
		let records = QueryHelper.buildViewingInfoRecords(viewingInfo)
		return Salesforce.sendRequest(
			'/services/data',
			`/v43.0/composite/tree/Closer__Content_Viewing_Info__c/`,
			'POST',
			records
		)
	}

	static async getAllRootContent() {
		const { isGlobalStore, soupName } = soupConfig
		const { userId } = await Salesforce.getAuthCredentials()
		let querySpec = Salesforce.buildSmartQuerySpec(
			`select {${soupName}:contentCategoryId}, {${soupName}:Name} from {${soupName}} 
      where {${soupName}:isRoot} = 'true' and {${soupName}:userId} = '${userId}'`
		)
		const queryResult = await Salesforce.runSmartQuery(
			{
				storeName: userId,
				isGlobalStore
			},
			querySpec
		)
		return queryResult.currentPageOrderedEntries
			? queryResult.currentPageOrderedEntries.map(c => ({
					contentCategoryId: c[0],
					contentCategoryName: c[1]
			  }))
			: []
	}

	static async getSingleViewSoup(path, matchKey) {
		const querySpec = smartstore.buildExactQuerySpec(path, matchKey)
		const { isGlobalStore, soupName } = soupConfig

		const { userId } = await Salesforce.getAuthCredentials()
		let soupViewCursor = await Salesforce.querySoup(
			{
				storeName: userId,
				isGlobalStore
			},

			soupName,
			querySpec
		)
		let soupView = soupViewCursor.currentPageOrderedEntries[0] || {}

		let childTiles = await QueryHelper.getChildTiles(
			soupView.childCategories || []
		)

		soupView.childTiles = childTiles || []

		return soupView
	}

	//Internal Methods

	static async downloadToLocalDirectory(
		contentVersionInfo,
		subdirectory,
		creds,
		progressCb
	) {
		const { accessToken, instanceUrl, userId } =
			creds || (await Salesforce.getAuthCredentials())
		const {
			Id: contentVersionId,
			FileExtension: fileExtension
		} = contentVersionInfo
		await RNFS.mkdir(
			`${RNFS.DocumentDirectoryPath}/${userId}/${subdirectory}`,
			{
				NSURLIsExcludedFromBackupKey: true
			}
		)

		const downloadFileOptions = {
			fromUrl: `${instanceUrl}/services/data/v43.0/sobjects/ContentVersion/${contentVersionId}/VersionData`,
			toFile: `${
				RNFS.DocumentDirectoryPath
			}/${userId}/${subdirectory}/${contentVersionId}.${fileExtension}`,
			headers: { Authorization: `Bearer ${accessToken}` },
			progress: throttle(
				res => {
					progressCb(res, contentVersionInfo)
				},
				700,
				{ trailing: true }
			),
			background: true
		}

		return RNFS.downloadFile(downloadFileOptions)
	}

	static getTotalSize(contentVersionInfo) {
		return contentVersionInfo.reduce((a, info) => a + info.ContentSize, 0)
	}

	static buildViewingInfoRecords(viewingInfo) {
		let records = viewingInfo.map((vi, i) => {
			let timestamp = new Date(vi.timestamp)
			timestamp = timestamp.toISOString()
			return {
				name: vi.contentName,
				Closer__Content_Version__c: vi.versionDataId,
				Closer__Star_Rating__c: vi.starRating,
				Closer__location__latitude__s: vi.coords.latitude,
				Closer__location__longitude__s: vi.coords.longitude,
				Closer__View_Datetime__c: timestamp,
				Closer__Viewing_Duration__c: vi.viewDuration,
				Closer__Opportunity__c: vi.Opportunity ? vi.Opportunity.Id : null,
				Closer__Account__c: vi.Account ? vi.Account.Id : null,
				Closer__Contact__c: vi.Contact ? vi.Contact.Id : null,
				attributes: {
					type: 'Closer__Content_Viewing_Info__c',
					referenceId: 'ref' + i
				},
				ContentDocumentLinks: {
					records: [
						{
							attributes: {
								type: 'ContentDocumentLink',
								referenceId: 'cdlRef' + i
							},
							ContentDocumentId: vi.contentDocumentId,
							ShareType: 'V'
						}
					]
				}
			}
		})
		return { records }
	}

	static extractContentVersionInfo({ records = [] }) {
		let contentVersionInfo = []
		records.forEach(category => {
			if (category.ContentDocumentLinks) {
				category.ContentDocumentLinks.records.forEach(cdl => {
					contentVersionInfo.push(cdl.ContentDocument.LatestPublishedVersion)
				})
			}
		})
		return contentVersionInfo
	}

	static async loadAllContentToFiles(contentVersionInfo, progressCb) {
		let creds = await Salesforce.getAuthCredentials()

		const [
			storedContentVersionIds,
			storedBannerContentVersionIds,
			storedTileContentVersionIds
		] = await Promise.all([
			QueryHelper.getStoredContentVersionIds('content'),
			QueryHelper.getStoredContentVersionIds('banners'),
			QueryHelper.getStoredContentVersionIds('tiles')
		])

		let downloadResultPromises = []

		contentVersionInfo.forEach(cvi => {
			const { Id, Closer__is_banner__c, Closer__is_tile__c } = cvi

			let subdirectory
			if (Closer__is_banner__c) {
				subdirectory = 'banners'
			} else if (Closer__is_tile__c) {
				subdirectory = 'tiles'
			} else {
				subdirectory = 'content'
			}

			if (subdirectory === 'banners' && storedBannerContentVersionIds.has(Id))
				return
			if (subdirectory === 'tiles' && storedTileContentVersionIds.has(Id))
				return
			if (subdirectory === 'content' && storedContentVersionIds.has(Id)) return

			let downloadResultPromise = QueryHelper.downloadToLocalDirectory(
				cvi,
				subdirectory,
				creds,
				progressCb
			)
			downloadResultPromises.push(downloadResultPromise)
		})

		downloadResultPromises = await Promise.all(downloadResultPromises)
		return downloadResultPromises
	}

	static async getContentAndImages(contentCategories) {
		const { isGlobalStore, soupName } = soupConfig
		let newEntries = []
		let allRelatedContentInfo = []
		const { userId } = await Salesforce.getAuthCredentials()
		// iterate over contentCategories
		for (let contentCategory of contentCategories) {
			let newEntry = {
				userId,
				contentCategoryId: contentCategory.Id,
				Name: contentCategory.Name,
				childCategories: []
			}

			//Sharing rules still expose the id of an object the user cannot see, so
			// the id field is returned. To check whether a shared object should be treated as
			// root, it is necessary to check the value of the whole parent record, which returns null
			// when read access to a record has not been granted.
			if (!contentCategory.Closer__Parent_Content_Category__r) {
				//booleans can't be indexed, must be indexible to be used in SmartSearch
				newEntry.isRoot = 'true'
			} else {
				newEntry.isRoot = 'false'
			}

			//extract ids from child content categories
			if (contentCategory.Closer__Content_Categories__r) {
				newEntry.childCategories = contentCategory.Closer__Content_Categories__r.records.map(
					childCat => childCat.Id
				)
			}
			let allContent = []
			// for each contentCategory get all ContentDocumentLinks
			if (contentCategory.ContentDocumentLinks) {
				allContent = contentCategory.ContentDocumentLinks.records
			}

			//iterate over all related content,
			//mark new entry as banner, tile, or neither
			//add id and file extension
			newEntry.relatedContentInfo = QueryHelper.getRelatedContentInfo(
				allContent,
				newEntry
			)

			// append new relatedContentInfo
			allRelatedContentInfo = [
				...allRelatedContentInfo,
				...newEntry.relatedContentInfo
			]

			newEntries.push(newEntry)
		}

		await Salesforce.upsertSoupEntriesWithExternalId(
			{ storeName: userId, isGlobalStore },
			soupName,
			newEntries,
			'contentCategoryId'
		)
		// remove unused files from all directories
		QueryHelper.cleanupDirectories(newEntries, allRelatedContentInfo)
		return allRelatedContentInfo
	}

	static cleanupDirectories(newEntries, allRelatedContentInfo) {
		let tileIds = []
		let bannerIds = []
		newEntries.forEach(e => {
			tileIds.push(e.tileId)
			bannerIds.push(e.bannerId)
		})
		QueryHelper.clearUnusedContent(tileIds, 'tiles')
		QueryHelper.clearUnusedContent(bannerIds, 'banners')
		allRelatedContentInfo
		QueryHelper.clearUnusedContent(
			allRelatedContentInfo.map(info => info.versionDataId),
			'content'
		)
	}

	static getRelatedContentInfo(allContent, newEntry) {
		//iterate over all related content,
		//mark new entry as banner, tile, or neither
		//add id and file extension

		//    for each ContentDocumentLinks get all versionData
		let relatedContentInfo = []
		allContent.forEach(c => {
			let latestPublishedVersion = c.ContentDocument.LatestPublishedVersion

			let contentSize = c.ContentDocument.LatestPublishedVersion.ContentSize
			let versionDataId = c.ContentDocument.LatestPublishedVersionId
			let contentDocumentId = c.ContentDocumentId

			let isBanner = latestPublishedVersion.Closer__is_banner__c
			let isTile = latestPublishedVersion.Closer__is_tile__c
			let title = latestPublishedVersion.Title

			let fileExtension = latestPublishedVersion.FileExtension
			if (isBanner) {
				newEntry.isBanner = isBanner
				newEntry.bannerId = versionDataId
				newEntry.bannerFileExtension = fileExtension
			} else if (isTile) {
				newEntry.isTile = isTile
				newEntry.tileId = versionDataId
				newEntry.tileFileExtension = fileExtension
			} else {
				relatedContentInfo.push({
					versionDataId,
					title,
					fileExtension,
					contentDocumentId,
					contentSize
				})
			}
		})
		return relatedContentInfo
	}

	static async getStoredContentVersionIds(subdirectory) {
		const { userId } = await Salesforce.getAuthCredentials()
		let contentFolderExists = await RNFS.exists(
			`${RNFS.DocumentDirectoryPath}/${userId}/${subdirectory}`
		)
		if (!contentFolderExists) return new Set()
		let paths = await RNFS.readdir(
			`${RNFS.DocumentDirectoryPath}/${userId}/${subdirectory}`
		)
		return new Set(paths.map(p => p.slice(0, p.indexOf('.'))))
	}

	static async clearUnusedContent(allRelatedContentInfo, subdirectory) {
		const { userId } = await Salesforce.getAuthCredentials()
		let directoryExists = await RNFS.exists(
			`${RNFS.DocumentDirectoryPath}/${userId}/${subdirectory}`
		)
		if (!directoryExists) return
		const storedContentVersionPaths = await RNFS.readdir(
			`${RNFS.DocumentDirectoryPath}/${userId}/${subdirectory}`
		)
		const storedContentVersionIds = storedContentVersionPaths.map(p =>
			p.slice(0, p.indexOf('.'))
		)
		let allRelatedContentInfoSet = new Set(allRelatedContentInfo)

		storedContentVersionIds.forEach((id, i) => {
			if (!allRelatedContentInfoSet.has(id)) {
				RNFS.unlink(
					`${RNFS.DocumentDirectoryPath}/${userId}/${subdirectory}/${
						storedContentVersionPaths[i]
					}`
				)
			}
		})
	}

	static buildSoql() {
		const {
			query: { fieldlist, sObject, where, order, limit }
		} = soupConfig
		const query = `SELECT ${fieldlist.join(',')} FROM ${sObject} ${
			where ? 'WHERE ' + where : ''
		} ${order ? 'ORDER By ' + order : ''} ${limit ? 'LIMIT ' + limit : ''}`
		return query
	}

	static async getChildTiles(matchKeys) {
		const { soupName, isGlobalStore } = soupConfig
		const { userId } = await Salesforce.getAuthCredentials()

		let querySpec = Salesforce.buildSmartQuerySpec(
			`SELECT 
      {${soupName}:_soup},
      {${soupName}:contentCategoryId},
      {${soupName}:Name}
      FROM {${soupName}} 
      WHERE {${soupName}:contentCategoryId}
      IN (${matchKeys.map(k => `'${k}'`).join(',')}) 
      ORDER BY {${soupName}:Name}`
		)
		const queryResult = await Salesforce.runSmartQuery(
			{
				storeName: userId,
				isGlobalStore
			},
			querySpec
		)

		let tileImages = queryResult.currentPageOrderedEntries
			.map(q => {
				const [{ tileId, contentCategoryId, Name, tileFileExtension }] = q
				return { tileId, contentCategoryId, name: Name, tileFileExtension }
			})
			.filter(img => img)

		return tileImages
	}
}
