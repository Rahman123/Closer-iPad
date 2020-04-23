export const UPDATE_CURRENT_VIEWING_INFO = 'UPDATE_CURRENT_VIEWING_INFO'
export const UPDATE_ASSOCIATION_SEARCH_RESULTS =
	'UPDATE_ASSOCIATION_SEARCH_RESULTS'
export const CLEAR_MEETING_INFO = 'CLEAR_MEETING_INFO'
export const SET_SAVED_ASSOCIATION = 'SET_SAVED_ASSOCIATION'
export const SET_SELECTED_ASSOCIATION = 'SET_SELECTED_ASSOCIATION'
export const REMOVE_SELECTED_ASSOCIATION = 'REMOVE_SELECTED_ASSOCIATION'
export const UPDATE_STAR_RATINGS = 'UPDATE_STAR_RATINGS'
export const HIDE_UPLOAD_SUCCESS = 'HIDE_UPLOAD_SUCCESS'
export const SHOW_UPLOAD_SUCCESS = 'SHOW_UPLOAD_SUCCESS'
export const REMOVE_ITEM_FROM_VIEWING_LIST = 'REMOVE_ITEM_FROM_VIEWING_LIST'
export const ADD_CURRENT_VIEWING_INFO_TO_LIST =
	'ADD_CURRENT_VIEWING_INFO_TO_LIST'

import QueryHelper from '../utils/queryHelper'
import { changeLoadingState } from '../utils/actionUtilities'

export const updateCurrentViewingInfo = currentViewingInfo => {
	return async dispatch => {
		dispatch({
			type: UPDATE_CURRENT_VIEWING_INFO,
			payload: { currentViewingInfo }
		})
	}
}

export const addCurrentViewingInfoToList = () => {
	return async dispatch => {
		try {
			const position = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject, {
					enableHighAccuracy: true,
					timeout: 20000,
					maximumAge: 1000
				})
			})
			dispatch({
				type: ADD_CURRENT_VIEWING_INFO_TO_LIST,
				payload: { ...position }
			})
		} catch (e) {}
	}
}

export const updateStarRatings = starRating => {
	return async dispatch => {
		dispatch({
			type: UPDATE_STAR_RATINGS,
			payload: starRating
		})
	}
}
export const clearMeetingInfo = () => {
	return async dispatch => {
		dispatch({
			type: CLEAR_MEETING_INFO
		})
	}
}

export const removeFromViewingInfoList = ({
	versionDataId,
	timestamp,
	uniqueId
}) => {
	return async (dispatch, getState) => {
		const { viewingInfoList } = getState().analyticsReducer
		const newViewingInfoList = viewingInfoList.filter(vi => {
			return !(
				vi.versionDataId === versionDataId &&
				vi.uniqueId === uniqueId &&
				vi.timestamp === timestamp
			)
		})
		dispatch({
			type: REMOVE_ITEM_FROM_VIEWING_LIST,
			payload: { viewingInfoList: newViewingInfoList }
		})
	}
}

export const hideUploadSuccess = () => {
	return async dispatch => {
		dispatch({
			type: HIDE_UPLOAD_SUCCESS
		})
	}
}

export const uploadMeetingInfo = () => {
	return async (dispatch, getState) => {
		changeLoadingState(true, dispatch, 'uploadMeetingInfo')
		let {
			viewingInfoList,
			savedAssociations,
			starRatings
		} = getState().analyticsReducer

		/**
		 * Pepare ContentViewingInfo for insertion into Salesforce org.
		 * Only submit for which a contentDocumentId exists (removes
		 * corrupted files viewed and the like.)
		 */
		viewingInfoList = viewingInfoList
			.filter(vi => vi.contentDocumentId)
			.map(vi => ({
				starRating: starRatings[vi.versionDataId],
				...savedAssociations,
				...vi
			}))

		let { hasErrors } =
			(await QueryHelper.uploadViewingInfo(viewingInfoList)) || {}
		if (!hasErrors) {
			dispatch({
				type: CLEAR_MEETING_INFO
			})
			dispatch({
				type: SHOW_UPLOAD_SUCCESS
			})
		}
		changeLoadingState(false, dispatch, 'uploadMeetingInfo')
	}
}

export const searchForAssociations = queryPhrase => {
	return async dispatch => {
		changeLoadingState(true, dispatch, 'searchForAssociations')

		const {
			searchRecords = []
		} = await QueryHelper.queryContactsOpportunitiesAndAccounts(queryPhrase)

		dispatch({
			type: UPDATE_ASSOCIATION_SEARCH_RESULTS,
			payload: { associationSearchResults: searchRecords }
		})
		changeLoadingState(false, dispatch, 'searchForAssociations')
	}
}

export const clearAssociationSearchResults = () => {
	return async dispatch => {
		changeLoadingState(false, dispatch, 'clearAssociationSearchResults')
		dispatch({
			type: UPDATE_ASSOCIATION_SEARCH_RESULTS,
			payload: { associationSearchResults: [] }
		})
	}
}

export const setSelectedAssociation = association => {
	return async dispatch => {
		dispatch({
			type: SET_SELECTED_ASSOCIATION,
			payload: association
		})
	}
}

export const setSavedAssociation = () => {
	return async dispatch => {
		dispatch({
			type: SET_SAVED_ASSOCIATION
		})
	}
}

export const removeAssociation = type => {
	return async dispatch => {
		dispatch({
			type: REMOVE_SELECTED_ASSOCIATION,
			payload: type
		})
	}
}
