import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { useClientSelfie } from '@/hook/useClient';

// Safely import MLKit Face Detector to prevent crashing in Expo Go/Simulators without native module
let RNMLKitFaceDetector: any = null;
try {
  const mlkit = require('@infinitered/react-native-mlkit-face-detection');
  RNMLKitFaceDetector = mlkit.RNMLKitFaceDetector;
} catch (error) {
  console.warn('MLKit Face Detection native module is missing. Bypassing face validation check.');
}

interface SelfieScreenProps {
  selfieUri: string | null;
  setSelfieUri: (uri: string | null) => void;
}

export interface SelfieScreenRef {
  takePhoto: () => Promise<void>;
  submit: () => Promise<boolean>;
}

const SelfieScreen = forwardRef<SelfieScreenRef, SelfieScreenProps>(
  ({ selfieUri, setSelfieUri }, ref) => {
    const cameraRef = useRef<any>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(true);
    const scanAnim = useRef(new Animated.Value(0)).current;

    const faceDetectorRef = useRef<any>(null);
    if (!faceDetectorRef.current && RNMLKitFaceDetector) {
      try {
        faceDetectorRef.current = new RNMLKitFaceDetector();
      } catch (err) {
        console.warn('Failed to initialize RNMLKitFaceDetector:', err);
      }
    }

    useEffect(() => {
      if (isCameraActive && !selfieUri) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scanAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(scanAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        scanAnim.setValue(0);
      }
    }, [isCameraActive, selfieUri]);

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

            // Perform on-device face detection if the native module is available
            const faceDetector = faceDetectorRef.current;
            if (faceDetector) {
              try {
                const detection = await faceDetector.detectFaces(manipResult.uri);

                if (!detection || !detection.faces || detection.faces.length === 0) {
                  Alert.alert(
                    'Face Detection Failed',
                    'No face detected. Please ensure your face is fully visible inside the frame and has good lighting.'
                  );
                  return;
                }

                if (detection.faces.length > 1) {
                  Alert.alert(
                    'Face Detection Failed',
                    'Multiple faces detected. Please make sure only one face is visible in the frame.'
                  );
                  return;
                }

                const face = detection.faces[0];

                // Check if head is turned to the side (Euler Y/Yaw rotation)
                if (
                  face.hasHeadEulerAngleY &&
                  face.headEulerAngleY !== undefined &&
                  face.headEulerAngleY !== null
                ) {
                  const yaw = face.headEulerAngleY;
                  // An angle absolute value greater than 18 degrees represents a side face profile
                  if (Math.abs(yaw) > 18) {
                    Alert.alert(
                      'Face Detection Failed',
                      'Please look straight at the camera. Side profile or turned face poses are not accepted.'
                    );
                    return;
                  }
                }
              } catch (detError) {
                console.warn('Face detection execution failed, bypassing check:', detError);
              }
            } else {
              console.warn('MLKit Face Detection is not active. Bypassing face check.');
            }

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

    const { mutateAsync } = useClientSelfie();

    // Expose the takePhoto and submit functions to the parent component
    useImperativeHandle(ref, () => ({
      takePhoto,
      submit: async () => {
        if (!selfieUri) {
          Alert.alert('Validation Error', 'Please capture a selfie.');
          return false;
        }
        try {
          await mutateAsync(selfieUri);
          return true;
        } catch (error) {
          console.error('Error uploading selfie:', error);
          return false;
        }
      },
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
          <View
            style={[
              styles.ovalContainer,
              selfieUri ? { borderWidth: 4, borderColor: '#10B981', borderStyle: 'solid' } : null,
            ]}>
            {selfieUri ? (
              <View className="relative h-full w-full">
                <Image
                  source={{ uri: selfieUri }}
                  className="h-full w-full -scale-x-100"
                  resizeMode="cover"
                />
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
                  <Animated.View
                    style={[
                      styles.scanLine,
                      {
                        transform: [
                          {
                            translateY: scanAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-140, 140],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Tip / Action / Guidelines Section */}
        {selfieUri ? (
          <View className="mb-8 mt-4 w-full items-center px-4">
            <View className="mb-4 w-full flex-row items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-3">
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text className="ml-2 font-semibold text-sm text-emerald-800">
                Face scan captured successfully
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClearPhoto}
              className="w-full flex-row items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 active:bg-slate-50"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
              activeOpacity={0.8}>
              <Ionicons name="camera-reverse-outline" size={20} color="#64748B" />
              <Text className="ml-2 font-bold text-sm text-slate-600">Retake Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mb-8 mt-4 items-center px-4">
            <Text className="text-center text-sm leading-relaxed text-slate-400">
              Tip: Keep your face clear, look straight at the camera and ensure good lighting.
            </Text>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  ovalContainer: {
    width: 260,
    height: 320,
    borderRadius: 130, // Half of width to make it a perfect ellipse/oval
    borderWidth: 2.5,
    borderColor: '#F6163C', // Accent color for scanning look
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    shadowColor: '#F6163C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(246, 22, 60, 0.02)', // Subtle red tint
  },
  scanTargetRing: {
    width: '90%',
    height: '92%',
    borderRadius: 120,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'rgba(246, 22, 60, 0.5)', // Distinct guide color
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2.5,
    backgroundColor: '#F6163C',
    opacity: 0.8,
    shadowColor: '#F6163C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});

SelfieScreen.displayName = 'SelfieScreen';

export default SelfieScreen;
