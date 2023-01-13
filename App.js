import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import useCachedResources from './hooks/useCachedResources';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostsScreen from './screens/PostsScreen';
import CreatePostsScreen from './screens/CreatePostsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import useRouter from './router';

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const routing = useRouter(true);
  if (!isLoadingComplete) {
    return null;
  }

  return <NavigationContainer>{routing}</NavigationContainer>;
}
