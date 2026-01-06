import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SUBSCRIPTION_SKU = 'com.cigoff.premium.monthly'; // À définir dans App Store Connect

export interface SubscriptionStatus {
  isPremium: boolean;
  expiryDate: string | null;
  isTrialActive: boolean;
}

class SubscriptionService {
  async initialize() {
    console.log('Subscription service initialized (using mock)');
  }

  async getSubscriptions() {
    try {
      // Retourner un produit simulé
      return [
        {
          productId: SUBSCRIPTION_SKU,
          title: 'CigOff Premium Monthly',
          description: 'Monthly subscription to CigOff Premium',
          price: '9.99',
          currency: 'USD',
        },
      ];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async startSubscription() {
    try {
      // Simulation pour les tests
      console.log('Using simulated purchase');
      await AsyncStorage.setItem('isPremium', 'true');
      await AsyncStorage.setItem('subscriptionExpiry', new Date().toISOString());
      return { success: true };
    } catch (error: any) {
      console.error('Subscription error:', error);
      throw error;
    }
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
    try {
      await this.updateSubscriptionStatus();
      return true;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  }

  async cancelSubscription() {
    // Les utilisateurs doivent annuler via les Paramètres iOS
  }
}

export default new SubscriptionService();
