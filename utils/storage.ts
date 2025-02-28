import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyWorkout, UserProgress, createDailyWorkout, initialUserProgress } from './mockData';

// Storage keys
const DAILY_WORKOUT_KEY = 'solo_leveling_daily_workout';
const USER_PROGRESS_KEY = 'solo_leveling_user_progress';

// Save daily workout to AsyncStorage
export const saveDailyWorkout = async (workout: DailyWorkout): Promise<void> => {
  try {
    await AsyncStorage.setItem(DAILY_WORKOUT_KEY, JSON.stringify(workout));
  } catch (error) {
    console.error('Error saving daily workout:', error);
  }
};

// Get daily workout from AsyncStorage
export const getDailyWorkout = async (): Promise<DailyWorkout> => {
  try {
    const workoutJson = await AsyncStorage.getItem(DAILY_WORKOUT_KEY);
    if (workoutJson) {
      return JSON.parse(workoutJson);
    }
    // If no workout exists, create a new one
    const newWorkout = createDailyWorkout();
    await saveDailyWorkout(newWorkout);
    return newWorkout;
  } catch (error) {
    console.error('Error getting daily workout:', error);
    const newWorkout = createDailyWorkout();
    await saveDailyWorkout(newWorkout);
    return newWorkout;
  }
};

// Save user progress to AsyncStorage
export const saveUserProgress = async (progress: UserProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
};

// Get user progress from AsyncStorage
export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const progressJson = await AsyncStorage.getItem(USER_PROGRESS_KEY);
    if (progressJson) {
      return JSON.parse(progressJson);
    }
    // If no progress exists, use initial progress
    await saveUserProgress(initialUserProgress);
    return initialUserProgress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    await saveUserProgress(initialUserProgress);
    return initialUserProgress;
  }
};

// Update workout completion status
export const updateWorkoutCompletion = async (
  workout: DailyWorkout,
  progress: UserProgress
): Promise<void> => {
  const allExercisesCompleted = workout.exercises.every(
    (exercise) => exercise.completed >= exercise.target
  );
  
  if (allExercisesCompleted && !workout.completed) {
    // Update workout status
    workout.completed = true;
    
    // Update user progress
    const today = new Date().toISOString().split('T')[0];
    const isNewStreak = progress.lastCompletedDate === null || 
      isConsecutiveDay(progress.lastCompletedDate, today);
    
    progress.totalWorkoutsCompleted += 1;
    progress.lastCompletedDate = today;
    
    if (isNewStreak) {
      progress.streakDays += 1;
    } else {
      progress.streakDays = 1; // Reset streak if not consecutive
    }
    
    // Save updated data
    await saveDailyWorkout(workout);
    await saveUserProgress(progress);
  }
};

// Check if two dates are consecutive days
const isConsecutiveDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Set hours to 0 to compare just the dates
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
};