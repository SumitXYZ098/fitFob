import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Keyboard,
} from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useClientLocation } from '@/hook/useClient';

interface Suggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface LocationScreenRef {
  submit: () => Promise<boolean>;
}

interface LocationScreenProps {
  prefill?: any;
}

const LocationScreen = forwardRef<LocationScreenRef, LocationScreenProps>(({ prefill }, ref) => {
  const { mutateAsync } = useClientLocation();
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState({
    latitude: prefill?.latitude ? parseFloat(prefill.latitude) : 28.6139,
    longitude: prefill?.longitude ? parseFloat(prefill.longitude) : 77.209,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useImperativeHandle(ref, () => ({
    submit: async () => {
      try {
        await mutateAsync({
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
        });
        return true;
      } catch (error) {
        console.error('Error submitting location:', error);
        return false;
      }
    },
  }));

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

      // Get readable address name
      reverseGeocode(newCoords.latitude, newCoords.longitude);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Reverse Geocode: Get address string from coordinates
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'User-Agent': 'FitFobClient/1.0',
          },
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        setCity(data.display_name);
      }
    } catch (error) {
      console.log('Error reverse geocoding:', error);
    }
  };

  // Auto-Detect Location on Mount or use prefilled coordinates
  useEffect(() => {
    if (prefill?.latitude && prefill?.longitude) {
      const lat = parseFloat(prefill.latitude);
      const lon = parseFloat(prefill.longitude);
      const newCoords = {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(newCoords);
      mapRef.current?.animateToRegion(newCoords, 1000);
      reverseGeocode(lat, lon);
    } else {
      getCurrentLocation();
    }
  }, [prefill]);

  // Forward Geocode: Search coordinates from text query
  const searchLocation = async () => {
    if (!city.trim()) return;
    Keyboard.dismiss();
    setSearchLoading(true);
    setSuggestions([]);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FitFobClient/1.0',
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        if (data.length === 1) {
          // Single match -> immediately update coordinates
          const item = data[0];
          const newCoords = {
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setLocation(newCoords);
          mapRef.current?.animateToRegion(newCoords, 1000);
          setCity(item.display_name);
        } else {
          // Multiple matches -> show suggestions dropdown
          setSuggestions(data);
        }
      } else {
        Alert.alert(
          'Location not found',
          'We could not find the location you searched for. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error forward geocoding:', error);
      Alert.alert('Search Error', 'Failed to search address. Please check your network.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectSuggestion = (item: Suggestion) => {
    const newCoords = {
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setLocation(newCoords);
    mapRef.current?.animateToRegion(newCoords, 1000);
    setCity(item.display_name);
    setSuggestions([]); // Clear suggestions
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* --- MAP SECTION --- */}
      <View style={StyleSheet.absoluteFillObject}>
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
              const updatedRegion = {
                ...location,
                latitude: newCoords.latitude,
                longitude: newCoords.longitude,
              };
              setLocation(updatedRegion);
              reverseGeocode(newCoords.latitude, newCoords.longitude);
            }}>
            <View className="items-center justify-center">
              <Ionicons name="location" size={50} color="#F6163C" />
              <View className="absolute bottom-1 h-3 w-3 rounded-full border-2 border-white bg-red-600 shadow-sm" />
            </View>
          </Marker>
        </MapView>
      </View>

      {/* --- UI OVERLAY --- */}
      <View className="relative z-50 px-5 pt-12">
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

        {/* Dynamic Search Bar */}
        <View
          className="mb-2 flex-row items-center rounded-full bg-white py-1.5 pl-6 pr-2"
          style={{ elevation: 15, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 15 }}>
          <TextInput
            placeholder="Search location..."
            className="flex-1 font-medium text-[16px] text-slate-700"
            value={city}
            onChangeText={(text) => {
              setCity(text);
              if (text === '') setSuggestions([]);
            }}
            onSubmitEditing={searchLocation}
            placeholderTextColor="#94a3b8"
            returnKeyType="search"
          />
          <TouchableOpacity
            onPress={searchLocation}
            disabled={searchLoading}
            className="h-12 w-12 items-center justify-center rounded-full bg-[#F6163C]">
            {searchLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons name="search" size={22} color="white" />
            )}
          </TouchableOpacity>
        </View>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <View
            className="mt-1 overflow-hidden rounded-3xl bg-white"
            style={{
              elevation: 20,
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 20,
              maxHeight: 220,
            }}>
            <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item.place_id.toString()}
                  onPress={() => handleSelectSuggestion(item)}
                  className="flex-row items-center border-b border-slate-50 p-4 active:bg-slate-50">
                  <Ionicons name="location-outline" size={20} color="#94a3b8" className="mr-3" />
                  <Text className="flex-1 font-medium text-sm text-slate-700" numberOfLines={2}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
});

LocationScreen.displayName = 'LocationScreen';

export default LocationScreen;
