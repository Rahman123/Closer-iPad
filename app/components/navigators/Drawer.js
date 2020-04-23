import {
	DrawerItems,
	SafeAreaView,
	NavigationActions,
	StackActions
} from 'react-navigation'
import React from 'react'
import { StyleSheet, ScrollView, View, Alert } from 'react-native'
import NavigationAssociations from '../presentational/NavigationAssociations'
import QueryHelper from '../../utils/queryHelper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as DataActions from '../../actions/dataActions'
import * as AnalyticsActions from '../../actions/analyticsActions'
import * as ErrorActions from '../../actions/errorActions'
import ProfilePicker from '../containers/ProfilePickerContainer'

const CustomDrawerContent = props => {
	const {
		items,
		savedAssociations = {},
		resetAllContent,
		navigation,
		isConnected
	} = props

	return (
		<ScrollView>
			<SafeAreaView
				style={styles.container}
				forceInset={{ top: 'always', horizontal: 'never' }}
			>
				<View />
				<ProfilePicker rootNavigator={navigation} />
				<View style={styles.divider} />
				<DrawerItems
					{...props}
					items={items.slice(0, 1)}
					onItemPress={routeInfo => {
						const {
							route: { routes = [] }
						} = routeInfo
						if (routes.some(r => r.routeName === 'ContentViewer')) {
							navigation.navigate('Home', {}, NavigationActions.back())
						} else {
							navigation.navigate('Home')
						}
					}}
				/>
				<DrawerItems {...props} items={items.slice(1, 3)} />
				<View style={styles.divider} />
				{/* Analytics */}
				<DrawerItems {...props} items={items.slice(3, 4)} />
				<NavigationAssociations {...savedAssociations} />
				<View style={styles.divider} />
				<DrawerItems {...props} items={items.slice(4, 5)} />
				{!!isConnected && (
					<View>
						{/* refresh content */}
						<View style={styles.divider} />
						<DrawerItems
							{...props}
							items={items.slice(5, 7)}
							onItemPress={route => {
								handleItemPress(route, props)
							}}
						/>
					</View>
				)}
				{/* setting, reset and logout */}
				<View style={styles.divider} />
				<DrawerItems
					{...props}
					items={items.slice(7, 8)}
					onItemPress={route => {
						Alert.alert(
							'Reset All Content',
							"Are you sure you'd like to remove all content and profiles from the app?",
							[
								{ text: 'OK', onPress: resetAllContent },
								{ text: 'Cancel', style: 'cancel' }
							]
						)
					}}
				/>
				<DrawerItems
					{...props}
					items={items.slice(8)}
					onItemPress={route => {
						Alert.alert('Sign Out', "Are you sure you'd like to sign out?", [
							{ text: 'OK', onPress: QueryHelper.logout },
							{ text: 'Cancel', style: 'cancel' }
						])
					}}
				/>
			</SafeAreaView>
		</ScrollView>
	)
}

const handleItemPress = ({ route }, props) => {
	const { refreshData, uploadMeetingInfo, navigation } = props
	const { routeName } = route
	if (routeName === 'Quick Sync Analytics') {
		uploadMeetingInfo()
	}
	if (routeName === 'Refresh Content') {
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'ContentScreen' })]
		})
		navigation.dispatch(resetAction)
		refreshData()
	}
	navigation.toggleDrawer()
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between'
	},
	divider: {
		height: 1,
		width: '100%',
		backgroundColor: 'lightgrey'
	}
})

function mapStateToProps(state, props) {
	const { dataReducer, analyticsReducer, errorReducer } = state
	return { ...props, ...dataReducer, ...analyticsReducer, ...errorReducer }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		{ ...DataActions, ...AnalyticsActions, ...ErrorActions },
		dispatch
	)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CustomDrawerContent)
