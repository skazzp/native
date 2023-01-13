import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CreatePostsScreen from './screens/CreatePostsScreen';
import LoginScreen from './screens/LoginScreen';
import PostsScreen from './screens/PostsScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import { Feather } from '@expo/vector-icons';

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export default useRouter = isAuth => {
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
    <MainTab.Navigator screenOptions={{ tabBarShowLabel: false }}>
      <MainTab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          tabBarIcon: ({ focused, size, color }) => <Feather name="grid" size={24} color="black" />,
        }}
      />
      <MainTab.Screen
        name="Create"
        component={CreatePostsScreen}
        options={{
          tabBarIcon: ({ focused, size, color }) => <Feather name="plus" size={24} color="black" />,
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, size, color }) => <Feather name="user" size={24} color="black" />,
        }}
      />
    </MainTab.Navigator>
  );
};
