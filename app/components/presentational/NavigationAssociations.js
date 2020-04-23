import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default ({ Contact, Opportunity, Account }) => {
	const showAssociations = Contact || Opportunity || Account
	return (
		<View>
			{showAssociations && (
				<View style={styles.associationContainer}>
					{Contact && (
						<View>
							<View>
								<Text style={styles.associationText}>{`Contact`}</Text>
							</View>
							<View>
								<Text
									numberOfLines={2}
									ellipsizeMode={'tail'}
									style={styles.associationNameText}
								>
									{Contact.Name}
								</Text>
							</View>
						</View>
					)}
					{Opportunity && (
						<View>
							<View>
								<Text style={styles.associationText}>{`Opportunity`}</Text>
							</View>
							<View>
								<Text
									numberOfLines={2}
									ellipsizeMode={'tail'}
									style={styles.associationNameText}
								>
									{Opportunity.Name}
								</Text>
							</View>
						</View>
					)}
					{Account && (
						<View>
							<View>
								<Text style={styles.associationText}>{`Account`}</Text>
							</View>
							<View>
								<Text
									numberOfLines={2}
									ellipsizeMode={'tail'}
									style={styles.associationNameText}
								>
									{Account.Name}
								</Text>
							</View>
						</View>
					)}
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	associationContainer: {
		marginLeft: 72
	},
	associationText: {
		fontFamily: 'System',
		fontWeight: '700',
		fontSize: 14
	},
	associationNameText: {
		fontWeight: '200',
		fontSize: 18,
		marginRight: 20,
		marginBottom: 10,
		color: '#565656'
	}
})
