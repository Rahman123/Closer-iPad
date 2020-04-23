import React, { Component } from 'react'
import { BarIndicator } from 'react-native-indicators'
import { View, Animated } from 'react-native'

export default WrappedComponent => {
	return class WithSpinner extends Component {
		constructor(props) {
			super(props)
		}
		static navigationOptions = {
			header: null
		}
		render() {
			const { loading, totalBytesWritten, totalSize } = this.props
			const display = loading ? {} : { display: 'none' }
			const showStatusBar = totalBytesWritten && totalSize
			const percentComplete = totalSize > 0 ? totalBytesWritten / totalSize : 0

			return (
				<View style={[styles.outerContainer]}>
					<View style={[styles.container, display]}>
						<View style={styles.outerSpinnerContainer}>
							<View style={styles.innerSpinnerContainer}>
								<BarIndicator size={250} color="white" count={5} />
							</View>
						</View>

						<View style={styles.progressBarContainer}>
							<View
								style={[
									styles.progressBar,
									{
										width: `${100 * percentComplete}%`,
										opacity: !!showStatusBar ? 1 : 0
									}
								]}
							/>
						</View>
					</View>
					<WrappedComponent {...this.props} />
				</View>
			)
		}
	}
}

const styles = {
	container: {
		flex: 1,
		backgroundColor: '#01579B',
		opacity: 0.5,
		padding: 20,
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 10000
	},

	progressBar: {
		height: 20,
		backgroundColor: 'white',
		alignSelf: 'flex-start',
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		paddingLeft: 20,
		paddingRight: 20
	},
	progressBarContainer: {
		flex: 0.25
	},

	reverse: {
		transform: [
			{
				rotate: '180deg'
			}
		]
	},
	outerContainer: { height: '100%', width: '100%' },
	innerSpinnerContainer: { flex: 1 },
	outerSpinnerContainer: { opacity: 1, flex: 1, flexDirection: 'row' }
}
