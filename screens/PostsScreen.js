import { createStackNavigator } from '@react-navigation/stack';
import DefaultScreenPosts from './nestedScreens/DefaultScreenPosts';
import CommentsScreen from './nestedScreens/CommentsScreen';
import MapScreen from './nestedScreens/MapScreen';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { logOutUser } from '../redux/auth/authOperation';
import { updateRoute } from '../redux/auth/authSlice';

const NestedScreen = createStackNavigator();

const PostsScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOutUser());
    // navigation.navigate('Login')
  };
  return (
    <NestedScreen.Navigator
      initialRouteName="Default"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Roboto-Medium',
          color: '#212121',
        },

        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E8E8E8',
        },
      }}
    >
      <NestedScreen.Screen
        name="Default"
        component={DefaultScreenPosts}
        options={{
          title: 'Posts',
          headerLeft: () => {},
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout}>
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          ),
          headerRightContainerStyle: {
            paddingRight: 10,
          },
        }}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          title: 'Comments',
          tabBarStyle: { display: 'none' },
          headerLeft: ({ focused, size, color }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Default');
                dispatch(updateRoute(false));
              }}
            >
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        }}
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: 'Map',
          headerLeft: ({ focused, size, color }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Default');
                dispatch(updateRoute(false));
              }}
            >
              <Feather name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            paddingLeft: 16,
          },
        }}
      />
    </NestedScreen.Navigator>
  );
};

export default PostsScreen;
