import React from 'react'
import {
	Text,
	View,
	FlatList,
	Image,
	TouchableOpacity as oldTouchableOpacity,
	StyleSheet
} from 'react-native'

import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)

const TILE_HEIGHT = 150
const TILE_WIDTH = 150

import RNFS from 'react-native-fs'

export default ({ handlePress, childTiles = [], userId }) => {
	const tileListWidth = childTiles.length * (TILE_WIDTH + 60)
	return (
		<View style={[styles.tileContainer]}>
			<Text style={[styles.categoryHeadingText, styles.baseText]}>
				Categories
			</Text>
			<FlatList
				contentContainerStyle={[styles.tileList, { width: tileListWidth }]}
				showsHorizontalScrollIndicator={false}
				data={childTiles}
				horizontal
				renderItem={({ item }) => (
					<View style={styles.outerItemContainer}>
						<TouchableOpacity
							disabled={false}
							onPress={() => {
								handlePress(item.contentCategoryId)
							}}
							style={styles.tileImageContainer}
						>
							<Image
								style={styles.tileImage}
								resizeMode={'contain'}
								source={{
									uri: `${RNFS.DocumentDirectoryPath}/${userId}/tiles/${
										item.tileId
									}.${item.tileFileExtension}`
								}}
							/>
							<Text
								numberOfLines={2}
								style={[styles.baseText, styles.categoryTileText]}
							>
								{item.name}
							</Text>
						</TouchableOpacity>
					</View>
				)}
				keyExtractor={(item, index) => 'i' + index}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	baseText: {
		fontFamily: 'System',
		fontWeight: '300'
	},
	categoryTileText: {
		color: '#8a8a8a',
		fontSize: 20,
		maxWidth: 175,
		textAlign: 'center'
	},
	tileImage: {
		height: TILE_HEIGHT,
		width: TILE_WIDTH,
		marginTop: 10,
		marginBottom: 10,
		marginHorizontal: 30
	},
	tileImageContainer: {
		display: 'flex',
		alignItems: 'center'
	},
	tileList: {
		flexDirection: 'row',
		justifyContent: 'center',
		minWidth: '100%'
	},
	categoryHeadingText: {
		alignSelf: 'flex-start',
		marginLeft: 65,
		marginRight: 50,
		fontSize: 20
	},
	tileContainer: {
		marginTop: 20,
		width: '100%',
		alignItems: 'center'
	},
	outerItemContainer: {
		display: 'flex',
		alignItems: 'center'
	}
})
