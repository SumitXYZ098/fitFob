import React, { useState } from 'react';
import { View, Text, TouchableOpacity,  } from 'react-native';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { KeyboardAwareScrollView } from '@pietile-native-kit/keyboard-aware-scrollview';
import OnBoarding1 from '../../components/screen/OnBoarding1';
import OnBoarding2 from '@/components/screen/OnBoarding2';

export default function OnBoardingStep() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else console.log('Form Submitted!');
  };

  return (
    <Container>
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: 'white' }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* HEADER & PROGRESS BAR */}
        <View className="mt-4">
          <View className="mt-6 flex-row justify-between">
            {[1, 2, 3, 4, 5].map((item) => {
              let bgColor = ' ';
              if (item === step) bgColor = 'bg-[#F6163C]';
              else if (item < step) bgColor = 'bg-[#FFC1C1]';

              return (
                <TouchableOpacity
                  key={item}
                  onPress={() => item < step && setStep(item)}
                  disabled={item >= step}
                  className="mx-1 h-3 flex-1 justify-center"
                  activeOpacity={0.7}>
                  <View
                    className={`h-3 w-full rounded-full  border-[] ${bgColor}`}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {/* DYNAMIC CONTENT */}
        <View className="mt-10">
          {step === 1 && <OnBoarding1 />}
          {step === 2 && <OnBoarding2 />}
          {step === 3 && <LocationStep />}
          {step === 4 && <SelfieStep />}
          {step === 5 && <IDUploadStep />}
        </View>
        <View className="mb-10 mt-auto pt-6">
          <Button
            title={step === 4 ? 'Take Photo' : step === 5 ? 'Submit' : 'Next'}
            onPress={handleNext}
          />
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
}

// --- Step Components  ---

// const NameStep = () => (
//   <View>
//     <Text className="font-bold text-3xl text-slate-900">What&lsquo;s your name?</Text>
//     <Text className="mt-2 text-base text-slate-400">Let&lsquo;s get started with the basics.</Text>
//     <TextInput
//       placeholder="Full Name"
//       className="mt-8 h-14 border-b-2 border-slate-100 font-semibold text-xl text-slate-900"
//       autoFocus
//     />

//   </View>
// );
// const NameStep = () => {
//   return <OnBoarding1 />;
// };

// const AgeWeightStep = () => (
//   <View>
//     <Text className="font-bold text-3xl text-slate-900">What is your Age?</Text>
//     <Text className="mt-2 text-base text-slate-400">This helps us customize your plan.</Text>
//     <TextInput
//       placeholder="e.g. 25"
//       keyboardType="number-pad"
//       className="mt-8 h-14 border-b-2 border-slate-100 font-semibold text-xl text-slate-900"
//     />
//   </View>
// );

const LocationStep = () => (
  <View>
    <Text className="font-bold text-2xl">Where do you live?</Text>
  </View>
);
const SelfieStep = () => (
  <View>
    <Text className="font-bold text-2xl">Upload a Selfie</Text>
  </View>
);
const IDUploadStep = () => (
  <View>
    <Text className="font-bold text-2xl">Verify your ID</Text>
  </View>
);
