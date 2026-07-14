import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useI18n } from '@/contexts/I18nContext';
import { APP_LOGIC_CONFIG } from '@/config/appConfig';
import MoodSelector from '@/components/form/partials/MoodSelector';
import SpecificMoodSection from '@/components/form/SpecificMoodSection';
import PrimaryButton from '@/components/game/PrimaryButton';
import { MoodService, AspectKey } from '@/services/moodService';
import { Brand } from '@/styles/colors';
import { gameFonts, gameStyles } from '@/styles/gameStyles';
import { showAlert } from '@/utils/alert';

type AspectState = Record<AspectKey, { score: number; note: string }>;

export default function MoodNoteScreen() {
  const aspects = APP_LOGIC_CONFIG.specificMoods as AspectKey[];
  const totalSteps = 2 + aspects.length; // overall + aspects + summary
  const { t } = useI18n();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [overallMood, setOverallMood] = useState(0);
  const [overallNote, setOverallNote] = useState('');
  const [specific, setSpecific] = useState<AspectState>(() => {
    const init = {} as AspectState;
    aspects.forEach((key) => {
      init[key] = { score: 0, note: '' };
    });
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [earnedXp, setEarnedXp] = useState<number | null>(null);

  const progress = useMemo(() => step / totalSteps, [step, totalSteps]);

  const canNext = () => {
    if (step === 1) return overallMood > 0;
    if (step > 1 && step <= aspects.length + 1) {
      const key = aspects[step - 2];
      return specific[key].score > 0;
    }
    return true;
  };

  const nextStep = () => {
    if (!canNext()) return;
    setStep((s) => Math.min(totalSteps, s + 1));
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    try {
      setSubmitting(true);
      const payload = {
        overallMood,
        note: overallNote.trim() || null,
        aspects: Object.fromEntries(
          aspects.map((key) => [
            key,
            {
              score: specific[key].score,
              note: specific[key].note.trim() || null,
            },
          ])
        ) as Record<AspectKey, { score: number; note: string | null }>,
      };

      const result = await MoodService.create(payload);
      if (!result) {
        showAlert(t('error'), t('mood-note.submitError'));
        return;
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEarnedXp(result.entry.xpEarned);
      setStep(totalSteps + 1);
    } catch (e) {
      console.error(e);
      showAlert(t('error'), t('mood-note.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndHome = () => {
    router.replace('/(app)');
  };

  const renderBody = () => {
    if (step === totalSteps + 1) {
      return (
        <View style={styles.success}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>{t('mood-note.successTitle')}</Text>
          <Text style={styles.successXp}>+{earnedXp ?? 0} XP</Text>
          <Text style={styles.successBody}>{t('mood-note.successBody')}</Text>
          <PrimaryButton title={t('mood-note.backHome')} onPress={resetAndHome} />
        </View>
      );
    }

    if (step === 1) {
      return (
        <View>
          <Text style={styles.stepTitle}>{t('mood-note.overall.title')}</Text>
          <Text style={styles.stepHint}>{t('mood-note.overall.hint')}</Text>
          <MoodSelector mood={overallMood} setMood={setOverallMood} />
        </View>
      );
    }

    if (step <= aspects.length + 1) {
      const key = aspects[step - 2];
      return (
        <SpecificMoodSection
          aspect={key}
          score={specific[key].score}
          note={specific[key].note}
          setScore={(score) =>
            setSpecific((prev) => ({ ...prev, [key]: { ...prev[key], score } }))
          }
          setNote={(note) =>
            setSpecific((prev) => ({ ...prev, [key]: { ...prev[key], note } }))
          }
        />
      );
    }

    return (
      <View>
        <Text style={styles.stepTitle}>{t('mood-note.summary.title')}</Text>
        <Text style={styles.stepHint}>{t('mood-note.summary.hint')}</Text>
        <View style={styles.summaryList}>
          <Text style={styles.summaryLine}>
            {t('mood-note.overall.short')}: {overallMood}/6
          </Text>
          {aspects.map((key) => (
            <Text key={key} style={styles.summaryLine}>
              {t(`mood-note.aspects.${key}.title`)}: {specific[key].score}/6
            </Text>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder={t('mood-note.overallNotePlaceholder')}
          placeholderTextColor="#AFAFAF"
          value={overallNote}
          onChangeText={setOverallNote}
          multiline
          maxLength={1000}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={gameStyles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <View style={gameStyles.topBar}>
        <Text style={gameStyles.brand}>{t('mood-note.title')}</Text>
        {step <= totalSteps ? (
          <Text style={styles.stepCounter}>
            {step}/{totalSteps}
          </Text>
        ) : null}
      </View>

      {step <= totalSteps ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={gameStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={gameStyles.panel}>{renderBody()}</View>
      </ScrollView>

      {step <= totalSteps ? (
        <View style={styles.footer}>
          {step > 1 ? (
            <PrimaryButton
              title={t('mood-note.back')}
              variant="secondary"
              onPress={prevStep}
              style={{ flex: 1 }}
            />
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {step < totalSteps ? (
            <PrimaryButton
              title={t('mood-note.next')}
              onPress={nextStep}
              disabled={!canNext()}
              style={{ flex: 1.4 }}
            />
          ) : (
            <PrimaryButton
              title={t('mood-note.submit')}
              onPress={submit}
              loading={submitting}
              disabled={!canNext()}
              style={{ flex: 1.4 }}
            />
          )}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  stepCounter: {
    fontFamily: gameFonts.extra,
    fontSize: 16,
    color: Brand.greenDark,
  },
  progressTrack: {
    height: 10,
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D6D6D6',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Brand.green,
  },
  stepTitle: {
    fontFamily: gameFonts.extra,
    fontSize: 24,
    color: Brand.ink,
    marginBottom: 6,
  },
  stepHint: {
    fontFamily: gameFonts.regular,
    fontSize: 15,
    color: '#777',
    marginBottom: 8,
    lineHeight: 21,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 8,
    backgroundColor: Brand.mist,
  },
  input: {
    marginTop: 12,
    minHeight: 100,
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
  summaryList: {
    backgroundColor: Brand.greenSoft,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  summaryLine: {
    fontFamily: gameFonts.bold,
    fontSize: 15,
    color: Brand.ink,
  },
  success: { alignItems: 'center', paddingVertical: 24 },
  successEmoji: { fontSize: 64, marginBottom: 8 },
  successTitle: {
    fontFamily: gameFonts.extra,
    fontSize: 26,
    color: Brand.ink,
    marginBottom: 8,
  },
  successXp: {
    fontFamily: gameFonts.extra,
    fontSize: 32,
    color: Brand.gold,
    marginBottom: 8,
  },
  successBody: {
    fontFamily: gameFonts.regular,
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
});
