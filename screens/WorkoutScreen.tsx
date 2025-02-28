import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DailyWorkout, Exercise, UserProgress } from '../utils/mockData';
import { getDailyWorkout, getUserProgress, saveDailyWorkout, updateWorkoutCompletion } from '../utils/storage';
import ExerciseCard from '../components/ExerciseCard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type WorkoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Workout'>;

export default function WorkoutScreen() {
  const navigation = useNavigation<WorkoutScreenNavigationProp>();
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
      await updateWorkoutCompletion(updatedWorkout, progress);
      
      // Reload progress to get updated streak
      const updatedProgress = await getUserProgress();
      setProgress(updatedProgress);
      
      // Check if workout was just completed
      const allCompleted = updatedExercises.every(ex => ex.completed >= ex.target);
      if (allCompleted && !workout.completed) {
        Alert.alert(
          "Workout Completed!",
          "Congratulations! You've completed today's Solo Leveling training.",
          [{ text: "OK", onPress: () => navigation.navigate('Home') }]
        );
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Training</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {workout && workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onIncrement={() => handleIncrement(exercise.id)}
            onDecrement={() => handleDecrement(exercise.id)}
            onViewInstructions={() => showInstructions(exercise)}
          />
        ))}
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 16,
    color: '#2196F3',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});