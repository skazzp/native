import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CreatePostsScreen from './screens/CreatePostsScreen';
import LoginScreen from './screens/LoginScreen';
import PostsScreen from './screens/PostsScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import { Feather } from '@expo/vector-icons';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigationState, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
const addPostIcon = require('./assets/images/new.png');

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

const useRouter = isAuth => {
  const myState = useSelector(state => state.auth);
  if (!isAuth) {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Login"
          component={LoginScreen}
        />
        <AuthStack.Screen
          options={{
            headerShown: false,
          }}
          name="Register"
          component={RegistrationScreen}
        />
      </AuthStack.Navigator>
    );
  }

  return (
    <MainTab.Navigator
      initialRouteName="Posts"
      screenOptions={{
        tabBarActiveTintColor: '#FF6C00',
        tabBarInactiveTintColor: 'rgba(33, 33, 33, 0.8)',
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
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
      <MainTab.Screen
        name="Posts"
        component={PostsScreen}
        options={({ route }) => ({
          tabBarStyle: myState.route ? { display: 'none' } : { display: 'flex' },
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => {
            return <Feather name="grid" size={24} color="black" />;
          },
        })}
      />
      <MainTab.Screen
        name="Create"
        component={CreatePostsScreen}
        options={{
          tabBarButton: props => (
            <View style={styles.trashIconBox}>
              <TouchableOpacity activeOpacity={0.7} {...props} />
            </View>
          ),
          tabBarStyle: { display: 'none' },
          tabBarItemStyle: {
            justifyContent: 'center',
            width: 70,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#FF6C00',
          },
          tabBarIcon: ({ focused, size, color }) => (
            <Feather name="plus" size={24} color="#ffffff" />
          ),
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,

          tabBarIcon: ({ focused, size, color }) => <Feather name="user" size={24} color="black" />,
        }}
      />
    </MainTab.Navigator>
  );
};

export default useRouter;

const styles = StyleSheet.create({
  trashIconBox: {
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 40,
    borderRadius: 20,
    backgroundColor: ' #FF6C00',
  },
  trashIcon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6C00',
  },
});
