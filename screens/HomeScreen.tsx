import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useSubscription } from '../utils/SubscriptionContext';
import AdBanner from '../components/AdBanner';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { isPremium } = useSubscription();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Solo Leveling Training</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Complete your daily training to level up!
        </Text>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Today's Workout</Text>
          <Text style={[styles.exercise, { color: theme.text }]}>• 100 Push-ups</Text>
          <Text style={[styles.exercise, { color: theme.text }]}>• 100 Squats</Text>
          <Text style={[styles.exercise, { color: theme.text }]}>• 10km Run</Text>
          <Text style={[styles.exercise, { color: theme.text }]}>• 100 Sit-ups</Text>
        </View>
        
        {!isPremium && <AdBanner />}
        
        <View style={[styles.quoteCard, { backgroundColor: theme.quoteBackground }]}>
          <Text style={[styles.quote, { color: theme.quoteText }]}>
            "I alone level up."
          </Text>
          <Text style={[styles.quoteAuthor, { color: theme.quoteAuthor }]}>
            - Sung Jin-Woo
          </Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
  exercise: {
    fontSize: 16,
    marginBottom: 8,
  },
  quoteCard: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontSize: 14,
    textAlign: 'right',
  },
});