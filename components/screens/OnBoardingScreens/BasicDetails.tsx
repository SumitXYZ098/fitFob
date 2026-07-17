import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TextInput, TouchableOpacity, Image, Text, View } from 'react-native';
// Nayi library import karein
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';

const BasicDetails = () => {
  const [selectedGender, setSelectedGender] = useState('male');

  // Phone aur Country state
  const [countryCode, setCountryCode] = useState<CountryCode>('IN'); // Default India
  const [callingCode, setCallingCode] = useState('91');
  const [phoneNumber, setPhoneNumber] = useState('');

  const genders = [
    {
      id: 'male',
      label: 'Male',
      icon: 'male-outline',
      image: require('../../../assets/images/male.png'),
    },
    {
      id: 'female',
      label: 'Female',
      icon: 'female-outline',
      image: require('../../../assets/images/female.png'),
    },
    { id: 'other', label: 'Other', icon: 'male-female-outline' },
  ];

  return (
    <View className="flex-1  bg-white">
      <Text className="font-bold text-3xl leading-tight text-slate-900">What’s your name?</Text>
      <Text className="font-bold text-3xl text-slate-900">Let’s get started.</Text>

      {/* Name Input */}
      <View className="mt-4">
        <Text className="mb-1 font-medium text-slate-400">Name</Text>
        <TextInput
          placeholder="Enter Name"
          placeholderTextColor="#94a3b8"
          className="h-16 rounded-2xl border border-slate-200 bg-white px-5"
        />
      </View>

      {/* Email Input */}
      <View className="mt-4">
        <Text className="mb-1 font-medium text-slate-400">Email</Text>
        <TextInput
          placeholder="Enter Email"
          placeholderTextColor="#94a3b8"
          className="h-16 rounded-2xl border border-slate-100 bg-white px-5"
        />
      </View>

      {/* Phone Number Field with Country Picker & Down Arrow */}
      <View className="mt-4">
        <Text className="mb-1 font-medium text-slate-400">Phone Number</Text>
        <View className="h-16 flex-row items-center rounded-2xl border border-slate-100 bg-white px-4">
          {/* Country Selector with Flag and Arrow */}
          <View className="flex-row items-center">
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withAlphaFilter
              onSelect={(country: Country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
            />
            {/* Down Arrow Icon */}
            <Ionicons name="chevron-down" size={16} color="#475569" className="ml-1" />
          </View>

          {/* Calling Code Text */}
          <Text className="ml-2 font-medium text-slate-900">+{callingCode}</Text>

          {/* Vertical Separator */}
          <View className="mx-3 h-6 w-[1px] bg-slate-200" />

          {/* Phone Number Input */}
          <TextInput
            placeholder="Enter phone number"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            className="h-full flex-1 text-slate-900"
          />
        </View>
      </View>

      {/* Gender Selection */}
      <View className="mt-8">
        <Text className="mb-4 font-medium text-slate-400">Gender (optional)</Text>
        <View className="flex-row justify-between">
          {genders.map((item) => {
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

export default BasicDetails;
