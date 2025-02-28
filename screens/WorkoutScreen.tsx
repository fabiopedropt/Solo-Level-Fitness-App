import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DailyWorkout, Exercise, UserProgress, getRandomQuote } from '../utils/mockData';
import { getDailyWorkout, getUserProgress, saveDailyWorkout, updateWorkoutCompletion } from '../utils/storage';
import ExerciseCard from '../components/ExerciseCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useTheme } from '../utils/ThemeContext';
import { useSubscription } from '../utils/SubscriptionContext';
import AdBanner from '../components/AdBanner';

type WorkoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Workout'>;

export default function WorkoutScreen() {
  const navigation = useNavigation<WorkoutScreenNavigationProp>();
  const { theme } = useTheme();
  const { isPremium } = useSubscription();
  const [workout, setWorkout] = useState<DailyWorkout | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [instructionsVisible, setInstructionsVisible] = useState(false);
  const [attributeGains, setAttributeGains] = useState<Partial<Record<string, number>>>({});
  const [showAttributeGains, setShowAttributeGains] = useState(false);

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

  const handleIncrement = async (exerciseId: string) => {
    if (!workout) return;
    
    const updatedExercises = workout.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          completed: exercise.completed + (exercise.name === 'Running' ? 0.5 : 1)
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
        // Show attribute gains
        setAttributeGains(result.attributeGains);
        setShowAttributeGains(true);
      }
    }
  };

  const handleDecrement = async (exerciseId: string) => {
    if (!workout) return;
    
    const updatedExercises = workout.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const decrementValue = exercise.name === 'Running' ? 0.5 : 1;
        return {
          ...exercise,
          completed: Math.max(0, exercise.completed - decrementValue)
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

  const handleAttributeGainsClose = () => {
    setShowAttributeGains(false);
    
    // Navigate back to home after showing gains
    navigation.navigate('Home');
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
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>Today's Training</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.closeButton, { color: theme.accent }]}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!isPremium && <AdBanner />}
        
        {workout && workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onIncrement={() => handleIncrement(exercise.id)}
            onDecrement={() => handleDecrement(exercise.id)}
            onViewInstructions={() => showInstructions(exercise)}
            theme={theme}
          />
        ))}
        
        {!isPremium && <AdBanner />}
      </ScrollView>

      {/* Exercise Instructions Modal */}
      <Modal
        visible={instructionsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setInstructionsVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {selectedExercise?.name} Instructions
            </Text>
            <Text style={[styles.modalText, { color: theme.textSecondary }]}>
              {selectedExercise?.instructions}
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: theme.accent }]}
              onPress={() => setInstructionsVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Attribute Gains Modal */}
      <Modal
        visible={showAttributeGains}
        transparent={true}
        animationType="fade"
        onRequestClose={handleAttributeGainsClose}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.attributeModalContent, { backgroundColor: theme.levelCard, borderColor: theme.primary }]}>
            <Text style={styles.attributeModalTitle}>Attributes Increased!</Text>
            
            <View style={styles.attributesList}>
              {Object.entries(attributeGains).map(([key, value]) => (
                <View key={key} style={[styles.attributeItem, { borderBottomColor: 'rgba(255, 255, 255, 0.1)' }]}>
                  <Text style={styles.attributeName}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <Text style={styles.attributeValue}>+{value.toFixed(1)}</Text>
                </View>
              ))}
            </View>
            
            <View style={[styles.quoteContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
              <Text style={styles.quoteText}>"{getRandomQuote()}"</Text>
              <Text style={styles.quoteAuthor}>- Sung Jin-Woo</Text>
            </View>
            
            <TouchableOpacity
              style={[styles.attributeModalButton, { backgroundColor: theme.primary }]}
              onPress={handleAttributeGainsClose}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  attributeModalContent: {
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    borderWidth: 2,
  },
  attributeModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  attributesList: {
    width: '100%',
    marginBottom: 20,
  },
  attributeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  attributeName: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  attributeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quoteContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  quoteAuthor: {
    fontSize: 12,
    color: '#cccccc',
    textAlign: 'right',
  },
  attributeModalButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
});