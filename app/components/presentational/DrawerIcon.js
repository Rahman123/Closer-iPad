import React from 'react'
import {
	Text,
	TouchableOpacity as oldTouchableOpacity,
	StyleSheet,
	Animated
} from 'react-native'
import { withNavigation } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)

const DrawerIcon = ({
	maxBannerHeight,
	scrollY,
	navigation,
	shadowOpacity = 0
}) => {
	let opacity
	if (!scrollY || !maxBannerHeight) {
		opacity = shadowOpacity
	} else {
		opacity = scrollY.interpolate({
			inputRange: [0, maxBannerHeight],
			outputRange: [0.5, 0],
			extrapolate: 'clamp'
		})
	}

	return (
		<Animated.View
			style={[
				styles.iconContainer,
				{
					shadowOpacity: opacity
				}
			]}
		>
			<TouchableOpacity
				onPress={() => navigation.toggleDrawer()}
				hitSlop={{
					top: 10,
					left: 10,
					bottom: 10,
					right: 10
				}}
			>
				<Text>
					<Icon name={'menu'} size={30} color="darkgrey" />
				</Text>
			</TouchableOpacity>
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	iconContainer: {
		position: 'absolute',
		zIndex: 50,
		top: 20,
		left: 10,
		backgroundColor: 'white',
		borderRadius: 30,
		paddingVertical: 10,
		paddingHorizontal: 12,
		opacity: 0.7,
		shadowOffset: { width: 2, height: 3 },
		shadowColor: 'black',
		shadowRadius: 4
	}
})

export default withNavigation(DrawerIcon)
