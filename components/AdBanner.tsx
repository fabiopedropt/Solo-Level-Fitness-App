import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSubscription } from '../utils/SubscriptionContext';
import { useTheme } from '../utils/ThemeContext';

export default function AdBanner() {
  const { isPremium, purchaseMonthly } = useSubscription();
  const { theme } = useTheme();
  
  if (isPremium) {
    return null;
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.text, { color: theme.text }]}>This is an advertisement</Text>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={purchaseMonthly}
      >
        <Text style={styles.buttonText}>Remove Ads</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  text: {
    marginBottom: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});