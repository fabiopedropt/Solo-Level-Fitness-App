import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserProgress } from '../utils/storage';
import { UserProgress, getAnalyticsMonths } from '../utils/mockData';
import MonthlyAnalyticsChart from '../components/MonthlyAnalyticsChart';
import AttributeStats from '../components/AttributeStats';
import { useSubscription } from '../utils/SubscriptionContext';
import AdBanner from '../components/AdBanner';

export default function StatsScreen() {
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading stats...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
      </View>

      <ScrollView style={styles.content}>
        {!isPremium && <AdBanner />}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {progress?.totalWorkoutsCompleted || 0}
              </Text>
              <Text style={styles.statLabel}>
                Total Workouts
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {progress?.streakDays || 0}
              </Text>
              <Text style={styles.statLabel}>
                Current Streak
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {calculateMonthlyCompletionRate()}
              </Text>
              <Text style={styles.statLabel}>
                Completion Rate
              </Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {calculateStreakPercentage()}
              </Text>
              <Text style={styles.statLabel}>
                Streak Goal
              </Text>
            </View>
          </View>
        </View>

        {progress && (
          <>
            <MonthlyAnalyticsChart monthlyWorkouts={progress.monthlyWorkouts} />
            
            <AttributeStats attributes={progress.attributes} />
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Level Progress</Text>
              
              <View style={styles.levelInfo}>
                <View style={styles.levelHeader}>
                  <Text style={styles.levelLabel}>LEVEL</Text>
                  <Text style={styles.levelValue}>{progress.level}</Text>
                </View>
                
                <View style={styles.expBarContainer}>
                  <View 
                    style={[
                      styles.expBar, 
                      { 
                        width: `${(progress.experience / progress.experienceToNextLevel) * 100}%`
                      }
                    ]} 
                  />
                </View>
                
                <Text style={styles.expText}>
                  {progress.experience} / {progress.experienceToNextLevel} XP
                </Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              
              <View style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    Last Workout Completed
                  </Text>
                  <Text style={styles.activityDate}>
                    {progress.lastCompletedDate || 'No workouts completed yet'}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {!isPremium && (
          <View style={styles.premiumPromo}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333333',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a4ae0',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
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
    color: '#666666',
    marginRight: 8,
  },
  levelValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a4ae0',
  },
  expBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  expBar: {
    height: '100%',
    backgroundColor: '#4a4ae0',
    borderRadius: 4,
  },
  expText: {
    fontSize: 12,
    color: '#666666',
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
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#666666',
  },
  premiumPromo: {
    backgroundColor: '#4a4ae0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  promoText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
});