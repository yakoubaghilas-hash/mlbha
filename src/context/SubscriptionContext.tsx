import React, { createContext, useContext, useState, useEffect } from 'react';
import subscriptionService, { SubscriptionStatus } from '@/src/services/subscriptionService';
import { safeAsync } from '@/src/utils/safeInitialization';

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  startTrial: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const DEFAULT_SUBSCRIPTION_STATUS: SubscriptionStatus = {
  isPremium: false,
  expiryDate: null,
  isTrialActive: false,
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(
    DEFAULT_SUBSCRIPTION_STATUS
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeSubscription = async () => {
      try {
        // Try to initialize subscription service (non-blocking)
        await safeAsync(
          () => subscriptionService.initialize(),
          undefined
        );

        // Try to get subscription status
        const status = await safeAsync(
          () => subscriptionService.getSubscriptionStatus(),
          DEFAULT_SUBSCRIPTION_STATUS
        );

        if (isMounted) {
          setSubscriptionStatus(status);
        }
      } catch (error) {
        // Use default if everything fails
        if (isMounted) {
          setSubscriptionStatus(DEFAULT_SUBSCRIPTION_STATUS);
        }
      }
    };

    // Initialize in background without blocking
    initializeSubscription();

    return () => {
      isMounted = false;
    };
  }, []);

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
