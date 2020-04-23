import { changeLoadingState } from '../utils/actionUtilities'
export const RECEIVE_ERROR = 'RECEIVE_ERROR'
export const CLEAR_ERROR = 'CLEAR_ERROR'

export const errorAction = (error, dispatch) => {
	dispatch({
		type: RECEIVE_ERROR,
		payload: { error }
	})
	changeLoadingState(false, dispatch)
}
export const clearError = () => {
	return async dispatch => {
		dispatch({
			type: CLEAR_ERROR,
			payload: { error: null }
		})
	}
}

export const throwError = (error) => {
	return async dispatch => {
		dispatch({
			type: RECEIVE_ERROR,
			payload: { error }
		})
		changeLoadingState(false, dispatch)
	}
}
