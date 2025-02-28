import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { useSubscription } from '../utils/SubscriptionContext';
import { AdService } from '../utils/AdService';

interface AdBannerProps {
  size?: 'banner' | 'large';
}

export default function AdBanner({ size = 'banner' }: AdBannerProps) {
  const { isPremium } = useSubscription();
  
  if (isPremium) {
    return null; // Don't show ads for premium users
  }
  
  const adSize = size === 'large' ? BannerAdSize.MEDIUM_RECTANGLE : BannerAdSize.BANNER;
  
  return (
    <View style={styles.container}>
      <AdService.BannerAd size={adSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});