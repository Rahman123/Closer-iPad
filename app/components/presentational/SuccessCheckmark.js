import React, { Component } from 'react'
import { Animated, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

class SuccessCheckMark extends Component {
	constructor(props) {
		super(props)
		this.state = {
			fadeAnim: new Animated.Value(0)
		}
	}
	componentDidMount() {
		const { onFinish } = this.props
		Animated.sequence([
			Animated.timing(this.state.fadeAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true
			}),
			Animated.timing(this.state.fadeAnim, {
				toValue: 0,
				duration: 700,
				useNativeDriver: true
			})
		]).start(onFinish)
	}
	render() {
		const { screenHeight, style } = this.props
		let { fadeAnim } = this.state
		return (
			<Animated.View
				style={[
					{
						height: screenHeight * 0.7,
						opacity: fadeAnim
					},
					styles.outerContainer,
					style
				]}
			>
				<Animated.View style={styles.innerContainer}>
					<Icon name="check" size={200} color="green" style={{}} />
				</Animated.View>
			</Animated.View>
		)
	}
}

const styles = StyleSheet.create({
	outerContainer: {
		justifyContent: 'center'
	},
	innerContainer: {
		backgroundColor: 'white',
		width: 200,
		height: 200,
		borderTopRightRadius: 100,
		borderBottomRightRadius: 100,
		borderTopLeftRadius: 100,
		borderBottomLeftRadius: 100,
		borderColor: 'green',
		borderWidth: 3,
		alignSelf: 'center'
	}
})

export default SuccessCheckMark
