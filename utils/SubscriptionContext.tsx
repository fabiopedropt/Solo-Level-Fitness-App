import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface SubscriptionContextType {
  isPremium: boolean;
  expiryDate: Date | null;
  subscriptionType: 'none' | 'monthly' | 'yearly';
  purchaseMonthly: () => Promise<void>;
  purchaseYearly: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPremium: false,
  expiryDate: null,
  subscriptionType: 'none',
  purchaseMonthly: async () => {},
  purchaseYearly: async () => {},
  restorePurchases: async () => {},
  cancelSubscription: async () => {},
});

const SUBSCRIPTION_KEY = 'solo_leveling_subscription';

// Mock subscription data structure
interface SubscriptionData {
  isPremium: boolean;
  expiryDate: string | null;
  subscriptionType: 'none' | 'monthly' | 'yearly';
}

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<'none' | 'monthly' | 'yearly'>('none');
  
  // Load subscription data on startup
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const data = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
        if (data) {
          const subscription: SubscriptionData = JSON.parse(data);
          setIsPremium(subscription.isPremium);
          setSubscriptionType(subscription.subscriptionType);
          
          if (subscription.expiryDate) {
            const expiry = new Date(subscription.expiryDate);
            setExpiryDate(expiry);
            
            // Check if subscription has expired
            if (expiry < new Date()) {
              setIsPremium(false);
              setSubscriptionType('none');
              setExpiryDate(null);
              await saveSubscriptionData(false, null, 'none');
            }
          }
        }
      } catch (error) {
        console.error('Error loading subscription data:', error);
      }
    };
    
    loadSubscription();
  }, []);
  
  // Save subscription data to AsyncStorage
  const saveSubscriptionData = async (
    premium: boolean, 
    expiry: Date | null, 
    type: 'none' | 'monthly' | 'yearly'
  ) => {
    try {
      const data: SubscriptionData = {
        isPremium: premium,
        expiryDate: expiry ? expiry.toISOString() : null,
        subscriptionType: type,
      };
      
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving subscription data:', error);
    }
  };
  
  // Mock purchase functions
  const purchaseMonthly = async () => {
    try {
      // In a real app, this would call the in-app purchase API
      const now = new Date();
      const expiry = new Date(now.setMonth(now.getMonth() + 1));
      
      setIsPremium(true);
      setExpiryDate(expiry);
      setSubscriptionType('monthly');
      
      await saveSubscriptionData(true, expiry, 'monthly');
      
      Alert.alert(
        'Subscription Successful',
        'You have successfully subscribed to the monthly plan. Your subscription will expire on ' + 
        expiry.toLocaleDateString() + '.'
      );
    } catch (error) {
      console.error('Error purchasing monthly subscription:', error);
      Alert.alert('Purchase Failed', 'There was an error processing your purchase.');
    }
  };
  
  const purchaseYearly = async () => {
    try {
      // In a real app, this would call the in-app purchase API
      const now = new Date();
      const expiry = new Date(now.setFullYear(now.getFullYear() + 1));
      
      setIsPremium(true);
      setExpiryDate(expiry);
      setSubscriptionType('yearly');
      
      await saveSubscriptionData(true, expiry, 'yearly');
      
      Alert.alert(
        'Subscription Successful',
        'You have successfully subscribed to the yearly plan. Your subscription will expire on ' + 
        expiry.toLocaleDateString() + '.'
      );
    } catch (error) {
      console.error('Error purchasing yearly subscription:', error);
      Alert.alert('Purchase Failed', 'There was an error processing your purchase.');
    }
  };
  
  const restorePurchases = async () => {
    // In a real app, this would call the in-app purchase API to restore purchases
    Alert.alert(
      'Restore Purchases',
      'In a real app, this would restore your previous purchases. For this demo, please purchase again.'
    );
  };
  
  const cancelSubscription = async () => {
    try {
      // In a real app, this would call the in-app purchase API to cancel the subscription
      setIsPremium(false);
      setExpiryDate(null);
      setSubscriptionType('none');
      
      await saveSubscriptionData(false, null, 'none');
      
      Alert.alert(
        'Subscription Cancelled',
        'Your subscription has been cancelled. You will still have access until the end of your billing period.'
      );
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      Alert.alert('Cancellation Failed', 'There was an error cancelling your subscription.');
    }
  };
  
  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        expiryDate,
        subscriptionType,
        purchaseMonthly,
        purchaseYearly,
        restorePurchases,
        cancelSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);