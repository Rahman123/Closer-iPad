export const logger = store => next => action => {
	const isDebuggingEnabled = typeof atob !== 'undefined'
	if (isDebuggingEnabled ) {
		console.group(action.type)
		console.info('dispatching', action)

		if(action.type !== 'UPDATE_PROGRESS') console.log('next state', store.getState())
		console.groupEnd()
	}
	return next(action)
}
export const errorHandling = store => next => action => {
	if (typeof action === 'function') {
		return next(dispatch => {
			try {
				action(dispatch)
			} catch (error) {
				dispatch({
					type: 'RECEIVE_ERROR',
					payload: { error }
				})
			}
		})
	} else {
		return next(action)
	}
}
