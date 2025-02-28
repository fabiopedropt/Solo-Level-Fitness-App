import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icon from '@expo/vector-icons';
import { useSubscription } from '../utils/SubscriptionContext';
import AdBanner from '../components/AdBanner';
import ExerciseCard from '../components/ExerciseCard';
import { 
  DailyWorkout, 
  Exercise, 
  UserProgress, 
  getRandomQuote 
} from '../utils/mockData';
import { 
  getDailyWorkout, 
  getUserProgress, 
  saveDailyWorkout, 
  updateWorkoutCompletion 
} from '../utils/storage';

export default function WorkoutScreen({ navigation }: any) {
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
        // Show attribute gains
        setAttributeGains(result.attributeGains);
        setShowAttributeGains(true);
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

  const handleAttributeGainsClose = () => {
    setShowAttributeGains(false);
    
    // Navigate back to home after showing gains
    navigation.navigate('HomeMain');
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
          <Icon.Ionicons name="close" size={24} color="#2196F3" />
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

      {/* Attribute Gains Modal */}
      <Modal
        visible={showAttributeGains}
        transparent={true}
        animationType="fade"
        onRequestClose={handleAttributeGainsClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.attributeModalContent}>
            <Text style={styles.attributeModalTitle}>Attributes Increased!</Text>
            
            <View style={styles.attributesList}>
              {Object.entries(attributeGains).map(([key, value]) => (
                <View key={key} style={styles.attributeItem}>
                  <Text style={styles.attributeName}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <Text style={styles.attributeValue}>+{value.toFixed(1)}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>"{getRandomQuote()}"</Text>
              <Text style={styles.quoteAuthor}>- Sung Jin-Woo</Text>
            </View>
            
            <TouchableOpacity
              style={styles.attributeModalButton}
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

// Styles remain the same
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
  attributeModalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a4ae0',
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: '#4a4ae0',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
});