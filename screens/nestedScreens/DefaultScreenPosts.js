import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, Button, Text, TouchableOpacity } from 'react-native';
import { db } from '../../firebase/config';
import { collection, getCountFromServer, getDocs, onSnapshot } from 'firebase/firestore';
import { Feather } from '@expo/vector-icons';

const DefaultScreenPosts = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  // console.log('route.params', route.params);

  const getPosts = async () => {
    onSnapshot(collection(db, 'posts'), data => {
      setPosts(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
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
            <Image source={{ uri: item.photo }} style={{ width: 343, height: 240 }} />
            <View>
              <Text>{item.title}</Text>
            </View>
            <View
              style={{
                width: '100%',
                marginHorizontal: 16,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
                onPress={() => navigation.navigate('Comments', { postId: item.id })}
              >
                <Feather name="message-circle" size={24} color="black" />
                <Text>{item.commentsCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
                onPress={() => navigation.navigate('Map', { location: item.location.coords })}
              >
                <Feather name="map-pin" size={24} color="black" />
                <Text>{item.address}</Text>
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
