import React, { Component } from 'react'
import {
	Text,
	View,
	TouchableOpacity as oldTouchableOpacity,
	ScrollView,
	StyleSheet
} from 'react-native'
import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
class AssociationList extends Component {
	constructor(props) {
		super(props)
		this.state = { showMore: false }
		this.buildListItems = this.buildListItems.bind(this)
		this.toggleShowMore = this.toggleShowMore.bind(this)
	}

	toggleShowMore() {
		const { showMore } = this.state
		this.setState({ showMore: !showMore })
	}

	handlePress(e) {
		const { handlePress } = this.props
		handlePress(e)
	}

	buildListItems() {
		const {
			associationOptions,
			iconName,
			iconSize,
			iconColor,
      handlePress,
      screenWidth,
			savedAssociations = {}
		} = this.props

		let optionsToShow = this.state.showMore
			? associationOptions
			: associationOptions.slice(0, 3)

		const savedAssociationIds = Object.values(savedAssociations).map(a => a.Id)

		const savedStatuses = optionsToShow.map(e =>
			savedAssociationIds.includes(e.Id)
		)
		return optionsToShow.map((e, i) => {
			const type = e.attributes.type
			const anyOfTypeSaved = type in savedAssociations
			const alreadySaved = savedStatuses[i]
			const disabled = !alreadySaved && anyOfTypeSaved
			iconFinalColor = disabled ? '#e5e5e5' : iconColor

			return (
				<TouchableOpacity key={e + i} onPress={() => handlePress(e)}>
					<View
						style={[styles.listItem, alreadySaved ? styles.itemActive : {}]}
					>
						<View style={styles.icon}>
							<Icon
								name={iconName}
								size={iconSize}
								color={alreadySaved ? 'white' : iconFinalColor}
							/>
						</View>
						<Text
							numberOfLines={2}
							ellipsizeMode={'tail'}
							style={[
                styles.listItemText,
                {width: screenWidth * .40},
								alreadySaved ? styles.itemTextActive : {},
                disabled ? styles.itemTextDisabled : {},
							]}
						>
							{e.Name}
						</Text>
					</View>
				</TouchableOpacity>
			)
		})
	}

	render() {
		const { style, headerText, associationOptions } = this.props
		const { showMore } = this.state
		if (!associationOptions.length) return null

		const associationElements = this.buildListItems()

		const displayLengthToggle = associationOptions.length > 3

		return (
			<View style={style}>
				<Text style={styles.headerStyle}>{headerText}</Text>
				<ScrollView>{associationElements}</ScrollView>
				<TouchableOpacity
					onPress={this.toggleShowMore}
					hitSlop={{
						top: 10,
						left: 10,
						bottom: 10,
						right: 10
					}}
				>
					{displayLengthToggle && (
						<Text style={styles.showMore}>
							{`See ${showMore ? 'fewer' : 'more'} ${headerText}`.toUpperCase()}
						</Text>
					)}
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	headerStyle: {
		fontFamily: 'System',
		fontWeight: '300',
		marginBottom: 20,
		fontSize: 17
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
		borderBottomWidth: 0.5,
		paddingHorizontal: 20
	},
	icon: {
		justifyContent: 'center'
	},
	listItemText: {
		marginTop: 10,
		paddingLeft: 20,
		fontSize: 20,
	},
	itemActive: {
		backgroundColor: '#488aea'
	},
	itemTextActive: {
		color: 'white'
	},
	itemTextDisabled: {
		color: '#e5e5e5'
	}
})

export default AssociationList
