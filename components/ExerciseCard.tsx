import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Exercise } from '../utils/mockData';

interface ExerciseCardProps {
  exercise: Exercise;
  onIncrement: () => void;
  onDecrement: () => void;
  onViewInstructions: () => void;
}

export default function ExerciseCard({ 
  exercise, 
  onIncrement, 
  onDecrement, 
  onViewInstructions 
}: ExerciseCardProps) {
  const progress = Math.min((exercise.completed / exercise.target) * 100, 100);
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{exercise.name}</Text>
        <Text style={styles.progress}>
          {exercise.completed}/{exercise.target} {exercise.unit}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, styles.decrementButton]}
          onPress={onDecrement}
          disabled={exercise.completed <= 0}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.instructionsButton}
          onPress={onViewInstructions}
        >
          <Text style={styles.instructionsText}>Instructions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.incrementButton]}
          onPress={onIncrement}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
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
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructionsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  instructionsText: {
    color: '#555555',
    fontSize: 14,
  },
});