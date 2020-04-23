import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions/dataActions'

import { NavigationActions, StackActions } from 'react-navigation'

import ProfilePicker from '../presentational/ProfilePicker'

const ProfilePickerContainer = ({
	allRootContent,
	updateSelectedProfile,
	rootCategoryId,
	rootNavigator
}) => {
	const handleProfileSelection = contentCategoryId => {
		const resetAction = StackActions.reset({
			index: 0,
			actions: [
				NavigationActions.navigate({
					routeName: 'ContentScreen',
					params: { contentCategoryId }
				})
			]
		})
		rootNavigator.dispatch(resetAction)
		updateSelectedProfile(contentCategoryId)
	}

	return (
		<ProfilePicker
			rootCategoryId={rootCategoryId}
			profiles={allRootContent}
			handleProfileSelection={handleProfileSelection}
		/>
	)
}

function mapStateToProps(state, props) {
	return { ...props, ...state.dataReducer }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfilePickerContainer)
