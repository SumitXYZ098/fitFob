import { View, Text } from 'react-native';
import { Container } from '@/components/Container';

export default function HomeScreen() {
  return (
    <Container>
      <View className="flex-1 items-center justify-center">
        <Text className="font-bold text-2xl">Welcome directly to FitFob!</Text>
        <Text className="mt-4 text-secondaryText">This is your dashboard.</Text>
      </View>
    </Container>
  );
}
