import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import apiInstance from '@/api/apiInstance';
import { ENDPOINTS } from '@/api/endpoint';

// Configure notification behavior when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  let token: string | undefined;

  // Android Notification Channel Setup
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default Channel',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F6163C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Push notification permissions denied.');
      return undefined;
    }

    // Retrieve EAS Project ID from Expo Constants
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    if (!projectId) {
      console.error('Project ID not found in app.json extra.eas.projectId');
      return undefined;
    }

    try {
      const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      token = pushTokenData.data;
      console.log('✅ Registered Expo Push Token:', token);
    } catch (error) {
      console.error('❌ Error getting Expo Push Token:', error);
    }
  } else {
    console.log('Must use a physical device for Push Notifications');
  }

  return token;
}

export async function registerDeviceTokenWithBackend(expoPushToken?: string) {
  try {
    const token = expoPushToken || (await registerForPushNotificationsAsync());

    if (token) {
      const response = await apiInstance.post(ENDPOINTS.REGISTER_DEVICE_TOKEN, {
        token,
        platform: Platform.OS,
      });
      console.log('✅ Device token registered with backend:', response.data);
      return response.data;
    }
  } catch (error: any) {
    console.error(
      '❌ Failed to register device token with backend:',
      error?.response?.data || error.message
    );
  }
}

export async function unregisterDeviceTokenWithBackend(expoPushToken?: string) {
  try {
    const token = expoPushToken || (await registerForPushNotificationsAsync());

    if (token) {
      const response = await apiInstance.post(ENDPOINTS.UNREGISTER_DEVICE_TOKEN, {
        token,
        platform: Platform.OS,
      });
      console.log('✅ Device token unregistered with backend:', response.data);
      return response.data;
    }
  } catch (error: any) {
    console.error(
      '❌ Failed to unregister device token with backend:',
      error?.response?.data || error.message
    );
  }
}
