import React, { Component } from 'react'

import {
	Animated,
	Keyboard,
	View,
	StyleSheet,
	TouchableWithoutFeedback
} from 'react-native'
class TwoColumn extends Component {
	constructor(props) {
		super(props)
		this.state = { scrollY: new Animated.Value(0) }
	}

	render() {
		const {
			children,
			icon,
			style,
			rightStyle = {},
			leftStyle = {}
		} = this.props
		const [left, right] = children
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<View style={[styles.outerContainer, style]}>
					{icon}
					<View style={[styles.innerContainer, leftStyle]}>{left}</View>
					<View style={[styles.verticalDivider]} />
					<View style={[styles.innerContainer, rightStyle]}>{right}</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	outerContainer: {
    backgroundColor: 'pink',
    flexDirection: 'row',
		height: '100%',
		paddingTop: 35,
    backgroundColor: 'white'
	},
	innerContainer: {
		
		height: '100%',
		flex: 1,
		marginHorizontal: 65,
		maxWidth: '50%'
	},

	verticalDivider: {
		width: 3,
		backgroundColor: 'darkgrey',
		marginVertical: 50
	}
})

export default TwoColumn
