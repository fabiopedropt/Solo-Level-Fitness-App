import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  DailyWorkout, 
  UserProgress, 
  createDailyWorkout, 
  initialUserProgress, 
  calculateExperienceGain,
  calculateAttributeGains,
  checkLevelUp,
  getCurrentMonthString
} from './mockData';

// Storage keys
const DAILY_WORKOUT_KEY = 'solo_leveling_daily_workout';
const USER_PROGRESS_KEY = 'solo_leveling_user_progress';
const LEVEL_UP_NOTIFICATION_KEY = 'solo_leveling_level_up_notification';

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
      const workout = JSON.parse(workoutJson);
      
      // Check if the workout is from today
      const today = new Date().toISOString().split('T')[0];
      if (workout.date === today) {
        return workout;
      }
      
      // If not from today, create a new one
      const newWorkout = createDailyWorkout();
      await saveDailyWorkout(newWorkout);
      return newWorkout;
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

// Save level up notification status
export const saveLevelUpNotification = async (levelUp: { 
  shown: boolean, 
  level: number 
}): Promise<void> => {
  try {
    await AsyncStorage.setItem(LEVEL_UP_NOTIFICATION_KEY, JSON.stringify(levelUp));
  } catch (error) {
    console.error('Error saving level up notification:', error);
  }
};

// Get level up notification status
export const getLevelUpNotification = async (): Promise<{ shown: boolean, level: number } | null> => {
  try {
    const notificationJson = await AsyncStorage.getItem(LEVEL_UP_NOTIFICATION_KEY);
    if (notificationJson) {
      return JSON.parse(notificationJson);
    }
    return null;
  } catch (error) {
    console.error('Error getting level up notification:', error);
    return null;
  }
};

// Update workout completion status and handle level up
export const updateWorkoutCompletion = async (
  workout: DailyWorkout,
  progress: UserProgress
): Promise<{ 
  updatedProgress: UserProgress, 
  leveledUp: boolean, 
  attributeGains: Partial<Record<string, number>> 
}> => {
  const allExercisesCompleted = workout.exercises.every(
    (exercise) => exercise.completed >= exercise.target
  );
  
  let leveledUp = false;
  let attributeGains = {};
  
  if (allExercisesCompleted && !workout.completed) {
    // Update workout status
    workout.completed = true;
    
    // Update user progress
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = getCurrentMonthString();
    const isNewStreak = progress.lastCompletedDate === null || 
      isConsecutiveDay(progress.lastCompletedDate, today);
    
    progress.totalWorkoutsCompleted += 1;
    progress.lastCompletedDate = today;
    
    // Update monthly workouts
    if (!progress.monthlyWorkouts[currentMonth]) {
      progress.monthlyWorkouts[currentMonth] = 0;
    }
    progress.monthlyWorkouts[currentMonth] += 1;
    
    if (isNewStreak) {
      progress.streakDays += 1;
    } else {
      progress.streakDays = 1; // Reset streak if not consecutive
    }
    
    // Calculate and add experience
    const expGain = calculateExperienceGain(workout);
    progress.experience += expGain;
    
    // Calculate attribute gains
    attributeGains = calculateAttributeGains(workout);
    
    // Update attributes
    Object.keys(attributeGains).forEach(key => {
      const attrKey = key as keyof typeof progress.attributes;
      progress.attributes[attrKey] += attributeGains[attrKey] || 0;
    });
    
    // Check for level up
    const levelUpResult = checkLevelUp(progress);
    if (levelUpResult.leveledUp) {
      progress.level = levelUpResult.newLevel;
      progress.experience = levelUpResult.newExperience;
      progress.experienceToNextLevel = levelUpResult.newExperienceToNextLevel;
      leveledUp = true;
      
      // Save level up notification
      await saveLevelUpNotification({ shown: false, level: progress.level });
    }
    
    // Save updated data
    await saveDailyWorkout(workout);
    await saveUserProgress(progress);
  }
  
  return { updatedProgress: progress, leveledUp, attributeGains };
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