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
};

// Get today's date in YYYY-MM-DD format
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Create a new daily workout with fresh exercises
export const createDailyWorkout = (): DailyWorkout => {
  return {
    date: getTodayDateString(),
    completed: false,
    exercises: initialExercises.map(exercise => ({ ...exercise, completed: 0 })),
  };
};