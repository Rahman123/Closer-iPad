import React, { Component } from 'react'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {
	TextInput,
	StyleSheet,
	View,
	TouchableOpacity as oldTouchableOpacity
} from 'react-native'
import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)
class ContentSearch extends Component {
	constructor(props) {
		super(props)
		this.state = { query: '' }
		this.handleSearch = this.handleSearch.bind(this)
		this.clearQuery = this.clearQuery.bind(this)
	}

	handleSearch() {
		const { query } = this.state
		const { searchFunction = () => {} } = this.props
		if (query.length < 2) return
		searchFunction(query)
	}

	clearQuery() {
		const { clearSearch = () => {} } = this.props
		this.setState({ query: '' })
		this.textInput.clear()
		clearSearch()
	}

	render() {
		const { query } = this.state
		const { editable, placeholder = 'Search', style } = this.props

		return (
			<View style={[styles.searchSection, style]}>
				<Icon
					style={styles.searchIcon}
					name="magnify"
					size={15}
					color="darkgrey"
				/>
				<TextInput
					editable={editable}
					ref={input => {
						this.textInput = input
					}}
					style={styles.searchInput}
					placeholder={placeholder}
					returnKeyType="search"
					onEndEditing={this.handleSearch}
					onChangeText={query => {
						this.setState({ query })
					}}
					underlineColorAndroid="transparent"
				/>
				{query.length > 0 && (
					<TouchableOpacity
						style={styles.closeIconContainer}
						onPress={this.clearQuery}
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
								size={13}
								color="white"
								style={styles.closeIcon}
							/>
						</View>
					</TouchableOpacity>
				)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	searchSection: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	searchInput: {
		flex: 1,
		height: 40,
		paddingLeft: 40,
		paddingRight: 20,
		borderColor: 'darkgray',
		borderWidth: 1,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		borderBottomRightRadius: 20,
		borderBottomLeftRadius: 20
	},
	searchIcon: {
		position: 'absolute',
		left: 10,
		padding: 10
	},
	closeIconContainer: {
		backgroundColor: 'darkgrey',
		borderRadius: 10,
		width: 18,
		height: 18,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 'auto',
		position: 'absolute',
		right: 10
	}
})

export default ContentSearch
