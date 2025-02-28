import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useSubscription } from '../utils/SubscriptionContext';
import AdBanner from '../components/AdBanner';

export default function StatsScreen() {
  const { theme } = useTheme();
  const { isPremium } = useSubscription();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Your Stats</Text>
        
        {!isPremium && <AdBanner />}
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Level Progress</Text>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Current Level:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>5</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Experience:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>250/500 XP</Text>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Attributes</Text>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Strength:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>7.5</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Endurance:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>6.2</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Agility:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>5.8</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Willpower:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>8.1</Text>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Monthly Progress</Text>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Workouts Completed:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>15</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Current Streak:</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>7 days</Text>
          </View>
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
});