import React from 'react'
import {
	View,
	Text,
	TouchableOpacity as oldTouchableOpacity,
	StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import * as Actions from '../../actions/analyticsActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)

class UploadMeetingInfo extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<View
				style={[
					{ flexDirection: 'row', alignItems: 'center' },
					this.props.style
				]}
			>
				<TouchableOpacity onPress={e => this.props.uploadMeetingInfo()}>
					<Text>
						<Icon name={'cloud-upload'} size={30} color="darkgrey" />
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	breadCrumbContainer: {
		flexDirection: 'row'
	},
	breadCrumb: {
		fontFamily: 'System',
		fontWeight: '300',
		fontSize: 20,
		color: 'black',
		marginLeft: 10
	}
})

function mapStateToProps(state, props) {
	return {}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UploadMeetingInfo)
