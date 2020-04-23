import React, { Component } from 'react'
import {
	Text,
	TouchableOpacity as oldTouchableOpacity,
	StyleSheet,
	Animated,
	View,
	FlatList
} from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)

class ProfilePickerContainer extends Component {
	constructor(props) {
		super(props)
		this.toggleOpen = this.toggleOpen.bind(this)
		this.handleProfileSelection = this.handleProfileSelection.bind(this)
		this.state = { isOpen: false }
	}

	toggleOpen() {
		const { isOpen } = this.state

		this.setState({ isOpen: !isOpen })
	}

	handleProfileSelection(contentCategoryId) {
		const { handleProfileSelection } = this.props
		handleProfileSelection(contentCategoryId)
		this.toggleOpen()
	}

	render() {
		const { isOpen } = this.state
		const { profiles = [], rootCategoryId } = this.props
		const selectedProfile = profiles.find(
			p => p.contentCategoryId === rootCategoryId
		)

		return (
			<View>
				<TouchableOpacity style={styles.container} onPress={this.toggleOpen}>
					<Icon

						name={'book-multiple'}
						size={25}
						color="darkgrey"
					/>
					<Text style={styles.headerText}>Select Profile</Text>
					<Icon
						style={styles.icon}
						name={isOpen ? 'chevron-down' : 'chevron-right'}
						size={40}
						color="darkgrey"
					/>
				</TouchableOpacity>
				{!isOpen &&
					selectedProfile && (
						<View style={styles.profileContainer}>
							<Text
								numberOfLines={2}
								ellipsizeMode={'tail'}
								style={[styles.selectedProfileText]}
							>
								{selectedProfile.contentCategoryName}
							</Text>
						</View>
					)}
				{isOpen && (
					<FlatList
						style={styles.profileList}
						keyExtractor={(item, index) => item.contentCategoryId}
						data={profiles}
						renderItem={({ item }) => (
							<TouchableOpacity
								onPress={() => {
									this.handleProfileSelection(item.contentCategoryId)
								}}
							>
								<View style={styles.profileContainer}>
									<View>
										<Text
											numberOfLines={2}
											ellipsizeMode={'tail'}
											style={[
												styles.profileNameText,
												rootCategoryId === item.contentCategoryId
													? styles.selectedProfile
													: {}
											]}
										>
											{item.contentCategoryName}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						)}
					/>
				)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 17
	},
	icon: {
		marginRight: 40
	},
	profileList: {
		maxHeight: 180
	},
	headerText: {
		fontWeight: '700',
		marginLeft: 30,
		marginRight: 80
	},
	profileContainer: {
		marginLeft: 72,
		marginBottom: 5
	},
	selectedProfile: {
    fontWeight: '500',
    color: 'black'
	},
	profileNameText: {
		fontSize: 18,
		fontWeight: '200',
		marginRight: 20,
		marginBottom: 10,
		color: '#565656'
	},
	selectedProfileText: {
		fontSize: 18,
		fontWeight: '200',
		marginRight: 20,
		marginBottom: 10
	}
})

export default ProfilePickerContainer
