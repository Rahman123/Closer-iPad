import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import Button from '../presentational/Button'
import debounce from 'lodash/debounce'

export default ({
	messageInfo = {},
	onSend,
	update,
	sendDisabled = false,
	screenHeight
}) => {
	return (
		<View style={styles.container}>
			<TextInput
				placeholder={'Email Address'}
				clearButtonMode={'always'}
				defaultValue={messageInfo.email}
				style={[styles.emailAddress]}
				textContentType={'emailAddress'}
				keyboardType={'email-address'}
				autoCapitalize={'none'}
				onChangeText={debounce(text => {
					update({ email: text })
				}, 300)}
			/>
			<TextInput
				placeholder={'Subject'}
				clearButtonMode={'always'}
				defaultValue={messageInfo.subject}
				style={[styles.emailSubject]}
				autoCapitalize={'none'}
				onChangeText={debounce(text => {
					update({ subject: text })
				}, 300)}
			/>
			<TextInput
				multiline={true}
				placeholder={'Message'}
				clearButtonMode={'never'}
				defaultValue={messageInfo.message}
				style={[styles.emailBody, { height: screenHeight }]}
				onChangeText={debounce(text => {
					update({ message: text })
				}, 1000)}
			/>
			<View style={styles.sendButtonContainer}>
				<Button
					disabled={sendDisabled}
					onPress={onSend}
					title="Send"
					color="white"
					iconName="send"
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { marginTop: 10 },
	emailSubject: {
		borderColor: 'darkgrey',
		height: 40,
		padding: 10,
		borderWidth: 1,
		marginTop: 10,
		borderTopRightRadius: 3,
		borderBottomRightRadius: 3,
		borderTopLeftRadius: 3,
		borderBottomLeftRadius: 3
	},
	emailAddress: {
		borderColor: 'darkgrey',
		height: 40,
		padding: 10,
		borderWidth: 1,
		borderTopRightRadius: 3,
		borderBottomRightRadius: 3,
		borderTopLeftRadius: 3,
		borderBottomLeftRadius: 3
	},
	emailBody: {
		borderColor: 'darkgrey',
		marginTop: 10,
		height: 352,
		padding: 10,
		borderWidth: 1,
		borderTopRightRadius: 3,
		borderBottomRightRadius: 3,
		borderTopLeftRadius: 3,
		borderBottomLeftRadius: 3
	},
	sendButtonContainer: {
		flexDirection: 'row',
		marginTop: 20,
		marginLeft: 'auto'
	}
})
