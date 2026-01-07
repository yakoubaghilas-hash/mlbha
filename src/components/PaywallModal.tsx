import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useSubscription } from '@/src/context/SubscriptionContext';
import { useLanguage } from '@/src/context/LanguageContext';
import i18n from '@/src/i18n';

// Safe wrapper component
export function PaywallModal() {
  try {
    return <PaywallModalContent />;
  } catch (error) {
    console.error('[PaywallModal] Error rendering:', error);
    return null;
  }
}

function PaywallModalContent() {
  const { subscriptionStatus, startTrial, isLoading } = useSubscription();
  const { language } = useLanguage();
  const [agreed, setAgreed] = useState(false);

  if (subscriptionStatus.isPremium) {
    return null;
  }

  // Create translations object that updates when language changes
  const translations = useMemo(() => ({
    unlock_premium: i18n.t('unlock_premium'),
    access_all_tools: i18n.t('access_all_tools'),
    premium_trial: i18n.t('premium_trial'),
    premium_price: i18n.t('premium_price'),
    premium_report: i18n.t('premium_report'),
    premium_challenges: i18n.t('premium_challenges'),
    premium_reduction_plan: i18n.t('premium_reduction_plan'),
    premium_notifications: i18n.t('premium_notifications'),
    premium_trial_button: i18n.t('premium_trial_button'),
    premium_terms: i18n.t('premium_terms'),
    premium_auto_renew: i18n.t('premium_auto_renew'),
    premium_restore: i18n.t('premium_restore'),
    premium_activated: i18n.t('premium_activated'),
    premium_activated_desc: i18n.t('premium_activated_desc'),
    premium_error: i18n.t('premium_error'),
    premium_error_desc: i18n.t('premium_error_desc'),
  }), [language]);

  const handleStartTrial = async () => {
    if (!agreed) {
      Alert.alert(
        translations.premium_error,
        'Please accept the terms and conditions'
      );
      return;
    }

    try {
      await startTrial();
      Alert.alert(
        translations.premium_activated,
        translations.premium_activated_desc
      );
      setAgreed(false);
    } catch (error) {
      Alert.alert(
        translations.premium_error,
        translations.premium_error_desc
      );
    }
  };

  return (
    <Modal
      visible={!subscriptionStatus.isPremium}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.emoji}>🚀</Text>
            <Text style={styles.title}>{translations.unlock_premium}</Text>
            <Text style={styles.subtitle}>
              {translations.access_all_tools}
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📊</Text>
                <Text style={styles.featureText}>{translations.premium_report}</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text style={styles.featureText}>{translations.premium_challenges}</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>📈</Text>
                <Text style={styles.featureText}>{translations.premium_reduction_plan}</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🔔</Text>
                <Text style={styles.featureText}>{translations.premium_notifications}</Text>
              </View>
            </View>

            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Limited offer</Text>
              <Text style={styles.price}>{translations.premium_trial}</Text>
              <Text style={styles.priceSmall}>
                {translations.premium_price}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreed(!agreed)}
            >
              <View style={[styles.checkboxBox, agreed && styles.checkboxBoxChecked]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                {translations.premium_terms}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, !agreed && styles.buttonDisabled]}
              onPress={handleStartTrial}
              disabled={!agreed || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>{translations.premium_trial_button}</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              {translations.premium_auto_renew}
            </Text>

            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.restoreLink}>{translations.premium_restore}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresList: {
    width: '100%',
    marginBottom: 24,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  priceSection: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  priceLabel: {
    fontSize: 12,
    color: '#0078D4',
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0078D4',
    marginBottom: 4,
  },
  priceSmall: {
    fontSize: 12,
    color: '#666666',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cccccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  checkboxBoxChecked: {
    backgroundColor: '#0078D4',
    borderColor: '#0078D4',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 11,
    color: '#666666',
    flex: 1,
    lineHeight: 16,
  },
  button: {
    backgroundColor: '#0078D4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 14,
  },
  restoreLink: {
    fontSize: 12,
    color: '#0078D4',
    textDecorationLine: 'underline',
  },
});
