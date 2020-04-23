import { combineReducers } from 'redux'
import dataReducer from './dataReducer'
import analyticsReducer from './analyticsReducer'
import errorReducer from './errorReducer'
import mailtoReducer from './mailtoReducer'

const rootReducer = combineReducers({
	dataReducer,
	analyticsReducer,
	errorReducer,
	mailtoReducer
})

export default rootReducer
