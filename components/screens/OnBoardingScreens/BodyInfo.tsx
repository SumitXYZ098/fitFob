import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useClientBodyInfo } from '@/hook/useClient';

const { width } = Dimensions.get('window');
const TICK_SPACING = 15;

export interface BodyInfoRef {
  submit: () => Promise<boolean>;
}

interface BodyInfoProps {
  prefill?: any;
}

const BodyInfo = forwardRef<BodyInfoRef, BodyInfoProps>(({ prefill }, ref) => {
  const { mutateAsync } = useClientBodyInfo();

  // Parsing DOB helpers
  const getInitialDob = () => {
    if (prefill?.date_of_birth) {
      const parts = prefill.date_of_birth.split('-');
      if (parts.length === 3) {
        // YYYY-MM-DD
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
      return new Date(prefill.date_of_birth);
    }
    return new Date(2000, 0, 1);
  };

  const getInitialDobText = () => {
    if (prefill?.date_of_birth) {
      const parts = prefill.date_of_birth.split('-');
      if (parts.length === 3) {
        // YYYY-MM-DD -> DD/MM/YYYY
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return prefill.date_of_birth;
    }
    return 'DD/MM/YYYY';
  };

  // Parsing Weight helpers
  const getInitialWeight = () => {
    if (prefill?.weight) {
      const parts = prefill.weight.split(' ');
      const val = parseInt(parts[0]);
      if (!isNaN(val)) return val;
    }
    return 70;
  };

  const getInitialWeightUnit = () => {
    if (prefill?.weight) {
      const parts = prefill.weight.split(' ');
      if (parts[1] === 'lb') return 'lb';
    }
    return 'kg';
  };

  // Parsing Height helpers
  const getInitialHeight = () => {
    if (prefill?.height) {
      const parts = prefill.height.split(' ');
      const val = parseInt(parts[0]);
      if (!isNaN(val)) return val;
    }
    return 170;
  };

  const getInitialHeightUnit = () => {
    if (prefill?.height) {
      const parts = prefill.height.split(' ');
      if (parts[1] === 'inches') return 'inches';
    }
    return 'cm';
  };

  const [date, setDate] = useState(getInitialDob());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobText, setDobText] = useState(getInitialDobText());

  const [weight, setWeight] = useState<number>(getInitialWeight());
  const [height, setHeight] = useState<number>(getInitialHeight());
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>(getInitialWeightUnit());
  const [heightUnit, setHeightUnit] = useState<'cm' | 'inches'>(getInitialHeightUnit());

  useImperativeHandle(ref, () => ({
    submit: async () => {
      if (dobText === 'DD/MM/YYYY') {
        Alert.alert('Validation Error', 'Please select your Date of Birth.');
        return false;
      }
      try {
        const dobFormatted = date.toISOString().split('T')[0];
        await mutateAsync({
          height: `${height} ${heightUnit}`,
          weight: `${weight} ${weightUnit}`,
          date_of_birth: dobFormatted,
        });
        return true;
      } catch (error) {
        console.error('Error submitting body info:', error);
        return false;
      }
    },
  }));

  const weights = Array.from({ length: 251 }, (_, i) => i + 20);
  const heights = Array.from({ length: 201 }, (_, i) => i + 50);

  // --- Date Picker Logic ---
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Android mein 'set' dabate hi band hona chahiye, 'dismissed' pe bhi band hona chahiye
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate) {
      setDate(selectedDate);

      // Formatting: DD/MM/YYYY
      let d = selectedDate.getDate().toString().padStart(2, '0');
      let m = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      let y = selectedDate.getFullYear();
      setDobText(`${d}/${m}/${y}`);

      // Android pe select karte hi picker close kar do
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // --- Weight/Height Logic (Remains Same) ---
  const convertWeight = (val: number, toUnit: 'kg' | 'lb'): number => {
    if (toUnit === 'lb') return Math.round(val * 2.20462);
    return Math.round(val / 2.20462);
  };

  const convertHeight = (val: number, toUnit: 'cm' | 'inches'): number => {
    if (toUnit === 'inches') return Math.round(val / 2.54);
    return Math.round(val * 2.54);
  };

  const handleUnitChange = (type: 'weight' | 'height', newUnit: any) => {
    if (type === 'weight' && weightUnit !== newUnit) {
      setWeight(convertWeight(weight, newUnit));
      setWeightUnit(newUnit);
    } else if (type === 'height' && heightUnit !== newUnit) {
      setHeight(convertHeight(height, newUnit));
      setHeightUnit(newUnit);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleScrollSelection = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    setter: (value: number) => void,
    data: number[],
    spacing: number,
    currentVal: number
  ) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / spacing);
    const value = data[index];
    if (value !== undefined && value !== currentVal) {
      setter(value);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View className="flex-1 bg-white ">
      {/* --- DATE OF BIRTH SELECTOR --- */}
      <View className="mb-6 mt-4">
        <Text className="mb-2 font-medium text-slate-500">What is Date of Birth</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowDatePicker(true)}
          className="h-16 flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-5">
          <Text
            className={`font-medium text-lg ${dobText === 'DD/MM/YYYY' ? 'text-slate-300' : 'text-slate-700'}`}>
            {dobText}
          </Text>
          <Ionicons name="calendar-outline" size={24} color="#94a3b8" />
        </TouchableOpacity>

        {showDatePicker && (
          <View>
            {Platform.OS === 'ios' && (
              <TouchableOpacity onPress={() => setShowDatePicker(false)} className="items-end p-2">
                <Text className="font-bold text-lg text-[#F6163C]">Done</Text>
              </TouchableOpacity>
            )}
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          </View>
        )}
      </View>

      {/* --- WEIGHT SELECTOR --- */}
      <View className="mb-6 rounded-[25px] bg-slate-50 ">
        <Text className="mb-4 font-bold text-lg text-slate-900">What is your Weight?</Text>
        <View className="mb-6 flex-row">
          <TouchableOpacity
            onPress={() => handleUnitChange('weight', 'kg')}
            className={`flex-1 items-center rounded-xl border py-3 ${weightUnit === 'kg' ? 'border-[#F6163C] bg-[#F6163C]' : 'mr-2 border-slate-200 bg-white'}`}>
            <Text className={`font-bold ${weightUnit === 'kg' ? 'text-white' : 'text-slate-400'}`}>
              kg
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleUnitChange('weight', 'lb')}
            className={`flex-1 items-center rounded-xl border py-3 ${weightUnit === 'lb' ? 'border-[#F6163C] bg-[#F6163C]' : 'ml-2 border-slate-200 bg-white'}`}>
            <Text className={`font-bold ${weightUnit === 'lb' ? 'text-white' : 'text-slate-400'}`}>
              lb
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mb-4 flex-row items-baseline justify-center">
          <Text className="text-5xl font-black text-slate-900">{weight}</Text>
          <Text className="ml-1 font-bold text-xl text-[#F6163C]">{weightUnit}</Text>
        </View>
        <View className="h-24 justify-center overflow-hidden rounded-2xl">
          <View
            className="absolute bottom-4 left-1/2 z-10 h-12 w-1 rounded-full bg-slate-900"
            style={{ marginLeft: -1 }}
          />
          <FlatList
            key={`weight-list-${weightUnit}`}
            data={weights}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={TICK_SPACING}
            decelerationRate="fast"
            onScroll={(e) => handleScrollSelection(e, setWeight, weights, TICK_SPACING, weight)}
            initialScrollIndex={weights.indexOf(weight)}
            getItemLayout={(_, i) => ({ length: TICK_SPACING, offset: TICK_SPACING * i, index: i })}
            contentContainerStyle={{ paddingHorizontal: (width - 80) / 2 }}
            renderItem={({ item }) => (
              <View style={{ width: TICK_SPACING }} className="items-center justify-end pb-4">
                {item % 10 === 0 && (
                  <Text className="absolute top-2 text-[10px] font-black text-slate-400">
                    {item}
                  </Text>
                )}
                <View
                  className={`w-[2px] rounded-full ${item % 10 === 0 ? 'h-8 bg-slate-800' : 'h-4 bg-slate-300'}`}
                />
              </View>
            )}
          />
        </View>
      </View>

      {/* --- HEIGHT SELECTOR --- */}
      <View className="mb-6 rounded-[25px] bg-slate-50 p-5">
        <Text className="mb-4 font-bold text-lg text-slate-900">What is your height?</Text>
        <View className="mb-6 flex-row">
          <TouchableOpacity
            onPress={() => handleUnitChange('height', 'cm')}
            className={`flex-1 items-center rounded-xl border py-3 ${heightUnit === 'cm' ? 'border-[#F6163C] bg-[#F6163C]' : 'mr-2 border-slate-200 bg-white'}`}>
            <Text className={`font-bold ${heightUnit === 'cm' ? 'text-white' : 'text-slate-400'}`}>
              cm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleUnitChange('height', 'inches')}
            className={`flex-1 items-center rounded-xl border py-3 ${heightUnit === 'inches' ? 'border-[#F6163C] bg-[#F6163C]' : 'ml-2 border-slate-200 bg-white'}`}>
            <Text
              className={`font-bold ${heightUnit === 'inches' ? 'text-white' : 'text-slate-400'}`}>
              inches
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mb-4 flex-row items-baseline justify-center">
          <Text className="text-5xl font-black text-slate-900">{height}</Text>
          <Text className="ml-1 font-bold text-xl text-[#F6163C]">{heightUnit}</Text>
        </View>
        <View className="h-24 justify-center overflow-hidden rounded-2xl">
          <View
            className="absolute bottom-4 left-1/2 z-10 h-12 w-1 rounded-full bg-slate-900"
            style={{ marginLeft: -1 }}
          />
          <FlatList
            key={`height-list-${heightUnit}`}
            data={heights}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={TICK_SPACING}
            decelerationRate="fast"
            onScroll={(e) => handleScrollSelection(e, setHeight, heights, TICK_SPACING, height)}
            initialScrollIndex={heights.indexOf(height)}
            getItemLayout={(_, i) => ({ length: TICK_SPACING, offset: TICK_SPACING * i, index: i })}
            contentContainerStyle={{ paddingHorizontal: (width - 80) / 2 }}
            renderItem={({ item }) => (
              <View style={{ width: TICK_SPACING }} className="items-center justify-end pb-4">
                {item % 10 === 0 && (
                  <Text className="absolute top-2 text-[10px] font-black text-slate-400">
                    {item}
                  </Text>
                )}
                <View
                  className={`w-[2px] rounded-full ${item % 10 === 0 ? 'h-8 bg-slate-800' : 'h-4 bg-slate-300'}`}
                />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
});

BodyInfo.displayName = 'BodyInfo';

export default BodyInfo;
