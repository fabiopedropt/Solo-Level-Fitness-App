import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../utils/SubscriptionContext';
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
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.scrollContent}>
        {!isPremium && <AdBanner size="large" />}

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="card-outline" size={20} color="#333333" style={styles.cardTitleIcon} />
            <Text style={styles.cardTitle}>Subscription</Text>
          </View>
          
          <View style={styles.subscriptionStatus}>
            <Ionicons 
              name={isPremium ? "checkmark-circle" : "close-circle-outline"} 
              size={20} 
              color={isPremium ? "#4CAF50" : "#666666"} 
              style={styles.statusIcon} 
            />
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
                style={styles.cancelButton}
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
                  <Ionicons name="calendar-outline" size={24} color="#4a4ae0" style={styles.planIcon} />
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
                  <Ionicons name="calendar" size={24} color="#4a4ae0" style={styles.planIcon} />
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
              
              <TouchableOpacity style={styles.restoreButton}>
                <Text style={styles.restoreText}>Restore Purchases</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="settings-outline" size={20} color="#333333" style={styles.cardTitleIcon} />
            <Text style={styles.cardTitle}>Data Management</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={handleResetProgress}
          >
            <Text style={styles.settingLabel}>Reset Progress</Text>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="information-circle-outline" size={20} color="#333333" style={styles.cardTitleIcon} />
            <Text style={styles.cardTitle}>About</Text>
          </View>
          
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
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
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
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
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
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIcon: {
    marginRight: 4,
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
  planIcon: {
    marginBottom: 8,
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
  cancelButton: {
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
  restoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  restoreText: {
    fontSize: 14,
    color: '#4a4ae0',
  },
  versionText: {
    fontSize: 14,
    color: '#666666',
  },
});