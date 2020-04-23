import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TouchableOpacity as oldTouchableOpacity
} from 'react-native'
import StarRating from 'react-native-star-rating'
import ModalDropdown from 'react-native-modal-dropdown'
import WithPreventDoubleTap from '../wrappers/withPreventDoubleTap'
import Swipeout from 'rc-swipeout'

const TouchableOpacity = WithPreventDoubleTap(oldTouchableOpacity)
class ContentList extends Component {
	constructor(props) {
		super(props)
		this.buildContent = this.buildContent.bind(this)
		this.handleSort = this.handleSort.bind(this)
	}

	buildContent(relatedContentInfo) {
		const iconMappings = {
			pdf: 'file-pdf',
			png: 'image',
			jpg: 'image',
			gif: 'image',
			jpeg: 'image',
			mp4: 'play-circle-outline',
			mpeg4: 'play-circle-outline',
			mov: 'play-circle-outline',
			docx: 'file-word',
			doc: 'file-word',
			xlsx: 'file-excel',
			xls: 'file-excel',
			csv: 'file-excel',
			avi: 'play-circle-outline',
			mpeg: 'play-circle-outline',
			m4a: 'play-circle-outline',
			m4v: 'play-circle-outline',
			fmp4: 'play-circle-outline',
			webm: 'play-circle-outline',
			mkv: 'play-circle-outline',
			mp3: 'play-circle-outline',
			ogg: 'play-circle-outline',
			wav: 'play-circle-outline',
			flv: 'play-circle-outline',
			adts: 'play-circle-outline',
			aac: 'play-circle-outline'
		}

		const {
			screenWidth,
			handlePress,
			handleStarPress,
			showStars = false,
			showSize = true,
			showMailto = true,
			starRatings = {},
			swipeEnabled = false,
			removeFunction = () => {},
			mailtoContent = [],
			handleSelectMailto = () => {},
			handleDeselectMailto = () => {}
		} = this.props
		return relatedContentInfo.map((c, i) => {
			const iconName = iconMappings[c.fileExtension] || 'file'
			const mailtoSelected = mailtoContent
				.map(mc => mc.versionDataId)
				.includes(c.versionDataId)

			const mailtoColor = mailtoSelected ? '#488aea' : 'grey'
			const mailtoFunction = mailtoSelected
				? handleDeselectMailto
				: handleSelectMailto
			return (
				<Swipeout
					autoClose
					right={[
						{
							text: 'Remove',
							onPress: () => {
								removeFunction(c)
							},
							style: { backgroundColor: 'red', color: 'white' }
						}
					]}
					disabled={!swipeEnabled}
					key={i + 't'}
					style={[
						{
							height: showStars ? 95 : 50
						},
						styles.outerItemContainer
					]}
				>
					<TouchableOpacity onPress={() => handlePress(c)}>
						<View style={[styles.contentText]}>
							<Text style={[styles.icon, styles.baseText]}>
								<Icon name={iconName} size={30} color="darkgrey" />
							</Text>
							<Text
								numberOfLines={1}
								ellipsizeMode={'tail'}
								style={{ maxWidth: screenWidth * 0.28 }}
							>
								{c.title}
							</Text>
							{showSize && (
								<Text
									style={{
										marginLeft: 'auto',
										textAlignVertical: 'center'
									}}
								>
									{' '}
									{c.contentSize > 900000
										? `${(parseFloat(c.contentSize) / 1000000).toFixed(2)} mb`
										: `${(parseFloat(c.contentSize) / 1000).toFixed(2)} kb`}
								</Text>
							)}
							{showMailto && (
								<TouchableOpacity
									style={[
										{
											marginLeft: showSize ? 20 : 'auto'
										},
										styles.mailtoContainer
									]}
									onPress={() => mailtoFunction(c)}
								>
									<Icon name={'email'} size={30} color={mailtoColor} />
								</TouchableOpacity>
							)}
						</View>
						{showStars && (
							<View style={styles.starsContainer}>
								<Text> Rating: </Text>
								<StarRating
									animation={'rotate'}
									disabled={false}
									maxStars={5}
									rating={starRatings[c.versionDataId]}
									starSize={25}
									containerStyle={styles.stars}
									selectedStar={rating => {
										handleStarPress(rating, c.versionDataId)
									}}
								/>
							</View>
						)}
					</TouchableOpacity>
				</Swipeout>
			)
		})
	}

	handleSort(sortType, isDesc) {
		const { sortFunction = () => {} } = this.props
		sortFunction(sortType, isDesc)
	}

	render() {
		const {
			height,
			relatedContentInfo = [],
			sortChoice = {},
			listTitle = 'Content',
			style,
			showSort = true
		} = this.props

		const { isDesc = false, sortType = 'NAME' } = sortChoice

		return (
			<View style={[styles.relatedContentContainer, style]}>
				<View>
					<View style={styles.listHeader}>
						<Text style={[styles.contentHeadingText, styles.baseText]}>
							{listTitle}
						</Text>
						{!!relatedContentInfo.length &&
							!!showSort && (
								<View style={styles.sortContainer}>
									<TouchableOpacity
										onPress={() => {
											this.handleSort(sortType, !isDesc)
										}}
										hitSlop={{
											top: 10,
											left: 10,
											bottom: 10,
											right: 5
										}}
									>
										<Text>
											<Icon
												name={isDesc ? 'arrow-down' : 'arrow-up'}
												size={25}
												color="darkgrey"
											/>
										</Text>
									</TouchableOpacity>
									<ModalDropdown
										defaultValue={sortType}
										dropdownStyle={[styles.sortDropdown]}
										dropdownTextStyle={[styles.sortDropdownText]}
										style={[styles.sortDropdownButton]}
										textStyle={[styles.sortText]}
										defaultIndex={0}
										options={['NAME', 'TYPE', 'SIZE']}
										onSelect={(idx, value) => {
											this.handleSort(value, false)
										}}
									/>
								</View>
							)}
					</View>
					<ScrollView style={{ height }}>
						{this.buildContent(relatedContentInfo)}
					</ScrollView>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	relatedContentContainer: {
		marginTop: 20,
		marginLeft: 65,
		marginRight: 50
	},
	sortContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	sortDropdown: {
		height: 115,
		marginTop: 10,
		width: 90,
		shadowOffset: { width: 3, height: 2 },
		shadowColor: 'lightgrey',
		shadowRadius: 4,
		shadowOpacity: 0.5
	},
	sortDropdownButton: {
		width: 60,
		paddingVertical: 10
	},
	sortText: {
		textAlign: 'right',
		fontFamily: 'System',
		fontWeight: '300',
		fontSize: 15,
		padding: 5
	},
	sortDropdownText: {
		textAlign: 'center',
		fontFamily: 'System',
		fontWeight: '300',
		fontSize: 15
	},
	listHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%'
	},
	baseText: {
		fontFamily: 'System',
		fontWeight: '300',
		fontSize: 20
	},
	icon: {
		marginRight: 20,
		marginLeft: 0,
		marginTop: 0,
		marginBottom: 0
	},
	contentText: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 15,
		width: '100%'
	},
	stars: { width: 150, marginLeft: 'auto', marginRight: 10, paddingBottom: 10 },
	outerItemContainer: {
		backgroundColor: 'transparent',
		borderBottomColor: 'darkgray',
		borderBottomWidth: 0.5
	},
	mailtoContainer: {
		marginRight: 10,
		alignItems: 'flex-end'
	},
	starsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginTop: 10
	}
})

export default ContentList
