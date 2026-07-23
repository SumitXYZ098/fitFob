import { useEffect, useState } from 'react';
import '../global.css';
import { View, ActivityIndicator } from 'react-native';
import { SplashScreen, Stack, useSegments, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store/useAuthStore';
import { registerDeviceTokenWithBackend } from '@/services/notificationService';

const queryClient = new QueryClient();

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { user, isInitializing, initializeAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    initializeAuth();
    setIsNavigationReady(true);
  }, [initializeAuth]);

  useEffect(() => {
    if (user?.token) {
      registerDeviceTokenWithBackend();
    }
  }, [user?.token]);

  useEffect(() => {
    if (!isNavigationReady || isInitializing) return;

    const inAuthGroup =
      segments[0] === 'auth' ||
      segments[0] === 'welcome' ||
      segments[0] === 'splash' ||
      !segments[0];

    if (!user) {
      if (!inAuthGroup) {
        router.replace('/welcome');
      }
    } else {
      if (inAuthGroup) {
        if (user.verification_status === 'approved') {
          router.replace('/(tabs)');
        } else if (user.verification_status === 'in-review') {
          router.replace('/onBoardingScreen/UnderReview');
        } else {
          router.replace('/onBoardingScreen/OnBoardingStep');
        }
      }
    }
  }, [user, segments, isNavigationReady, isInitializing, router]);

  if (isInitializing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#F6163C" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function Layout() {
  const [loaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'Helvetica-Regular': require('../assets/fonts/HelveticaforTarget.ttf'),
    'Helvetica-Bold': require('../assets/fonts/HelveticaforTarget-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationGuard>
        <Stack screenOptions={{ headerShown: false }} />
      </NavigationGuard>
      <Toast />
    </QueryClientProvider>
  );
}
