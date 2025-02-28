import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../utils/ThemeContext';
import { useSubscription } from '../utils/SubscriptionContext';
import { getUserProgress } from '../utils/storage';
import { UserProgress, getAnalyticsMonths } from '../utils/mockData';
import MonthlyAnalyticsChart from '../components/MonthlyAnalyticsChart';
import AttributeStats from '../components/AttributeStats';
import AdBanner from '../components/AdBanner';

export default function StatsScreen() {
  const { theme } = useTheme();
  const { isPremium } = useSubscription();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const progressData = await getUserProgress();
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate completion rate for the current month
  const calculateMonthlyCompletionRate = (): string => {
    if (!progress) return '0%';
    
    const months = getAnalyticsMonths();
    const currentMonth = months[0]; // First month is the current month
    const daysInMonth = new Date(
      parseInt(currentMonth.split('-')[0]), 
      parseInt(currentMonth.split('-')[1]), 
      0
    ).getDate();
    
    const completedWorkouts = progress.monthlyWorkouts[currentMonth] || 0;
    const completionRate = (completedWorkouts / daysInMonth) * 100;
    
    return `${Math.round(completionRate)}%`;
  };

  // Calculate streak percentage
  const calculateStreakPercentage = (): string => {
    if (!progress) return '0%';
    
    const daysInMonth = 30; // Approximate
    const streakPercentage = (progress.streakDays / daysInMonth) * 100;
    
    return `${Math.min(100, Math.round(streakPercentage))}%`;
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading stats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>Statistics</Text>
      </View>

      <ScrollView style={styles.content}>
        {!isPremium && <AdBanner />}

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Monthly Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: theme.background }]}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {progress?.totalWorkoutsCompleted || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Total Workouts
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.background }]}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {progress?.streakDays || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Current Streak
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.background }]}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {calculateMonthlyCompletionRate()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Completion Rate
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.background }]}>
              <Text style={[styles.statValue, { color: theme.primary }]}>
                {calculateStreakPercentage()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Streak Goal
              </Text>
            </View>
          </View>
        </View>

        {progress && (
          <>
            <MonthlyAnalyticsChart monthlyWorkouts={progress.monthlyWorkouts} />
            
            <AttributeStats attributes={progress.attributes} />
            
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Level Progress</Text>
              
              <View style={styles.levelInfo}>
                <View style={styles.levelHeader}>
                  <Text style={[styles.levelLabel, { color: theme.textSecondary }]}>LEVEL</Text>
                  <Text style={[styles.levelValue, { color: theme.primary }]}>{progress.level}</Text>
                </View>
                
                <View style={[styles.expBarContainer, { backgroundColor: theme.background }]}>
                  <View 
                    style={[
                      styles.expBar, 
                      { 
                        width: `${(progress.experience / progress.experienceToNextLevel) * 100}%`,
                        backgroundColor: theme.primary 
                      }
                    ]} 
                  />
                </View>
                
                <Text style={[styles.expText, { color: theme.textSecondary }]}>
                  {progress.experience} / {progress.experienceToNextLevel} XP
                </Text>
              </View>
            </View>
            
            <View style={[styles.section, { backgroundColor: theme.card }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
              
              <View style={styles.activityItem}>
                <View style={[styles.activityDot, { backgroundColor: theme.secondary }]} />
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: theme.text }]}>
                    Last Workout Completed
                  </Text>
                  <Text style={[styles.activityDate, { color: theme.textSecondary }]}>
                    {progress.lastCompletedDate || 'No workouts completed yet'}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {!isPremium && (
          <View style={[styles.premiumPromo, { backgroundColor: theme.primary }]}>
            <Text style={styles.promoTitle}>Upgrade to Premium</Text>
            <Text style={styles.promoText}>
              Get detailed analytics, export your data, and remove ads.
            </Text>
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  levelInfo: {
    marginBottom: 8,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  levelValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  expBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  expBar: {
    height: '100%',
    borderRadius: 4,
  },
  expText: {
    fontSize: 12,
    textAlign: 'right',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
  },
  premiumPromo: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  promoText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});