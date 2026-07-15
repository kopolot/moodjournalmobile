import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useI18n } from '@/contexts/I18nContext';
import { APP_LOGIC_CONFIG } from '@/config/appConfig';
import MoodSelector from '@/components/form/partials/MoodSelector';
import SpecificMoodSection from '@/components/form/SpecificMoodSection';
import PrimaryButton from '@/components/game/PrimaryButton';
import {
  MoodService,
  AspectKey,
  CheckinHints,
  isNoteRequiredForScore,
} from '@/services/moodService';
import { Brand } from '@/styles/colors';
import { gameFonts, gameStyles } from '@/styles/gameStyles';
import { useGameStyles } from '@/hooks/useGameStyles';
import { useFeedback } from '@/contexts/FeedbackContext';
import { createIdempotencyKey } from '@/utils/idempotency';

type AspectState = Record<AspectKey, { score: number; note: string }>;

const noteOk = (value: string, min: number) => value.trim().length >= min;

export default function MoodNoteScreen() {
  const aspects = [...APP_LOGIC_CONFIG.specificMoods];
  const noteMin = APP_LOGIC_CONFIG.aspectNoteMinLength;
  const totalSteps = 2 + aspects.length; // overall + aspects + summary
  const { t } = useI18n();
  const { showToast } = useFeedback();
  const { styles: game, colors, statusBar, scheme } = useGameStyles();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const editId = typeof params.id === 'string' ? params.id : null;
  const isEdit = !!editId;

  const [hints, setHints] = useState<CheckinHints | null>(null);
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
  const [loadingEntry, setLoadingEntry] = useState(!!editId);
  const [earnedXp, setEarnedXp] = useState<number | null>(null);
  const submitIdempotencyKey = useRef<string | null>(null);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        stepCounter: {
          fontFamily: gameFonts.extra,
          fontSize: 16,
          color: Brand.green,
        },
        progressTrack: {
          height: 10,
          marginHorizontal: 20,
          marginBottom: 8,
          backgroundColor: colors.border,
          borderRadius: 999,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: colors.border,
        },
        progressFill: {
          height: '100%',
          backgroundColor: Brand.green,
        },
        stepTitle: {
          fontFamily: gameFonts.extra,
          fontSize: 24,
          color: colors.text,
          marginBottom: 6,
        },
        stepHint: {
          fontFamily: gameFonts.regular,
          fontSize: 15,
          color: colors.muted,
          marginBottom: 8,
          lineHeight: 21,
        },
        footer: {
          flexDirection: 'row',
          gap: 12,
          paddingHorizontal: 20,
          paddingBottom: 28,
          paddingTop: 8,
          backgroundColor: colors.background,
        },
        noteLabel: {
          fontFamily: gameFonts.bold,
          fontSize: 14,
          color: colors.text,
          marginTop: 8,
          marginBottom: 6,
        },
        whyRequired: {
          fontFamily: gameFonts.regular,
          fontSize: 13,
          color: Brand.streak,
          marginBottom: 6,
          lineHeight: 18,
        },
        dropBanner: {
          fontFamily: gameFonts.bold,
          fontSize: 13,
          color: Brand.red,
          marginBottom: 8,
          lineHeight: 18,
        },
        avg: {
          fontFamily: gameFonts.bold,
          fontSize: 13,
          color: Brand.blue,
          marginBottom: 4,
        },
        input: {
          minHeight: 100,
          borderWidth: 2,
          borderColor: colors.border,
          borderRadius: 16,
          padding: 14,
          fontFamily: gameFonts.regular,
          fontSize: 16,
          color: colors.text,
          backgroundColor: colors.inputBackground,
          textAlignVertical: 'top',
        },
        counter: {
          marginTop: 6,
          fontFamily: gameFonts.semi,
          fontSize: 12,
          color: colors.muted,
        },
        counterWarn: {
          color: Brand.streak,
        },
        summaryList: {
          backgroundColor: scheme === 'dark' ? colors.surfaceStrong : Brand.greenSoft,
          borderRadius: 14,
          padding: 14,
          gap: 10,
        },
        summaryItem: {
          gap: 2,
        },
        summaryLine: {
          fontFamily: gameFonts.bold,
          fontSize: 15,
          color: colors.text,
        },
        summaryNote: {
          fontFamily: gameFonts.regular,
          fontSize: 13,
          color: colors.muted,
          lineHeight: 18,
        },
        success: { alignItems: 'center', paddingVertical: 24 },
        successEmoji: { fontSize: 64, marginBottom: 8 },
        successTitle: {
          fontFamily: gameFonts.extra,
          fontSize: 26,
          color: colors.text,
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
          color: colors.muted,
          textAlign: 'center',
          marginBottom: 20,
          lineHeight: 22,
        },
      }),
    [colors, scheme]
  );

  useEffect(() => {
    MoodService.getCheckinHints().then(setHints);
  }, []);

  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    setLoadingEntry(true);
    MoodService.get(editId).then((entry) => {
      if (cancelled || !entry) {
        if (!cancelled && !entry) {
          showToast({ tone: 'error', message: t('mood-note.loadError') });
          router.replace('/(app)/history');
        }
        return;
      }
      setOverallMood(entry.overallMood);
      setOverallNote(entry.note ?? '');
      const next = {} as AspectState;
      aspects.forEach((key) => {
        next[key] = {
          score: entry.aspects?.[key]?.score ?? 0,
          note: entry.aspects?.[key]?.note ?? '',
        };
      });
      setSpecific(next);
      setLoadingEntry(false);
    });
    return () => {
      cancelled = true;
    };
  }, [editId]);

  const progress = useMemo(() => step / totalSteps, [step, totalSteps]);
  const deviation = hints?.deviationThreshold ?? 1;
  const drop = !!hints?.noticeableDrop;

  const overallNoteRequired = isNoteRequiredForScore(
    overallMood,
    hints?.overallAverage,
    drop,
    deviation
  );

  const aspectNoteRequired = (key: AspectKey, score: number) =>
    isNoteRequiredForScore(score, hints?.aspectAverages?.[key], drop, deviation);

  const canNext = () => {
    if (step === 1) {
      if (overallMood <= 0) return false;
      return !overallNoteRequired || noteOk(overallNote, noteMin);
    }
    if (step > 1 && step <= aspects.length + 1) {
      const key = aspects[step - 2];
      if (specific[key].score <= 0) return false;
      return !aspectNoteRequired(key, specific[key].score) || noteOk(specific[key].note, noteMin);
    }
    return true;
  };

  const nextStep = () => {
    if (!canNext()) {
      showToast({
        tone: 'info',
        title: t('mood-note.incompleteTitle'),
        message: t('mood-note.incompleteBody', { min: noteMin }),
      });
      return;
    }
    setStep((s) => Math.min(totalSteps, s + 1));
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    try {
      setSubmitting(true);
      if (!submitIdempotencyKey.current) {
        submitIdempotencyKey.current = createIdempotencyKey();
      }
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

      if (isEdit && editId) {
        const entry = await MoodService.update(editId, payload);
        if (!entry) {
          showToast({ tone: 'error', title: t('error'), message: t('mood-note.submitError') });
          return;
        }
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setEarnedXp(entry.xpEarned);
        setStep(totalSteps + 1);
        return;
      }

      const result = await MoodService.create(payload, {
        idempotencyKey: submitIdempotencyKey.current,
      });
      if (!result) {
        showToast({ tone: 'error', title: t('error'), message: t('mood-note.submitError') });
        return;
      }

      submitIdempotencyKey.current = null;
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setEarnedXp(result.entry.xpEarned);
      setStep(totalSteps + 1);
    } catch (e) {
      console.error(e);
      showToast({ tone: 'error', title: t('error'), message: t('mood-note.submitError') });
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndHome = () => {
    router.replace(isEdit ? '/(app)/history' : '/(app)');
  };

  if (loadingEntry) {
    return (
      <View style={[game.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={game.panelText}>{t('mood-note.loading')}</Text>
      </View>
    );
  }

  const renderBody = () => {
    if (step === totalSteps + 1) {
      return (
        <View style={styles.success}>
          <Text style={styles.successEmoji}>{isEdit ? '✏️' : '🎉'}</Text>
          <Text style={styles.successTitle}>
            {isEdit ? t('mood-note.editSuccessTitle') : t('mood-note.successTitle')}
          </Text>
          {!isEdit ? <Text style={styles.successXp}>+{earnedXp ?? 0} XP</Text> : null}
          <Text style={styles.successBody}>
            {isEdit ? t('mood-note.editSuccessBody') : t('mood-note.successBody')}
          </Text>
          <PrimaryButton
            title={isEdit ? t('mood-note.backHistory') : t('mood-note.backHome')}
            onPress={resetAndHome}
          />
        </View>
      );
    }

    if (step === 1) {
      return (
        <View>
          <Text style={styles.stepTitle}>{t('mood-note.overall.title')}</Text>
          <Text style={styles.stepHint}>{t('mood-note.overall.hint')}</Text>
          {drop ? <Text style={styles.dropBanner}>{t('mood-note.dropBanner')}</Text> : null}
          {hints?.overallAverage != null ? (
            <Text style={styles.avg}>
              {t('mood-note.yourAverage', { value: hints.overallAverage.toFixed(1) })}
            </Text>
          ) : null}
          <MoodSelector mood={overallMood} setMood={setOverallMood} />
          <Text style={styles.noteLabel}>
            {overallNoteRequired
              ? t('mood-note.overallNoteRequired')
              : t('mood-note.aspectNoteOptional')}
          </Text>
          {overallNoteRequired ? (
            <Text style={styles.whyRequired}>{t('mood-note.whyRequired')}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder={t('mood-note.overallNotePlaceholder')}
            placeholderTextColor={colors.muted}
            value={overallNote}
            onChangeText={setOverallNote}
            multiline
            maxLength={1000}
          />
          {overallNoteRequired || overallNote.trim().length > 0 ? (
            <Text
              style={[
                styles.counter,
                overallNote.trim().length > 0 &&
                  overallNote.trim().length < noteMin &&
                  styles.counterWarn,
              ]}
            >
              {t('mood-note.aspectNoteHint', {
                min: noteMin,
                count: overallNote.trim().length,
              })}
            </Text>
          ) : null}
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
          noteRequired={aspectNoteRequired(key, specific[key].score)}
          average={hints?.aspectAverages?.[key]}
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
          <Text style={styles.summaryNote} numberOfLines={2}>
            {overallNote.trim()}
          </Text>
          {aspects.map((key) => (
            <View key={key} style={styles.summaryItem}>
              <Text style={styles.summaryLine}>
                {t(`mood-note.aspects.${key}.title`)}: {specific[key].score}/6
              </Text>
              <Text style={styles.summaryNote} numberOfLines={2}>
                {specific[key].note.trim()}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={game.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style={statusBar} />
      <View style={game.topBar}>
        <Text style={game.brand}>
          {isEdit ? t('mood-note.editTitle') : t('mood-note.title')}
        </Text>
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
        contentContainerStyle={game.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={game.panel}>{renderBody()}</View>
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
              title={isEdit ? t('mood-note.saveEdit') : t('mood-note.submit')}
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
