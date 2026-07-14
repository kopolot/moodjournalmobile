import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MoodScale } from '@/styles/colors';
import { gameFonts } from '@/styles/gameStyles';
import { useI18n } from '@/contexts/I18nContext';

type Props = {
  mood: number;
  setMood: (value: number) => void;
  showLabels?: boolean;
};

export default function MoodSelector({ mood, setMood, showLabels = true }: Props) {
  const { t } = useI18n();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {MoodScale.map((item) => {
          const selected = mood === item.level;
          return (
            <TouchableOpacity
              key={item.level}
              accessibilityRole="button"
              accessibilityLabel={t(item.labelKey)}
              onPress={async () => {
                await Haptics.selectionAsync();
                setMood(item.level);
              }}
              style={[
                styles.btn,
                {
                  backgroundColor: selected ? item.color : '#F3F3F3',
                  borderColor: selected ? item.color : '#E5E5E5',
                  transform: [{ scale: selected ? 1.08 : 1 }],
                },
              ]}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {showLabels && mood > 0 ? (
        <Text style={[styles.label, { color: MoodScale[mood - 1].color }]}>
          {t(MoodScale[mood - 1].labelKey)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', alignItems: 'center', marginVertical: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 6,
  },
  btn: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 56,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 26 },
  label: {
    marginTop: 12,
    fontFamily: gameFonts.extra,
    fontSize: 18,
  },
});
