// Types para o sistema de planos e funcionalidades

export type PlanType = "basic" | "intermediate" | "premium"

export interface UserPlan {
  type: PlanType
  points: number
  discount: number
}

export interface PlanFeatures {
  micronutrients: boolean
  customRoutines: boolean
  advancedReports: boolean
  detailedHistory: boolean
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  basic: {
    micronutrients: false,
    customRoutines: false,
    advancedReports: false,
    detailedHistory: false,
  },
  intermediate: {
    micronutrients: true,
    customRoutines: false,
    advancedReports: false,
    detailedHistory: false,
  },
  premium: {
    micronutrients: true,
    customRoutines: true,
    advancedReports: true,
    detailedHistory: true,
  },
}

export interface Micronutrients {
  vitaminA: number
  vitaminC: number
  vitaminD: number
  calcium: number
  iron: number
  fiber: number
}

export interface MealAnalysis {
  foods: Array<{
    name: string
    portion: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }>
  totals: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  micronutrients?: Micronutrients
  notes?: string
}

export interface Exercise {
  id: string
  name: string
  duration: number
  sets?: number
  reps?: string
  instructions: string[]
  commonMistakes: string[]
  videoUrl?: string
  images?: string[]
}

export interface Workout {
  id: number
  title: string
  duration: number
  level: "beginner" | "intermediate" | "advanced"
  location: "home" | "anywhere"
  calories: number
  exercises: Exercise[]
  description: string
  intensity: "light" | "moderate" | "intense"
}

// Função para calcular desconto baseado em pontos
export function calculateDiscount(points: number): number {
  const discountTiers = Math.floor(points / 2000)
  const discount = discountTiers * 5
  return Math.min(discount, 25) // Máximo 25%
}

// Função para calcular calorias queimadas
export function calculateCaloriesBurned(
  duration: number,
  intensity: "light" | "moderate" | "intense",
  weight: number
): number {
  const intensityMultiplier = {
    light: 3.5,
    moderate: 5.5,
    intense: 8.0,
  }

  const met = intensityMultiplier[intensity]
  const caloriesPerMinute = (met * 3.5 * weight) / 200
  return Math.round(caloriesPerMinute * duration)
}
