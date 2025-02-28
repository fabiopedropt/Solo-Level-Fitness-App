import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SubscriptionProvider, useSubscription } from './utils/SubscriptionContext';
import ExerciseCard from './components/ExerciseCard';
import AdBanner from './components/AdBanner';
import { 
  DailyWorkout, 
  Exercise, 
  UserProgress, 
  getTodayDateString,
  getRandomQuote,
  initialExercises
} from './utils/mockData';
import {
  getDailyWorkout,
  getUserProgress,
  saveDailyWorkout,
  updateWorkoutCompletion
} from './utils/storage';

// Home Screen
function HomeScreen({ navigation }) {
  const { isPremium } = useSubscription();
  const [workout, setWorkout] = useState<DailyWorkout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const workoutData = await getDailyWorkout();
      setWorkout(workoutData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.text}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView>
        <Text style={styles.title}>Solo Leveling Training</Text>
        <Text style={styles.subtitle}>{getTodayDateString()}</Text>
        
        {!isPremium && <AdBanner />}
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Workout</Text>
          
          {workout && workout.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseRow}>
              <View style={styles.exerciseNameContainer}>
                <Ionicons 
                  name={
                    exercise.name === 'Push-ups' ? 'fitness-outline' :
                    exercise.name === 'Squats' ? 'body-outline' :
                    exercise.name === 'Running' ? 'walk-outline' :
                    exercise.name === 'Sit-ups' ? 'bicycle-outline' : 'barbell-outline'
                  } 
                  size={20} 
                  color="#333333" 
                  style={styles.icon} 
                />
                <Text style={styles.exerciseName}>{exercise.name}</Text>
              </View>
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
              styles.button,
              workout?.completed ? styles.completedButton : null
            ]}
            onPress={() => navigation.navigate('Workout')}
            disabled={workout?.completed}
          >
            <Text style={styles.buttonText}>
              {workout?.completed ? 'Completed' : 'Start Training'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Workout Screen
function WorkoutScreen({ navigation }) {
  const { isPremium } = useSubscription();
  const [workout, setWorkout] = useState<DailyWorkout | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [workoutData, progressData] = await Promise.all([
        getDailyWorkout(),
        getUserProgress(),
      ]);
      
      setWorkout(workoutData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async (exerciseId: string, amount: number = 1) => {
    if (!workout) return;
    
    console.log(`Incrementing exercise ${exerciseId} by ${amount}`);
    
    const updatedExercises = workout.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        // For running, we increment by 0.5 km per unit
        const incrementAmount = exercise.name === 'Running' ? amount * 0.5 : amount;
        console.log(`Actual increment amount: ${incrementAmount}`);
        
        return {
          ...exercise,
          completed: exercise.completed + incrementAmount
        };
      }
      return exercise;
    });
    
    const updatedWorkout = {
      ...workout,
      exercises: updatedExercises,
    };
    
    setWorkout(updatedWorkout);
    await saveDailyWorkout(updatedWorkout);
    
    // Check if all exercises are completed
    if (progress) {
      const result = await updateWorkoutCompletion(updatedWorkout, progress);
      
      // Update progress with the latest data
      setProgress(result.updatedProgress);
      
      // Check if workout was just completed
      const allCompleted = updatedExercises.every(ex => ex.completed >= ex.target);
      if (allCompleted && !workout.completed) {
        // Navigate back to home after completion
        navigation.navigate('Home');
      }
    }
  };

  const handleDecrement = async (exerciseId: string, amount: number = 1) => {
    if (!workout) return;
    
    const updatedExercises = workout.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        // For running, we decrement by 0.5 km per unit
        const decrementAmount = exercise.name === 'Running' ? amount * 0.5 : amount;
        return {
          ...exercise,
          completed: Math.max(0, exercise.completed - decrementAmount)
        };
      }
      return exercise;
    });
    
    const updatedWorkout = {
      ...workout,
      exercises: updatedExercises,
    };
    
    setWorkout(updatedWorkout);
    await saveDailyWorkout(updatedWorkout);
  };

  const showInstructions = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setInstructionsVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <Text style={styles.text}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Training</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {!isPremium && <AdBanner />}
        
        {workout && workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onIncrement={(amount) => handleIncrement(exercise.id, amount)}
            onDecrement={(amount) => handleDecrement(exercise.id, amount)}
            onViewInstructions={() => showInstructions(exercise)}
          />
        ))}
      </ScrollView>

      {/* Exercise Instructions Modal */}
      <Modal
        visible={instructionsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setInstructionsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedExercise?.name} Instructions</Text>
            <Text style={styles.modalText}>{selectedExercise?.instructions}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setInstructionsVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Stats Screen
function StatsScreen() {
  const { isPremium } = useSubscription();
  
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Statistics</Text>
      <Text style={styles.text}>Your training statistics will appear here.</Text>
      {!isPremium && <AdBanner />}
    </SafeAreaView>
  );
}

// Profile Screen
function ProfileScreen() {
  const { isPremium } = useSubscription();
  
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.text}>Your profile information will appear here.</Text>
      {!isPremium && <AdBanner />}
    </SafeAreaView>
  );
}

// Settings Screen
function SettingsScreen() {
  const { isPremium, purchaseMonthly, purchaseYearly, cancelSubscription } = useSubscription();
  
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subscription</Text>
        <Text style={styles.text}>Status: {isPremium ? 'Premium' : 'Free'}</Text>
        
        {isPremium ? (
          <TouchableOpacity style={[styles.button, { backgroundColor: '#f44336' }]} onPress={cancelSubscription}>
            <Text style={styles.buttonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity style={styles.button} onPress={purchaseMonthly}>
              <Text style={styles.buttonText}>Monthly Subscription (2€)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, { marginTop: 8 }]} onPress={purchaseYearly}>
              <Text style={styles.buttonText}>Yearly Subscription (21.6€)</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {!isPremium && <AdBanner size="large" />}
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack Navigator
function HomeStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Workout" component={WorkoutScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SubscriptionProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                if (route.name === 'Home') {
                  return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
                } else if (route.name === 'Stats') {
                  return <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={size} color={color} />;
                } else if (route.name === 'Profile') {
                  return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
                } else if (route.name === 'Settings') {
                  return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />;
                }
                return <Ionicons name="help-outline" size={size} color={color} />;
              },
              tabBarActiveTintColor: '#4a4ae0',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen name="Home" component={HomeStackScreen} />
            <Tab.Screen name="Stats" component={StatsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SubscriptionProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
  },
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
  },
  exerciseName: {
    fontSize: 16,
    color: '#333',
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
  icon: {
    marginRight: 8,
  },
  button: {
    backgroundColor: '#4a4ae0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  completedButton: {
    backgroundColor: '#9E9E9E',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  modalText: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});