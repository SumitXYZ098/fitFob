import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Container } from '@/components/modules/Container';
import { Button } from '@/components/modules/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useCheckUserStep } from '@/hook/useClient';

export default function UnderReview() {
  const router = useRouter();
  const { user, setUser, logOut } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const checkStatusMutation = useCheckUserStep();

  const handleDone = async () => {
    setLoading(true);
    try {
      const userData = await checkStatusMutation.mutateAsync();

      if (userData) {
        if (user) {
          await setUser(
            {
              ...user,
              verification_status: userData.verification_status,
            },
            true
          );
        }

        if (userData.verification_status === 'approved') {
          Toast.show({
            type: 'success',
            text1: 'Verification Approved! 🎉',
            text2: 'Welcome to FitFob.',
          });
          router.replace('/onBoardingScreen/Congratulations');
          return;
        }
      }

      // Still in review -> log out and go to welcome
      await logOut();
      router.replace('/welcome');
    } catch (error) {
      console.log('Error checking status on done:', error);
      // Fallback: log out anyway
      await logOut();
      router.replace('/welcome');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.replace({
      pathname: '/onBoardingScreen/OnBoardingStep',
      params: { step: '5' },
    });
  };

  return (
    <Container>
      <View className="flex-1 bg-white">
        {/* Header Back Button */}
        <TouchableOpacity
          onPress={handleBack}
          className="mt-4 h-12 w-12 items-center justify-center rounded-full bg-slate-50"
          activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={24} color="#CBD5E1" />
        </TouchableOpacity>

        <View className="-mt-12 flex-1 items-center justify-center px-4">
          {/* Title Area */}
          <Text className="mb-4 text-center font-bold text-[30px] leading-tight text-slate-900">
            We’re reviewing your submission
          </Text>
          <Text className="mb-12 text-center text-sm leading-relaxed text-slate-400">
            We need more time to verify your identity. This may be due to your document requiring
            manual review or delays with our third-party partner. We’ll update you once the review
            is complete.
          </Text>

          {/* Megaphone Icon */}
          <Image source={require('../../assets/images/reviewing.png')} className="h-31 w-31" />
        </View>

        {/* Done Button */}
        <View className="mb-8">
          <Button title="Done" onPress={handleDone} loading={loading} />
        </View>
      </View>
    </Container>
  );
}
