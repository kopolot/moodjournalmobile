import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Brand } from '@/styles/colors';
import { gameFonts } from '@/styles/gameStyles';

type Props = {
  level: number;
  xpIntoLevel: number;
  xpPerLevel: number;
  label?: string;
};

export default function XpBar({ level, xpIntoLevel, xpPerLevel, label }: Props) {
  const progress = useSharedValue(0);
  const ratio = xpPerLevel > 0 ? Math.min(1, xpIntoLevel / xpPerLevel) : 0;

  useEffect(() => {
    progress.value = withTiming(ratio, { duration: 650 });
  }, [ratio, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.level}>LVL {level}</Text>
        <Text style={styles.xp}>
          {label ?? `${xpIntoLevel} / ${xpPerLevel} XP`}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  level: {
    fontFamily: gameFonts.extra,
    fontSize: 14,
    color: Brand.ink,
  },
  xp: {
    fontFamily: gameFonts.bold,
    fontSize: 13,
    color: '#777',
  },
  track: {
    height: 14,
    borderRadius: 999,
    backgroundColor: '#E5E5E5',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D0D0D0',
  },
  fill: {
    height: '100%',
    backgroundColor: Brand.gold,
    borderRadius: 999,
  },
});
