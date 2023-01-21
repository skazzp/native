import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
// import { signOutUser } from '../redux/auth/authOperations';
import {
  collection,
  getCountFromServer,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);
  const { userId, login, photoURL } = useSelector(state => state.auth.user);

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    const q = query(collection(db, 'posts'), where('userId', '==', userId));
    onSnapshot(q, data => setUserPosts(data.docs.map(doc => ({ ...doc.data(), id: doc.id }))));
  };

  // const signOut = () => {
  //   dispatch(signOutUser());
  // };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/photo_bg.jpg')}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.form}>
          <View style={styles.avatarBox}>
            <Image source={{ uri: photoURL }} style={styles.avatarImage} />
            {/* <TouchableOpacity style={styles.addAvatarButton} onPress={pickImage}>
              <Image source={addButton} />
            </TouchableOpacity> */}
          </View>

          <View>
            <View>
              <Text style={styles.textlogin}>{login}</Text>
            </View>

            <FlatList
              data={userPosts}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginBottom: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ width: '100%', height: 250, borderRadius: 8, overflow: 'hidden' }}>
                    <Image source={{ uri: item.photo }} style={{ width: '100%', height: '100%' }} />
                  </View>
                  <View style={{ marginTop: 8, width: '100%', marginBottom: 8 }}>
                    <Text>{item.title}</Text>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      marginHorizontal: 16,
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}
                        onPress={() => navigation.navigate('Comments', { postId: item.id })}
                      >
                        <Feather
                          name="message-circle"
                          size={24}
                          color={+item.commentsCount > 0 ? '#FF6C00' : '#BDBDBD'}
                        />
                        <Text>{item.commentsCount}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        }}
                        onPress={() => {
                          addLike(item);
                        }}
                      >
                        <Feather
                          name="thumbs-up"
                          size={24}
                          color={+item.likes > 0 ? '#FF6C00' : '#BDBDBD'}
                        />
                        <Text>{item.likes}</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                      onPress={() => navigation.navigate('Map', { location: item.location.coords })}
                    >
                      <Feather name="map-pin" size={24} color="black" />
                      <Text>{item.address.split(', ')[1]}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  textlogin: {
    fontSize: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    paddingHorizontal: 16,
    paddingTop: 65,
    marginTop: 300,
    height: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  avatarBox: {
    position: 'absolute',
    top: -60,
    left: Dimensions.get('window').width / 2 - 60,
    width: 120,
    height: 120,
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
  },
  addAvatarButton: {
    position: 'absolute',
    bottom: 14,
    right: -12.5,
    width: 25,
    height: 25,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
});
