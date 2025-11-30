// Types centralizados do app

export interface UserProfile {
  id: string
  name: string
  email: string
  height: number // em cm
  weight: number // em kg
  age: number
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_fitness'
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPlan {
  id: 'free' | 'premium' | 'pro'
  name: string
  price: number
  features: string[]
  limits: {
    mealsPerDay: number
    workoutsPerWeek: number
    photoAnalysisPerMonth: number
    customWorkouts: boolean
    advancedStats: boolean
    nutritionPlans: boolean
    videoExercises: boolean
  }
}

export interface UserSubscription {
  plan: 'free' | 'premium' | 'pro'
  startDate: string
  endDate?: string
  points: number
  discount: number // percentual de desconto baseado em pontos
}

export interface Meal {
  id: string
  userId: string
  name: string
  time: string
  calories: number
  protein: number
  carbs: number
  fat: number
  foods: string[]
  completed: boolean
  date: string
  photoUrl?: string
}

export interface Habit {
  id: string
  userId: string
  title: string
  icon: string
  completed: boolean
  streak: number
  points: number
  date: string
}

export interface WorkoutSession {
  id: string
  userId: string
  workoutId: string
  date: string
  duration: number
  caloriesBurned: number
  completed: boolean
  exercises: Exercise[]
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  weight?: number
  duration?: number
  videoUrl?: string
  imageUrl?: string
  gifUrl?: string
}

export interface ProgressEntry {
  id: string
  userId: string
  date: string
  weight: number
  bodyFat?: number
  muscleMass?: number
  photos?: string[]
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    legs?: number
  }
}
