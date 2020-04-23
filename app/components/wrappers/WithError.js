import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import Button from '../presentational/Button'
import * as Actions from '../../actions/errorActions'

const ErrorWrapper = WrappedComponent => {
	return class WithError extends Component {
		constructor(props) {
			super(props)
		}
		static navigationOptions = {
			header: null
		}

		getMessage(error) {
			let functionName
			if (error && error.stack) {
				functionName = error.stack.match(/\.(.*)(?=\$\s)/)
        functionName = functionName ? functionName[0].slice(1) : null
			} else if (error && !error.stack && error.message) {
        functionName = error.message.match(/\w*\s/)
        functionName = functionName ? functionName[0].trim() : null
			}
			const messages = {
				syncData:
					'There was an issue with syncing. Maybe it was the connection. Give it another try.',
				sendRequest:
					'There was a hiccup getting info from your Salesforce org. Have you installed the Mobile Content Guide App into your org too?'
			}

			return (
				messages[functionName] ||
				(error ? error.message : 'Something went wrong.')
			)
		}

		render() {
			const {
				error, // = { message: 'something went wrong' },
				clearError
			} = this.props
			const display = error ? {} : { display: 'none' }

			return (
				<View style={styles.outerContainer}>
					<View style={[styles.backdrop, display]} />
					<View style={[styles.innerContainer, display]}>
						<View style={[styles.row, { opacity: 1 }]}>
							<View style={{ flex: 1 }}>
								<Text style={[styles.baseText, styles.errorTitle]}>
									Something went a little sideways...
								</Text>
								<Text style={[styles.baseText, styles.errorMessage]}>
									{this.getMessage(error)}
								</Text>
								<Button
									textStyle={styles.button}
									color="white"
									title={'OK'}
									onPress={clearError}
								/>
							</View>
						</View>
					</View>
					<WrappedComponent {...this.props} />
				</View>
			)
		}
	}
}

const styles = {
	button: {
		fontWeight: '100'
	},
	outerContainer: {
		height: '100%',
		width: '100%'
	},
	backdrop: {
		flex: 1,
		opacity: 0.92,
		backgroundColor: 'black',
		padding: 20,
		position: 'absolute',
		zIndex: 10000,
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	innerContainer: {
		flex: 1,
		position: 'absolute',
		padding: 20,
		zIndex: 10001,
		height: '40%',
		width: '100%',
		alignSelf: 'center',
		top: '30%',
		borderRadius: 5
	},

	row: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	baseText: {
		fontFamily: 'System',
		fontWeight: '100',
		fontSize: 20,
		color: 'white'
	},
	errorTitle: {
		fontSize: 50,
		textAlign: 'center',
		marginBottom: 20
	},
	errorMessage: {
		fontSize: 25,
		textAlign: 'center',
    marginBottom: 40,
    width: '65%',
    alignSelf: 'center'
	},
	errorMessageTiny: {
		fontSize: 15,
		textAlign: 'center',
		marginBottom: 40
	}
}

function mapStateToProps(state, props) {
	const { errorReducer } = state
	return { ...props, ...errorReducer }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch)
}

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
	ErrorWrapper
)
