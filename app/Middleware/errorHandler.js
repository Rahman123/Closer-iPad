import bugsnag from '../utils/bugsnag'
export const createErrorHandler = handler => {
	return store => next => action => {
		if (typeof action === 'function') {
			return next((dispatch, getState, extraArgument) => {
				const resultOfAction = Promise.resolve(
					action(dispatch, getState, extraArgument)
				)
				resultOfAction.catch(error => {
          handler(error, dispatch, getState)
          bugsnag.notify(error)
				})
			})
		}
		return next(action)
	}
}
