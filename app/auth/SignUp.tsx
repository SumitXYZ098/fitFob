/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { KeyboardAwareScrollView } from '@pietile-native-kit/keyboard-aware-scrollview';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUp() {
  const router = useRouter();

  // States for visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  return (
    <Container>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-[#FFF]">
        {/* Logo  */}
        <View className="mt-10 items-center">
          <View className="h-20 w-20 items-center justify-center">
            <Image
              source={require('../../assets/images/Vector.png')}
              className="h-12 w-12"
              resizeMode="contain"
            />
          </View>
          <Text
            className=" text-center text-3xl text-slate-900"
            style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Sign up
          </Text>
          <Text
            className="mt-2 text-center text-base text-slate-400"
            style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
            Create an account to continue!
          </Text>
        </View>

        {/* Form Section */}
        <View className="mt-10 space-y-5">
          {/*  Email or Phone number */}
          <View>
            <Text className="mb-2 ml-1 font-semibold text-sm text-slate-600">
              Email or Phone number
            </Text>
            <View className="h-14 justify-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm shadow-slate-100">
              <TextInput
                placeholder="Email or Phone number"
                placeholderTextColor="#94A3B8"
                className="h-full text-slate-900"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* 2. Password */}
          <View>
            <Text className="mb-2 ml-1 mt-2 font-semibold text-sm text-slate-600">
              {' '}
              Set Password
            </Text>
            <View className="h-14 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm shadow-slate-100">
              <TextInput
                placeholder="*******"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!isPasswordVisible}
                className="h-full flex-1 text-slate-900"
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons
                  name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Confirm Password */}
          <View>
            <Text className="mb-2 ml-1 mt-2 font-semibold text-sm text-slate-600">
              Confirm Password
            </Text>
            <View className="h-14 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm shadow-slate-100">
              <TextInput
                placeholder="*******"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!isConfirmPasswordVisible}
                className="h-full flex-1 text-slate-900"
              />
              <TouchableOpacity
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                <Ionicons
                  name={isConfirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* SignUp Button */}
        <View className="mt-8">
          <Button
            className="rounded-xl"
            title="Create Account"
            onPress={() => router.push('/auth/OtpScreen')}
          />
        </View>

        {/* Divider */}
        <View className="mb-2 mt-8 flex-row items-center px-4">
          <LinearGradient
            colors={['rgba(0,0,0,0)', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 1.5, flex: 1 }}
          />

          <Text className="mx-2 font-medium text-xs text-black">OR</Text>

          <LinearGradient
            colors={['#000000', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 1.5, flex: 1 }}
          />
        </View>
        <View className="mb-6 ">
          <View className="mt-2 flex-row justify-between">
            <TouchableOpacity className="h-14 flex-[0.47] flex-row items-center justify-center rounded-2xl    bg-[#F2F2F2]">
              <Image source={require('../../assets/images/Google.png')} className="h-6 w-6" />
            </TouchableOpacity>
            <TouchableOpacity className="h-14 flex-[0.47] flex-row items-center justify-center rounded-2xl   bg-[#F2F2F2]">
              <Image source={require('../../assets/images/Facebook.png')} className="h-6 w-6" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Login Link */}
        <View className="flex-row justify-center">
          <Text className="text-slate-400" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/Login')}>
            <Text className="font-bold text-[#F6163C]">Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
}
