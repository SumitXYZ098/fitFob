import { useEffect } from 'react';
import '../global.css';
import { View, ActivityIndicator } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store/useAuthStore';
import { registerDeviceTokenWithBackend } from '@/services/notificationService';

const queryClient = new QueryClient();

export default function Layout() {
  const { user, isInitializing, initializeAuth } = useAuthStore();

  const [loaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'Helvetica-Regular': require('../assets/fonts/HelveticaforTarget.ttf'),
    'Helvetica-Bold': require('../assets/fonts/HelveticaforTarget-Bold.ttf'),
  });

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (user?.token) {
      registerDeviceTokenWithBackend();
    }
  }, [user?.token]);

  console.log('User=========>>', user);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded || isInitializing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#F6163C" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </QueryClientProvider>
  );
}
