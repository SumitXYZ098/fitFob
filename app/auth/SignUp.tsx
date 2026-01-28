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

export default function SignUp() {
  const router = useRouter();

  // States for visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-6">
          {/* Logo & Header Section */}
          <View className="mt-10 items-center">
            <View className="h-20 w-20 items-center justify-center">
              <Image
                source={require('../../assets/images/Vector.png')}
                className="h-12 w-12"
                resizeMode="contain"
              />
            </View>
            <Text
              className="mt-4 text-center text-3xl text-slate-900"
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
            {/* 1. Email or Phone number */}
            <View>
              <Text className="mb-2 ml-1  text-sm font-normal">Email or Phone number</Text>
              <View className="h-16 flex-row items-center rounded-2xl border border-slate-100 bg-slate-50/50 px-4">
                <TextInput
                  className=" flex-1 text-slate-900"
                  placeholder="Email or phone number"
                  placeholderTextColor="#94A3B8"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                />
              </View>
            </View>

            {/* 2. Password */}
            <View>
              <Text className="mb-2 ml-1 mt-2  font-semibold text-sm  ">Set Password</Text>
              <View className="h-16 flex-row items-center rounded-2xl border border-slate-100 bg-slate-50/50 px-4">
                <TextInput
                  className=" flex-1 text-slate-900"
                  placeholder="Set Password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!isPasswordVisible}
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Ionicons
                    name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. Confirm Password */}
            <View>
              <Text className="mb-2 ml-1 mt-2 font-semibold text-sm  ">Confirm Password</Text>
              <View className="h-16 flex-row items-center rounded-2xl border border-slate-100 bg-slate-50/50 px-4">
                <TextInput
                  className="flex-1 text-slate-900"
                  placeholder="Confirm Password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!isConfirmPasswordVisible}
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                />
                <TouchableOpacity
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                  <Ionicons
                    name={isConfirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            className="mt-10 h-16 items-center justify-center rounded-[20px] bg-[#F6163C] shadow-xl shadow-red-200">
            <Button title="Create Account" className="w-full bg-transparent" />
          </TouchableOpacity>

          {/* Divider & Socials */}
          <View className="mb-6 mt-10">
            <View className="flex-row items-center">
              <View className="h-[2px] flex-1 bg-slate-300" />
              <Text
                className="mx-4 text-slate-400"
                style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Or sign up with
              </Text>
              <View className="h-[1px] flex-1 bg-slate-300" />
            </View>

            <View className="mt-6 flex-row justify-between">
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
            <TouchableOpacity>
              <Text className="font-bold text-[#F6163C]">Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
