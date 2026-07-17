import React, { useImperativeHandle, forwardRef } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface GovernmentIdProps {
  govIdUri: string | null;
  setGovIdUri: (uri: string | null) => void;
}

export interface GovernmentIdRef {
  uploadId: () => Promise<void>;
}

const GovernmentId = forwardRef<GovernmentIdRef, GovernmentIdProps>(
  ({ govIdUri, setGovIdUri }, ref) => {

    const uploadId = async () => {
      // Show choices: Camera or Gallery
      Alert.alert(
        'Upload Government ID',
        'Choose a source to upload your ID card:',
        [
          {
            text: 'Take Photo (Camera)',
            onPress: handleLaunchCamera,
          },
          {
            text: 'Choose from Gallery',
            onPress: handleLaunchLibrary,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    };

    const handleLaunchCamera = async () => {
      try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera permission is required to snap a picture of your ID.');
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: true,
          quality: 0.9,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          setGovIdUri(result.assets[0].uri);
        }
      } catch (error) {
        console.error('Error launching camera:', error);
        Alert.alert('Error', 'Unable to open the camera.');
      }
    };

    const handleLaunchLibrary = async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access the photo gallery is required.');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 0.9,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          setGovIdUri(result.assets[0].uri);
        }
      } catch (error) {
        console.error('Error launching library:', error);
        Alert.alert('Error', 'Unable to open your photo gallery.');
      }
    };

    // Expose uploadId function to parent
    useImperativeHandle(ref, () => ({
      uploadId,
    }));

    return (
      <View className="flex-1 items-center bg-white px-6">
        {/* Header Section */}
        <View className="items-center mt-6 mb-8">
          <Text className="font-bold text-3xl text-slate-900 text-center">Government ID</Text>
          <Text className="mt-2 text-center text-sm text-slate-400">
            Please upload a photo of your government ID.
          </Text>
        </View>

        {/* ID Rectangular Frame Section */}
        <View className="flex-1 justify-center items-center my-6">
          <View style={styles.cardContainer}>
            {govIdUri ? (
              <View className="relative w-full h-full">
                <Image
                  source={{ uri: govIdUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                {/* Floating Clear/Trash Button */}
                <TouchableOpacity
                  onPress={() => setGovIdUri(null)}
                  className="absolute bottom-3 right-3 bg-slate-900/80 p-3 rounded-full items-center justify-center"
                  style={{ elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={uploadId}
                className="w-full h-full items-center justify-center bg-slate-50"
                activeOpacity={0.7}
              >
                <Ionicons name="card-outline" size={44} color="#94a3b8" />
                <Text className="mt-3 text-xs font-semibold text-slate-400">Tap to Upload ID</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tip / Guidelines Section */}
        <View className="items-center mb-10 mt-6 px-4">
          <Text className="text-center text-slate-400 text-sm leading-relaxed">
            Tip: Make Sure all details on your ID are visible{"\n"}and clear
          </Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  cardContainer: {
    width: 320,
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#94a3b8',
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});

GovernmentId.displayName = 'GovernmentId';

export default GovernmentId;
