import React from 'react'
import {
	View,
	Text,
	TouchableOpacity as oldTouchableOpacity,
	StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)

export default ({ history, breadCrumbNav }) => {
	return (
		<View style={[styles.breadCrumbs]}>
			{history.length > 0 && (
				<TouchableOpacity onPress={e => breadCrumbNav(-1)}>
					<Text>
						<Icon name={'home'} size={30} color="darkgrey" />
					</Text>
				</TouchableOpacity>
			)}
			{generateBreadCrumbs({ history, breadCrumbNav })}
		</View>
	)
}

const generateBreadCrumbs = ({ history, breadCrumbNav }) => {
	//truncate breadcrumbs if they may overrun
	history =
		history.length > 4
			? [...history.slice(0, 2), { name: '...' }, ...history.slice(-2)]
			: history
	return history.map((h, i) => {
		return (
			<TouchableOpacity key={h.name + i} onPress={() => breadCrumbNav(i)}>
				<Text style={styles.breadCrumb}>
					{' '}
					{i > 0 ? '> ' : ''} {h.name}{' '}
				</Text>
			</TouchableOpacity>
		)
	})
}

const styles = StyleSheet.create({
	breadCrumbContainer: {
		flexDirection: 'row'
	},
	breadCrumb: {
		fontFamily: 'System',
		fontWeight: '300',
		fontSize: 20,
		color: 'black',
		marginLeft: 10
	},
	breadCrumbs: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 27,
		paddingBottom: 10,
		paddingLeft: 65,
		backgroundColor: 'rgba(255,255,255,.7)',
		alignSelf: 'flex-start'
	}
})
