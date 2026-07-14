import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import MoodSelector from '@/components/form/partials/MoodSelector';
import { useI18n } from '@/contexts/I18nContext';
import { Brand } from '@/styles/colors';
import { gameFonts } from '@/styles/gameStyles';
import { APP_LOGIC_CONFIG } from '@/config/appConfig';
import type { AspectKey } from '@/services/moodService';

type Props = {
  aspect: AspectKey;
  score: number;
  note: string;
  noteRequired: boolean;
  average?: number | null;
  setScore: (value: number) => void;
  setNote: (value: string) => void;
};

export default function SpecificMoodSection({
  aspect,
  score,
  note,
  noteRequired,
  average,
  setScore,
  setNote,
}: Props) {
  const { t } = useI18n();
  const min = APP_LOGIC_CONFIG.aspectNoteMinLength;
  const trimmed = note.trim().length;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{t(`mood-note.aspects.${aspect}.title`)}</Text>
      <Text style={styles.subtitle}>{t(`mood-note.aspects.${aspect}.hint`)}</Text>
      {average != null ? (
        <Text style={styles.avg}>
          {t('mood-note.yourAverage', { value: average.toFixed(1) })}
        </Text>
      ) : null}
      <MoodSelector mood={score} setMood={setScore} />
      <Text style={styles.noteLabel}>
        {noteRequired ? t('mood-note.aspectNoteRequired') : t('mood-note.aspectNoteOptional')}
      </Text>
      {noteRequired ? (
        <Text style={styles.whyRequired}>{t('mood-note.whyRequired')}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder={t('mood-note.aspectNotePlaceholder')}
        placeholderTextColor="#AFAFAF"
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={500}
      />
      {noteRequired || trimmed > 0 ? (
        <Text style={[styles.counter, trimmed > 0 && trimmed < min && styles.counterWarn]}>
          {t('mood-note.aspectNoteHint', { min, count: trimmed })}
        </Text>
      ) : null}
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
    marginBottom: 4,
    lineHeight: 21,
  },
  avg: {
    fontFamily: gameFonts.bold,
    fontSize: 13,
    color: Brand.blue,
    marginBottom: 4,
  },
  noteLabel: {
    fontFamily: gameFonts.bold,
    fontSize: 14,
    color: Brand.ink,
    marginTop: 4,
    marginBottom: 4,
  },
  whyRequired: {
    fontFamily: gameFonts.regular,
    fontSize: 13,
    color: Brand.streak,
    marginBottom: 6,
    lineHeight: 18,
  },
  input: {
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
  counter: {
    marginTop: 6,
    fontFamily: gameFonts.semi,
    fontSize: 12,
    color: '#888',
  },
  counterWarn: {
    color: Brand.streak,
  },
});
