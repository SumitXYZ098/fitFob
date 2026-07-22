import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Rect } from 'react-native-svg';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { Container } from '@/components/modules/Container';

const USER_ID = '123-456-789';

function StyledQRCode({ size = 260 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      {/* Top Left Marker */}
      <Rect x="10" y="10" width="48" height="48" rx="12" stroke="#1C1C1C" strokeWidth="6" />
      <Rect x="23" y="23" width="22" height="22" rx="6" fill="#E23744" />

      {/* Top Right Marker */}
      <Rect x="142" y="10" width="48" height="48" rx="12" stroke="#1C1C1C" strokeWidth="6" />
      <Rect x="155" y="23" width="22" height="22" rx="6" fill="#E23744" />

      {/* Bottom Left Marker */}
      <Rect x="10" y="142" width="48" height="48" rx="12" stroke="#1C1C1C" strokeWidth="6" />
      <Rect x="23" y="155" width="22" height="22" rx="6" fill="#E23744" />

      {/* Bottom Right Marker */}
      <Rect x="142" y="142" width="48" height="48" rx="12" stroke="#1C1C1C" strokeWidth="6" />
      <Rect x="155" y="155" width="22" height="22" rx="6" fill="#E23744" />

      {/* Data Pattern Modules */}
      <Rect x="68" y="12" width="10" height="22" rx="4" fill="#1C1C1C" />
      <Rect x="88" y="12" width="24" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="120" y="12" width="10" height="10" rx="4" fill="#1C1C1C" />

      <Rect x="68" y="42" width="30" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="108" y="30" width="10" height="32" rx="4" fill="#1C1C1C" />

      <Rect x="10" y="68" width="48" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="68" y="60" width="10" height="24" rx="4" fill="#1C1C1C" />
      <Rect x="88" y="68" width="40" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="142" y="68" width="24" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="176" y="68" width="14" height="14" rx="4" fill="#1C1C1C" />

      <Rect x="12" y="88" width="10" height="24" rx="4" fill="#1C1C1C" />
      <Rect x="30" y="88" width="24" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="64" y="92" width="36" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="110" y="80" width="10" height="30" rx="4" fill="#1C1C1C" />
      <Rect x="130" y="90" width="10" height="20" rx="4" fill="#1C1C1C" />
      <Rect x="150" y="88" width="38" height="10" rx="4" fill="#1C1C1C" />

      <Rect x="12" y="120" width="20" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="40" y="110" width="10" height="24" rx="4" fill="#1C1C1C" />
      <Rect x="68" y="110" width="24" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="100" y="118" width="10" height="20" rx="4" fill="#1C1C1C" />
      <Rect x="120" y="118" width="30" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="160" y="108" width="10" height="24" rx="4" fill="#1C1C1C" />

      <Rect x="68" y="142" width="10" height="24" rx="4" fill="#1C1C1C" />
      <Rect x="88" y="150" width="20" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="118" y="142" width="10" height="24" rx="4" fill="#1C1C1C" />

      <Rect x="68" y="176" width="38" height="10" rx="4" fill="#1C1C1C" />
      <Rect x="118" y="176" width="10" height="14" rx="4" fill="#1C1C1C" />
    </Svg>
  );
}

export default function ScanScreen() {
  const router = useRouter();

  const handleCopyId = async () => {
    await Clipboard.setStringAsync(USER_ID);
    Toast.show({
      type: 'success',
      text1: 'ID Copied',
      text2: 'User ID copied to clipboard!',
    });
  };

  const handleScanPress = () => {
    Toast.show({
      type: 'info',
      text1: 'Scanner Active',
      text2: 'Hold QR code near the gym entrance reader.',
    });
  };

  return (
    <Container>
      {/* 1. Header */}
      <View className="flex-row items-center justify-between px-4 pb-2 pt-2">
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          className="h-10 w-10 items-center justify-center rounded-full">
          <Ionicons name="chevron-back" size={24} color="#1C1C1C" />
        </TouchableOpacity>

        <Text className="font-bold text-lg text-darkText">Check In</Text>

        <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full">
          <Ionicons name="notifications" size={20} color="#E23744" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: Platform.OS === 'ios' ? 100 : 80,
        }}>
        {/* 2. Subtitle Instruction */}
        <Text className="font-regular max-w-[280px] text-center text-base leading-snug text-[#64748B]">
          Scan code at the gym’s entrance to check in.
        </Text>

        {/* 3. QR Code Display */}
        <View className="my-8 items-center justify-center p-2">
          <StyledQRCode size={260} />
        </View>

        {/* 4. Action Button */}
        <TouchableOpacity
          onPress={handleScanPress}
          activeOpacity={0.8}
          className="w-full items-center justify-center rounded-2xl bg-[#F6163C] py-4 shadow-sm">
          <Text className="font-bold text-base text-white">Scan QR Code</Text>
        </TouchableOpacity>

        {/* 5. Trouble scanning / ID Section */}
        <Text className="font-regular mb-3 mt-6 text-center text-sm text-[#64748B]">
          Trouble scanning? Use your ID below
        </Text>

        <View className="w-full flex-row items-center justify-between rounded-2xl border border-[#F1F5F9] bg-[#F8FAFC] px-5 py-3.5">
          <Text className="font-medium text-base text-[#475569]">
            ID: <Text className="font-semibold text-darkText">{USER_ID}</Text>
          </Text>

          <TouchableOpacity
            onPress={handleCopyId}
            className="h-10 w-10 items-center justify-center rounded-xl bg-[#FFEAEF]">
            <MaterialCommunityIcons name="content-copy" size={18} color="#F6163C" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}
