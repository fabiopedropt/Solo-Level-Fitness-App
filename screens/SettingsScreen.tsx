import React from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useSubscription } from '../utils/SubscriptionContext';
import { Ionicons } from '@expo/vector-icons';
import AdBanner from '../components/AdBanner';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { isPremium, purchaseMonthly, purchaseYearly } = useSubscription();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        
        {!isPremium && <AdBanner />}
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Appearance</Text>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Subscription</Text>
          <Text style={[styles.subscriptionStatus, { color: theme.text }]}>
            Status: {isPremium ? 'Premium' : 'Free'}
          </Text>
          
          {!isPremium && (
            <View style={styles.subscriptionOptions}>
              <TouchableOpacity 
                style={[styles.subscriptionButton, { backgroundColor: theme.primary }]}
                onPress={purchaseMonthly}
              >
                <Text style={styles.buttonText}>Monthly (2€)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.subscriptionButton, { backgroundColor: theme.primary }]}
                onPress={purchaseYearly}
              >
                <Text style={styles.buttonText}>Yearly (21.6€)</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>About</Text>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Version</Text>
            <Text style={[styles.settingValue, { color: theme.textSecondary }]}>1.0.0</Text>
          </View>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 14,
  },
  subscriptionStatus: {
    fontSize: 16,
    marginBottom: 16,
  },
  subscriptionOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subscriptionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});