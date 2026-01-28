import { View, Text, ImageBackground, Image } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function Splash() {
  const router = useRouter();

  const translateY = useSharedValue(40);
  const opacity = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.exp),
    });

    opacity.value = withTiming(1, {
      duration: 800,
    });

    const t = setTimeout(() => {
      router.replace('/welcome');
    }, 20000);

    return () => clearTimeout(t);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/splash-grid.png')}
      className="flex-1 items-center justify-center bg-primary px-6"
      resizeMode="cover">
      <View className="items-center justify-center gap-4">
        <Animated.View style={logoStyle}>
          <Image
            source={require('../assets/images/logoVector.png')}
            className="h-[117px] w-[117px]"
            resizeMode="cover"
          />
        </Animated.View>
        <Text className="font-bold text-[40px] leading-[44px] text-background">fit fob</Text>
      </View>
      <View className="fle-col absolute bottom-20 flex w-full items-start gap-2 rounded-2xl bg-background px-5 py-4">
        <Entypo name="quote" size={24} className="scale-x-[-1]" color={'red'} />
        <Text className="font-sans text-sm leading-sm text-darkText">
          Every rep takes you closer.
        </Text>
      </View>
    </ImageBackground>
  );
}
