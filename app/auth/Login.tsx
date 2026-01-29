import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from '@pietile-native-kit/keyboard-aware-scrollview';
import { Container } from '@/components/Container';

export default function Login() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <Container>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        className="">
        {/* Logo Section */}
        <View className=" mt-12 items-center">
          <Image
            source={require('../../assets/images/Vector.png')}
            className="h-16 w-16"
            resizeMode="contain"
            style={{ tintColor: '#F6163C' }}
          />

          <Text
            className="mt-6 text-3xl text-slate-900"
            style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            Get Started Now
          </Text>
          <Text
            className="mt-2 px-4 text-center text-base text-slate-400"
            style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
            Create an account or log in to explore about our app
          </Text>
        </View>

        {/* Form Section */}
        <View className="mt-10 space-y-4">
          {/* Email Field */}
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

          {/* Password Field */}
          <View>
            <Text className="mb-2 mt-2 ml-1 font-semibold text-sm text-slate-600">Password</Text>
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

          {/* Remember Me & Forgot Password */}
          <View className="flex-row items-center justify-between pt-2">
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
              className="flex-row items-center">
              <View
                className={`h-5 w-5 items-center justify-center rounded border ${
                  rememberMe ? 'border-[#F6163C] bg-[#F6163C]' : 'border-slate-300 bg-white'
                }`}>
                {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text className="ml-2 text-sm text-slate-500">Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text className="font-bold text-sm text-[#F6163C]">Forgot Password ?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <View className="mt-8">
          <Button className='rounded-xl' title="Log In" onPress={() => router.push('/')} />
        </View>

        <View className="mb-6 mt-8 flex-row items-center px-4">
          {/* Left Line: Transparent to Black */}
          <LinearGradient
            colors={['rgba(0,0,0,0)', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 1.5, flex: 1 }}
          />

          <Text className="mx-4 font-medium text-xs text-black">OR</Text>

          {/* Right Line: Black to Transparent */}
          <LinearGradient
            colors={['#000000', 'rgba(0,0,0,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 1.5, flex: 1 }}
          />
        </View>

        {/* Social Buttons */}
        <View className="flex-row justify-between">
          <TouchableOpacity className="h-14 flex-[0.47] items-center justify-center rounded-2xl   bg-[#F2F2F2]">
            <Image
              source={require('../../assets/images/Google.png')}
              className="h-6 w-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity className="h-14 flex-[0.47] items-center justify-center rounded-2xl  bg-[#F2F2F2]">
            <Image
              source={require('../../assets/images/Facebook.png')}
              className="h-6 w-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Footer Link */}
        <View className="mb-6  flex-row justify-center py-6">
          <Text className="text-slate-400">Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/SignUp')}>
            <Text className="font-bold text-[#F6163C]">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
}
