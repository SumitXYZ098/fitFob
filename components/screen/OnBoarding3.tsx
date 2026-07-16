import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const OnBoarding3 = () => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState({
    latitude: 28.6139,
    longitude: 77.209,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow location access.');
        setLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newCoords = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(newCoords);
      mapRef.current?.animateToRegion(newCoords, 1000);
    } catch (error) {
      Alert.alert('Error', 'Could not get location. Check your GPS.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* --- MAP SECTION --- */}
      <View style={StyleSheet.absoluteFillObject} className="">
        <MapView
          className="rounded-lg"
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={location}
          mapType={Platform.OS === 'android' ? 'none' : 'standard'}>
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            tileSize={256}
          />

          <Marker
            draggable
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            onDragEnd={(e) => {
              const newCoords = e.nativeEvent.coordinate;
              setLocation({
                ...location,
                latitude: newCoords.latitude,
                longitude: newCoords.longitude,
              });
            }}>
            <View className="items-center justify-center">
              <Ionicons name="location" size={50} color="#F6163C" />
              <View className="absolute bottom-1 h-3 w-3 rounded-full border-2 border-white bg-red-600 shadow-sm" />
            </View>
          </Marker>
        </MapView>
      </View>

      {/* --- UI OVERLAY --- */}
      <View className="px-5 pt-12">
        {/* Auto-Detect Card */}
        <View
          className="mb-4 flex-row items-center justify-between rounded-3xl bg-white p-4"
          style={{ elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }}>
          <View className="flex-1 flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-red-50">
              {loading ? (
                <ActivityIndicator color="#F6163C" size="small" />
              ) : (
                <MaterialCommunityIcons name="map-marker-radius" size={24} color="#F6163C" />
              )}
            </View>
            <View className="ml-3">
              <Text className="font-bold text-[15px] text-slate-900">Auto-Detect Location</Text>
              <Text className="text-[11px] text-slate-400">Use your current location</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={getCurrentLocation}
            disabled={loading}
            className="rounded-2xl border border-slate-50 bg-white px-5 py-2">
            <Text className="font-bold text-[#F6163C]">{loading ? '...' : 'Enable'}</Text>
          </TouchableOpacity>
        </View>

        {/* Static Search Bar (No API) */}
        <View
          className="flex-row items-center rounded-full bg-white py-1.5 pl-6 pr-2"
          style={{ elevation: 15, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 15 }}>
          <TextInput
            placeholder="Search location..."
            className="flex-1 font-medium text-[16px] text-slate-700"
            value={city}
            onChangeText={setCity}
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity
            onPress={getCurrentLocation}
            className="h-12 w-12 items-center justify-center rounded-full bg-[#F6163C]">
            <Ionicons name="search" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default OnBoarding3;
