import { supabase } from './supabase';
import { UserProgress, DailyWorkout } from './mockData';

// Save user progress to Supabase
export const saveUserProgressToDatabase = async (
  userId: string,
  progress: UserProgress
): Promise<{ error: any | null }> => {
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: userId,
          streak_days: progress.streakDays,
          total_workouts_completed: progress.totalWorkoutsCompleted,
          last_completed_date: progress.lastCompletedDate,
          level: progress.level,
          experience: progress.experience,
          experience_to_next_level: progress.experienceToNextLevel,
          monthly_workouts: progress.monthlyWorkouts,
          attributes: progress.attributes,
        },
        { onConflict: 'user_id' }
      );

    return { error };
  } catch (error) {
    console.error('Error saving user progress to database:', error);
    return { error };
  }
};

// Get user progress from Supabase
export const getUserProgressFromDatabase = async (
  userId: string
): Promise<{ data: UserProgress | null; error: any | null }> => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return { data: null, error };
    }

    if (!data) {
      return { data: null, error: null };
    }

    // Convert from database format to app format
    const progress: UserProgress = {
      streakDays: data.streak_days,
      totalWorkoutsCompleted: data.total_workouts_completed,
      lastCompletedDate: data.last_completed_date,
      level: data.level,
      experience: data.experience,
      experienceToNextLevel: data.experience_to_next_level,
      monthlyWorkouts: data.monthly_workouts,
      attributes: data.attributes,
    };

    return { data: progress, error: null };
  } catch (error) {
    console.error('Error getting user progress from database:', error);
    return { data: null, error };
  }
};

// Save daily workout to Supabase
export const saveDailyWorkoutToDatabase = async (
  userId: string,
  workout: DailyWorkout
): Promise<{ error: any | null }> => {
  try {
    const { error } = await supabase
      .from('daily_workouts')
      .upsert(
        {
          user_id: userId,
          date: workout.date,
          completed: workout.completed,
          exercises: workout.exercises,
        },
        { onConflict: 'user_id, date' }
      );

    return { error };
  } catch (error) {
    console.error('Error saving daily workout to database:', error);
    return { error };
  }
};

// Get daily workout from Supabase
export const getDailyWorkoutFromDatabase = async (
  userId: string,
  date: string
): Promise<{ data: DailyWorkout | null; error: any | null }> => {
  try {
    const { data, error } = await supabase
      .from('daily_workouts')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (error) {
      return { data: null, error };
    }

    if (!data) {
      return { data: null, error: null };
    }

    // Convert from database format to app format
    const workout: DailyWorkout = {
      date: data.date,
      completed: data.completed,
      exercises: data.exercises,
    };

    return { data: workout, error: null };
  } catch (error) {
    console.error('Error getting daily workout from database:', error);
    return { data: null, error };
  }
};