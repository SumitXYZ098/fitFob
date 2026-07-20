import { forwardRef } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ActivityIndicator,
} from 'react-native';

type ButtonProps = {
  title: string;
  loading?: boolean;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  ({ title, loading, ...touchableProps }, ref) => {
    const isDisabled = touchableProps.disabled || loading;

    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={0.8}
        {...touchableProps}
        disabled={isDisabled}
        className={`items-center justify-center rounded-2xl p-4 ${
          isDisabled ? 'bg-[#E5E7EB] ' : 'bg-[#F6163C]'
        } ${touchableProps.className}`}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center font-bold text-base text-white">{title}</Text>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';
