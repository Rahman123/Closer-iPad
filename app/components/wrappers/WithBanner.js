import React from 'react'
import { StyleSheet, View, Animated } from 'react-native'

import RNFS from 'react-native-fs'

import DrawerIcon from '../presentational/DrawerIcon'
const MAX_BANNER_HEIGHT = 225

class WithBanner extends React.Component {
	static navigationOptions = {
		header: null
	}

	constructor(props) {
		super(props)
	}

	render() {
		const { screenWidth, scrollY, pageData ={}, userId, screenHeight } = this.props
		const {
			bannerHeight,
			bannerWidth,
			bannerId,
			bannerFileExtension
		} = pageData

		const calculatedBannerHeight = bannerHeight / (bannerWidth / screenWidth)
		return (
			<View style={styles.mainView}>
				<DrawerIcon scrollY={scrollY} maxBannerHeight={MAX_BANNER_HEIGHT} />
				{bannerId && (
					<View style={[styles.bannerContainer, StyleSheet.absoluteFill]}>
						<Animated.Image
							style={[
								{
									transform: [
										{
											scale: scrollY.interpolate({
												inputRange: [-150, 0],
												outputRange: [1.3, 1],
												extrapolate: 'clamp'
											})
										},
										{
											translateY: scrollY.interpolate({
												inputRange: [0, MAX_BANNER_HEIGHT],
												outputRange: [0, -100],
												extrapolate: 'clamp'
											})
										}
									],
									height: calculatedBannerHeight,
									width: screenWidth,
									margin: 'auto',
									opacity: scrollY.interpolate({
										inputRange: [0, MAX_BANNER_HEIGHT],
										outputRange: [1, 0.5]
									})
								},
								styles.banner
							]}
							resizeMode={'cover'}
							source={{
								uri: `${
									RNFS.DocumentDirectoryPath
								}/${userId}/banners/${bannerId}.${bannerFileExtension}`
							}}
						/>
					</View>
				)}
				<Animated.ScrollView
					contentContainerStyle={[
						styles.container,
						screenHeight ? { height: screenHeight + MAX_BANNER_HEIGHT } : {}
					]}
					scrollEventThrottle={1}
					onScroll={Animated.event(
						[
							{
								nativeEvent: {
									contentOffset: {
										y: scrollY
									}
								}
							}
						],
						{ useNativeDriver: true }
					)}
				>
					{this.props.children}
				</Animated.ScrollView>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		justifyContent: 'flex-start',
		backgroundColor: 'white',
		top: MAX_BANNER_HEIGHT,
		height: 1060
	},
	mainView: {
		backgroundColor: 'white'
	},
	bannerContainer: {
		height: 300
	},
	banner: {
		justifyContent: 'center'
	}
})

export default WithBanner
