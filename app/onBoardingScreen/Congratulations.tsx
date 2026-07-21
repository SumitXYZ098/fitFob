import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Container } from '@/components/modules/Container';
import { Button } from '@/components/modules/Button';

export default function Congratulations() {
  const router = useRouter();

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <Container>
      <View className="flex-1 bg-white">
        {/* Header Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 h-12 w-12 items-center justify-center rounded-full bg-slate-50"
          activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={24} color="#CBD5E1" />
        </TouchableOpacity>

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
            style={{ width: 150, height: 150, marginBottom: 20 }}
            resizeMode="contain"
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
