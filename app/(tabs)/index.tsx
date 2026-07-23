import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform, RefreshControl } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const CATEGORIES = ['Gyms', 'Yoga', 'Boxing', 'Dance', 'Crossfit', 'Zumba', 'Pilates'];

const GYM_DATA = [
  {
    id: '1',
    title: 'Anytime Fitness Gym',
    rating: '4.5/5',
    amenities: ['AC', 'Wi-Fi', 'Trainers', 'SPA', 'Shower', 'Parking'],
    price: '₹1200/Monthly',
    isOpen: true,
    isVerified: true,
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Gold’s Fitness Club',
    rating: '4.8/5',
    amenities: ['AC', 'Wi-Fi', 'Personal Trainer', 'Sauna', 'Locker'],
    price: '₹1500/Monthly',
    isOpen: true,
    isVerified: true,
    image:
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Gyms');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAF7F8]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E23744']} />
        }
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 90 : 70 }}>
        {/* 1. Header Bar */}
        <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
          {/* Location selector */}
          <TouchableOpacity className="flex-row items-center space-x-2">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#FFEAEF]">
              <Ionicons name="location" size={20} color="#E23744" />
            </View>
            <Text className="ml-2 font-bold text-lg text-darkText">Chandigarh</Text>
          </TouchableOpacity>

          {/* Action Icons */}
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              className="h-10 w-10 items-center justify-center rounded-full bg-[#FFEAEF]">
              <Ionicons name="notifications" size={18} color="#E23744" />
              <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#E23744]" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/profile')}
              className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-[#FFEAEF]">
              <Ionicons name="person" size={18} color="#E23744" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Search Bar */}
        <View className="my-2 px-4">
          <View className="flex-row items-center rounded-full border border-[#F3F4F6] bg-white px-4 py-2 shadow-sm">
            <TextInput
              placeholder="Search gyms, yoga...."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="font-regular flex-1 py-1 pr-2 text-base text-darkText"
            />
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-[#E23744]">
              <Feather name="search" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Category Horizontal Scroll */}
        <View className="my-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  className={`mr-2.5 rounded-full border px-5 py-2.5 ${
                    isSelected ? 'border-[#E23744] bg-[#E23744]' : 'border-[#E5E7EB] bg-white'
                  }`}>
                  <Text
                    className={`font-semibold text-sm ${
                      isSelected ? 'text-white' : 'text-[#6B7280]'
                    }`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. Offer Banner */}
        <View className="my-3 px-4">
          <View className="relative overflow-hidden rounded-2xl bg-primary p-5 shadow-md">
            {/* Background design accents */}
            <View className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/10" />
            <View className="absolute -top-10 right-12 h-24 w-24 rounded-full bg-white/10" />

            <Text className="font-bold font-boldHelvetica text-lg leading-tight text-white">
              Discover Gyms That Match Your Goals
            </Text>
            <Text className="mt-2 font-medium text-sm text-white/80">
              Up to 50% OFF on monthly gym passes
            </Text>
          </View>
        </View>

        {/* 5. Nearby Gym Section Header */}
        <View className="mb-3 mt-4 flex-row items-center justify-between px-4">
          <Text className="font-bold text-xl text-darkText">Nearby Gym</Text>
          <TouchableOpacity className="flex-row items-center space-x-1.5 rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 shadow-sm">
            <Ionicons name="options-outline" size={16} color="#E23744" />
            <Text className="ml-1 font-semibold text-sm text-darkText">Filter</Text>
          </TouchableOpacity>
        </View>

        {/* 6. Gym Cards */}
        <View className="px-4">
          {GYM_DATA.map((gym) => {
            const isFav = !!favorites[gym.id];
            return (
              <View
                key={gym.id}
                className="mb-5 overflow-hidden rounded-3xl border border-[#F3F4F6] bg-white shadow-sm">
                {/* Image & Badges */}
                <View className="relative h-60 w-full bg-gray-200">
                  <Image source={{ uri: gym.image }} className="h-full w-full" resizeMode="cover" />

                  {/* Top Left: Heart Favorite Button */}
                  <TouchableOpacity
                    onPress={() => toggleFavorite(gym.id)}
                    className="absolute left-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-black/30">
                    <Ionicons
                      name={isFav ? 'heart' : 'heart-outline'}
                      size={18}
                      color={isFav ? '#E23744' : '#FFF'}
                    />
                  </TouchableOpacity>

                  {/* Top Right: Verified Badge */}
                  {gym.isVerified && (
                    <View className="absolute right-3 top-3 h-7 w-7 items-center justify-center rounded-full border border-white bg-[#E23744]">
                      <Ionicons name="checkmark" size={16} color="#FFF" />
                    </View>
                  )}

                  {/* Bottom Left: Open Now Badge */}
                  {gym.isOpen && (
                    <View className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 shadow-sm">
                      <Text className="font-semibold text-xs text-[#E23744]">Open now</Text>
                    </View>
                  )}

                  {/* Bottom Right: Carousel Pagination Dots */}
                  <View className="absolute bottom-3 right-3 flex-row items-center space-x-1.5">
                    <View className="h-1.5 w-6 rounded-full bg-[#E23744]" />
                    <View className="ml-1 h-1.5 w-1.5 rounded-full bg-white" />
                    <View className="ml-1 h-1.5 w-1.5 rounded-full bg-white" />
                    <View className="ml-1 h-1.5 w-1.5 rounded-full bg-white" />
                    <View className="ml-1 h-1.5 w-1.5 rounded-full bg-white" />
                  </View>
                </View>

                {/* Card Details */}
                <View className="p-4">
                  {/* Title & Rating */}
                  <View className="flex-row items-center justify-between">
                    <Text className="mr-2 flex-1 font-bold text-lg text-darkText">{gym.title}</Text>
                    <View className="flex-row items-center space-x-1">
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text className="ml-1 font-medium text-xs text-secondaryText">
                        {gym.rating}
                      </Text>
                    </View>
                  </View>

                  {/* Amenities */}
                  <Text className="font-regular mt-1.5 text-sm text-secondaryText">
                    {gym.amenities.map((item) => `• ${item}`).join('  ')}
                  </Text>

                  {/* Pricing */}
                  <Text className="mt-2 font-bold text-base text-darkText">{gym.price}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
