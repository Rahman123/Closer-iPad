import React, { Component } from 'react'
import { BarIndicator } from 'react-native-indicators'
import { View } from 'react-native'
export default WrappedComponent => {
	return props => {
		const { onPress, ...rest } = props
		const handlePress = originalOnPress => {
			if (this.disabled) return
			this.disabled = true
			onPress()
			setTimeout(() => {
				this.disabled = false
			}, 500)
		}
		return <WrappedComponent {...rest} onPress={handlePress} />
	}
}
