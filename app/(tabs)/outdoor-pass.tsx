import React from 'react';
import { View, Text } from 'react-native';
import { Container } from '@/components/modules/Container';

export default function OutdoorPassScreen() {
  return (
    <Container>
      <View className="flex-1 items-center justify-center p-4">
        <Text className="font-bold text-2xl text-darkText">Outdoor Pass</Text>
        <Text className="mt-2 text-center text-secondaryText">
          Access your outdoor gym passes and activity credentials here.
        </Text>
      </View>
    </Container>
  );
}
