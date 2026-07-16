import React, { useCallback, useRef, useState } from 'react';
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
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useI18n } from '@/contexts/I18nContext';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useAuth } from '@/contexts/AuthContext';
import PrimaryButton from '@/components/game/PrimaryButton';
import {
  BillingProvider,
  PlanId,
  SubscriptionPlan,
  SubscriptionService,
} from '@/services/subscriptionService';
import { Brand } from '@/styles/colors';
import { gameFonts, gameStyles } from '@/styles/gameStyles';
import { createIdempotencyKey } from '@/utils/idempotency';

WebBrowser.maybeCompleteAuthSession();

export default function SubscriptionScreen() {
  const { t } = useI18n();
  const { showToast } = useFeedback();
  const { refreshUser } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [tier, setTier] = useState<PlanId>('free');
  const [billingProvider, setBillingProvider] = useState<BillingProvider>('mock');
  const [selected, setSelected] = useState<'plus' | 'pro'>('plus');
  const [paying, setPaying] = useState(false);
  const payIdempotencyKey = useRef<string | null>(null);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/30');
  const [cvc, setCvc] = useState('123');
  const [name, setName] = useState('');

  const load = useCallback(async () => {
    const current = await SubscriptionService.getCurrent();
    if (current) {
      setTier(current.tier);
      setPlans(current.plans);
      setBillingProvider(current.billingProvider);
      return;
    }
    const catalog = await SubscriptionService.getPlans();
    setPlans(catalog.plans);
    setBillingProvider(catalog.billingProvider);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const finishSuccess = async () => {
    payIdempotencyKey.current = null;
    await refreshUser?.();
    await load();
    showToast({
      tone: 'success',
      title: t('success'),
      message: t('subscription.paySuccess'),
    });
    router.back();
  };

  const payMock = async () => {
    if (!name.trim()) {
      showToast({ tone: 'error', message: t('subscription.cardNameRequired') });
      return;
    }
    try {
      setPaying(true);
      if (!payIdempotencyKey.current) {
        payIdempotencyKey.current = createIdempotencyKey();
      }
      await new Promise((r) => setTimeout(r, 900));
      const response = await SubscriptionService.checkout(
        {
          tier: selected,
          cardNumber,
          expiry,
          cvc,
          cardholderName: name.trim(),
        },
        { idempotencyKey: payIdempotencyKey.current }
      );
      if (!response.success) {
        showToast({
          tone: 'error',
          title: t('error'),
          message: t(response.message?.[0] || 'subscription.payError'),
        });
        return;
      }
      await finishSuccess();
    } catch {
      showToast({ tone: 'error', message: t('subscription.payError') });
    } finally {
      setPaying(false);
    }
  };

  const payStripe = async () => {
    try {
      setPaying(true);
      if (!payIdempotencyKey.current) {
        payIdempotencyKey.current = createIdempotencyKey();
      }
      const successUrl = Linking.createURL('subscription/success');
      const cancelUrl = Linking.createURL('subscription/cancel');
      const response = await SubscriptionService.checkout(
        {
          tier: selected,
          successUrl,
          cancelUrl,
        },
        { idempotencyKey: payIdempotencyKey.current }
      );
      if (!response.success) {
        showToast({
          tone: 'error',
          title: t('error'),
          message: t(response.message?.[0] || 'subscription.payError'),
        });
        return;
      }
      const data = response.data as { checkoutUrl?: string };
      if (!data?.checkoutUrl) {
        showToast({ tone: 'error', message: t('subscription.payError') });
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.checkoutUrl, successUrl);
      if (result.type === 'success') {
        await finishSuccess();
        return;
      }
      if (result.type === 'cancel' || result.type === 'dismiss') {
        showToast({ tone: 'info', message: t('subscription.checkoutCanceled') });
        payIdempotencyKey.current = null;
        await load();
      }
    } catch {
      showToast({ tone: 'error', message: t('subscription.payError') });
    } finally {
      setPaying(false);
    }
  };

  const pay = () => (billingProvider === 'stripe' ? payStripe() : payMock());

  const cancel = async () => {
    const response = await SubscriptionService.cancel();
    if (response.success) {
      await refreshUser?.();
      showToast({
        tone: 'success',
        message:
          billingProvider === 'stripe'
            ? t('subscription.cancelAtPeriodEnd')
            : t('subscription.canceled'),
      });
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
        <Text style={gameStyles.panelText}>
          {billingProvider === 'stripe'
            ? t('subscription.stripeHint')
            : t('subscription.demoHint')}
        </Text>
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

      {billingProvider === 'mock' ? (
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
      ) : (
        <View style={gameStyles.panel}>
          <Text style={gameStyles.panelTitle}>{t('subscription.stripeTitle')}</Text>
          <Text style={gameStyles.panelText}>{t('subscription.stripeBody')}</Text>
          <PrimaryButton
            title={paying ? t('subscription.processing') : t('subscription.payStripe')}
            onPress={pay}
            loading={paying}
            style={{ marginTop: 12 }}
          />
        </View>
      )}

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
