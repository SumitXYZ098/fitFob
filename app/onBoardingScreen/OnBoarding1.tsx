import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput, TouchableOpacity, Image, Text, View } from 'react-native';

const OnBoarding1 = () => {
  const [selectedGender, setSelectedGender] = useState('male');

  const genders = [
    {
      id: 'male',
      label: 'Male',
      icon: 'male-outline',
      image: require('../../assets/images/male.png'),
    },
    {
      id: 'female',
      label: 'Female',
      icon: 'female-outline',
      image: require('../../assets/images/female.png'),
    },
    { id: 'other', label: 'Other', icon: 'male-female-outline' },
  ];

  return (
    <View className="px-1">
      <Text className="font-bold text-3xl leading-tight text-slate-900">What’s your name?</Text>
      <Text className="font-bold text-3xl text-slate-900">Let’s get started.</Text>

      {/* Name Input Field */}
      <View className="mt-8">
        <Text className="mb-1 font-medium text-slate-400">Name</Text>
        <TextInput
          placeholder="Enter Name"
          placeholderTextColor="#94a3b8"
          className="h-16 rounded-2xl border border-slate-100 bg-white px-5 font-semibold text-lg text-slate-900 shadow-sm"
          autoFocus
        />
      </View>

      {/* Gender Selection */}
      <View className="mt-8">
        <Text className="mb-4 font-medium text-slate-400">Gender (optional)</Text>

        <View className="flex-row justify-between">
          {genders.map((item) => {
            // Check if this item is currently selected
            const isSelected = selectedGender === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedGender(item.id)}
                activeOpacity={0.8}
                className="items-center">
                <View
                  className={`h-20 w-20 items-center justify-center rounded-full border-2 bg-white ${
                    isSelected ? 'border-[#F6163C]' : 'border-slate-100'
                  }`}
                  style={{
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                  }}>
                  {isSelected && item.image ? (
                    <Image
                      source={item.image}
                      className="h-full w-full rounded-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <Ionicons
                      name={item.icon as any}
                      size={32}
                      color={isSelected ? '#F6163C' : '#CBD5E1'}
                    />
                  )}
                </View>
                <Text
                  className={`mt-2 font-medium ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default OnBoarding1;
