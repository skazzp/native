import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/auth/authSelectors';
import * as ImagePicker from 'expo-image-picker';

const CreatePostsScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [camera, setCamera] = useState(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [location, setLocation] = useState(null);
  const [title, setTitle] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const user = useSelector(selectUser);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const metadata = {
    contentType: 'image/jpeg',
  };

  const keyboarHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const takePhoto = async () => {
    const snap = await camera.takePictureAsync();
    setPhoto(snap.uri.toString());
    // console.log('photo', snap, 'permission', permission, 'location', location);
    let address = await Location.reverseGeocodeAsync(location.coords);
    setAddress(address[0].city + ', ' + address[0].country);
  };

  const uploadPhoto = async () => {
    const photoRef = ref(storage, 'photos/' + location.timestamp.toString() + '.jpg');
    const response = await fetch(photo);
    const file = await response.blob();
    const uploadTask = await uploadBytes(photoRef, file, metadata);
    const url = await getDownloadURL(uploadTask.ref);
    console.log('Photo available at', url);
    return url;
  };

  const createPost = async () => {
    const url = await uploadPhoto();
    const newPost = {
      photo: url,
      title: title,
      location,
      address,
      userId: user.userId,
      login: user.login,
      commentsCount: 0,
      likes: 0,
    };
    console.log('newPOST', newPost);
    try {
      const docRef = await addDoc(collection(db, 'posts'), newPost);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    await resetState();
    navigation.navigate('Default', { newPost });
  };

  const resetState = async () => {
    setPhoto(null);
    setTitle(null);
    setAddress(null);
    // setLocation(null);
    // setPhotoLink(null);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  useEffect(() => {
    (async () => {
      await requestPermission();
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
    <TouchableWithoutFeedback onPress={keyboarHide}>
      <View style={styles.container}>
        <KeyboardAvoidingView style={{}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
          <TouchableOpacity style={styles.pickPhotoBtn} onPress={pickImage}>
            <Text style={{ color: '#BDBDBD', fontSize: 16, lineHeight: 19 }}>Choose photo ...</Text>
          </TouchableOpacity>
          <View style={styles.titleBox}>
            <TextInput
              style={styles.inputTitle}
              placeholder="Title"
              placeholderTextColor="#BDBDBD"
              keyboardType="visible-password"
              value={title}
              onChangeText={value => setTitle(value)}
              onFocus={() => setIsShowKeyboard(true)}
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
              onFocus={() => setIsShowKeyboard(true)}
            />
          </View>
        </KeyboardAvoidingView>
        <View>
          <TouchableOpacity
            onPress={createPost}
            style={photo ? styles.sendBtn : styles.sendBtnDisabled}
            disabled={!photo}
          >
            <Text style={photo ? styles.sendBtnText : styles.sendBtnTextDisabled}>Create post</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.trashIconBox}>
          <TouchableOpacity
            style={styles.trashIcon}
            activeOpacity={0.7}
            onPress={async () => {
              await resetState();
              navigation.navigate('Default');
            }}
          >
            <Feather name="trash-2" size={24} color="#DADADA" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  cameraBox: {
    overflow: 'hidden',
    height: 250,
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
  pickPhotoBtn: { marginTop: 5, paddingLeft: 16 },
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
  trashIconBox: {
    marginTop: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
    justifyContent: 'center',
    width: 70,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
  },
  trashIcon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    // alignItems: "center",
    justifyContent: 'center',
    width: 24,
    height: 24,
    color: '#FFFFFF',
  },
});

export default CreatePostsScreen;
