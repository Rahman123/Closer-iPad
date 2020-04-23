import React from 'react'
import {
	TouchableOpacity as oldTouchableOpacity,
	View,
	Text,
	StyleSheet,
	noUpperCase
} from 'react-native'
import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default ({
	onPress,
	style,
	textStyle,
	backgroundColor,
	color,
	title,
	disabled,
	children,
	borderColor,
	iconName,
	iconStyle = {}
}) => {
	if (!noUpperCase && title) title = title.toUpperCase()
	let customColor = color ? { color } : { color: 'white' }
	let customBackgroundColor = backgroundColor ? { backgroundColor } : {}
	let customBorderColor = borderColor ? { borderColor, borderWidth: 1 } : {}
	let isDisabled = disabled ? styles.disabled : {}
	let icon = iconName ? (
		<Icon
			style={[styles.iconStyle, iconStyle]}
			name={iconName}
			size={25}
			color={customColor.color}
		/>
	) : null

	return (
		<TouchableOpacity
			style={[
				styles.button,
				customBackgroundColor,
				customBorderColor,
				style,
				isDisabled
			]}
			onPress={disabled ? () => {} : onPress}
		>
			<View style={styles.textContainer}>
				{icon}
				{title && (
					<Text style={[styles.title, customColor, textStyle]}>{title}</Text>
				)}
				{children}
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	title: {
		textAlign: 'center',
		fontFamily: 'System',
		fontWeight: '700',
		fontSize: 15,
		color: 'white'
	},
	button: {
		height: 50,
		width: 200,
		backgroundColor: '#488aea',
		justifyContent: 'center',
		borderRadius: 5,
		marginLeft: 'auto',
		marginRight: 'auto'
	},
	disabled: {
		backgroundColor: '#e5e5e5'
	},
	textContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	iconStyle: { marginRight: 20 }
})
