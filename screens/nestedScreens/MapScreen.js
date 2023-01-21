import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { updateRoute } from '../../redux/auth/authSlice';

const MapScreen = ({ route }) => {
  console.log('route.params.location', route.params.location);
  const { longitude, latitude } = route.params.location;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateRoute(true));
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} title="travel photo" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapScreen;
