import {
	ADD_ID_TO_HISTORY,
	FINISHED_RESETTING,
	INIT,
	LOGOUT,
	LOADING_CHANGE,
	RECEIVE_ALL_CONTENT_INFO,
	REFRESH_DATA,
	RESET_ALL_CONTENT,
	SET_SCREEN_DIMENSIONS,
	SET_TOTAL_SIZE,
	UPDATE_CONNECTION_STATUS,
	UPDATE_CURRENT_CONTENT_ID,
	UPDATE_HISTORY,
	UPDATE_PREFETCHED_CHILDREN,
	UPDATE_PROGRESS,
	UPDATE_SORT_CHOICES,
	UPDATE_SELECTED_PROFILE,
	UPDATE_VIEW_MAP
} from '../actions/dataActions'

let dataState = {
	allContentInfo: [],
	history: [],
	viewMap: {},
	progress: {},
	sortChoices: {},
	allRootContent: [],
	totalBytesWritten: 0,
	waitingFunctions: {}
}

const dataReducer = (state = dataState, action) => {
	const { history, viewMap, sortChoices } = state
	switch (action.type) {
		case INIT:
			state = { ...state, ...action.payload }
			return state
		case REFRESH_DATA:
			state = { ...state, ...action.payload }
			return state
		case LOGOUT:
			state = { history: [], viewMap: {}, progress: {}, sortChoices: {} }
			return state
		case LOADING_CHANGE:
			const {
				loading,
				totalBytesWritten,
				totalSize,
				callingFunction
			} = action.payload
			const { waitingFunctions } = state
			const newWaitingFunctions = {
				...waitingFunctions,
				[callingFunction]: loading
			}
			
			let anyLoading = Object.values(newWaitingFunctions).some(
				isLoading => isLoading
			)
			state = {
				...state,
				waitingFunctions: newWaitingFunctions,
				totalBytesWritten,
				totalSize,
				loading: anyLoading
			}
			return state
		case RECEIVE_ALL_CONTENT_INFO:
			state = { ...state, ...action.payload }
			return state
		case RESET_ALL_CONTENT:
			state = {
				...state,
				allRootContent: [],
				allContentInfo: [],
				history: [],
				viewMap: {},
				progress: {},
				sortChoices: {},
				isResetting: true
			}
			return state
		case FINISHED_RESETTING:
			state = { ...state, isResetting: false }
			return state
		case SET_SCREEN_DIMENSIONS:
			state = { ...state, ...action.payload }
			return state

		case SET_TOTAL_SIZE:
			state = { ...state, ...action.payload }
			return state
		case UPDATE_CURRENT_CONTENT_ID:
			state = { ...state, ...action.payload }
			return state
		case UPDATE_VIEW_MAP:
			state = { ...state, viewMap: { ...viewMap, ...action.payload } }
			return state
		case UPDATE_HISTORY:
			state = { ...state, history: action.payload }
			return state
		case UPDATE_PREFETCHED_CHILDREN:
			state = { ...state, viewMap: { ...viewMap, ...action.payload } }
			return state
		case UPDATE_CONNECTION_STATUS:
			state = { ...state, ...action.payload }
			return state
		case UPDATE_SELECTED_PROFILE:
			state = { ...state, ...action.payload, history: [] }
			return state
		case UPDATE_PROGRESS:
			state = {
				...state,
				...action.payload
			}
			return state
		case UPDATE_SORT_CHOICES:
			state = { ...state, sortChoices: { ...sortChoices, ...action.payload } }
			return state
		case ADD_ID_TO_HISTORY:
			newHistory = history.slice()
			newHistory.push(action.payload)
			state = { ...state, history: newHistory }
			return state
		default:
			return state
	}
}
export default dataReducer
