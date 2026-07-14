import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import MoodSelector from '@/components/form/partials/MoodSelector';
import { useI18n } from '@/contexts/I18nContext';
import { Brand } from '@/styles/colors';
import { gameFonts } from '@/styles/gameStyles';
import type { AspectKey } from '@/services/moodService';

type Props = {
  aspect: AspectKey;
  score: number;
  note: string;
  setScore: (value: number) => void;
  setNote: (value: string) => void;
};

export default function SpecificMoodSection({
  aspect,
  score,
  note,
  setScore,
  setNote,
}: Props) {
  const { t } = useI18n();

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{t(`mood-note.aspects.${aspect}.title`)}</Text>
      <Text style={styles.subtitle}>{t(`mood-note.aspects.${aspect}.hint`)}</Text>
      <MoodSelector mood={score} setMood={setScore} />
      <TextInput
        style={styles.input}
        placeholder={t('mood-note.aspectNotePlaceholder')}
        placeholderTextColor="#AFAFAF"
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={500}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  title: {
    fontFamily: gameFonts.extra,
    fontSize: 24,
    color: Brand.ink,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: gameFonts.regular,
    fontSize: 15,
    color: '#777',
    marginBottom: 8,
    lineHeight: 21,
  },
  input: {
    marginTop: 8,
    minHeight: 90,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 14,
    fontFamily: gameFonts.regular,
    fontSize: 16,
    color: Brand.ink,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
});
