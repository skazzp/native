import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Button, Text, TouchableOpacity } from 'react-native';
import { db } from '../../firebase/config';
import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';

const DefaultScreenPosts = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  // console.log('route.params', route.params);

  const getPosts = async () => {
    onSnapshot(collection(db, 'posts'), data => {
      setPosts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
  };

  const addLike = async item => {
    console.log(item);
    await updateDoc(doc(db, 'posts', item.id), {
      likes: item.likes + 1,
    });
  };

  useEffect(() => {
    getPosts();
  }, []);
  console.log('posts', posts);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
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
                    marginRight: 10,
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});

export default DefaultScreenPosts;
