import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DailyWorkout, UserProgress, getTodayDateString, getRandomQuote } from '../utils/mockData';
import { getDailyWorkout, getUserProgress, getLevelUpNotification, saveLevelUpNotification } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import LevelUpModal from '../components/LevelUpModal';
import { useTheme } from '../utils/ThemeContext';
import { useSubscription } from '../utils/SubscriptionContext';
import AdBanner from '../components/AdBanner';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useTheme();
  const { isPremium, purchaseMonthly, purchaseYearly } = useSubscription();
  const [workout, setWorkout] = useState<DailyWorkout | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<string>('');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(1);
  const [showPremiumPromo, setShowPremiumPromo] = useState(false);

  useEffect(() => {
    loadData();
    setQuote(getRandomQuote());
    
    // Show premium promo randomly for free users
    if (!isPremium && Math.random() > 0.7) {
      setShowPremiumPromo(true);
    }
  }, [isPremium]);

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

  // For debugging - add this function to reset all data
  const resetAllData = async () => {
    Alert.alert(
      "Reset All Data",
      "This will reset all app data. This is for debugging purposes only. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Success", "All data has been reset. Please restart the app.");
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert("Error", "Failed to reset data.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Solo Leveling Training</Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>{getTodayDateString()}</Text>
        </View>

        {progress && (
          <View style={[styles.levelContainer, { backgroundColor: theme.levelCard }]}>
            <View style={styles.levelHeader}>
              <Text style={[styles.levelLabel, { color: theme.levelCardText }]}>LEVEL</Text>
              <Text style={[styles.levelValue, { color: theme.primary }]}>{progress.level}</Text>
            </View>
            <View style={[styles.expBarContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <View 
                style={[
                  styles.expBar, 
                  { width: `${calculateExperiencePercentage()}%`, backgroundColor: theme.primary }
                ]} 
              />
            </View>
            <Text style={[styles.expText, { color: theme.levelCardText }]}>
              {progress.experience} / {progress.experienceToNextLevel} XP
            </Text>
          </View>
        )}

        <View style={[styles.quoteContainer, { backgroundColor: theme.quoteBackground }]}>
          <Text style={[styles.quoteText, { color: theme.quoteText }]}>"{quote}"</Text>
          <Text style={[styles.quoteAuthor, { color: theme.quoteAuthor }]}>- Sung Jin-Woo</Text>
        </View>

        {!isPremium && <AdBanner />}

        {showPremiumPromo && !isPremium && (
          <View style={[styles.premiumPromo, { backgroundColor: theme.primary }]}>
            <Text style={styles.promoTitle}>Upgrade to Premium</Text>
            <Text style={styles.promoText}>
              Remove ads and unlock exclusive features!
            </Text>
            <View style={styles.promoButtons}>
              <TouchableOpacity 
                style={[styles.promoButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                onPress={purchaseMonthly}
              >
                <Text style={styles.promoButtonText}>Monthly</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.promoButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
                onPress={purchaseYearly}
              >
                <Text style={styles.promoButtonText}>Yearly (Save 10%)</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.dismissButton}
              onPress={() => setShowPremiumPromo(false)}
            >
              <Text style={styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        {progress && (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{progress.streakDays}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Day Streak</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{progress.totalWorkoutsCompleted}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Workouts</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{calculateOverallProgress()}%</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Today</Text>
            </View>
          </View>
        )}

        <View style={[styles.workoutCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.workoutTitle, { color: theme.text }]}>Today's Training</Text>
          
          {workout && workout.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseRow}>
              <Text style={[styles.exerciseName, { color: theme.text }]}>{exercise.name}</Text>
              <View style={[styles.exerciseProgress, { backgroundColor: theme.background }]}>
                <View 
                  style={[
                    styles.progressIndicator, 
                    { 
                      width: `${Math.min((exercise.completed / exercise.target) * 100, 100)}%`,
                      backgroundColor: theme.secondary 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.exerciseCount, { color: theme.textSecondary }]}>
                {exercise.completed}/{exercise.target}
              </Text>
            </View>
          ))}
          
          <TouchableOpacity 
            style={[
              styles.startButton,
              workout?.completed ? [styles.completedButton, { backgroundColor: theme.textSecondary }] : { backgroundColor: theme.secondary },
            ]}
            onPress={() => navigation.navigate('Workout')}
            disabled={workout?.completed}
          >
            <Text style={styles.startButtonText}>
              {workout?.completed ? 'Completed' : 'Start Training'}
            </Text>
          </TouchableOpacity>
        </View>

        {__DEV__ && (
          <TouchableOpacity 
            style={styles.debugButton}
            onPress={resetAllData}
          >
            <Text style={styles.debugButtonText}>Reset All Data (Debug)</Text>
          </TouchableOpacity>
        )}
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
  },
  date: {
    fontSize: 16,
    marginTop: 4,
  },
  levelContainer: {
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
  quoteContainer: {
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
    marginBottom: 8,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontSize: 14,
    textAlign: 'right',
  },
  premiumPromo: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  promoText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  promoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  promoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  promoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dismissButton: {
    alignItems: 'center',
  },
  dismissText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
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
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  workoutCard: {
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
    marginBottom: 16,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    width: '30%',
  },
  exerciseProgress: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressIndicator: {
    height: '100%',
    borderRadius: 4,
  },
  exerciseCount: {
    fontSize: 14,
    width: '20%',
    textAlign: 'right',
  },
  startButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  completedButton: {
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});