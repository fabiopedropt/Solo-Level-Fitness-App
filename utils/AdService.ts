import { Platform } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

// Use test IDs for development and real IDs for production
const BANNER_AD_UNIT_ID = __DEV__ 
  ? TestIds.BANNER 
  : Platform.OS === 'ios'
    ? 'ca-app-pub-XXXXXXXXXXXXXXXX/NNNNNNNNNN' // iOS banner ad unit ID
    : 'ca-app-pub-XXXXXXXXXXXXXXXX/NNNNNNNNNN'; // Android banner ad unit ID

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
    ? 'ca-app-pub-XXXXXXXXXXXXXXXX/NNNNNNNNNN' // iOS interstitial ad unit ID
    : 'ca-app-pub-XXXXXXXXXXXXXXXX/NNNNNNNNNN'; // Android interstitial ad unit ID

const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === 'ios'
    ? 'ca-app-pub-XXXXXXXXXXXXXXXX/NNNNNNNNNN' // iOS rewarded ad unit ID
    : 'ca-app-pub-XXXXXXXXXXXXXXXX/NNNNNNNNNN'; // Android rewarded ad unit ID

// Preload interstitial ad
const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);
let interstitialLoaded = false;

// Preload rewarded ad
const rewarded = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID);
let rewardedLoaded = false;

export const AdService = {
  // Initialize ads
  initialize: () => {
    // Load interstitial ad
    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitialLoaded = true;
    });
    
    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      interstitialLoaded = false;
      interstitial.load();
    });
    
    interstitial.load();
    
    // Load rewarded ad
    rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      rewardedLoaded = true;
    });
    
    rewarded.addAdEventListener(RewardedAdEventType.CLOSED, () => {
      rewardedLoaded = false;
      rewarded.load();
    });
    
    rewarded.load();
  },
  
  // Banner ad component
  BannerAd: ({ size = BannerAdSize.BANNER }) => {
    return (
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    );
  },
  
  // Show interstitial ad
  showInterstitial: () => {
    if (interstitialLoaded) {
      interstitial.show();
      return true;
    }
    return false;
  },
  
  // Show rewarded ad with callback for reward
  showRewarded: (onRewarded: (amount: number, type: string) => void) => {
    if (rewardedLoaded) {
      rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
        onRewarded(reward.amount, reward.type);
      });
      
      rewarded.show();
      return true;
    }
    return false;
  },
};