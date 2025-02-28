import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSubscription } from '../utils/SubscriptionContext';

interface AdBannerProps {
  size?: 'banner' | 'large';
}

export default function AdBanner({ size = 'banner' }: AdBannerProps) {
  const { isPremium, purchaseMonthly } = useSubscription();
  
  if (isPremium) {
    return null; // Don't show ads for premium users
  }
  
  return (
    <View style={[styles.container, size === 'large' ? styles.largeBanner : styles.smallBanner]}>
      <Text style={styles.adText}>
        {size === 'large' 
          ? 'This is a simulated full-width advertisement' 
          : 'This is a simulated advertisement'}
      </Text>
      <TouchableOpacity style={styles.upgradeButton} onPress={purchaseMonthly}>
        <Text style={styles.upgradeButtonText}>Remove Ads</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    alignSelf: 'center',
    width: '90%',
  },
  smallBanner: {
    height: 60,
  },
  largeBanner: {
    height: 100,
  },
  adText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  upgradeButton: {
    backgroundColor: '#4a4ae0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});