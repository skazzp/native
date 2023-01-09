// import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground style={styles.image} source={require('./assets/images/photo_bg.jpg')}>
        <LoginScreen />
        {/* <StatusBar style="auto" /> */}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff0000',
    // height: 100,
    // width: 100,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    // justifyContent: "center",
    // alignItems: "center",
  },
});
