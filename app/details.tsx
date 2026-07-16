import { Text, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { Container } from '@/components/Container';
import { useStore } from '@/store/store';
import { Button } from '@/components/Button';

export default function Details() {
  const { name } = useLocalSearchParams();
  const { bears, increasePopulation, decreasePopulation, removeAllBears } = useStore();

  return (
    <Container>
      <View className="flex-row items-center justify-center gap-x-10">
        <Button title="-" onPress={decreasePopulation} />
        <Text className="ios:font-bold font-medium text-xl">{bears}</Text>
        <Button title="+" onPress={increasePopulation} />
      </View>
      <Button title="Reset" onPress={removeAllBears} />
      <View className="mt-1 ">
        <Text className="font-semibold text-green-600">{name}</Text>
      </View>
    </Container>
  );
}
