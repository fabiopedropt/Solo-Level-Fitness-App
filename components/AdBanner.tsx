import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <Ionicons name="megaphone-outline" size={16} color="#666" style={styles.icon} />
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
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  smallBanner: {
    height: 60,
  },
  largeBanner: {
    height: 100,
  },
  icon: {
    marginRight: 4,
  },
  adText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
    flex: 1,
    textAlign: 'center',
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