import {
	ADD_CURRENT_VIEWING_INFO_TO_LIST,
	CLEAR_MEETING_INFO,
	HIDE_UPLOAD_SUCCESS,
	REMOVE_ITEM_FROM_VIEWING_LIST,
	REMOVE_SELECTED_ASSOCIATION,
	SET_SAVED_ASSOCIATION,
	SET_SELECTED_ASSOCIATION,
	SHOW_UPLOAD_SUCCESS,
	UPDATE_ASSOCIATION_SEARCH_RESULTS,
	UPDATE_CURRENT_VIEWING_INFO,
	UPDATE_STAR_RATINGS
} from '../actions/analyticsActions'

let analyticsState = {
	currentViewingInfo: {},
	viewingInfoList: [],
	starRatings: {}
}

const analyticsReducer = (state = analyticsState, action) => {
	const { selectedAssociations = {} } = state
	switch (action.type) {
		case CLEAR_MEETING_INFO:
			state = { ...state, viewingInfoList: [], starRatings: {} }
			return state
		case SHOW_UPLOAD_SUCCESS:
			state = { ...state, uploadCompletedSuccess: true }
			return state
		case HIDE_UPLOAD_SUCCESS:
			state = { ...state, uploadCompletedSuccess: false }
			return state
		case UPDATE_STAR_RATINGS:
			const { starRatings } = state
			state = { ...state, starRatings: { ...starRatings, ...action.payload } }
			return state
		case UPDATE_CURRENT_VIEWING_INFO:
			state = { ...state, ...action.payload }
			return state
		case UPDATE_ASSOCIATION_SEARCH_RESULTS:
			state = { ...state, ...action.payload }
			return state
		case REMOVE_ITEM_FROM_VIEWING_LIST:
			state = { ...state, ...action.payload }
			return state
		case REMOVE_SELECTED_ASSOCIATION:
			let newSelectedAssociations = { ...selectedAssociations }
			delete newSelectedAssociations[action.payload]
			state = {
				...state,
				selectedAssociations: newSelectedAssociations
			}
			return state
		case SET_SELECTED_ASSOCIATION:
			state = {
				...state,
				selectedAssociations: { ...selectedAssociations, ...action.payload }
			}
			return state
		case SET_SAVED_ASSOCIATION:
			state = {
				...state,
				savedAssociations: { ...selectedAssociations }
			}
			return state
		case ADD_CURRENT_VIEWING_INFO_TO_LIST:
			const {
				currentViewingInfo,
				viewingInfoList,
				savedAssociations = {}
			} = state
			if (
				!(
					currentViewingInfo.contentDocumentId &&
					currentViewingInfo.versionDataId
				)
			)
				return state
			state = {
				...state,
				currentViewingInfo: {},
				viewingInfoList: [
					...viewingInfoList,
					{ ...currentViewingInfo, ...action.payload, ...savedAssociations }
				]
			}
			return state
		default:
			return state
	}
}

export default analyticsReducer
