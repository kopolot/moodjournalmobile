import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  ViewStyle,
  StyleProp,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { gameStyles } from '@/styles/gameStyles';
import { Brand } from '@/styles/colors';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'light';
  style?: StyleProp<ViewStyle>;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style,
}: Props) {
  const isDisabled = disabled || loading;
  const base =
    variant === 'secondary'
      ? gameStyles.secondaryBtn
      : variant === 'light'
        ? [gameStyles.primaryBtn, { backgroundColor: '#fff', borderBottomColor: '#D0D0D0' }]
        : gameStyles.primaryBtn;
  const textStyle =
    variant === 'secondary'
      ? gameStyles.secondaryBtnText
      : variant === 'light'
        ? [gameStyles.primaryBtnText, { color: Brand.greenDark }]
        : gameStyles.primaryBtnText;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={({ pressed }) => [
        base,
        isDisabled && gameStyles.primaryBtnDisabled,
        pressed && !isDisabled && { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : Brand.ink} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </Pressable>
  );
}
