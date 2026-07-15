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
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors, scheme } = useTheme();
  const isDisabled = disabled || loading;

  const base =
    variant === 'secondary'
      ? [
          gameStyles.secondaryBtn,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]
      : variant === 'light'
        ? [
            gameStyles.primaryBtn,
            {
              backgroundColor: scheme === 'dark' ? colors.card : '#fff',
              borderBottomColor: scheme === 'dark' ? colors.border : '#D0D0D0',
            },
          ]
        : gameStyles.primaryBtn;

  const textStyle =
    variant === 'secondary'
      ? [gameStyles.secondaryBtnText, { color: colors.text }]
      : variant === 'light'
        ? [
            gameStyles.primaryBtnText,
            { color: scheme === 'dark' ? Brand.green : Brand.greenDark },
          ]
        : gameStyles.primaryBtnText;

  const spinnerColor =
    variant === 'primary' ? colors.onPrimary : scheme === 'dark' ? Brand.green : Brand.ink;

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
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </Pressable>
  );
}
