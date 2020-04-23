export const ADD_CONTENT_TO_MAILTO = 'ADD_CONTENT_TO_MAILTO'
export const REMOVE_CONTENT_FROM_MAILTO = 'REMOVE_CONTENT_FROM_MAILTO'
export const CLEAR_MAILTO_CONTENT = 'CLEAR_MAILTO_CONTENT'
export const UPDATE_MESSAGE_VALUE = 'UPDATE_MESSAGE_VALUE'
export const SHOW_UPLOAD_SUCCESS = 'SHOW_UPLOAD_SUCCESS'

import QueryHelper from '../utils/queryHelper'
import { validEmail } from '../utils/actionUtilities'

export const addContentToMailto = contentToAdd => {
	return async dispatch => {
		dispatch({
			type: ADD_CONTENT_TO_MAILTO,
			payload: contentToAdd
		})
	}
}

export const removeContentFromMailto = contentToRemove => {
	return async dispatch => {
		dispatch({
			type: REMOVE_CONTENT_FROM_MAILTO,
			payload: contentToRemove
		})
	}
}

export const updateMessageValue = newValue => {
	return async dispatch => {
		dispatch({
			type: UPDATE_MESSAGE_VALUE,
			payload: newValue
		})
	}
}

export const clearMailtoContent = () => {
	return async dispatch => {
		dispatch({
			type: CLEAR_MAILTO_CONTENT
		})
	}
}

export const sendContent = () => {
	return async (dispatch, getStore) => {
		const { mailtoReducer = {} } = getStore()
		const {
			messageInfo: { email, message = '', subject = '' },
			mailtoContent
		} = mailtoReducer

		if (!validEmail(email)) {
			throw Error('Looks like an issue with the email address entered.')
		}

		const contentVersionIds = mailtoContent.map(c => c.versionDataId)
		const { _bodyText } = await QueryHelper.emailContent({
			email,
			message,
			contentVersionIds,
			subject
		})

		if (_bodyText !== '"success"')
			throw Error(
				"The email couldn't be sent. It could be an issue with daily email limits or the content no longer existing in the org."
			)

		dispatch({
			type: SHOW_UPLOAD_SUCCESS
		})
	}
}
