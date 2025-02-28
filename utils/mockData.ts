export interface Exercise {
  id: string;
  name: string;
  target: number;
  unit: string;
  instructions: string;
  completed: number;
}

export interface DailyWorkout {
  date: string;
  completed: boolean;
  exercises: Exercise[];
}

export interface UserProgress {
  streakDays: number;
  totalWorkoutsCompleted: number;
  lastCompletedDate: string | null;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  monthlyWorkouts: Record<string, number>; // Format: "YYYY-MM": count
  attributes: UserAttributes;
}

export interface UserAttributes {
  strength: number;
  endurance: number;
  agility: number;
  willpower: number;
}

// Initial exercises based on Solo Leveling training
export const initialExercises: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    target: 100,
    unit: 'reps',
    instructions: 'Keep your body straight, lower yourself until your chest nearly touches the floor, then push back up.',
    completed: 0,
  },
  {
    id: '2',
    name: 'Squats',
    target: 100,
    unit: 'reps',
    instructions: 'Stand with feet shoulder-width apart, lower your body as if sitting in a chair, then return to standing.',
    completed: 0,
  },
  {
    id: '3',
    name: 'Running',
    target: 10,
    unit: 'km',
    instructions: 'Maintain a steady pace. You can break this into smaller segments if needed.',
    completed: 0,
  },
  {
    id: '4',
    name: 'Sit-ups',
    target: 100,
    unit: 'reps',
    instructions: 'Lie on your back with knees bent, hands behind your head. Lift your upper body toward your knees, then lower back down.',
    completed: 0,
  },
];

// Initial user progress
export const initialUserProgress: UserProgress = {
  streakDays: 0,
  totalWorkoutsCompleted: 0,
  lastCompletedDate: null,
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  monthlyWorkouts: {},
  attributes: {
    strength: 1,
    endurance: 1,
    agility: 1,
    willpower: 1,
  },
};

// Sung Jin-Woo motivational quotes
export const motivationalQuotes = [
  "I don't have a reason to fight. I fight because I want to survive.",
  "I'm not a hero. I'm just someone who doesn't want to lose.",
  "The weak die, and the strong survive. That's the law of nature.",
  "I alone level up.",
  "I'll become stronger. Strong enough that no one can threaten me ever again.",
  "If I can't win with skill, I'll win with numbers. If I can't win with numbers, I'll win with strength.",
  "I'm not going to die here. I'm going to survive and become stronger.",
  "Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger.",
  "I will hunt until the end of my life.",
  "I'm not a hunter who relies on luck. I'm a hunter who relies on preparation.",
  "The only thing I can trust is the power I build with my own hands.",
  "Arise.",
  "I'll show you what a real hunter looks like.",
  "I don't need a system to tell me what to do. I'll decide my own path.",
  "Every day is a chance to become stronger than yesterday."
];

// Get a random motivational quote
export const getRandomQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

// Get today's date in YYYY-MM-DD format
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Get current month in YYYY-MM format
export const getCurrentMonthString = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
};

// Create a new daily workout with fresh exercises
export const createDailyWorkout = (): DailyWorkout => {
  return {
    date: getTodayDateString(),
    completed: false,
    exercises: initialExercises.map(exercise => ({ ...exercise, completed: 0 })),
  };
};

// Calculate experience points based on workout completion
export const calculateExperienceGain = (workout: DailyWorkout): number => {
  // Base XP for completing a workout
  const baseXP = 50;
  
  // Calculate completion percentage for each exercise
  const completionPercentages = workout.exercises.map(exercise => 
    Math.min((exercise.completed / exercise.target) * 100, 100)
  );
  
  // Average completion percentage
  const avgCompletion = completionPercentages.reduce((sum, percent) => sum + percent, 0) / 
    completionPercentages.length;
  
  // XP based on completion percentage
  const completionXP = Math.round((avgCompletion / 100) * 50);
  
  // Bonus XP for full completion
  const fullCompletionBonus = workout.completed ? 25 : 0;
  
  return baseXP + completionXP + fullCompletionBonus;
};

// Calculate attribute gains based on exercises completed
export const calculateAttributeGains = (workout: DailyWorkout): Partial<UserAttributes> => {
  const gains: Partial<UserAttributes> = {};
  
  // Map exercises to attributes
  workout.exercises.forEach(exercise => {
    const completionRatio = Math.min(exercise.completed / exercise.target, 1);
    
    switch(exercise.name) {
      case 'Push-ups':
        gains.strength = (gains.strength || 0) + completionRatio * 0.2;
        break;
      case 'Squats':
        gains.strength = (gains.strength || 0) + completionRatio * 0.1;
        gains.agility = (gains.agility || 0) + completionRatio * 0.1;
        break;
      case 'Running':
        gains.endurance = (gains.endurance || 0) + completionRatio * 0.2;
        break;
      case 'Sit-ups':
        gains.strength = (gains.strength || 0) + completionRatio * 0.05;
        gains.endurance = (gains.endurance || 0) + completionRatio * 0.15;
        break;
    }
    
    // Willpower increases with any exercise completion
    gains.willpower = (gains.willpower || 0) + completionRatio * 0.05;
  });
  
  // Round all gains to 1 decimal place
  Object.keys(gains).forEach(key => {
    gains[key as keyof UserAttributes] = Math.round(gains[key as keyof UserAttributes]! * 10) / 10;
  });
  
  return gains;
};

// Check if user should level up
export const checkLevelUp = (progress: UserProgress): {
  leveledUp: boolean;
  newLevel: number;
  newExperience: number;
  newExperienceToNextLevel: number;
} => {
  let currentExp = progress.experience;
  let currentLevel = progress.level;
  let expToNextLevel = progress.experienceToNextLevel;
  let leveledUp = false;
  
  // Check if experience exceeds current level requirement
  if (currentExp >= expToNextLevel) {
    // Level up!
    currentExp -= expToNextLevel;
    currentLevel += 1;
    // New experience requirement increases with each level
    expToNextLevel = Math.round(expToNextLevel * 1.5);
    leveledUp = true;
  }
  
  return {
    leveledUp,
    newLevel: currentLevel,
    newExperience: currentExp,
    newExperienceToNextLevel: expToNextLevel
  };
};

// Get months for analytics (last 6 months)
export const getAnalyticsMonths = (): string[] => {
  const months = [];
  const today = new Date();
  
  for (let i = 0; i < 6; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthString = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
    months.push(monthString);
  }
  
  return months;
};