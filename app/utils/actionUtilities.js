export const LOADING_CHANGE = 'LOADING_CHANGE'
export const changeLoadingState = (isLoading, dispatch, callingFunction) => {
	dispatch({
		type: LOADING_CHANGE,
		payload: {
			loading: isLoading,
			totalBytesWritten: null,
			totalSize: null,
			callingFunction
		}
	})
}

export const validEmail = email => {
	var validEmail = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
	return validEmail.test(email)
}
