import { View, Text, ImageBackground, Dimensions, Pressable, FlatList, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';

const images = [
  require('../assets/images/welcome1.png'),
  require('../assets/images/welcome2.png'),
  require('../assets/images/welcome3.png'),
];

const { width } = Dimensions.get('window');

export default function Welcome() {
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (index + 1) % images.length;
      setIndex(next);
      ref.current?.scrollToIndex({ index: next, animated: true });
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <View className="flex-1 bg-black">
      <FlatList
        ref={ref}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <ImageBackground
            source={item}
            style={{ width, height: '100%' }}
            className="justify-between">
            {/* Overlay */}
            <View className="absolute inset-0 bg-black/40" />

            {/* Top logo */}
            <View className="ml-6 mt-16">
              <Image
                source={require('../assets/images/logoVector.png')}
                className="h-[54px] w-[54px]"
                resizeMode="cover"
              />
            </View>

            {/* Bottom CTA */}
            <View className="px-6 pb-12">
              {/* Indicators */}
              <View className="mb-6 flex-row">
                {images.map((_, i) => (
                  <View
                    key={i}
                    className={`mr-2 h-1 rounded-full ${
                      i === index ? 'w-6 bg-primary' : 'w-3 bg-white/40'
                    }`}
                  />
                ))}
              </View>

              {/* Login */}
              <Pressable className="mb-4 rounded-2xl bg-primary py-4">
                <Text className="text-center font-semibold text-lg text-white">Login</Text>
              </Pressable>

              {/* Sign up */}
              <Pressable className="mb-6 rounded-2xl border border-white py-4">
                <Text className="text-center font-semibold text-lg text-white">Sign Up</Text>
              </Pressable>

              {/* Legal */}
              <Text className="text-center text-xs text-white/70">
                By proceeding, you agree to{' '}
                <Text className="text-primary underline">Terms & Conditions</Text> &{' '}
                <Text className="text-primary underline">Privacy Policy</Text>
              </Text>
            </View>
          </ImageBackground>
        )}
      />
    </View>
  );
}
