import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store from './app/store'
import ErrorWrapper from './app/components/wrappers/WithError'
import DrawerNavigator from './app/components/navigators/DrawerNavigator'
import { init } from './app/actions/dataActions'
window.store = store

const DrawerNavigatorWithError = ErrorWrapper(DrawerNavigator)
export class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<DrawerNavigatorWithError />
			</Provider>
		)
	}
}
