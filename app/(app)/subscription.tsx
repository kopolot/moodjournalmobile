import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useAuth } from '@/contexts/AuthContext';
import PrimaryButton from '@/components/game/PrimaryButton';
import {
  PlanId,
  SubscriptionPlan,
  SubscriptionService,
} from '@/services/subscriptionService';
import { Brand } from '@/styles/colors';
import { gameFonts, gameStyles } from '@/styles/gameStyles';

export default function SubscriptionScreen() {
  const { t } = useI18n();
  const { showToast } = useFeedback();
  const { refreshUser } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [tier, setTier] = useState<PlanId>('free');
  const [selected, setSelected] = useState<'plus' | 'pro'>('plus');
  const [paying, setPaying] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/30');
  const [cvc, setCvc] = useState('123');
  const [name, setName] = useState('');

  const load = useCallback(async () => {
    const current = await SubscriptionService.getCurrent();
    if (current) {
      setTier(current.tier);
      setPlans(current.plans);
    } else {
      setPlans(await SubscriptionService.getPlans());
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const pay = async () => {
    if (!name.trim()) {
      showToast({ tone: 'error', message: t('subscription.cardNameRequired') });
      return;
    }
    try {
      setPaying(true);
      // Fake processing delay — feels like a real gateway
      await new Promise((r) => setTimeout(r, 1400));
      const response = await SubscriptionService.checkout({
        tier: selected,
        cardNumber,
        expiry,
        cvc,
        cardholderName: name.trim(),
      });
      if (!response.success) {
        showToast({
          tone: 'error',
          title: t('error'),
          message: t(response.message?.[0] || 'subscription.payError'),
        });
        return;
      }
      await refreshUser?.();
      showToast({
        tone: 'success',
        title: t('success'),
        message: t('subscription.paySuccess'),
      });
      router.back();
    } catch {
      showToast({ tone: 'error', message: t('subscription.payError') });
    } finally {
      setPaying(false);
    }
  };

  const cancel = async () => {
    const response = await SubscriptionService.cancel();
    if (response.success) {
      await refreshUser?.();
      showToast({ tone: 'success', message: t('subscription.canceled') });
      load();
    }
  };

  return (
    <ScrollView style={gameStyles.screen} contentContainerStyle={gameStyles.scrollContent}>
      <StatusBar style="dark" />
      <View style={[gameStyles.topBar, { paddingHorizontal: 0 }]}>
        <Text style={gameStyles.brand}>{t('subscription.title')}</Text>
      </View>

      <View style={gameStyles.panel}>
        <Text style={gameStyles.panelTitle}>
          {t('subscription.current', { tier: tier.toUpperCase() })}
        </Text>
        <Text style={gameStyles.panelText}>{t('subscription.demoHint')}</Text>
      </View>

      {plans
        .filter((p) => p.id !== 'free')
        .map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[styles.plan, selected === plan.id && styles.planSelected]}
            onPress={() => setSelected(plan.id as 'plus' | 'pro')}
          >
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>
              {plan.priceMonthly.toFixed(2)} {plan.currency}
              {t('subscription.perMonth')}
            </Text>
            <Text style={styles.planFeatures}>{plan.features.join(' · ')}</Text>
          </TouchableOpacity>
        ))}

      <View style={gameStyles.panel}>
        <Text style={gameStyles.panelTitle}>{t('subscription.paymentTitle')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('subscription.cardName')}
          value={name}
          onChangeText={setName}
          placeholderTextColor="#AFAFAF"
        />
        <TextInput
          style={styles.input}
          placeholder={t('subscription.cardNumber')}
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="number-pad"
          placeholderTextColor="#AFAFAF"
        />
        <View style={styles.row}>
          <View style={styles.rowField}>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              value={expiry}
              onChangeText={setExpiry}
              placeholderTextColor="#AFAFAF"
            />
          </View>
          <View style={styles.rowField}>
            <TextInput
              style={styles.input}
              placeholder="CVC"
              value={cvc}
              onChangeText={setCvc}
              keyboardType="number-pad"
              maxLength={4}
              placeholderTextColor="#AFAFAF"
            />
          </View>
        </View>
        <PrimaryButton
          title={paying ? t('subscription.processing') : t('subscription.pay')}
          onPress={pay}
          loading={paying}
        />
      </View>

      {tier !== 'free' ? (
        <PrimaryButton
          title={t('subscription.cancel')}
          variant="secondary"
          onPress={cancel}
          style={{ marginBottom: 24 }}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  plan: {
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    padding: 16,
    marginBottom: 10,
  },
  planSelected: {
    borderColor: Brand.green,
    backgroundColor: Brand.greenSoft,
  },
  planName: {
    fontFamily: gameFonts.extra,
    fontSize: 20,
    color: Brand.ink,
  },
  planPrice: {
    fontFamily: gameFonts.bold,
    fontSize: 16,
    color: Brand.greenDark,
    marginTop: 4,
  },
  planFeatures: {
    fontFamily: gameFonts.regular,
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    fontFamily: gameFonts.semi,
    fontSize: 16,
    color: Brand.ink,
    backgroundColor: '#fff',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  rowField: {
    flex: 1,
    minWidth: 0,
  },
});

