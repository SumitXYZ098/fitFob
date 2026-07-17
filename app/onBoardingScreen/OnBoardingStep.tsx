import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { KeyboardAwareScrollView } from '@pietile-native-kit/keyboard-aware-scrollview';
import BasicDetails from '@/components/screens/OnBoardingScreens/BasicDetails';
import BodyInfo from '@/components/screens/OnBoardingScreens/BodyInfo';
import LocationScreen from '@/components/screens/OnBoardingScreens/LocationScreen';
import SelfieScreen from '@/components/screens/OnBoardingScreens/SelfieScreen';
import GovernmentId from '@/components/screens/OnBoardingScreens/GovernmentId';

export default function OnBoardingStep() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Selfie state & ref
  const selfieRef = useRef<any>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);

  // Government ID state & ref
  const govIdRef = useRef<any>(null);
  const [govIdUri, setGovIdUri] = useState<string | null>(null);

  const handleNext = () => {
    if (step === 4 && !selfieUri) {
      // Trigger camera capture in SelfieScreen
      selfieRef.current?.takePhoto();
    } else if (step === 5 && !govIdUri) {
      // Trigger ID upload selection in GovernmentId
      govIdRef.current?.uploadId();
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <Container>
      {/* --- FIXED PROGRESS BAR (Sticky) --- */}
      <View className=" mt-1 flex-row">
        {[1, 2, 3, 4, 5].map((item) => {
          let bgColor = ' ';
          if (item === step) bgColor = 'bg-primary border-2 border-[#FFC1C1] h-4';
          else if (item < step) bgColor = 'bg-[#FFC1C1] h-3';
          else bgColor = 'border h-3 border-border';

          return (
            <TouchableOpacity
              key={item}
              onPress={() => item < step && setStep(item)}
              disabled={item >= step}
              className="mx-1 h-auto flex-1 justify-center"
              activeOpacity={0.7}>
              <View className={`w-full rounded-full ${bgColor}`} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* --- SCROLLABLE CONTENT --- */}
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: 'white' }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View className="mt-6 flex-1">
          {step === 1 && <BasicDetails />}
          {step === 2 && <BodyInfo />}
          {step === 3 && <LocationScreen />}
          {step === 4 && (
            <SelfieScreen ref={selfieRef} selfieUri={selfieUri} setSelfieUri={setSelfieUri} />
          )}
          {step === 5 && (
            <GovernmentId ref={govIdRef} govIdUri={govIdUri} setGovIdUri={setGovIdUri} />
          )}
        </View>

        <View className="pt-6">
          <Button
            title={
              step === 4
                ? (selfieUri ? 'Next' : 'Take Photo')
                : step === 5
                ? (govIdUri ? 'Submit' : 'Upload government ID')
                : 'Next'
            }
            onPress={handleNext}
          />
        </View>
      </KeyboardAwareScrollView>
    </Container>
  );
}
