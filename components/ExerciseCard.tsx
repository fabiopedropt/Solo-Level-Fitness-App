import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Exercise } from '../utils/mockData';
import { Theme } from '../utils/ThemeContext';

interface ExerciseCardProps {
  exercise: Exercise;
  onIncrement: () => void;
  onDecrement: () => void;
  onViewInstructions: () => void;
  theme: Theme;
}

export default function ExerciseCard({ 
  exercise, 
  onIncrement, 
  onDecrement, 
  onViewInstructions,
  theme
}: ExerciseCardProps) {
  const progress = Math.min((exercise.completed / exercise.target) * 100, 100);
  
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{exercise.name}</Text>
        <Text style={[styles.progress, { color: theme.textSecondary }]}>
          {exercise.completed}/{exercise.target} {exercise.unit}
        </Text>
      </View>
      
      <View style={[styles.progressBarContainer, { backgroundColor: theme.background }]}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${progress}%`, backgroundColor: theme.secondary }
          ]} 
        />
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, styles.decrementButton, { backgroundColor: theme.error }]}
          onPress={onDecrement}
          disabled={exercise.completed <= 0}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.instructionsButton, { backgroundColor: theme.background }]}
          onPress={onViewInstructions}
        >
          <Text style={[styles.instructionsText, { color: theme.textSecondary }]}>Instructions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.incrementButton, { backgroundColor: theme.secondary }]}
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
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
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
  },
  progress: {
    fontSize: 16,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
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
  },
  incrementButton: {
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructionsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  instructionsText: {
    fontSize: 14,
  },
});