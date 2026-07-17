import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

interface SelfieScreenProps {
  selfieUri: string | null;
  setSelfieUri: (uri: string | null) => void;
}

export interface SelfieScreenRef {
  takePhoto: () => Promise<void>;
}

const SelfieScreen = forwardRef<SelfieScreenRef, SelfieScreenProps>(
  ({ selfieUri, setSelfieUri }, ref) => {
    const cameraRef = useRef<any>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(true);

    useEffect(() => {
      (async () => {
        const { status } = await Camera.getCameraPermissionsAsync();
        if (status === 'granted') {
          setHasPermission(true);
        } else {
          const request = await Camera.requestCameraPermissionsAsync();
          setHasPermission(request.status === 'granted');
        }
      })();
    }, []);

    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    const takePhoto = async () => {
      if (hasPermission !== true) {
        Alert.alert('Permission Required', 'Camera permission is needed to scan your face.');
        return;
      }

      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync({
            quality: 0.85,
            skipProcessing: false,
          });

          if (photo && photo.uri) {
            // Flip captured photo horizontally so it is not a mirrored selfie
            const manipResult = await manipulateAsync(photo.uri, [{ flip: FlipType.Horizontal }], {
              compress: 0.85,
              format: SaveFormat.JPEG,
            });

            setSelfieUri(manipResult.uri);
            setIsCameraActive(false);
          }
        } catch (error) {
          console.error('Error taking face scan:', error);
          Alert.alert(
            'Capture Failed',
            'Something went wrong while scanning your face. Please try again.'
          );
        }
      }
    };

    // Expose the takePhoto function to the parent component
    useImperativeHandle(ref, () => ({
      takePhoto,
    }));

    const handleClearPhoto = () => {
      setSelfieUri(null);
      setIsCameraActive(true);
    };

    return (
      <View className="flex-1 items-center bg-white px-6">
        {/* Header Section */}
        <View className="mb-6 mt-6 items-center">
          <Text className="text-center font-bold text-3xl text-slate-900">Selfie Scan</Text>
          <Text className="mt-2 px-4 text-center text-sm text-slate-400">
            Align your face in the oval frame to scan your face.
          </Text>
        </View>

        {/* Selfie Frame Section with Live Camera Feed */}
        <View className="my-4 flex-1 items-center justify-center">
          <View style={styles.ovalContainer}>
            {selfieUri ? (
              <View className="relative h-full w-full">
                <Image
                  source={{ uri: selfieUri }}
                  className="-rotate-270 h-full w-full"
                  resizeMode="cover"
                />
                {/* Floating Retake Button over the photo */}
                <TouchableOpacity
                  onPress={handleClearPhoto}
                  className="absolute bottom-4 right-4 items-center justify-center rounded-full bg-slate-900/80 p-3"
                  style={{
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                  }}
                  activeOpacity={0.8}>
                  <Ionicons name="refresh-outline" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : hasPermission === null ? (
              <View className="items-center justify-center p-4">
                <ActivityIndicator size="large" color="#F6163C" />
                <Text className="mt-2 text-xs text-slate-400">Initializing Scanner...</Text>
              </View>
            ) : hasPermission === false ? (
              <View className="items-center justify-center p-6 text-center">
                <Ionicons name="eye-off-outline" size={36} color="#94a3b8" />
                <Text className="mt-3 text-center font-semibold text-xs leading-relaxed text-slate-400">
                  Camera permission is required for face scanning.
                </Text>
                <TouchableOpacity
                  onPress={requestCameraPermission}
                  className="mt-4 rounded-xl bg-[#F6163C] px-5 py-2.5"
                  activeOpacity={0.8}>
                  <Text className="font-bold text-xs text-white">Grant Access</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="relative h-full w-full">
                {isCameraActive && (
                  <CameraView
                    ref={cameraRef}
                    facing="front"
                    mirror={true} // Mirrored preview for intuitive framing
                    style={StyleSheet.absoluteFillObject}
                  />
                )}

                {/* Visual feedback/scanning guidelines overlay */}
                <View style={styles.scannerOverlay} pointerEvents="none">
                  <View style={styles.scanTargetRing} />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Tip / Guidelines Section */}
        <View className="mb-8 mt-4 items-center px-4">
          <Text className="text-center text-sm leading-relaxed text-slate-400">
            Tip: Keep your face clear, look straight at the camera and ensure good lighting.
          </Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  ovalContainer: {
    width: 230,
    height: 320,
    borderRadius: 115, // Half of width to make it a perfect ellipse/oval
    borderWidth: 3,
    borderColor: '#F6163C', // Accent color for scanning look
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(246, 22, 60, 0.03)', // Subtle red tint
  },
  scanTargetRing: {
    width: '90%',
    height: '92%',
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderStyle: 'solid',
  },
});

SelfieScreen.displayName = 'SelfieScreen';

export default SelfieScreen;
