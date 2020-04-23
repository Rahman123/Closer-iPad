import React, { Component } from 'react'
import ContentSearch from '../presentational/ContentSearch'
import { Animated, ScrollView, Text, View, StyleSheet } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../../actions/analyticsActions'
import AssociationList from '../presentational/AssociationList'
import AssociationCard from '../presentational/AssociationCard'
import TwoColumn from '../presentational/TwoColumn'
import DrawerIcon from '../presentational/DrawerIcon'
import Button from '../presentational/Button'
class AssociateRecordContainer extends Component {
	constructor(props) {
		super(props)
		this.state = { scrollY: new Animated.Value(0) }
		this.handleAssociationPress = this.handleAssociationPress.bind(this)
		this.shouldDisableButton = this.shouldDisableButton.bind(this)
		this.cancelNewAssociations = this.cancelNewAssociations.bind(this)
		this.handleClearSearch = this.handleClearSearch.bind(this)
	}

	componentWillUnmount() {
		this.cancelNewAssociations()
		this.handleClearSearch()
	}

	handleSearchResults(results) {
		const result = { accounts: [], contacts: [], opportunities: [] }
		results.forEach(r => {
			switch (r.attributes.type) {
				case 'Account':
					result.accounts.push(r)
					break
				case 'Contact':
					result.contacts.push(r)
					break
				case 'Opportunity':
					result.opportunities.push(r)
					break

				default:
					break
			}
		})
		return result
	}

	handleAssociationPress(association) {
		const { setSelectedAssociation } = this.props
		const {
			attributes: { type }
		} = association
		setSelectedAssociation({ [type]: association })
	}

	shouldDisableButton() {
		const { selectedAssociations = {}, savedAssociations = {} } = this.props

		return Object.keys({ ...selectedAssociations, ...savedAssociations }).every(
			k => {
				return (
					selectedAssociations[k] &&
					savedAssociations[k] &&
					selectedAssociations[k].Id === savedAssociations[k].Id
				)
			}
		)
	}

	cancelNewAssociations() {
		const { setSelectedAssociation, savedAssociations } = this.props

		setSelectedAssociation(savedAssociations)
	}

	handleClearSearch() {
		const { clearAssociationSearchResults } = this.props

		clearAssociationSearchResults()
	}

	render() {
		const {
			searchForAssociations,
			associationSearchResults = [],
			selectedAssociations = {},
			setSavedAssociation,
			savedAssociations,
			removeAssociation,
			screenWidth,
			screenHeight,
			isConnected
		} = this.props
		const { contacts, accounts, opportunities } = this.handleSearchResults(
			associationSearchResults
		)

		const buttonDisabled = this.shouldDisableButton()
		const isPortrait = screenHeight > screenWidth

		return (
			<TwoColumn icon={<DrawerIcon />}>
				<View>
					<Text style={styles.headerText}>
						Search for Contacts, Accounts, And Opportunities
					</Text>
					<ContentSearch
						placeholder={
							isConnected ? 'Search' : 'Network connection required to search'
						}
						editable={isConnected}
						clearSearch={this.handleClearSearch}
						style={{ width: screenWidth * 0.4 }}
						searchFunction={searchForAssociations}
					/>
					<ScrollView
						showsVerticalScrollIndicator={false}
						style={{
							maxHeight: screenHeight - 175
						}}
					>
						<AssociationList
							savedAssociations={savedAssociations}
							handlePress={this.handleAssociationPress}
							style={styles.listItem}
							headerText={'Contacts'}
							associationOptions={contacts}
							iconName={'account-outline'}
							iconSize={35}
							iconColor={'grey'}
						/>

						<AssociationList
							savedAssociations={savedAssociations}
							handlePress={this.handleAssociationPress}
							style={styles.listItem}
							headerText={'Opportunities'}
							associationOptions={opportunities}
							iconName={'folder-account'}
							iconSize={35}
							iconColor={'grey'}
						/>

						<AssociationList
							savedAssociations={savedAssociations}
							handlePress={this.handleAssociationPress}
							style={styles.listItem}
							headerText={'Accounts'}
							associationOptions={accounts}
							iconName={'domain'}
							iconSize={35}
							iconColor={'grey'}
						/>
					</ScrollView>
				</View>
				<View>
					<Text style={styles.headerText}>Association Summary</Text>
					<AssociationCard
						handlePress={removeAssociation}
						style={styles.associationList}
						headerText={'Contact'}
						association={selectedAssociations.Contact}
					/>
					<AssociationCard
						handlePress={removeAssociation}
						style={styles.associationList}
						headerText={'Opportunity'}
						association={selectedAssociations.Opportunity}
					/>
					<AssociationCard
						handlePress={removeAssociation}
						style={styles.associationList}
						headerText={'Account'}
						association={selectedAssociations.Account}
					/>
					<View
						style={
							isPortrait
								? styles.buttonContainerPortrait
								: styles.buttonContainer
						}
					>
						<Button
							disabled={buttonDisabled}
							onPress={setSavedAssociation}
							title="Save"
							color="white"
						/>
						{!buttonDisabled && (
							<Button
								onPress={this.cancelNewAssociations}
								title="Cancel"
								color="#7d7d7d"
								backgroundColor="white"
								borderColor="#7d7d7d"
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
	buttonContainerPortrait: {
		flexDirection: 'column',
		height: 110,
		justifyContent: 'space-between'
	}
})

function mapStateToProps(state, props) {
	const { dataReducer, analyticsReducer } = state
	return { ...props, ...dataReducer, ...analyticsReducer }
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AssociateRecordContainer)
