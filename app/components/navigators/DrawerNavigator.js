import React from 'react'
import { Text } from 'react-native'
import { createDrawerNavigator } from 'react-navigation'
import MainContent from './StackNavigator'
import CustomContentDrawer from './Drawer'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AllContent from '../containers/AllContent'
import AssociateRecordContainer from '../containers/AssociateRecordContainer'
import MailContentContainer from '../containers/MailContentContainer'
import MeetingSummary from '../containers/MeetingSummary'

export default createDrawerNavigator(
	{
		Home: {
			screen: MainContent,
			navigationOptions: {
				drawerIcon: props => (
					<Text>
						<Icon name={'home'} size={25} color="darkgrey" />
					</Text>
				)
			}
		},
		'All Content': {
			screen: AllContent,
			navigationOptions: {
				drawerIcon: props => (
					<Text>
						<Icon name={'magnify'} size={25} color="darkgrey" />
					</Text>
				)
			}
		},
		'Send Content': {
			screen: MailContentContainer,
			navigationOptions: {
				drawerIcon: props => (
					<Text>
						<Icon name={'email'} size={25} color="darkgrey" />
					</Text>
				)
			}
		},
		'Associate Meeting with Record': {
			screen: AssociateRecordContainer,
			navigationOptions: {
				drawerIcon: props => (
					<Text>
						<Icon name={'link'} size={25} color="darkgrey" />
					</Text>
				)
			}
		},
		'Analytics Summary': {
			screen: MeetingSummary,
			navigationOptions: {
				drawerIcon: props => (
					<Text>
						<Icon name={'poll'} size={25} color="darkgrey" />
					</Text>
				)
			}
		},
		'Quick Sync Analytics': {
			screen: MainContent,
			navigationOptions: {
				drawerIcon: props => (
					<Text>
						<Icon name={'cloud-upload'} size={25} color="darkgrey" />
					</Text>
				)
			}
		},
		'Refresh Content': {
			screen: MainContent,
			navigationOptions: {
				drawerIcon: props => (
					<Text>
						<Icon name={'refresh'} size={25} color="darkgrey" />
					</Text>
				)
			}
		},

		'Reset All Content': {
			screen: MainContent,
			navigationOptions: {
				drawerIcon: props => (
					<Text>
						<Icon name={'nuke'} size={25} color="darkgrey" />
					</Text>
				)
			}
		},
		Logout: {
			screen: MainContent,
			navigationOptions: {
				drawerIcon: props => (
					<Text style={{ transform: [{ rotateY: '180deg' }] }}>
						<Icon name={'exit-to-app'} size={25} color="darkgrey" />
					</Text>
				)
			}
		}
	},
	{
		contentComponent: CustomContentDrawer,
		backBehavior: 'none'
	}
)
