import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SubscriptionStatus {
  isPremium: boolean;
  expiryDate: string | null;
  isTrialActive: boolean;
}

// Mock service for Web platform - doesn't use react-native-iap
class SubscriptionServiceWeb {
  async initialize() {
    console.log('Web: Subscription service initialized (mocked)');
  }

  async getSubscriptions() {
    return [
      {
        productId: 'com.cigoff.premium.monthly',
        title: 'CigOff Premium Monthly',
        description: 'Monthly subscription to CigOff Premium',
        price: '9.99',
        currency: 'USD',
      },
    ];
  }

  async startSubscription() {
    console.log('Web: Starting subscription (simulated)');
    await AsyncStorage.setItem('isPremium', 'true');
    await AsyncStorage.setItem('subscriptionExpiry', new Date().toISOString());
    return { success: true };
  }

  async updateSubscriptionStatus() {
    return false;
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const isPremium = await AsyncStorage.getItem('isPremium');
      const expiryDate = await AsyncStorage.getItem('subscriptionExpiry');
      
      return {
        isPremium: isPremium === 'true',
        expiryDate,
        isTrialActive: !isPremium,
      };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return {
        isPremium: false,
        expiryDate: null,
        isTrialActive: false,
      };
    }
  }

  async restorePurchases() {
    return true;
  }

  async cancelSubscription() {
    // No-op for web
  }
}

export default new SubscriptionServiceWeb();
