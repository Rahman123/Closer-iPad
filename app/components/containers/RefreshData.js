import React from 'react'
import {
	View,
	Text,
	TouchableOpacity as oldTouchableOpacity,
	StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import * as Actions from '../../actions/dataActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)
class RefreshData extends React.Component {
	constructor(props) {
		super(props)
		this.refreshData = this.refreshData.bind(this)
	}

	refreshData() {
		const { beforeRefresh, refreshData } = this.props
		refreshData()
		if (beforeRefresh) {
			beforeRefresh()
		}
	}

	render() {
		const { size, style } = this.props

		return (
			<View style={[styles.container, style]}>
				<TouchableOpacity onPress={this.refreshData}>
					<Text>
						<Icon name={'refresh'} size={size || 30} color="darkgrey" />
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	}
})

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
)(RefreshData)
