import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Container } from '@/components/modules/Container';
import { Button } from '@/components/modules/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useCheckUserStep } from '@/hook/useClient';

export default function UnderReview() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const checkStatusMutation = useCheckUserStep();

  const checkVerificationStatus = async () => {
    try {
      const userData = await checkStatusMutation.mutateAsync();
      if (userData) {
        if (user) {
          await setUser({
            ...user,
            verification_status: userData?.details?.user?.verification_status,
          });
        }

        if (userData.verification_status === 'approved') {
          Toast.show({
            type: 'success',
            text1: 'Verification Approved! 🎉',
            text2: 'Welcome to FitFob.',
          });
          router.replace('/onBoardingScreen/Congratulations');
          return true;
        }
      }

      Toast.show({
        type: 'info',
        text1: 'Still Under Review ⏳',
        text2: 'Your account review is still in progress.',
      });
      return false;
    } catch (error) {
      console.log('Error checking status:', error);
      Toast.show({
        type: 'error',
        text1: 'Status Check Failed',
        text2: 'Unable to verify status. Please try again.',
      });
      return false;
    }
  };

  const handleDone = async () => {
    setLoading(true);
    try {
      await checkVerificationStatus();
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await checkVerificationStatus();
    } finally {
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => {
    router.replace({
      pathname: '/onBoardingScreen/OnBoardingStep',
      params: { step: '5' },
    });
  };

  return (
    <Container>
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F6163C']} />
        }>
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
              We need more time to verify your identity. Pull down to refresh status at any time.
            </Text>

            {/* Megaphone Icon */}
            <Image source={require('../../assets/images/reviewing.png')} className="h-31 w-31" />
          </View>

          {/* Done Button */}
          <View className="mb-8">
            <Button title="Check Status" onPress={handleDone} loading={loading} />
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
