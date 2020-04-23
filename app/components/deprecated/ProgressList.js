import React from 'react'
import { ProgressViewIOS, StyleSheet, Text, View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as Actions from '../actions/dataActions'

class ProgressList extends React.Component {
	constructor(props) {
		super(props)
		this.state = { totalBytes: 0 }
	}

	buildProgressBars() {
		const {
      totalBytesWritten = 0,
			totalSize
		} = this.props


		return (
			<ProgressViewIOS
				// key={id}
				progress={0.6}
				style={{
					marginLeft: 'auto',
					marginRight: 'auto',
					borderRadius: 20,
					width: '100%',
					height: 15,
					transform: [{ scaleY: 4 }]
				}}
			/>
		)
		// })
	}

	render() {
		const { progress } = this.props
		return this.buildProgressBars()
	}
}

const styles = StyleSheet.create({})

function mapStateToProps(state, props) {
	const { dataReducer } = state
	return { ...dataReducer, ...props }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProgressList)
