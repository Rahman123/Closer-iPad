import React, { Component } from 'react'
import RNFS from 'react-native-fs'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions/analyticsActions'
import { withNavigation, NavigationActions } from 'react-navigation'
import ContentWebView from '../presentational/ContentWebView'
import ContentVideo from '../presentational/ContentVideo'
import ContentError from '../presentational/ContentError'

import { HeaderBackButton } from 'react-navigation'

class ContentView extends Component {
	constructor(props) {
		super(props)
		this.updateViewingInfo = this.updateViewingInfo.bind(this)
		this.state = { fileExists: false }
	}

	static navigationOptions = ({ navigation }) => {
		//Hides header when content is video.
		let fileExtension = navigation.getParam('fileExtension')
		const header = {
			header: [
				'avi',
				'mov',
				'mpeg',
				'mp4',
				'm4a',
				'm4v',
				'fmp4',
				'webm',
				'mkv',
				'mp3',
				'ogg',
				'wav',
				'flv',
				'adts',
				'aac'
			].includes(fileExtension)
				? null
				: undefined
		}

		return {
			headerLeft: (
				<HeaderBackButton
					onPress={() => {
						ContentView.customBackFunction(navigation)
					}}
				/>
			),
			...header
		}
	}

	static customBackFunction(navigation) {
		const previousRoute = navigation.getParam('previousRoute')
		if (previousRoute == 'All Content') {
			navigation.navigate('All Content', {}, NavigationActions.back())
		} else {
			navigation.navigate('Home', {}, NavigationActions.back())
		}
	}

	async componentDidMount() {
		const { fileExtension, versionDataId, userId } = this.props
		let path = `${
			RNFS.DocumentDirectoryPath
		}/${userId}/content/${versionDataId}.${fileExtension}`
		const fileExists = await RNFS.exists(path)
		this.setState({ fileExists })
	}
	componentWillUnmount() {
		const { fileExists } = this.state
		if (!fileExists) return
		this.props.addCurrentViewingInfoToList()
	}

	updateViewingInfo(e) {
		const {
			versionDataId,
			name,
			contentDocumentId,
			fileExtension,
			contentSize
		} = this.props
		const viewingInfo = {
			uniqueId: Math.floor(Math.random() * 10000000),
			viewDuration: e ? e.currentTime : null,
			versionDataId: versionDataId,
			contentName: name,
			contentDocumentId,
			title: name,
			fileExtension,
			contentSize
		}
		this.props.updateCurrentViewingInfo(viewingInfo)
	}

	render() {
		const { fileExists } = this.state
		const { fileExtension, versionDataId, navigation, userId } = this.props
		if (!fileExists) return <ContentError navigation={navigation} />
		const videoExtensions = [
			'avi',
			'mov',
			'mpeg',
			'mp4',
			'm4a',
			'm4v',
			'fmp4',
			'webm',
			'mkv',
			'mp3',
			'ogg',
			'wav',
			'flv',
			'adts',
			'aac'
		]
		if (!versionDataId) return null

		switch (videoExtensions.includes(fileExtension)) {
			case true:
				return (
					<ContentVideo
						userId={userId}
						fileExtension={fileExtension}
						versionDataId={versionDataId}
						navigation={navigation}
						updateViewingInfo={this.updateViewingInfo}
						onBackHandler={() => {
							ContentView.customBackFunction(navigation)
						}}
						onErrorHandler={e => {
							ContentView.customBackFunction(navigation)
						}}
					/>
				)
			default:
				return (
					<ContentWebView
						userId={userId}
						fileExtension={fileExtension}
						versionDataId={versionDataId}
						updateViewingInfo={this.updateViewingInfo}
					/>
				)
		}
	}
}

function mapStateToProps(state, props) {
	return { ...props.navigation.state.params, ...props, ...state.dataReducer }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withNavigation(ContentView))
