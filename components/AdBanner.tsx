import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSubscription } from '../utils/SubscriptionContext';
import { useTheme } from '../utils/ThemeContext';

interface AdBannerProps {
  size?: 'banner' | 'large';
}

export default function AdBanner({ size = 'banner' }: AdBannerProps) {
  const { isPremium } = useSubscription();
  const { theme } = useTheme();
  
  if (isPremium) {
    return null; // Don't show ads for premium users
  }
  
  return (
    <View 
      style={[
        styles.container, 
        size === 'large' ? styles.largeBanner : styles.smallBanner,
        { backgroundColor: theme.card, borderColor: theme.border }
      ]}
    >
      <Text style={[styles.adText, { color: theme.textSecondary }]}>
        {size === 'large' 
          ? 'This is a simulated full-width advertisement' 
          : 'This is a simulated advertisement'}
      </Text>
      <TouchableOpacity 
        style={[styles.upgradeButton, { backgroundColor: theme.primary }]}
        onPress={() => {}}
      >
        <Text style={styles.upgradeButtonText}>Remove Ads</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  smallBanner: {
    height: 60,
  },
  largeBanner: {
    height: 100,
  },
  adText: {
    fontSize: 12,
    marginBottom: 4,
  },
  upgradeButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});