import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../utils/ThemeContext';
import { useSubscription } from '../utils/SubscriptionContext';
import { Ionicons } from '@expo/vector-icons';
import AdBanner from '../components/AdBanner';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme, setTheme, themeMode } = useTheme();
  const { 
    isPremium, 
    subscriptionType, 
    expiryDate, 
    purchaseMonthly, 
    purchaseYearly, 
    restorePurchases,
    cancelSubscription
  } = useSubscription();

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setTheme(value);
  };

  const formatExpiryDate = () => {
    if (!expiryDate) return 'Not subscribed';
    return expiryDate.toLocaleDateString();
  };

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive",
          onPress: () => Alert.alert("Progress Reset", "All progress has been reset.") 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {!isPremium && <AdBanner size="large" />}

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor="#f4f3f4"
            />
          </View>
          
          <View style={styles.themeSelector}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'light' && [styles.selectedTheme, { borderColor: theme.primary }]
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <View style={styles.themeCircle}>
                <View style={styles.lightThemePreview} />
              </View>
              <Text style={[styles.themeText, { color: theme.text }]}>Light</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'dark' && [styles.selectedTheme, { borderColor: theme.primary }]
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <View style={styles.themeCircle}>
                <View style={styles.darkThemePreview} />
              </View>
              <Text style={[styles.themeText, { color: theme.text }]}>Dark</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'system' && [styles.selectedTheme, { borderColor: theme.primary }]
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <View style={styles.themeCircle}>
                <View style={styles.systemThemePreview} />
              </View>
              <Text style={[styles.themeText, { color: theme.text }]}>System</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Subscription</Text>
          
          <View style={styles.subscriptionStatus}>
            <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>Status:</Text>
            <Text style={[
              styles.statusValue, 
              { color: isPremium ? theme.secondary : theme.textSecondary }
            ]}>
              {isPremium ? 'Premium' : 'Free'}
            </Text>
          </View>
          
          {isPremium && (
            <>
              <View style={styles.subscriptionInfo}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Plan:</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {subscriptionType === 'monthly' ? 'Monthly (2€/month)' : 'Yearly (21.6€/year)'}
                </Text>
              </View>
              
              <View style={styles.subscriptionInfo}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Expires:</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{formatExpiryDate()}</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.subscriptionButton, { backgroundColor: theme.error }]}
                onPress={cancelSubscription}
              >
                <Text style={styles.buttonText}>Cancel Subscription</Text>
              </TouchableOpacity>
            </>
          )}
          
          {!isPremium && (
            <>
              <View style={styles.planContainer}>
                <View style={[styles.planCard, { backgroundColor: theme.background }]}>
                  <Text style={[styles.planTitle, { color: theme.text }]}>Monthly</Text>
                  <Text style={[styles.planPrice, { color: theme.primary }]}>2€</Text>
                  <Text style={[styles.planPeriod, { color: theme.textSecondary }]}>per month</Text>
                  <TouchableOpacity 
                    style={[styles.planButton, { backgroundColor: theme.primary }]}
                    onPress={purchaseMonthly}
                  >
                    <Text style={styles.buttonText}>Subscribe</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={[styles.planCard, { backgroundColor: theme.background }]}>
                  <View style={styles.bestValueTag}>
                    <Text style={styles.bestValueText}>SAVE 10%</Text>
                  </View>
                  <Text style={[styles.planTitle, { color: theme.text }]}>Yearly</Text>
                  <Text style={[styles.planPrice, { color: theme.primary }]}>21.6€</Text>
                  <Text style={[styles.planPeriod, { color: theme.textSecondary }]}>per year</Text>
                  <TouchableOpacity 
                    style={[styles.planButton, { backgroundColor: theme.primary }]}
                    onPress={purchaseYearly}
                  >
                    <Text style={styles.buttonText}>Subscribe</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.restoreButton}
                onPress={restorePurchases}
              >
                <Text style={[styles.restoreText, { color: theme.primary }]}>
                  Restore Purchases
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Management</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={handleResetProgress}
          >
            <Text style={[styles.settingLabel, { color: theme.text }]}>Reset Progress</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Version</Text>
            <Text style={[styles.versionText, { color: theme.textSecondary }]}>1.0.0</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
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
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  themeOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTheme: {
    borderWidth: 2,
  },
  themeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
  },
  lightThemePreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  darkThemePreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#121212',
  },
  systemThemePreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    // Half light, half dark
    overflow: 'hidden',
    position: 'relative',
  },
  themeText: {
    fontSize: 12,
  },
  subscriptionStatus: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscriptionInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  planCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  bestValueTag: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestValueText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  planPeriod: {
    fontSize: 14,
    marginBottom: 16,
  },
  planButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  subscriptionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  restoreText: {
    fontSize: 14,
  },
  versionText: {
    fontSize: 14,
  },
});