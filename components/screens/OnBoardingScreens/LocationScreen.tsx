/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
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
  const [addressLoading, setAddressLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState({
    latitude: prefill?.latitude ? parseFloat(prefill.latitude) : 28.6139,
    longitude: prefill?.longitude ? parseFloat(prefill.longitude) : 77.209,
    latitudeDelta: 0.008,
    longitudeDelta: 0.008,
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

  // Reverse Geocode: Get full address string from coordinates using OpenStreetMap Nominatim with native fallback
  const reverseGeocode = async (latitude: number, longitude: number) => {
    setAddressLoading(true);
    try {
      // 1. First attempt: OpenStreetMap Nominatim reverse geocode
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FitFobApp/1.0 (contact@fitfob.com)',
            'Accept-Language': 'en',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          setCity(data.display_name);
          setAddressLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Nominatim reverse geocode error, attempting native fallback:', error);
    }

    // 2. Fallback: Native device reverse geocoding via expo-location
    try {
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addresses && addresses.length > 0) {
        const item = addresses[0];
        const parts = [
          item.name,
          item.streetNumber ? `${item.streetNumber} ${item.street || ''}`.trim() : item.street,
          item.district || item.subregion,
          item.city,
          item.region,
          item.postalCode,
          item.country,
        ].filter(Boolean) as string[];

        // Remove duplicates while keeping order
        const uniqueParts = parts.filter((val, idx) => parts.indexOf(val) === idx);
        if (uniqueParts.length > 0) {
          setCity(uniqueParts.join(', '));
        }
      }
    } catch (fallbackError) {
      console.log('Native reverse geocode error:', fallbackError);
    } finally {
      setAddressLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings.'
        );
        setLoading(false);
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow location access.');
        setLoading(false);
        return;
      }

      let userLocation: Location.LocationObject | null = null;

      try {
        const positionPromise = Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Location request timed out')), 8000)
        );
        userLocation = (await Promise.race([
          positionPromise,
          timeoutPromise,
        ])) as Location.LocationObject;
      } catch (err) {
        console.log('getCurrentPosition timed out or failed, checking last known position:', err);
      }

      if (!userLocation) {
        userLocation = await Location.getLastKnownPositionAsync();
      }

      if (userLocation) {
        const newCoords = {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        };

        setLocation(newCoords);
        mapRef.current?.animateToRegion(newCoords, 800);

        // Get readable full address for current location
        reverseGeocode(newCoords.latitude, newCoords.longitude);
      } else {
        throw new Error('Could not retrieve location.');
      }
    } catch (error) {
      console.log('Error getting current location:', error);
      Alert.alert(
        'Location Error',
        'Could not retrieve your location. Please check your GPS/network signal or search manually.'
      );
    } finally {
      setLoading(false);
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
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      };
      setLocation(newCoords);
      mapRef.current?.animateToRegion(newCoords, 800);
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
            'User-Agent': 'FitFobApp/1.0 (contact@fitfob.com)',
            'Accept-Language': 'en',
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
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
          };
          setLocation(newCoords);
          mapRef.current?.animateToRegion(newCoords, 800);
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
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    };
    setLocation(newCoords);
    mapRef.current?.animateToRegion(newCoords, 800);
    setCity(item.display_name);
    setSuggestions([]); // Clear suggestions
  };

  // Handler when marker is moved or map is tapped
  const handleLocationUpdate = (latitude: number, longitude: number) => {
    const updatedCoords = {
      ...location,
      latitude,
      longitude,
    };
    setLocation(updatedCoords);
    mapRef.current?.animateToRegion(updatedCoords, 500);
    reverseGeocode(latitude, longitude);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* --- OPENSTREETMAP SECTION --- */}
      <View style={StyleSheet.absoluteFill}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={location}
          mapType={Platform.OS === 'android' ? 'none' : 'standard'}
          rotateEnabled={false}
          onPress={(e) => {
            const coords = e.nativeEvent.coordinate;
            if (coords) {
              handleLocationUpdate(coords.latitude, coords.longitude);
            }
          }}>
          <UrlTile
            urlTemplate="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
            shouldReplaceMapContent={true}
            zIndex={1}
          />
          <Marker
            draggable
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            onDragEnd={(e) => {
              const coords = e.nativeEvent.coordinate;
              if (coords) {
                handleLocationUpdate(coords.latitude, coords.longitude);
              }
            }}>
            <View className="items-center justify-center">
              <Ionicons name="location" size={38} color="#F6163C" />
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
          {addressLoading ? (
            <View className="mr-2">
              <ActivityIndicator color="#F6163C" size="small" />
            </View>
          ) : null}
          <TextInput
            placeholder={addressLoading ? 'Fetching address...' : 'Search location...'}
            className="flex-1 font-medium text-[15px] text-slate-700"
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
