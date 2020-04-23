export const ADD_ID_TO_HISTORY = 'ADD_ID_TO_HISTORY'
export const FINISHED_RESETTING = 'FINISHED_RESETTING'
export const INIT = 'INIT'
export const LOADING_CHANGE = 'LOADING_CHANGE'
export const LOGOUT = 'LOGOUT'
export const RECEIVE_ALL_CONTENT_INFO = 'RECEIVE_ALL_CONTENT_INFO'
export const REFRESH_DATA = 'REFRESH_DATA'
export const RESET_ALL_CONTENT = 'RESET_ALL_CONTENT'
export const SET_SCREEN_DIMENSIONS = 'SET_SCREEN_DIMENSIONS'
export const SET_TOTAL_SIZE = 'SET_TOTAL_SIZE'
export const UPDATE_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS'
export const UPDATE_CURRENT_CONTENT_ID = 'UPDATE_CURRENT_CONTENT_ID'
export const UPDATE_HISTORY = 'UPDATE_HISTORY'
export const UPDATE_PREFETCHED_CHILDREN = 'UPDATE_PREFETCHED_CHILDREN'
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS'
export const UPDATE_SELECTED_PROFILE = 'UPDATE_SELECTED_PROFILE'
export const UPDATE_SORT_CHOICES = 'UPDATE_SORT_CHOICES'
export const UPDATE_VIEW_MAP = 'UPDATE_VIEW_MAP'

import QueryHelper from '../utils/queryHelper'
import { Image, NetInfo } from 'react-native'
import RNFS from 'react-native-fs'

import { changeLoadingState } from '../utils/actionUtilities'

export const init = () => {
	return async (dispatch, getState) => {
		changeLoadingState(true, dispatch, 'init')
		listenForNetworkInfoChange(dispatch)

		/***
		 * Create closure for progress callback to track as content
		 * downloads complete and update progress bar in UI.
		 *
		 * Salesforce does not return the file size, must be
		 * stored from earlier network call getting file metadata.
		 */
		const progressMap = {}
		const userId = await QueryHelper.init(
			updateProgress(dispatch, progressMap),
			size => setTotalContentSize(size)(dispatch)
		)

		/**
		 * Root content are all top-level ContentCategories (i.e., without parents),
		 * appear as Profiles in the app.
		 */
		const allRootContent = await QueryHelper.getAllRootContent()

		/**
		 * Set the first top-level ContentCategory returned as default to display.
		 */
		const rootId = allRootContent.length
			? allRootContent[0].contentCategoryId
			: null

		const { pageData, currentCategoryId } = await getPageDataHelper(
			rootId,
			userId
		)
		dispatch({
			type: INIT,
			payload: {
				allRootContent,
				userId,
				rootCategoryId: currentCategoryId,
				viewMap: { [currentCategoryId]: pageData }
			}
		})
		changeLoadingState(false, dispatch, 'init')

		/**
		 * Fetch the child category metadata in background for better
		 * responsiveness on tile tap.
		 */
		if (pageData && pageData.childCategories) {
			const { childCategories } = pageData
			preFetchChildCategories(childCategories)(dispatch, getState)
		}
	}
}

export const refreshData = () => {
  /**
   * Similar to Init, but assumes active session and soups/stores exist.
   */
	return async (dispatch, getState) => {
		changeLoadingState(true, dispatch, 'refreshData')
		const {
			dataReducer: { userId, rootCategoryId: prevRootCategoryId }
		} = getState()

		const progressMap = {}
		await QueryHelper.syncData(updateProgress(dispatch, progressMap), size =>
			setTotalContentSize(size)(dispatch)
		)

		const allRootContent = await QueryHelper.getAllRootContent()

		let rootId
		if (
			allRootContent.map(c => c.contentCategoryId).includes(prevRootCategoryId)
		) {
			rootId = prevRootCategoryId
		} else if (allRootContent.length) {
			rootId = allRootContent[0].contentCategoryId
		}
		const { pageData, currentCategoryId } = await getPageDataHelper(
			rootId,
			userId
		)

		dispatch({
			type: REFRESH_DATA,
			payload: {
				userId,
				allRootContent,
				history: [],
				viewMap: { [currentCategoryId]: pageData },
				rootCategoryId: rootId
			}
		})
		changeLoadingState(false, dispatch, 'refreshData')
		if (pageData) {
			const { childCategories } = pageData
			preFetchChildCategories(childCategories)(dispatch, getState)
		}
	}
}

export const logout = () => {
	return async (dispatch, getState) => {
		QueryHelper.logout()
		dispatch({ type: LOGOUT })
	}
}

export const updateSelectedProfile = rootId => {
	return async (dispatch, getState) => {
		changeLoadingState(true, dispatch, 'updateSelectedProfile')
		const {
			dataReducer: { userId }
		} = getState()

		const { pageData, currentCategoryId } = await getPageDataHelper(
			rootId,
			userId
		)
		dispatch({
			type: UPDATE_SELECTED_PROFILE,
			payload: {
				rootCategoryId: currentCategoryId,
				viewMap: { [currentCategoryId]: pageData }
			}
		})
		changeLoadingState(false, dispatch, 'updateSelectedProfile')
		const { childCategories } = pageData
		preFetchChildCategories(childCategories)(dispatch, getState)
	}
}

export const getPageData = id => {
	return async (dispatch, getState) => {
		const {
			dataReducer: { userId }
		} = getState()
		const payload = await getPageDataHelper(id, userId)
		dispatch({
			type: UPDATE_VIEW_MAP,
			payload
		})
		const { pageData } = payload

		dispatch({
			type: ADD_ID_TO_HISTORY,
			payload: { id: pageData.id, name: pageData.Name }
		})
	}
}

export const resetAllContent = () => {
	return async dispatch => {
		QueryHelper.resetAllContent()
		dispatch({
			type: RESET_ALL_CONTENT
		})
	}
}
export const finishedResetting = () => {
	return async dispatch => {
		dispatch({
			type: FINISHED_RESETTING
		})
	}
}

export const getAllContentInfo = () => {
	return async dispatch => {
		let allContentInfo = await QueryHelper.getAllContentInfo()
		dispatch({
			type: RECEIVE_ALL_CONTENT_INFO,
			payload: { allContentInfo }
		})
	}
}

export const sortAllContentInfo = newAllContentInfo => {
	return async dispatch => {
		dispatch({
			type: RECEIVE_ALL_CONTENT_INFO,
			payload: { allContentInfo: newAllContentInfo }
		})
	}
}

export const updateSortChoices = newSortChoice => {
	return async dispatch => {
		dispatch({
			type: UPDATE_SORT_CHOICES,
			payload: newSortChoice
		})
	}
}

//Error not handled when called by another thunk unless awaited
export const preFetchChildCategories = (childCategoryIds = []) => {
	return async (dispatch, getState) => {
		const { viewMap } = getState ? getState().dataReducer : { viewMap: {} }
		const {
			dataReducer: { userId }
		} = getState()
		const newChildCategoryIds = childCategoryIds.filter(c => !(c in viewMap))

		if (newChildCategoryIds.length) {
			const childCategories = await Promise.all(
				newChildCategoryIds.map(id => getPageDataHelper(id, userId))
			)
			const childCategoriesMap = {}
			childCategories.forEach(cc => {
				const { pageData } = cc
				childCategoriesMap[pageData.contentCategoryId] = pageData
			})
			dispatch({
				type: UPDATE_PREFETCHED_CHILDREN,
				payload: childCategoriesMap
			})
		}
	}
}

export const updateHistory = newHistory => {
	return async dispatch => {
		dispatch({
			type: UPDATE_HISTORY,
			payload: newHistory
		})
	}
}

export const updateCurrentContentId = contentCategoryId => {
	return async dispatch => {
		dispatch({
			type: UPDATE_CURRENT_CONTENT_ID,
			payload: { contentCategoryId }
		})
	}
}

export const addIdToHistory = pageHistoryItem => {
	return async dispatch => {
		dispatch({
			type: ADD_ID_TO_HISTORY,
			payload: pageHistoryItem
		})
	}
}

export const setScreenDimensions = dimensions => {
	return async dispatch => {
		dispatch({
			type: SET_SCREEN_DIMENSIONS,
			payload: dimensions
		})
	}
}

const getPageDataHelper = async (id, userId) => {
	if (!id || !userId) return {}

	/**
	 * Query table ('soup') in local db.
	 */
	const pageData = await QueryHelper.getSingleViewSoup('contentCategoryId', id)

	const [bannerWidth, bannerHeight] = pageData.bannerId
		? await getBannerDimensions(
				`${RNFS.DocumentDirectoryPath}/${userId}/banners/${pageData.bannerId}.${
					pageData.bannerFileExtension
				}`
		  )
		: [0, 0]
	pageData.bannerHeight = bannerHeight
	pageData.bannerWidth = bannerWidth
	return { pageData, currentCategoryId: id }
}

const getBannerDimensions = imgUrl => {
	return new Promise((resolveFunction, rejectFunction) => {
		Image.getSize(
			imgUrl,
			(width, height) => resolveFunction([width, height]),
			rejectFunction
		)
	})
}

export const setTotalContentSize = totalSize => {
	return async dispatch => {
		dispatch({
			type: SET_TOTAL_SIZE,
			payload: {
				totalSize
			}
		})
	}
}

export const updateProgress = (dispatch, progressMap) => (
	res,
	contentVersionInfo
) => {
	const { bytesWritten } = res
	const { Id: id } = contentVersionInfo
	progressMap[id] = bytesWritten
	const totalBytesWritten = Object.values(progressMap).reduce(
		(a, b) => a + b,
		0
	)
	dispatch({
		type: UPDATE_PROGRESS,
		payload: { totalBytesWritten }
	})
}

export const listenForNetworkInfoChange = dispatch => {
	NetInfo.isConnected.addEventListener('connectionChange', isConnected =>
		dispatch({
			type: UPDATE_CONNECTION_STATUS,
			payload: {
				isConnected
			}
		})
	)
}
