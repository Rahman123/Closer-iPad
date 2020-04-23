import React, { Component } from 'react'
import { withNavigation } from 'react-navigation'
import ContentList from '../presentational/ContentList'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as dataActions from '../../actions/dataActions'
import * as mailtoActions from '../../actions/mailtoActions'
class ContentListContainer extends Component {
	constructor(props) {
		super(props)
		this.navigateToContent = this.navigateToContent.bind(this)
		this.sortRelatedContent = this.sortRelatedContent.bind(this)
		this.state = {}
	}

	navigateToContent({
		versionDataId,
		fileExtension,
		title,
		contentDocumentId,
		contentSize
	}) {
		const {
			navigation,
			navigation: { navigate }
		} = this.props

		const previousRoute = navigation.state.routeName
		navigate('ContentViewer', {
			versionDataId,
			fileExtension,
			name: title,
			contentDocumentId,
			contentSize,
			previousRoute
		})
	}

	componentDidMount() {
		const { sortChoices = {}, navigation } = this.props
		const contentKey =
			navigation.getParam('contentCategoryId') || 'allContentCategories'
		const { sortType, isDesc } = sortChoices[contentKey] || {}
		this.sortRelatedContent(sortType, isDesc, false)
	}

	componentDidUpdate(prevProps, prevState) {
		const { relatedContentInfo, sortChoices, navigation } = this.props
		const contentKey =
			navigation.getParam('contentCategoryId') || 'allContentCategories'
		const sortChoice = sortChoices[contentKey] || {}
		const { sortType, isDesc } = sortChoice
		//Check difference by length first to avoid iterating
		if (relatedContentInfo.length !== prevProps.relatedContentInfo.length) {
			this.sortRelatedContent(sortType, isDesc, false)
			return
		}

		//check differences if relatedContentInfo are same length
		relatedContentInfo.forEach((rci, idx) => {
			if (
				rci.versionDataId !== prevProps.relatedContentInfo[idx].versionDataId
			) {
				this.sortRelatedContent(sortType, isDesc, false)
				return
			}
		})
	}

	sortRelatedContent(
		sortType = 'NAME',
		isDesc = false,
		shouldUpdateSortChoices = true
	) {
		const { relatedContentInfo, updateSortChoices, navigation } = this.props

		switch (sortType) {
			case 'NAME':
				relatedContentInfo.sort((a, b) => (a.title > b.title ? 1 : -1))
				break
			case 'SIZE':
				relatedContentInfo.sort((a, b) =>
					a.contentSize > b.contentSize ? 1 : -1
				)
				break
			case 'TYPE':
				relatedContentInfo.sort((a, b) =>
					a.fileExtension > b.fileExtension ? 1 : -1
				)
				break
			default:
				break
		}
		if (isDesc) relatedContentInfo.reverse()
		this.setState({ sortedResults: relatedContentInfo })
		const contentKey =
			navigation.getParam('contentCategoryId') || 'allContentCategories'
		if (shouldUpdateSortChoices)
			updateSortChoices({ [contentKey]: { sortType, isDesc } })
	}

	render() {
		const {
			height,
			style,
			userId,
			addContentToMailto,
			removeContentFromMailto,
			mailtoContent,
			relatedContentInfo,
			sortChoices,
			navigation
		} = this.props
		let { sortedResults } = this.state

		sortedResults =
			sortedResults && sortedResults.length ? sortedResults : relatedContentInfo

		const contentKey =
			navigation.getParam('contentCategoryId') || 'allContentCategories'
		return (
			<ContentList
				style={style}
				height={height}
				userId={userId}
				sortChoice={sortChoices[contentKey]}
				relatedContentInfo={sortedResults}
				handlePress={this.navigateToContent}
				mailtoContent={mailtoContent}
				handleSelectMailto={addContentToMailto}
				handleDeselectMailto={removeContentFromMailto}
				sortFunction={this.sortRelatedContent}
			/>
		)
	}
}

function mapStateToProps(state, props) {
	const { dataReducer, mailtoReducer } = state
	return { ...props, ...dataReducer, ...mailtoReducer }
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({ ...mailtoActions, ...dataActions }, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withNavigation(ContentListContainer))
