import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';

interface SubscriptionContextType {
  isPremium: boolean;
  purchaseSubscription: () => void;
  cancelSubscription: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: false,
  purchaseSubscription: () => {},
  cancelSubscription: () => {},
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);

  const purchaseSubscription = () => {
    setIsPremium(true);
    Alert.alert('Success', 'You are now a premium user!');
  };

  const cancelSubscription = () => {
    setIsPremium(false);
    Alert.alert('Subscription Cancelled', 'Your premium features have been deactivated.');
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        purchaseSubscription,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);