import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SubscriptionStatus {
  isPremium: boolean;
  expiryDate: string | null;
  isTrialActive: boolean;
  error?: string;
}

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  startTrial: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  isLoading: boolean;
  hasPaymentModuleError: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const DEFAULT_STATUS: SubscriptionStatus = {
  isPremium: false,
  expiryDate: null,
  isTrialActive: false,
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(DEFAULT_STATUS);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPaymentModuleError, setHasPaymentModuleError] = useState(false);

  useEffect(() => {
    // Safe initialization - wrap in try-catch to prevent native crashes
    try {
      setSubscriptionStatus(DEFAULT_STATUS);
    } catch (error) {
      console.error('[SubscriptionProvider] Init error:', error);
      setHasPaymentModuleError(true);
    }
  }, []);

  const startTrial = async () => {
    try {
      setIsLoading(true);
      // Mock implementation - no native IAP calls
      setSubscriptionStatus({
        isPremium: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        isTrialActive: true,
      });
    } catch (error) {
      console.error('[startTrial] Error:', error);
      setSubscriptionStatus({
        ...DEFAULT_STATUS,
        error: 'Failed to start trial',
      });
      setHasPaymentModuleError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      // Mock implementation - no native IAP calls
      setSubscriptionStatus(DEFAULT_STATUS);
    } catch (error) {
      console.error('[restorePurchases] Error:', error);
      setHasPaymentModuleError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const value: SubscriptionContextType = {
    subscriptionStatus,
    startTrial,
    restorePurchases,
    isLoading,
    hasPaymentModuleError,
  };

  return (
    <SubscriptionContext.Provider value={value}>
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
