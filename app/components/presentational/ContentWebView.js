import React, { Component } from 'react'
import { WebView, Dimensions, Linking } from 'react-native'
import RNFS from 'react-native-fs'

export default class MyWebView extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		const { updateViewingInfo } = this.props
		updateViewingInfo()
	}

	render() {
		const { fileExtension, versionDataId, userId } = this.props
		const { height, width } = Dimensions.get('window')

		return (
			<WebView
				ref={ref => {
					this.webview = ref
				}}
				onShouldStartLoadWithRequest={event => {
					if (event.navigationType === 'click') {
						Linking.openURL(event.url)
						this.webview.stopLoading()
						return false
					}
					return true
				}}
				style={{ height, width }}
				source={{
					uri: `${
						RNFS.DocumentDirectoryPath
					}/${userId}/content/${versionDataId}.${fileExtension}`
				}}
			/>
		)
	}
}
