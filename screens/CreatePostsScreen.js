import { View, Image, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { db, storage } from '../firebase/config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const CreatePostsScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [location, setLocation] = useState(null);
  const [title, setTitle] = useState(null);
  const [address, setAddress] = useState(null);
  const [photoLink, setPhotoLink] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const metadata = {
    contentType: 'image/jpeg',
  };

  const takePhoto = async () => {
    const snap = await camera.takePictureAsync();
    setPhoto(snap.uri);
    console.log('photo', snap, 'permission', permission, 'location', location);
    let address = await Location.reverseGeocodeAsync(location.coords);
    setAddress(address[0].city + ', ' + address[0].country);
  };

  const createPost = async () => {
    console.log(Date.now());
    const photoRef = ref(storage, 'photos/' + location.timestamp.toString() + '.jpg');
    console.log(photoRef);
    const response = await fetch(photo);
    const file = await response.blob();
    const uploadTask = await uploadBytes(photoRef, photo, metadata);
    // console.log(uploadTask);
    await getDownloadURL(uploadTask.ref).then(downloadURL => {
      console.log('Photo available at', downloadURL);
      setPhotoLink(downloadURL);
    });
    // await uploadBytes(photoRef, file, metadata).then(snapshot => {
    //   getDownloadURL(snapshot.ref).then(downloadURL => {
    //     console.log('File available at', downloadURL);
    //     setPhotoLink(downloadURL);
    //   });
    // });
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
        {photo ? (
          <View style={styles.takePhotoContainer}>
            <Image source={{ uri: photo }} style={styles.camera} />
          </View>
        ) : (
          <Camera style={styles.camera} ref={setCamera}>
            <TouchableOpacity
              onPress={takePhoto}
              // style={styles.snapContainer}
            >
              <View style={styles.snapContainer}>
                <Feather name="camera" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </Camera>
        )}
      </View>
      <View style={styles.titleBox}>
        <TextInput
          style={styles.inputTitle}
          placeholder="Title"
          placeholderTextColor="#BDBDBD"
          keyboardType="visible-password"
          value={title}
          onChangeText={value => setTitle(value)}
        />
      </View>
      <View style={styles.locationBox}>
        <TextInput
          style={styles.inputLocation}
          placeholder="Location"
          placeholderTextColor="#BDBDBD"
          keyboardType="visible-password"
          value={address}
          onChangeText={value => setAddress(value)}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={createPost}
          style={photo ? styles.sendBtn : styles.sendBtnDisabled}
          disabled={!photo}
        >
          <Text style={photo ? styles.sendBtnText : styles.sendBtnTextDisabled}>Create post</Text>
        </TouchableOpacity>
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
    width: '100%',
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
    height: '100%',
    borderRadius: 8,
    // marginBottom: 8,
  },
  titleBox: {
    marginTop: 33,
    height: 50,
  },
  inputTitle: {
    borderBottomWidth: 1,
    paddingVertical: 15,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    borderBottomColor: '#E8E8E8',
    marginHorizontal: 16,
  },
  locationBox: {
    marginTop: 17,
    height: 50,
  },
  inputLocation: {
    borderBottomWidth: 1,
    paddingVertical: 15,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    borderBottomColor: '#E8E8E8',
    marginHorizontal: 16,
  },
  sendBtn: {
    height: 50,
    borderRadius: 10,
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6C00',
    borderRadius: 100,
    marginHorizontal: 16,
  },
  sendBtnDisabled: {
    height: 50,
    borderRadius: 10,
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 100,
    marginHorizontal: 16,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  sendBtnTextDisabled: {
    color: '#BDBDBD',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
});

export default CreatePostsScreen;
