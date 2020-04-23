import React from 'react'
import WithSpinner from './wrappers/WithSpinner'
import {
	Dimensions,
	Text,
	View,
	Animated,
	StyleSheet,
	Image
} from 'react-native'

import * as Actions from '../actions/dataActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ContentList from './containers/ContentListContainer'
import BreadCrumbs from './presentational/BreadCrumbs'
import WithBanner from './wrappers/WithBanner'
import ChildTiles from './presentational/ChildTiles'

import DrawerIcon from './presentational/DrawerIcon'

class ContentScreen extends React.Component {
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props)
		this.breadCrumbNav = this.breadCrumbNav.bind(this)
		this.changeContentCategory = this.changeContentCategory.bind(this)
		this.state = { scrollY: new Animated.Value(0) }
	}

	componentDidMount() {
		try {
			const {
				rootCategoryId,
				contentCategoryId = rootCategoryId,
				init
			} = this.props

			if (!contentCategoryId) {
				init()
			}

			this.setScreenDimensions()
		} catch (e) {
			console.log('error: ', e)
		}
	}

	componentDidUpdate(prevProps) {
		const {
			navigation,
			rootCategoryId,
			contentCategoryId = rootCategoryId,
			isResetting,
			finishedResetting
		} = this.props
		const { contentCategoryId: prevContentCategoryId } = prevProps

		const viewId = contentCategoryId
		if (viewId && viewId !== prevContentCategoryId) {
			navigation.setParams({ contentCategoryId: viewId })
		}

		if (isResetting) {
			navigation.setParams({ contentCategoryId: null })
			finishedResetting()
		}
	}

	setScreenDimensions() {
		Dimensions.addEventListener('change', ({ window: { width, height } }) => {
			this.props.setScreenDimensions({
				screenWidth: width,
				screenHeight: height
			})
		})

		const { width, height } = Dimensions.get('window')
		this.props.setScreenDimensions({
			screenWidth: width,
			screenHeight: height
		})
	}

	changeContentCategory(contentCategoryId) {
		try {
			let {
				viewMap,
				navigation,
				preFetchChildCategories,
				getPageData,
				addIdToHistory
			} = this.props

			if (contentCategoryId && contentCategoryId in viewMap) {
				const newPageData = viewMap[contentCategoryId] || {}
				if (this.isDeadLeaf(newPageData)) return
				if (newPageData && newPageData.childCategories) {
					preFetchChildCategories(
						newPageData.childCategories.filter(
							contentCategoryId => !viewMap[contentCategoryId]
						)
					)
				}
			} else {
				getPageData(contentCategoryId)
			}

			if (contentCategoryId in viewMap) {
				addIdToHistory({
					contentCategoryId,
					name: viewMap[contentCategoryId].Name
				})
			}
			navigation.push('ContentScreen', {
				contentCategoryId
			})
		} catch (e) {
			console.log(e)
		}
	}

	isDeadLeaf(newPageData) {
		if (!newPageData) return false
		if (
			!newPageData.childTiles.length &&
			!newPageData.relatedContentInfo.length
		)
			return true
		return false
	}

	breadCrumbNav(idx) {
		const {
			history,
			navigation,
			rootCategoryId,
			contentCategoryId,
			updateHistory
		} = this.props
		let newHistory = []

		if (history.length - 1 < idx) return
		if (idx === -1) {
			if (contentCategoryId !== rootCategoryId) {
				navigation.navigate('ContentScreen', {
					contentCategoryId: rootCategoryId
				})
			}
		} else {
			const newContentCategoryId = history[idx].id
			if (contentCategoryId !== newContentCategoryId) {
				navigation.pop(history.length - idx - 1)
			}

			newHistory = history.slice(0, idx + 1)
		}
		updateHistory(newHistory)
	}

	render() {
		const {
			history = [],
			screenWidth,
			screenHeight,
			viewMap,
			contentCategoryId,
			loading,
			userId
		} = this.props
		const pageData = viewMap[contentCategoryId]
		const isLandscape = screenWidth > screenHeight

		const landscapeFallbackPath = '../assets/Fallback_Screen.jpg'
		const portraitFallbackPath = '../assets/Fallback_Screen_Portrait.jpg'

		if (!contentCategoryId || !userId || !pageData || loading) {
			return (
				<View>
					<DrawerIcon />
					<Image
						style={styles.fallbackImage}
						resizeMode={'contain'}
						source={
							isLandscape
								? require(landscapeFallbackPath)
								: require(portraitFallbackPath)
						}
					/>
				</View>
			)
		}
		const { scrollY } = this.state

		const {
			childTiles = [],
			relatedContentInfo = [],
			Name: name
		} = pageData
		const listHeight = screenHeight - 400
		return (
			<WithBanner
				userId={userId}
				pageData={pageData}
				scrollY={scrollY}
				screenWidth={screenWidth}
				screenHeight={screenHeight}
			>
				<BreadCrumbs
					style={styles.breadCrumbs}
					history={history}
					currentPageName={pageData.Name}
					breadCrumbNav={this.breadCrumbNav}
				/>

				{name && name.length > 0 && (
					<Text style={styles.titleText}>{name}</Text>
				)}

				{!!childTiles.length && (<ChildTiles
					userId={userId}
					handlePress={this.changeContentCategory}
					childTiles={childTiles}
				/>)}

				{!!relatedContentInfo.length && <ContentList
					relatedContentInfo={relatedContentInfo}
					height={listHeight}
				/>}
			</WithBanner>
		)
	}
}

const styles = StyleSheet.create({
	titleText: {
		marginLeft: 65,
		fontSize: 40,
		fontFamily: 'System',
		fontWeight: '200'
	},
	fallbackImage: {
		height: '100%',
		width: '100%'
	}
})

function mapStateToProps(state, props) {
	const { dataReducer } = state
	return { ...dataReducer, ...props.navigation.state.params }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WithSpinner(ContentScreen))
