import React, { Component } from 'react'
import {
	Text,
	View,
	TouchableOpacity as oldTouchableOpacity,
	StyleSheet,
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)
class AssociationCard extends Component {
	constructor(props) {
		super(props)
		this.getAddress = this.getAddress.bind(this)
		this.handlePress = this.handlePress.bind(this)
	}

	getAddress() {
		const { association } = this.props
		let addressString
		if (!association) return null
		switch (association.attributes.type) {
			case 'Contact':
				let { MailingAddress } = association
				MailingAddress = MailingAddress || {}
				const { street, state, city, postalCode } = MailingAddress
				addressString =
					[street, city, state].filter(el => el).join(', ') +
					' ' +
					(postalCode || '')
				return addressString
			case 'Opportunity':
				return null
			case 'Account':
				let { BillingAddress } = association
				BillingAddress = BillingAddress || {}
				const {
					street: aStreet,
					state: aState,
					city: aCity,
					postalCode: aPostalCode
				} = BillingAddress

				addressString =
					[aStreet, aCity, aState].filter(el => el).join(', ') +
					' ' +
					(aPostalCode || '')

				return addressString

			default:
				break
		}
	}

	handlePress(type) {
		const { handlePress } = this.props
		handlePress(type)
	}

	render() {
		const { style, headerText, association, hideClose } = this.props
		const address = this.getAddress(association)
		return (
			<View style={[style]}>
				<Text style={styles.headerStyle}>{headerText}</Text>
				{!association && (
					<Text style={styles.emptyAssociation}>
						No {headerText} associated.
					</Text>
				)}
				{association && (
					<View style={styles.innerContainer}>
						<View style={styles.headerContainer}>
							<Text style={styles.associationName}>{association.Name}</Text>
							{!hideClose && (
								<TouchableOpacity
									style={styles.closeIconContainer}
									onPress={() => this.handlePress(association.attributes.type)}
									hitSlop={{
										top: 10,
										left: 10,
										bottom: 10,
										right: 10
									}}
								>
									<View>
										<Icon
											name={'close'}
											size={15}
											color="white"
											style={styles.closeIcon}
										/>
									</View>
								</TouchableOpacity>
							)}
						</View>
						{address && <Text>{address}</Text>}
						<Text>{association.Phone || ''}</Text>
					</View>
				)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	innerContainer: {
		borderColor: '#90a4b9',
		borderWidth: 1,
		borderRadius: 3,
		padding: 20
	},
	associationName: {
		fontFamily: 'System',
		fontWeight: '700',
		fontSize: 17,
		marginBottom: 10
	},
	headerStyle: {
		fontFamily: 'System',
		fontWeight: '300',
		fontSize: 17,
		marginBottom: 10
	},
	emptyAssociation: {
		fontFamily: 'System',
		fontWeight: '500',
		fontSize: 15,
		marginBottom: 10
	},
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	showMore: {
		marginTop: 15,
		fontFamily: 'System',
		fontWeight: '300',
		marginBottom: 20,
		fontSize: 15
	},
	baseText: {
		fontFamily: 'System',
		fontWeight: '300',
		fontSize: 20
	},
	listItem: {
		marginLeft: 0,
		paddingVertical: 15,
		borderBottomColor: 'darkgray',
		borderBottomWidth: 0.5,
		flexDirection: 'row',
		borderBottomColor: 'darkgray',
		borderBottomWidth: 0.5
	},
	closeIconContainer: {
		backgroundColor: '#488aea',
		borderRadius: 10,
		width: 20,
		height: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 'auto',
		position: 'absolute',
		right: -15,
		top: -15
	},

	listItemText: {
		marginTop: 10,
		paddingLeft: 20,
		fontSize: 20
	}
})

export default AssociationCard
