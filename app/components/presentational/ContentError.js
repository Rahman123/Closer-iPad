import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import RefreshData from '../containers/RefreshData'
export default ({ navigation }) => {
	return (
		<View style={styles.errorContainer}>
			<Text>
				Something seems to be wrong with this file. Please try refreshing the
				data.
			</Text>
			<RefreshData beforeRefresh={navigation.goBack} size={50} />
		</View>
	)
}

var styles = StyleSheet.create({

	errorContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 'auto',
		marginBottom: 'auto'
	}
})
