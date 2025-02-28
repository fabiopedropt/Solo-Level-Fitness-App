import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { getSubscription, saveSubscription } from './storage';

interface SubscriptionContextType {
  isPremium: boolean;
  purchaseMonthly: () => void;
  purchaseYearly: () => void;
  cancelSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: false,
  purchaseMonthly: () => {},
  purchaseYearly: () => {},
  cancelSubscription: () => {},
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Load subscription status on startup
    const loadSubscription = async () => {
      const premium = await getSubscription();
      setIsPremium(premium);
    };
    
    loadSubscription();
  }, []);

  const purchaseMonthly = async () => {
    setIsPremium(true);
    await saveSubscription(true);
    Alert.alert('Success', 'You have purchased the monthly subscription!');
  };

  const purchaseYearly = async () => {
    setIsPremium(true);
    await saveSubscription(true);
    Alert.alert('Success', 'You have purchased the yearly subscription with 10% discount!');
  };

  const cancelSubscription = async () => {
    setIsPremium(false);
    await saveSubscription(false);
    Alert.alert('Subscription Cancelled', 'Your premium features have been deactivated.');
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        purchaseMonthly,
        purchaseYearly,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);