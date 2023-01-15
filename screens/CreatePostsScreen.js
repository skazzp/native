import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';

const CreatePostsScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const takePhoto = async () => {
    const snap = await camera.takePictureAsync();
    setPhoto(snap.uri);
    console.log('photo', snap, 'permission', permission, 'location', location);
  };

  useEffect(() => {
    (async () => {
      // const cameraStatus =
      await requestPermission();
      // console.log('cameraStatus', cameraStatus, 'permission', permission);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  if (!permission) {
    return <View onLayout={requestPermission}></View>;
  }

  return (
    // <View>
    //   <Text>CreatePostsScreen</Text>
    // </View>
    <View style={styles.container}>
      <View style={styles.cameraBox}>
        <Camera style={styles.camera} ref={setCamera}>
          {photo && (
            <View style={styles.takePhotoContainer}>
              <Image source={{ uri: photo }} style={{ height: 200, width: 200 }} />
            </View>
          )}
          <TouchableOpacity
            onPress={takePhoto}
            // style={styles.snapContainer}
          >
            <View style={styles.snapContainer}>
              <Feather name="camera" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </Camera>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraBox: {
    overflow: 'hidden',
    height: '40%',
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 8,
  },
  camera: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  snap: {
    color: '#fff',
  },
  snapContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takePhotoContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    borderColor: '#fff',
    borderWidth: 1,
  },
});

export default CreatePostsScreen;
