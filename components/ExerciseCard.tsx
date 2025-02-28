import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Exercise } from '../utils/mockData';
import * as Icon from '@expo/vector-icons';

interface ExerciseCardProps {
  exercise: Exercise;
  onIncrement: (amount: number) => void;
  onDecrement: (amount: number) => void;
  onViewInstructions: () => void;
}

export default function ExerciseCard({ 
  exercise, 
  onIncrement, 
  onDecrement, 
  onViewInstructions 
}: ExerciseCardProps) {
  const progress = Math.min((exercise.completed / exercise.target) * 100, 100);
  
  // Get the appropriate icon for each exercise
  const getExerciseIcon = () => {
    switch(exercise.name) {
      case 'Push-ups':
        return 'fitness-outline';
      case 'Squats':
        return 'body-outline';
      case 'Running':
        return 'walk-outline';
      case 'Sit-ups':
        return 'bicycle-outline';
      default:
        return 'barbell-outline';
    }
  };
  
  // Determine if we should show the +5/+10 buttons
  // For running, we'll show +2.5/+5 km instead
  const isRunning = exercise.name === 'Running';
  const increment5Label = isRunning ? '+2.5' : '+5';
  const increment10Label = isRunning ? '+5' : '+10';
  const increment5Value = isRunning ? 5 : 5; // 5 half-kilometers = 2.5km
  const increment10Value = isRunning ? 10 : 10; // 10 half-kilometers = 5km
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Icon.Ionicons name={getExerciseIcon()} size={24} color="#333333" style={styles.icon} />
          <Text style={styles.title}>{exercise.name}</Text>
        </View>
        <Text style={styles.progress}>
          {exercise.completed}/{exercise.target} {exercise.unit}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      
      <View style={styles.controlsContainer}>
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.button, styles.decrementButton]}
            onPress={() => onDecrement(1)}
            disabled={exercise.completed <= 0}
          >
            <Icon.Ionicons name="remove" size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.instructionsButton}
            onPress={onViewInstructions}
          >
            <Icon.Ionicons name="information-circle-outline" size={16} color="#555555" style={styles.instructionIcon} />
            <Text style={styles.instructionsText}>Instructions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.incrementButton]}
            onPress={() => onIncrement(1)}
          >
            <Icon.Ionicons name="add" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        {/* Quick increment options */}
        <View style={styles.quickIncrementContainer}>
          <TouchableOpacity 
            style={styles.quickIncrementButton}
            onPress={() => onIncrement(increment5Value)}
          >
            <Text style={styles.quickIncrementText}>{increment5Label}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickIncrementButton}
            onPress={() => onIncrement(increment10Value)}
          >
            <Text style={styles.quickIncrementText}>{increment10Label}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  progress: {
    fontSize: 16,
    color: '#555555',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  controlsContainer: {
    gap: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decrementButton: {
    backgroundColor: '#f44336',
  },
  incrementButton: {
    backgroundColor: '#4CAF50',
  },
  instructionsButton: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    alignItems: 'center',
  },
  instructionIcon: {
    marginRight: 4,
  },
  instructionsText: {
    color: '#555555',
    fontSize: 14,
  },
  quickIncrementContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  quickIncrementButton: {
    backgroundColor: '#4a4ae0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickIncrementText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});