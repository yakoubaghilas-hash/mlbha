import React, { createContext, useContext, useState, useEffect } from 'react';
import subscriptionService, { SubscriptionStatus } from '@/src/services/subscriptionService';

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  startTrial: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isPremium: false,
    expiryDate: null,
    isTrialActive: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeSubscription();
  }, []);

  const initializeSubscription = async () => {
    try {
      await subscriptionService.initialize();
      const status = await subscriptionService.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      // Initialization error handled silently
    } finally {
      setIsLoading(false);
    }
  };

  const startTrial = async () => {
    try {
      setIsLoading(true);
      await subscriptionService.startSubscription();
      const status = await subscriptionService.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      await subscriptionService.restorePurchases();
      const status = await subscriptionService.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptionStatus, startTrial, restorePurchases, isLoading }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}
