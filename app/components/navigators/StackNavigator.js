import { createStackNavigator } from 'react-navigation'
import ContentScreen from '../ContentScreen'
import ContentViewer from '../containers/ContentViewerContainer'
import AllContent from '../containers/AllContent'

export default createStackNavigator(
	{
		ContentScreen: { screen: ContentScreen },
		AllContent: { screen: AllContent },
		ContentViewer: { screen: ContentViewer }
	},
	{
		navigationOptions: {
			gesturesEnabled: false
		},
		mode: 'card'
	}
)
