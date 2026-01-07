import React, { createContext, useContext, useState, useEffect } from 'react';

interface SubscriptionStatus {
  isPremium: boolean;
  expiryDate: string | null;
  isTrialActive: boolean;
}

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  startTrial: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const DEFAULT_STATUS: SubscriptionStatus = {
  isPremium: false,
  expiryDate: null,
  isTrialActive: false,
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(DEFAULT_STATUS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Don't block app startup - just set default status
    setSubscriptionStatus(DEFAULT_STATUS);
  }, []);

  const startTrial = async () => {
    // Mock implementation
    setSubscriptionStatus({
      isPremium: true,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isTrialActive: true,
    });
  };

  const restorePurchases = async () => {
    // Mock implementation
    setSubscriptionStatus(DEFAULT_STATUS);
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
