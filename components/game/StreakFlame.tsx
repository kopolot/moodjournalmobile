import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Brand } from '@/styles/colors';
import { gameFonts } from '@/styles/gameStyles';

type Props = {
  streak: number;
  compact?: boolean;
};

export default function StreakFlame({ streak, compact }: Props) {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(withTiming(-3, { duration: 400 }), withTiming(0, { duration: 400 })),
      -1,
      false
    );
  }, [bounce]);

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <Animated.Text style={[styles.emoji, emojiStyle]}>🔥</Animated.Text>
      <Text style={styles.count}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: Brand.streak,
    gap: 4,
  },
  compact: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  emoji: { fontSize: 18 },
  count: {
    fontFamily: gameFonts.extra,
    fontSize: 16,
    color: Brand.streak,
  },
});
