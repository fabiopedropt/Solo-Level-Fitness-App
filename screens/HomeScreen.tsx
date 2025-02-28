import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DailyWorkout, UserProgress, getTodayDateString, getRandomQuote } from '../utils/mockData';
import { getDailyWorkout, getUserProgress, getLevelUpNotification, saveLevelUpNotification } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import LevelUpModal from '../components/LevelUpModal';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [workout, setWorkout] = useState<DailyWorkout | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<string>('');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(1);

  useEffect(() => {
    loadData();
    setQuote(getRandomQuote());
  }, []);

  const loadData = async () => {
    try {
      const [workoutData, progressData, levelUpNotification] = await Promise.all([
        getDailyWorkout(),
        getUserProgress(),
        getLevelUpNotification(),
      ]);
      
      setWorkout(workoutData);
      setProgress(progressData);
      
      // Check for level up notification
      if (levelUpNotification && !levelUpNotification.shown) {
        setLevelUpLevel(levelUpNotification.level);
        setShowLevelUp(true);
        // Mark as shown
        await saveLevelUpNotification({ ...levelUpNotification, shown: true });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelUpClose = () => {
    setShowLevelUp(false);
  };

  const calculateOverallProgress = (): number => {
    if (!workout) return 0;
    
    const totalCompleted = workout.exercises.reduce(
      (sum, exercise) => sum + (exercise.completed / exercise.target), 
      0
    );
    
    return Math.round((totalCompleted / workout.exercises.length) * 100);
  };

  const calculateExperiencePercentage = (): number => {
    if (!progress) return 0;
    return Math.round((progress.experience / progress.experienceToNextLevel) * 100);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Solo Leveling Training</Text>
          <Text style={styles.date}>{getTodayDateString()}</Text>
        </View>

        {progress && (
          <View style={styles.levelContainer}>
            <View style={styles.levelHeader}>
              <Text style={styles.levelLabel}>LEVEL</Text>
              <Text style={styles.levelValue}>{progress.level}</Text>
            </View>
            <View style={styles.expBarContainer}>
              <View 
                style={[
                  styles.expBar, 
                  { width: `${calculateExperiencePercentage()}%` }
                ]} 
              />
            </View>
            <Text style={styles.expText}>
              {progress.experience} / {progress.experienceToNextLevel} XP
            </Text>
          </View>
        )}

        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>"{quote}"</Text>
          <Text style={styles.quoteAuthor}>- Sung Jin-Woo</Text>
        </View>

        {progress && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progress.streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progress.totalWorkoutsCompleted}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{calculateOverallProgress()}%</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
          </View>
        )}

        <View style={styles.workoutCard}>
          <Text style={styles.workoutTitle}>Today's Training</Text>
          
          {workout && workout.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseRow}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.exerciseProgress}>
                <View 
                  style={[
                    styles.progressIndicator, 
                    { width: `${Math.min((exercise.completed / exercise.target) * 100, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.exerciseCount}>
                {exercise.completed}/{exercise.target}
              </Text>
            </View>
          ))}
          
          <TouchableOpacity 
            style={[
              styles.startButton,
              workout?.completed ? styles.completedButton : null
            ]}
            onPress={() => navigation.navigate('Workout')}
            disabled={workout?.completed}
          >
            <Text style={styles.startButtonText}>
              {workout?.completed ? 'Completed' : 'Start Training'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.profileButtonText}>View Profile</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <LevelUpModal 
        visible={showLevelUp} 
        level={levelUpLevel} 
        onClose={handleLevelUpClose} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  levelContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelLabel: {
    fontSize: 16,
    color: '#666',
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
    color: '#666',
    textAlign: 'right',
  },
  quoteContainer: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    color: '#333',
    width: '30%',
  },
  exerciseProgress: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  exerciseCount: {
    fontSize: 14,
    color: '#666',
    width: '20%',
    textAlign: 'right',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  completedButton: {
    backgroundColor: '#9E9E9E',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});