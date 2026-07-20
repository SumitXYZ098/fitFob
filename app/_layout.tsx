import { useEffect, useState } from 'react';
import '../global.css';
import { SplashScreen, Stack, useSegments, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/store/useAuthStore';

const queryClient = new QueryClient();

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    setIsNavigationReady(true);
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return;

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
  }, [user, segments, isNavigationReady, router]);

  return <>{children}</>;
}

export default function Layout() {
  const [loaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
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
