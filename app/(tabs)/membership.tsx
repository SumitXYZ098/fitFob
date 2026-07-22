import React from 'react';
import { View, Text } from 'react-native';
import { Container } from '@/components/modules/Container';

export default function MembershipScreen() {
  return (
    <Container>
      <View className="flex-1 items-center justify-center p-4">
        <Text className="font-bold text-2xl text-darkText">Membership</Text>
        <Text className="mt-2 text-center text-secondaryText">
          Manage your membership status, rewards, and plan details.
        </Text>
      </View>
    </Container>
  );
}
