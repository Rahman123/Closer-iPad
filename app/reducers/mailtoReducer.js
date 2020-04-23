import {
	ADD_CONTENT_TO_MAILTO,
	CLEAR_MAILTO_CONTENT,
	REMOVE_CONTENT_FROM_MAILTO,
	UPDATE_MESSAGE_VALUE
} from '../actions/mailtoActions'

const mailtoState = { mailtoContent: [] }

const mailtoReducer = (state = mailtoState, action) => {
	let { mailtoContent } = state
	switch (action.type) {
		case ADD_CONTENT_TO_MAILTO:
			const contentToAdd = action.payload
			mailtoContent = [...mailtoContent, contentToAdd]
			return { ...state, mailtoContent }
		case CLEAR_MAILTO_CONTENT:
			return { ...state, mailtoContent: [] }
		case REMOVE_CONTENT_FROM_MAILTO:
			const { versionDataId } = action.payload
			mailtoContent = [...mailtoContent].filter(
				c => c.versionDataId !== versionDataId
			)
			return { ...state, mailtoContent }
		case UPDATE_MESSAGE_VALUE:
			const { messageInfo } = state
			return {
				...state,
				messageInfo: { ...messageInfo, ...action.payload }
			}
		default:
			return state
	}
}

export default mailtoReducer
