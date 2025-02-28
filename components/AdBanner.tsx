import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSubscription } from '../utils/SubscriptionContext';
import { useTheme } from '../utils/ThemeContext';

export default function AdBanner() {
  const { isPremium, purchaseSubscription } = useSubscription();
  const { theme } = useTheme();
  
  if (isPremium) {
    return null; // Don't show ads for premium users
  }
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: theme.card, borderColor: theme.border }
      ]}
    >
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        This is a simulated advertisement
      </Text>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={purchaseSubscription}
      >
        <Text style={styles.buttonText}>Remove Ads</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 16,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});