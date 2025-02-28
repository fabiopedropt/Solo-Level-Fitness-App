import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProgress, initialUserProgress } from '../utils/mockData';
import { getUserProgress, saveUserProgress } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import MonthlyAnalyticsChart from '../components/MonthlyAnalyticsChart';
import AttributeStats from '../components/AttributeStats';
import { useTheme } from '../utils/ThemeContext';
import { useSubscription } from '../utils/SubscriptionContext';
import AdBanner from '../components/AdBanner';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { isPremium } = useSubscription();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get user progress data
      const progressData = await getUserProgress();
      
      // Ensure all required fields exist
      const validatedProgress = validateProgressData(progressData);
      
      setProgress(validatedProgress);
      setError(null);
    } catch (error) {
      console.error('Error loading progress data:', error);
      setError('Failed to load profile data. Please try again.');
      
      // Use initial progress as fallback
      setProgress(initialUserProgress);
    } finally {
      setLoading(false);
    }
  };

  // Validate and fix any missing fields in the progress data
  const validateProgressData = (data: any): UserProgress => {
    // Create a complete progress object with default values for any missing fields
    const validatedProgress: UserProgress = {
      streakDays: data.streakDays ?? initialUserProgress.streakDays,
      totalWorkoutsCompleted: data.totalWorkoutsCompleted ?? initialUserProgress.totalWorkoutsCompleted,
      lastCompletedDate: data.lastCompletedDate ?? initialUserProgress.lastCompletedDate,
      level: data.level ?? initialUserProgress.level,
      experience: data.experience ?? initialUserProgress.experience,
      experienceToNextLevel: data.experienceToNextLevel ?? initialUserProgress.experienceToNextLevel,
      monthlyWorkouts: data.monthlyWorkouts ?? initialUserProgress.monthlyWorkouts,
      attributes: {
        strength: data.attributes?.strength ?? initialUserProgress.attributes.strength,
        endurance: data.attributes?.endurance ?? initialUserProgress.attributes.endurance,
        agility: data.attributes?.agility ?? initialUserProgress.attributes.agility,
        willpower: data.attributes?.willpower ?? initialUserProgress.attributes.willpower,
      }
    };
    
    // Save the validated data back to storage
    saveUserProgress(validatedProgress);
    
    return validatedProgress;
  };

  const resetProgress = async () => {
    if (!progress) return;
    
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await saveUserProgress(initialUserProgress);
            setProgress(initialUserProgress);
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading profile data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.accent }]} onPress={loadData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>Your Profile</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.closeButton, { color: theme.accent }]}>Close</Text>
        </TouchableOpacity>
      </View>

      {progress && (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {!isPremium && <AdBanner />}
          
          <View style={[styles.levelCard, { backgroundColor: theme.levelCard }]}>
            <Text style={[styles.levelLabel, { color: theme.levelCardText }]}>HUNTER LEVEL</Text>
            <Text style={[styles.levelValue, { color: theme.primary }]}>{progress.level}</Text>
            <View style={[styles.expBarContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <View 
                style={[
                  styles.expBar, 
                  { width: `${(progress.experience / progress.experienceToNextLevel) * 100}%`, backgroundColor: theme.primary }
                ]} 
              />
            </View>
            <Text style={[styles.expText, { color: theme.levelCardText }]}>
              {progress.experience} / {progress.experienceToNextLevel} XP
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{progress.streakDays}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Current Streak</Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{progress.totalWorkoutsCompleted}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Workouts</Text>
            </View>
          </View>
          
          <AttributeStats attributes={progress.attributes} />
          
          <MonthlyAnalyticsChart monthlyWorkouts={progress.monthlyWorkouts} />
          
          <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>Last Completed Workout</Text>
            <Text style={[styles.infoValue, { color: theme.textSecondary }]}>
              {progress.lastCompletedDate || 'No workouts completed yet'}
            </Text>
          </View>
          
          <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.infoTitle, { color: theme.text }]}>Solo Leveling Training</Text>
            <Text style={[styles.infoDescription, { color: theme.textSecondary }]}>
              This training regimen is inspired by the daily workout routine from Solo Leveling:
            </Text>
            <View style={styles.exerciseList}>
              <Text style={[styles.exerciseItem, { color: theme.textSecondary }]}>• 100 Push-ups</Text>
              <Text style={[styles.exerciseItem, { color: theme.textSecondary }]}>• 100 Squats</Text>
              <Text style={[styles.exerciseItem, { color: theme.textSecondary }]}>• 10km Running</Text>
              <Text style={[styles.exerciseItem, { color: theme.textSecondary }]}>• 100 Sit-ups</Text>
            </View>
            <Text style={[styles.infoDescription, { color: theme.textSecondary }]}>
              Complete this workout every day to build your strength and endurance!
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.resetButton, { backgroundColor: theme.error }]} 
            onPress={resetProgress}
          >
            <Text style={styles.resetButtonText}>Reset Progress</Text>
          </TouchableOpacity>
          
          {!isPremium && <AdBanner />}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    borderRadius: 12,
    padding: 20,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 16,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  exerciseList: {
    marginVertical: 12,
    paddingLeft: 8,
  },
  exerciseItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  resetButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});