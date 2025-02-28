import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '../utils/SubscriptionContext';
import { Ionicons } from '@expo/vector-icons';
import AdBanner from '../components/AdBanner';

export default function SettingsScreen() {
  const { isPremium, purchaseMonthly, purchaseYearly, cancelSubscription } = useSubscription();

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {!isPremium && <AdBanner size="large" />}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          
          <View style={styles.subscriptionStatus}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text style={[
              styles.statusValue, 
              { color: isPremium ? '#4CAF50' : '#666666' }
            ]}>
              {isPremium ? 'Premium' : 'Free'}
            </Text>
          </View>
          
          {isPremium && (
            <>
              <View style={styles.subscriptionInfo}>
                <Text style={styles.infoLabel}>Plan:</Text>
                <Text style={styles.infoValue}>Premium</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.subscriptionButton}
                onPress={cancelSubscription}
              >
                <Text style={styles.buttonText}>Cancel Subscription</Text>
              </TouchableOpacity>
            </>
          )}
          
          {!isPremium && (
            <>
              <View style={styles.planContainer}>
                <View style={styles.planCard}>
                  <Text style={styles.planTitle}>Monthly</Text>
                  <Text style={styles.planPrice}>2€</Text>
                  <Text style={styles.planPeriod}>per month</Text>
                  <TouchableOpacity 
                    style={styles.planButton}
                    onPress={purchaseMonthly}
                  >
                    <Text style={styles.buttonText}>Subscribe</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.planCard}>
                  <View style={styles.bestValueTag}>
                    <Text style={styles.bestValueText}>SAVE 10%</Text>
                  </View>
                  <Text style={styles.planTitle}>Yearly</Text>
                  <Text style={styles.planPrice}>21.6€</Text>
                  <Text style={styles.planPeriod}>per year</Text>
                  <TouchableOpacity 
                    style={styles.planButton}
                    onPress={purchaseYearly}
                  >
                    <Text style={styles.buttonText}>Subscribe</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={handleResetProgress}
          >
            <Text style={styles.settingLabel}>Reset Progress</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
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
    color: '#333333',
  },
  subscriptionStatus: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    color: '#666666',
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
    color: '#666666',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
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
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
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
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a4ae0',
  },
  planPeriod: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  planButton: {
    backgroundColor: '#4a4ae0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  subscriptionButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  versionText: {
    fontSize: 14,
    color: '#666666',
  },
});