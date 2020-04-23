import React from 'react'
import {
	View,
	Text,
	TouchableOpacity as oldTouchableOpacity,
	StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import RNFS from 'react-native-fs'
import { oauth, net, smartstore } from 'react-native-force'

import * as Actions from '../actions/dataActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)

class TestingComponent extends React.Component {
	constructor(props) {
		super(props)
		this.test = this.test.bind(this)
	}

	// async test() {
	// 	let creds = await new Promise((resolve, reject) => {
	// 		oauth.getAuthCredentials(resolve, reject)
	// 	})

	// 	const {
	// 		accessToken, //: "00D1H000000MthZ!ASAAQE8nOoUBJf_0oL5VWF88mIKbR8.cutnHiAzNTlZGbPpxYSbrQTnO41cBofZYy3V0AnTocKGqH.vjTs5d_kI57XTwtiFv"
	// 		clientId, //: "3MVG9Iu66FKeHhINkB1l7xt7kR8czFcCTUhgoA8Ol2Ltf1eYHOU4SqQRSEitYFDUpqRWcoQ2.dBv_a1Dyu5xa"
	// 		instanceUrl, //: "https://na72.salesforce.com"
	// 		loginUrl, //: "https://login.salesforce.com"
	// 		orgId, //: "00D1H000000MthZUAS"
	// 		refreshToken, //: "5Aep8614gnB8HWYUgOljD37b0yG.csrKa5UlD3PyYHdmr_2R8Pwp3MsL1OLD0ebnzg5B0f.Ufp9qmV8g6GnGUEX"
	// 		userAgent, //: "SalesforceMobileSDK/6.1.0 iOS/11.4.1 (iPad) MobileContentGuide/1.0(1.0) ReactNative uid_0943A744-9FED-482C-8981-328F8D1E0AC0 ftr_UA.US Mozilla/5.0 (iPad; CPU OS 11_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15G77"
	// 		userId //: "0051H000008gR0f"}
	// 	} = creds
	// 	const downloadFileOptions = {
	// 		fromUrl: `${instanceUrl}/services/data/v43.0/sobjects/ContentVersion/0681H000003PtyhQAC/VersionData`, // URL to download file from
	// 		toFile: `${RNFS.DocumentDirectoryPath}/content/test.mp4`, // Local filesystem path to save the file to
	// 		headers: { Authorization: `Bearer ${accessToken}` }, // An object of headers to be passed to the server
	// 		// background?: boolean;     // Continue the download in the background after the app terminates (iOS only)
	// 		// discretionary?: boolean;  // Allow the OS to control the timing and speed of the download to improve perceived performance  (iOS only)
	// 		// cacheable?: boolean;      // Whether the download can be stored in the shared NSURLCache (iOS only, defaults to true)
	// 		// progressDivider?: number;
	// 		begin: res => {
	// 			console.log('%cbegin: ', 'color:blue', res)
	// 		},
	// 		progress: res => {
	// 			console.log('%cprogress: ', 'color:blue', res)
	// 		}
	// 		// resumable?: () => void;    // only supported on iOS yet
	// 		// readTimeout?: number       // supported on Android and iOS
	// 	}

	// 	RNFS.downloadFile(downloadFileOptions)
	// }

	test() {
		RNFS.readdir(`${RNFS.DocumentDirectoryPath}/content/`).then(res => {
			console.log(res)
		})
	}

	render() {
		const { size } = this.props

		return (
			<View
				style={[
					{ flexDirection: 'row', alignItems: 'center' },
					this.props.style
				]}
			>
				<TouchableOpacity onPress={this.test}>
					<Text>
						<Icon name={'star'} size={size || 30} color="darkgrey" />
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
	const { dataReducer } = state
	return { ...dataReducer, ...props }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TestingComponent)
