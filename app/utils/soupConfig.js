const soupConfig = {
	isGlobalStore: false,
	soupName: 'contentCategories',
	indexSpecs: [
		{ path: 'Id', type: 'string' },
		{ path: 'userId', type: 'string' },
		{ path: 'contentCategoryId', type: 'string' },
		{ path: 'Name', type: 'full_text' },
		{ path: 'isRoot', type: 'string' },
		{ path: '__local__', type: 'string' }
	],
	query: {
		fieldlist: [
			'Id',
			'Name',
			'Closer__Parent_Content_Category__c',
			'Closer__Parent_Content_Category__r.Closer__Parent_Content_Category__c',
			'(select id from Closer__content_categories__r)',
			'(select id, contentdocumentId, contentdocument.latestpublishedversion.title,contentdocument.latestpublishedversion.ContentSize, contentdocument.latestpublishedversion.Id, contentdocument.latestpublishedversionid, contentdocument.latestpublishedversion.Closer__is_banner__c, contentdocument.latestpublishedversion.Closer__is_tile__c, contentdocument.latestpublishedversion.fileextension from contentdocumentlinks order by contentdocument.latestpublishedversion.ContentSize)'
		],
		sObject: 'closer__content_category__c',
		limit: null,
		where: null,
		order: 'Name'
	}
}

module.exports = soupConfig
