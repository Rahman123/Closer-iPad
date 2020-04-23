import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as analyticsActions from '../../actions/analyticsActions'
import * as dataActions from '../../actions/dataActions'
import * as mailtoActions from '../../actions/mailtoActions'
import AssociationCard from '../presentational/AssociationCard'
import TwoColumn from '../presentational/TwoColumn'
import DrawerIcon from '../presentational/DrawerIcon'
import Button from '../presentational/Button'
import ContentList from '../presentational/ContentList'
import SuccessCheckMark from '../presentational/SuccessCheckmark'
class AssociateRecordContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.sortViewedContent = this.sortViewedContent.bind(this)
		this.handleStarPress = this.handleStarPress.bind(this)
		this.navigateToAssociations = this.navigateToAssociations.bind(this)
		this.swipeToDeleteContent = this.swipeToDeleteContent.bind(this)
	}

	componentDidMount() {
		const { hideUploadSuccess } = this.props
		hideUploadSuccess()
	}

	sortViewedContent(sortType = 'NAME', isDesc = false) {
		const { viewingInfoList, updateSortChoices } = this.props
		switch (sortType) {
			case 'NAME':
				viewingInfoList.sort((a, b) => (a.title > b.title ? 1 : -1))
				break
			case 'SIZE':
				viewingInfoList.sort((a, b) => (a.contentSize > b.contentSize ? 1 : -1))
				break
			case 'TYPE':
				viewingInfoList.sort((a, b) =>
					a.fileExtension > b.fileExtension ? 1 : -1
				)
				break
			default:
				break
		}
		if (isDesc) viewingInfoList.reverse()
		this.setState({ sortedResults: viewingInfoList })
		updateSortChoices({ viewedContent: { sortType, isDesc } })
	}

	handleStarPress(rating, contentId) {
		const { updateStarRatings } = this.props
		updateStarRatings({ [contentId]: rating })
	}

	navigateToAssociations() {
		const { navigation } = this.props
		navigation.navigate({ routeName: 'Associate Meeting with Record' })
	}

	swipeToDeleteContent(content) {
		const { removeFromViewingInfoList } = this.props
		removeFromViewingInfoList(content)
	}

	render() {
		const {
			uploadMeetingInfo,
			clearMeetingInfo,
			selectedAssociations = {},
			removeAssociation,
			viewingInfoList,
			screenHeight,
			screenWidth,
			starRatings,
			uploadCompletedSuccess,
			hideUploadSuccess,
			isConnected,
			sortChoices = {},
			addContentToMailto,
			removeContentFromMailto,
			mailtoContent
		} = this.props
		const buttonDisabled = !!!viewingInfoList.length

		return (
			<TwoColumn
				style={{ height: screenHeight }}
				icon={<DrawerIcon />}
				rightStyle={styles.rightStyle}
				leftStyle={styles.leftStyle}
			>
				<View>
					<Text style={styles.headerText}>Association Summary</Text>
					<AssociationCard
						hideClose={true}
						handlePress={removeAssociation}
						style={styles.associationList}
						headerText={'Contact'}
						association={selectedAssociations.Contact}
					/>
					<AssociationCard
						hideClose={true}
						handlePress={removeAssociation}
						style={styles.associationList}
						headerText={'Opportunity'}
						association={selectedAssociations.Opportunity}
					/>
					<AssociationCard
						hideClose={true}
						handlePress={removeAssociation}
						style={styles.associationList}
						headerText={'Account'}
						association={selectedAssociations.Account}
					/>
					<Button
						onPress={this.navigateToAssociations}
						title="New Association"
						color="white"
					/>
				</View>
				<View style={{ height: screenHeight }}>
					<ContentList
						swipeEnabled={true}
						removeFunction={this.swipeToDeleteContent}
						screenWidth={screenWidth}
						showStars={true}
						showSize={false}
						relatedContentInfo={viewingInfoList}
						mailtoContent={mailtoContent}
						handleSelectMailto={addContentToMailto}
						handleDeselectMailto={removeContentFromMailto}
						sortFunction={this.sortViewedContent}
						listTitle="Content Viewed"
						sortChoice={sortChoices['viewedContent']}
						height={viewingInfoList.length ? screenHeight * 0.72 : null}
						style={[{ width: screenWidth * 0.4 }, styles.contentListStyle]}
						starRatings={starRatings}
						handleStarPress={this.handleStarPress}
						handlePress={() => {}}
					/>
					{uploadCompletedSuccess && (
						<SuccessCheckMark
							onFinish={hideUploadSuccess}
							screenHeight={screenHeight}
						/>
					)}
					<View style={styles.buttonContainer}>
						<Button
							disabled={buttonDisabled || !isConnected}
							style={styles.button}
							onPress={uploadMeetingInfo}
							title="Sync"
							color="white"
							iconName="upload"
						/>
						<Button
							disabled={buttonDisabled}
							style={styles.button}
							onPress={clearMeetingInfo}
							title="Clear"
							color={buttonDisabled ? null : 'darkgrey'}
							borderColor={buttonDisabled ? null : 'darkgrey'}
							backgroundColor={buttonDisabled ? null : 'white'}
							iconName="delete"
						/>
					</View>
				</View>
			</TwoColumn>
		)
	}
}

const styles = StyleSheet.create({
	button: { width: 175 },
	outerContainer: {
		flexDirection: 'row',
		height: '100%',
		paddingTop: 35,
		backgroundColor: 'white'
	},
	contentListStyle: {
		marginLeft: 15,
		marginRight: 15
	},
	innerContainer: {
		flex: 1,
		marginHorizontal: 65
	},
	listItem: {
		marginTop: 20
	},
	headerText: {
		fontFamily: 'System',
		fontWeight: '300',
		marginBottom: 20,
		fontSize: 20
	},
	subHeaderText: {
		fontFamily: 'System',
		fontWeight: '300',
		marginBottom: 20,
		fontSize: 17
	},
	associationList: {
		marginBottom: 40
	},
	buttonContainer: {
		flexDirection: 'row'
	},
	rightStyle: {
		marginHorizontal: 15
	},
	leftStyle: {
		marginTop: 20,
		marginHorizontal: 0,
		paddingHorizontal: 65
	},
	buttonContainer: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: 90,
		width: '100%'
	}
})

function mapStateToProps(state, props) {
	const { dataReducer, analyticsReducer, mailtoReducer } = state
	return { ...props, ...dataReducer, ...analyticsReducer, ...mailtoReducer }
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{ ...dataActions, ...analyticsActions, ...mailtoActions },
		dispatch
	)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AssociateRecordContainer)
