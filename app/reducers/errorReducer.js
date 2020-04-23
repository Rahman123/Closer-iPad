import { RECEIVE_ERROR, CLEAR_ERROR } from '../actions/errorActions'
const errorState = {}

const errorReducer = (state = errorState, action) => {
	switch (action.type) {
		case RECEIVE_ERROR:
			return { ...state, ...action.payload }
		case CLEAR_ERROR:
			return { ...state, ...action.payload }
		default:
			return state
	}
}
export default errorReducer
