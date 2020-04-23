import { oauth, net, smartstore } from 'react-native-force'
export default class Salesforce {
	//oauth
	static logout() {
		oauth.logout()
	}
	static authenticate(...args) {
		return Salesforce.promiseGenerator(oauth.authenticate)(...args)
	}
	static getAuthCredentials(...args) {
		return Salesforce.promiseGenerator(oauth.getAuthCredentials)(...args)
	}
	static logout(...args) {
		return Salesforce.promiseGenerator(oauth.logout)(...args)
	}

	//net
	static setApiVersion(...args) {
		return Salesforce.promiseGenerator(net.setApiVersion)(...args)
	}
	static getApiVersion(...args) {
		return Salesforce.promiseGenerator(net.getApiVersion)(...args)
	}
	static sendRequest(...args) {
		return Salesforce.promiseGenerator(net.sendRequest, 2, 3)(...args)
	}
	static versions(...args) {
		return Salesforce.promiseGenerator(net.versions)(...args)
	}
	static resources(...args) {
		return Salesforce.promiseGenerator(net.resources)(...args)
	}
	static describeGlobal(...args) {
		return Salesforce.promiseGenerator(net.describeGlobal)(...args)
	}
	static metadata(...args) {
		return Salesforce.promiseGenerator(net.metadata)(...args)
	}
	static describe(...args) {
		return Salesforce.promiseGenerator(net.describe)(...args)
	}
	static describeLayout(...args) {
		return Salesforce.promiseGenerator(net.describeLayout)(...args)
	}
	static create(...args) {
		return Salesforce.promiseGenerator(net.create)(...args)
	}
	static retrieve(...args) {
		return Salesforce.promiseGenerator(net.retrieve)(...args)
	}
	static upsert(...args) {
		return Salesforce.promiseGenerator(net.upsert)(...args)
	}
	static update(...args) {
		return Salesforce.promiseGenerator(net.update)(...args)
	}
	static del(...args) {
		return Salesforce.promiseGenerator(net.del)(...args)
	}
	static query(...args) {
		return Salesforce.promiseGenerator(net.query)(...args)
	}
	static queryMore(...args) {
		return Salesforce.promiseGenerator(net.queryMore)(...args)
	}
	static search(...args) {
		return Salesforce.promiseGenerator(net.search)(...args)
	}
	static getAttachment(...args) {
		return Salesforce.promiseGenerator(net.getAttachment)(...args)
	}

	//smartstore
	static buildAllQuerySpec(...args) {
		return smartstore.buildAllQuerySpec(...args)
	}
	static buildExactQuerySpec(...args) {
		return smartstore.buildExactQuerySpec(...args)
	}
	static buildRangeQuerySpec(...args) {
		return smartstore.buildRangeQuerySpec(...args)
	}
	static buildLikeQuerySpec(...args) {
		return smartstore.buildLikeQuerySpec(...args)
	}
	static buildMatchQuerySpec(...args) {
		return smartstore.buildMatchQuerySpec(...args)
	}
	static buildSmartQuerySpec(...args) {
		return smartstore.buildSmartQuerySpec(...args)
	}

	static getDatabaseSize(...args) {
		return Salesforce.promiseGenerator(smartstore.getDatabaseSize)(...args)
	}
	static registerSoup(...args) {
		return Salesforce.promiseGenerator(smartstore.registerSoup)(...args)
	}
	static registerSoupWithSpec(...args) {
		return Salesforce.promiseGenerator(smartstore.registerSoupWithSpec)(...args)
	}
	static removeSoup(...args) {
		return Salesforce.promiseGenerator(smartstore.removeSoup)(...args)
	}
	static getSoupIndexSpecs(...args) {
		return Salesforce.promiseGenerator(smartstore.getSoupIndexSpecs)(...args)
	}
	static getSoupSpec(...args) {
		return Salesforce.promiseGenerator(smartstore.getSoupSpec)(...args)
	}
	static alterSoup(...args) {
		return Salesforce.promiseGenerator(smartstore.alterSoup)(...args)
	}
	static alterSoupWithSpec(...args) {
		return Salesforce.promiseGenerator(smartstore.alterSoupWithSpec)(...args)
	}
	static reIndexSoup(...args) {
		return Salesforce.promiseGenerator(smartstore.reIndexSoup)(...args)
	}
	static clearSoup(...args) {
		return Salesforce.promiseGenerator(smartstore.clearSoup)(...args)
	}
	static soupExists(...args) {
		return Salesforce.promiseGenerator(smartstore.soupExists)(...args)
	}
	static querySoup(...args) {
		return Salesforce.promiseGenerator(smartstore.querySoup)(...args)
	}
	static runSmartQuery(...args) {
		return Salesforce.promiseGenerator(smartstore.runSmartQuery)(...args)
	}
	static retrieveSoupEntries(...args) {
		return Salesforce.promiseGenerator(smartstore.retrieveSoupEntries)(...args)
	}
	static upsertSoupEntries(...args) {
		return Salesforce.promiseGenerator(smartstore.upsertSoupEntries)(...args)
	}
	static removeFromSoup(...args) {
		return Salesforce.promiseGenerator(smartstore.removeFromSoup)(...args)
	}
	static moveCursorToPageIndex(...args) {
		return Salesforce.promiseGenerator(smartstore.moveCursorToPageIndex)(
			...args
		)
	}
	static moveCursorToNextPage(...args) {
		return Salesforce.promiseGenerator(smartstore.moveCursorToNextPage)(...args)
	}
	static moveCursorToPreviousPage(...args) {
		return Salesforce.promiseGenerator(smartstore.moveCursorToPreviousPage)(
			...args
		)
	}
	static closeCursor(...args) {
		return Salesforce.promiseGenerator(smartstore.closeCursor)(...args)
	}
	static getAllStores(...args) {
		return Salesforce.promiseGenerator(smartstore.getAllStores)(...args)
	}
	static getAllGlobalStores(...args) {
		return Salesforce.promiseGenerator(smartstore.getAllGlobalStores)(...args)
	}
	static removeStore(...args) {
		return Salesforce.promiseGenerator(smartstore.removeStore)(...args)
	}
	static removeAllGlobalStores(...args) {
		return Salesforce.promiseGenerator(smartstore.removeAllGlobalStores)(
			...args
		)
	}
	static removeAllStores(...args) {
		return Salesforce.promiseGenerator(smartstore.removeAllStores)(...args)
	}

	//smartsync
	static syncDown(...args) {
		return Salesforce.promiseGenerator(smartsync.syncDown)(...args)
	}
	static reSync(...args) {
		return Salesforce.promiseGenerator(smartsync.reSync)(...args)
	}
	static cleanResyncGhosts(...args) {
		return Salesforce.promiseGenerator(smartsync.cleanResyncGhosts)(...args)
	}
	static syncUp(...args) {
		return Salesforce.promiseGenerator(smartsync.syncUp)(...args)
	}
	static getSyncStatus(...args) {
		return Salesforce.promiseGenerator(smartsync.getSyncStatus)(...args)
	}
	static deleteSync(...args) {
		return Salesforce.promiseGenerator(smartsync.deleteSync)(...args)
	}

	//convenience
	static async checkAndAuthenticate() {
		try {
			const userInfo = await Salesforce.getAuthCredentials()
			return userInfo
		} catch (e) {
			await new Promise((resolve, reject) => {
				oauth.authenticate(resolve, reject)
			})
			return Salesforce.checkAndAuthenticate()
		}
	}

	static upsertSoupEntriesWithExternalId(...args) {
		return Salesforce.promiseGenerator(
			smartstore.upsertSoupEntriesWithExternalId
		)(...args)
	}

	static getVersionData(id, apiVersion = 'v42.0') {
		return net.sendRequest(
			'/services/data',
			`/${apiVersion}/sobjects/ContentVersion/${id}/VersionData`,
			'GET',
			null,
			null,
			null,
			true /* return binary */
		)
	}

	static promiseGenerator(fn, successIdx, failureIdx) {
		return (...args) => {
			return new Promise((resolveFunction, rejectFunction) => {
				if (!successIdx && !failureIdx)
					args = [...args, resolveFunction, rejectFunction]
				if (successIdx) args.splice(successIdx, 0, resolveFunction)
				if (failureIdx) args.splice(failureIdx, 0, rejectFunction)
				fn(...args)
			})
		}
	}
}
