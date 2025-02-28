import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../utils/SubscriptionContext';
import AdBanner from '../components/AdBanner';
import AttributeStats from '../components/AttributeStats';
import MonthlyAnalyticsChart from '../components/MonthlyAnalyticsChart';
import { UserProgress, initialUserProgress } from '../utils/mockData';
import { getUserProgress, saveUserProgress } from '../utils/storage';

export default function ProfileScreen({ navigation }: any) {
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
      <SafeAreaView style={styles.screen}>
        <Text style={styles.text}>Loading profile data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Profile</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {progress && (
        <ScrollView style={styles.scrollContent}>
          {!isPremium && <AdBanner />}
          
          <View style={styles.levelCard}>
            <Text style={styles.levelLabel}>HUNTER LEVEL</Text>
            <Text style={styles.levelValue}>{progress.level}</Text>
            <View style={styles.expBarContainer}>
              <View 
                style={[
                  styles.expBar, 
                  { width: `${(progress.experience / progress.experienceToNextLevel) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.expText}>
              {progress.experience} / {progress.experienceToNextLevel} XP
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="flame-outline" size={24} color="#4a4ae0" style={styles.statIcon} />
              <Text style={styles.statValue}>{progress.streakDays}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="calendar-outline" size={24} color="#4a4ae0" style={styles.statIcon} />
              <Text style={styles.statValue}>{progress.totalWorkoutsCompleted}</Text>
              <Text style={styles.statLabel}>Total Workouts</Text>
            </View>
          </View>
          
          <AttributeStats attributes={progress.attributes} />
          
          <MonthlyAnalyticsChart monthlyWorkouts={progress.monthlyWorkouts} />
          
          <View style={styles.card}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="time-outline" size={20} color="#333333" style={styles.cardTitleIcon} />
              <Text style={styles.cardTitle}>Last Completed Workout</Text>
            </View>
            <Text style={styles.cardText}>
              {progress.lastCompletedDate || 'No workouts completed yet'}
            </Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.cardTitleContainer}>
              <Ionicons name="information-circle-outline" size={20} color="#333333" style={styles.cardTitleIcon} />
              <Text style={styles.cardTitle}>Solo Leveling Training</Text>
            </View>
            <Text style={styles.cardText}>
              This training regimen is inspired by the daily workout routine from Solo Leveling:
            </Text>
            <View style={styles.exerciseList}>
              <View style={styles.exerciseItem}>
                <Ionicons name="fitness-outline" size={16} color="#555555" style={styles.exerciseIcon} />
                <Text style={styles.exerciseText}>100 Push-ups</Text>
              </View>
              <View style={styles.exerciseItem}>
                <Ionicons name="body-outline" size={16} color="#555555" style={styles.exerciseIcon} />
                <Text style={styles.exerciseText}>100 Squats</Text>
              </View>
              <View style={styles.exerciseItem}>
                <Ionicons name="walk-outline" size={16} color="#555555" style={styles.exerciseIcon} />
                <Text style={styles.exerciseText}>10km Running</Text>
              </View>
              <View style={styles.exerciseItem}>
                <Ionicons name="bicycle-outline" size={16} color="#555555" style={styles.exerciseIcon} />
                <Text style={styles.exerciseText}>100 Sit-ups</Text>
              </View>
            </View>
            <Text style={styles.cardText}>
              Complete this workout every day to build your strength and endurance!
            </Text>
          </View>
          
          <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
            <Text style={styles.resetButtonText}>Reset Progress</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollContent: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  levelLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  levelValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4a4ae0',
    marginBottom: 12,
  },
  expBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    color: '#ffffff',
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
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
    marginBottom: 8,
  },
  cardTitleIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  cardText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 12,
  },
  exerciseList: {
    marginVertical: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseIcon: {
    marginRight: 8,
  },
  exerciseText: {
    fontSize: 14,
    color: '#555555',
  },
  resetButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});