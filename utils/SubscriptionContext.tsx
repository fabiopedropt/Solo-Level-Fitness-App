import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';

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

  const purchaseMonthly = () => {
    setIsPremium(true);
    Alert.alert('Success', 'You have purchased the monthly subscription!');
  };

  const purchaseYearly = () => {
    setIsPremium(true);
    Alert.alert('Success', 'You have purchased the yearly subscription with 10% discount!');
  };

  const cancelSubscription = () => {
    setIsPremium(false);
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