import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useSubscription } from '../utils/SubscriptionContext';
import AdBanner from '../components/AdBanner';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { isPremium } = useSubscription();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Your Profile</Text>
        
        {!isPremium && <AdBanner />}
        
        <View style={[styles.card, { backgroundColor: theme.levelCard }]}>
          <Text style={[styles.levelLabel, { color: theme.levelCardText }]}>HUNTER LEVEL</Text>
          <Text style={[styles.levelValue, { color: theme.primary }]}>5</Text>
          <View style={[styles.progressBar, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
            <View style={[styles.progress, { width: '50%', backgroundColor: theme.primary }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.levelCardText }]}>250/500 XP</Text>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Training Stats</Text>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Workouts:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>45</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Current Streak:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>7 days</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Last Workout:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>Today</Text>
          </View>
        </View>
        
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.error }]}>
          <Text style={styles.buttonText}>Reset Progress</Text>
        </TouchableOpacity>
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
  levelLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  levelValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});