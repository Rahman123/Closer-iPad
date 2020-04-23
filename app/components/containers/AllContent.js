import React, { Component } from 'react'
import ContentList from './ContentListContainer'
import WithBanner from '../wrappers/WithBanner'
import WithSpinner from '../wrappers/WithSpinner'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as DataActions from '../../actions/dataActions'

import { Animated, View, StyleSheet } from 'react-native'
import ContentSearch from '../presentational/ContentSearch'
const MAX_BANNER_HEIGHT = 225

class AllContent extends Component {
	constructor(props) {
		super(props)
		this.state = { scrollY: new Animated.Value(0) }
		this.handleSearch = this.handleSearch.bind(this)
		this.handleClearSearch = this.handleClearSearch.bind(this)
	}

	static navigationOptions = {
		header: null
	}

	componentDidMount() {
		this.props.getAllContentInfo()
	}

	handleSearch(query) {
		const { allContentInfo } = this.props
		const queryResults = allContentInfo.filter(
			c =>
				c.title.toLowerCase().indexOf(query.toLowerCase().trim()) > -1 ||
				c.fileExtension.toLowerCase().indexOf(query.toLowerCase().trim()) > -1
		)
		this.setState({ queryResults })
	}

	handleClearSearch() {
		const { allContentInfo } = this.props
		this.setState({ queryResults: allContentInfo })
	}

	render() {
		const {
			screenWidth,
			screenHeight,
			allContentInfo = [],
			rootCategoryId,
			viewMap,
			userId
		} = this.props
		const pageData = viewMap[rootCategoryId]
		const { queryResults = allContentInfo, scrollY } = this.state

		return (
			<WithBanner
				userId={userId}
				screenHeight={screenHeight}
				screenWidth={screenWidth}
				pageData={pageData}
				scrollY={scrollY}
			>
				<View style={styles.relatedContentContainer}>
					<ContentSearch
						searchFunction={this.handleSearch}
						clearSearch={this.handleClearSearch}
						style={styles.contentSearchStyle}
					/>
					<ContentList
						style={[styles.contentList]}
						userId={userId}
						listTitle={'All Content'}
						relatedContentInfo={queryResults}
						height={screenHeight - MAX_BANNER_HEIGHT}
					/>
				</View>
			</WithBanner>
		)
	}
}

const styles = StyleSheet.create({
	relatedContentContainer: {
		marginTop: 20,
		marginLeft: 65,
		marginRight: 50
	},
	contentList: {
		marginLeft: 5
	},
	contentSearchStyle: { width: '60%', marginBottom: 40, marginTop: 10 }
})

function mapStateToProps(state, props) {
	const { dataReducer } = state
	return { ...props, ...dataReducer }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(DataActions, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WithSpinner(AllContent))
