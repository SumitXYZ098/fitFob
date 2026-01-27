import { Text, View } from 'react-native';

import { Stack, useLocalSearchParams } from 'expo-router';

import { Container } from '@/components/Container';
import { ScreenContent } from '@/components/ScreenContent';
import { useStore } from '@/store/store';
import { Button } from '@/components/Button';

export default function Details() {
  const { name } = useLocalSearchParams();
  const { bears, increasePopulation, decreasePopulation, removeAllBears } = useStore();

  return (
 
      <Container>
        <View className="flex-row items-center justify-center gap-x-10">
          <Button title="-" onPress={decreasePopulation} />
          <Text className="text-xl">{bears}</Text>
          <Button title="+" onPress={increasePopulation} />
        </View>
          <Button title="Reset" onPress={removeAllBears} />
        <View className="mt-1 ">
          <Text className="text-green-600">{name}</Text>
        </View>
      </Container>
  );
}

const styles = {
  container: 'flex flex-1 bg-white',
};
