import React from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '@/components/modules/Container';
import { Button } from '@/components/modules/Button';
import { useAuthStore } from '@/store/useAuthStore';

export default function Congratulations() {
  const router = useRouter();
  const { user } = useAuthStore();
  console.log('user>>>>>>>>>>>>>>>', user);
  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <Container>
      <View className="flex-1 bg-white">
        <View className="-mt-12 flex-1 items-center justify-center">
          {/* Title Area */}
          <Text className="mb-2 text-center font-bold text-[34px] leading-tight text-slate-900">
            Congratulations
          </Text>
          <Text className="mb-12 text-center text-[15px] text-slate-400">
            You have successfully completed the process
          </Text>

          {/* Celebrating popper GIF */}
          <Image
            source={require('../../assets/gif/congrat.gif')}
            style={{ width: 200, height: 200, marginTop: 0 }}
            resizeMode="cover"
          />
        </View>

        {/* Finish Button */}
        <View className="mb-8">
          <Button title="Finish" onPress={handleFinish} />
        </View>
      </View>
    </Container>
  );
}
