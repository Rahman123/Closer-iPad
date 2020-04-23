import React, { Component } from 'react'
import { Animated, Text, View, StyleSheet } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as mailtoActions from '../../actions/mailtoActions'
import * as dataActions from '../../actions/dataActions'
import * as analyticsActions from '../../actions/analyticsActions'
import TwoColumn from '../presentational/TwoColumn'
import DrawerIcon from '../presentational/DrawerIcon'
import Button from '../presentational/Button'
import ContentList from '../presentational/ContentList'
import SuccessCheckMark from '../presentational/SuccessCheckmark'
import MailtoForm from '../presentational/MailtoForm'

class MailContentContainer extends Component {
	constructor(props) {
		super(props)
		this.state = { scrollY: new Animated.Value(0) }
		this.navigateToAllContentSearch = this.navigateToAllContentSearch.bind(this)
	}

	componentDidMount() {
		const {
			hideUploadSuccess,
			savedAssociations = {},
			updateMessageValue,
			messageInfo
		} = this.props
		hideUploadSuccess()

		if (savedAssociations.Contact && !messageInfo) {
			updateMessageValue({
				email: savedAssociations.Contact.Email,
				subject: `Content we discussed`,
				message: savedAssociations.Contact.FirstName
					? `Hi ${
							savedAssociations.Contact.FirstName
					  },\n\nHere is some of the content we went over today!\n\n`
					: null
			})
		}
	}

	navigateToAllContentSearch() {
		const { navigation } = this.props
		navigation.navigate({ routeName: 'All Content' })
	}

	render() {
		const {
			screenWidth,
			screenHeight,
			isConnected,
			mailtoContent,
			starRatings,
			addContentToMailto,
			removeContentFromMailto,
			sortChoices,
			uploadCompletedSuccess,
			clearMailtoContent,
			sendContent,
			hideUploadSuccess,
			updateMessageValue,
			messageInfo = {}
		} = this.props

		const buttonDisabled = !(isConnected && mailtoContent.length)

		const isPortrait = screenHeight > screenWidth

		return (
			<TwoColumn
				icon={<DrawerIcon />}
				leftStyle={styles.twoColumnLeftStyle}
				rightStyle={styles.twoColumnRightStyle}
			>
				<View style={{ width: screenWidth * 0.4 }}>
					<Text style={styles.headerText}>Message</Text>
					<MailtoForm
						update={updateMessageValue}
						onSend={sendContent}
						sendDisabled={buttonDisabled}
						messageInfo={messageInfo}
						screenHeight={screenHeight * 0.4}
					/>
				</View>
				<View
					style={{
						height: screenHeight * 0.95,
						width: screenWidth * 0.4
					}}
				>
					<ContentList
						showSize={false}
						showSort={false}
						relatedContentInfo={mailtoContent}
						handleSelectMailto={addContentToMailto}
						handleDeselectMailto={removeContentFromMailto}
						mailtoContent={mailtoContent}
						listTitle="Content to Send"
						sortChoice={sortChoices['sortedResults']}
						height={mailtoContent.length ? screenHeight * 0.7 : null}
						style={[
							{
								width: screenWidth * 0.4
							},
							styles.contentListStyle
						]}
						screenWidth={screenWidth}
						starRatings={starRatings}
						handleStarPress={this.handleStarPress}
						handlePress={() => {}}
					/>
					{uploadCompletedSuccess && (
						<SuccessCheckMark
							style={[
								{ right: screenWidth * 0.37 },
								styles.successCheckMarkStyle
							]}
							onFinish={hideUploadSuccess}
							screenHeight={screenHeight}
						/>
					)}
					<View
						style={[
							isPortrait
								? styles.buttonContainerPortrait
								: styles.buttonContainer,
							!mailtoContent.length ? styles.buttonContainerEmptyList : {}
						]}
					>
						<Button
							onPress={this.navigateToAllContentSearch}
							title="Search Content"
							color="white"
							iconName="magnify"
							iconStyle={styles.searchContentButton}
						/>
						{!!mailtoContent.length && (
							<Button
								disabled={buttonDisabled}
								style={styles.clearButton}
								onPress={clearMailtoContent}
								title="Clear"
								color="#7d7d7d"
								backgroundColor="white"
								borderColor="#7d7d7d"
								iconName="delete"
							/>
						)}
					</View>
				</View>
			</TwoColumn>
		)
	}
}

const styles = StyleSheet.create({
	outerContainer: {
		flexDirection: 'row',
		height: '100%',
		paddingTop: 35,
		backgroundColor: 'white'
	},
	innerContainer: {
		flex: 1,
		marginHorizontal: 65
	},
	contentListStyle: {
		marginLeft: 15,
		marginRight: 15,
		marginTop: 0
	},
	successCheckMarkStyle: { position: 'absolute' },
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
	searchContentButton: {
		marginRight: 10
	},
	buttonContainer: {
		marginTop: 20,
		flexDirection: 'row',
		position: 'absolute',
		bottom: 90,
		width: '100%'
	},
	buttonContainerPortrait: {
		marginTop: 20,
		flexDirection: 'column',
		height: 110,
		justifyContent: 'space-between',
		position: 'absolute',
		bottom: 90,
		width: '100%'
	},
	buttonContainerEmptyList: { position: 'relative', bottom: 0 },
	sendButtonContainer: {
		flexDirection: 'row',
		marginTop: 20,
		marginLeft: 'auto'
	},
	twoColumnLeftStyle: {
		marginHorizontal: 20,
		marginTop: 40,
		alignItems: 'center'
	},
	twoColumnRightStyle: { marginHorizontal: 20, marginTop: 40 }
})

function mapStateToProps(state, props) {
	const { dataReducer, analyticsReducer, mailtoReducer } = state
	return { ...props, ...dataReducer, ...analyticsReducer, ...mailtoReducer }
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{ ...mailtoActions, ...dataActions, ...analyticsActions },
		dispatch
	)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MailContentContainer)
