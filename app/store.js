import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { logger } from './Middleware/logger'
import { createErrorHandler } from './Middleware/errorHandler'
import { errorAction } from './actions/errorActions'
import rootReducer from '../app/reducers/rootReducer' 


export default createStore(
	rootReducer,
	applyMiddleware(createErrorHandler(errorAction), thunk, logger)
)
