import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import VideoPlayer from 'react-native-video-controls'
import RNFS from 'react-native-fs'

export default ({
  userId,
	fileExtension,
	versionDataId,
	navigation,
	updateViewingInfo,
	onBackHandler,
	onErrorHandler
}) => {
	return (
		<VideoPlayer
			navigator={navigation}
			source={{
				uri: `file://${
					RNFS.DocumentDirectoryPath
				}/${userId}/content/${versionDataId}.${fileExtension}`
			}}
			onError={onErrorHandler}
			onBack={onBackHandler}
			onProgress={updateViewingInfo}
			style={styles.backgroundVideo}
		/>
	)
}

var styles = StyleSheet.create({
	backgroundVideo: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	}
})
