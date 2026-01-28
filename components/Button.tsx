import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, ...touchableProps }, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      {...touchableProps}
      className={`${styles.button} ${touchableProps.className}`}>
      <Text className={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

const styles = {
  button: 'items-center bg-[#232334] ios:bg-primary rounded-[28px] shadow-md p-4',
  buttonText: 'text-white text-3xl leading-3xl font-medium ios:font-semibold text-center',
};
