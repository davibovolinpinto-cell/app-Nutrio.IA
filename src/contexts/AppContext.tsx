"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { storage, STORAGE_KEYS } from "@/lib/storage"
import { Meal, Habit, WorkoutSession } from "@/types"

interface AppContextType {
  // Meals
  meals: Meal[]
  addMeal: (meal: Omit<Meal, "id">) => void
  updateMeal: (id: string, updates: Partial<Meal>) => void
  deleteMeal: (id: string) => void
  getTodayMeals: () => Meal[]
  getTodayCalories: () => number

  // Habits
  habits: Habit[]
  addHabit: (habit: Omit<Habit, "id">) => void
  toggleHabit: (id: string) => void
  getTodayHabits: () => Habit[]
  getTodayPoints: () => number
  totalPoints: number

  // Workouts
  workoutSessions: WorkoutSession[]
  addWorkoutSession: (session: Omit<WorkoutSession, "id">) => void
  getTodayWorkouts: () => WorkoutSession[]
  getWeekWorkouts: () => WorkoutSession[]

  // Sync
  lastSync: Date
  forceSync: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Gerador de ID único
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [lastSync, setLastSync] = useState(new Date())
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMeals = storage.get<Meal[]>(STORAGE_KEYS.MEALS, [])
      const storedHabits = storage.get<Habit[]>(STORAGE_KEYS.HABITS, [])
      const storedWorkouts = storage.get<WorkoutSession[]>(STORAGE_KEYS.WORKOUTS, [])

      setMeals(storedMeals)
      setHabits(storedHabits)
      setWorkoutSessions(storedWorkouts)

      // Calcular pontos totais
      const points = storedHabits.reduce(
        (sum, habit) => sum + (habit.completed ? habit.points : 0),
        0
      )
      setTotalPoints(points)

      setIsLoaded(true)
    }
  }, [])

  // Salvar meals no localStorage quando mudarem (com debounce)
  useEffect(() => {
    if (isLoaded) {
      storage.set(STORAGE_KEYS.MEALS, meals)
      setLastSync(new Date())
    }
  }, [meals, isLoaded])

  // Salvar habits no localStorage quando mudarem (com debounce)
  useEffect(() => {
    if (isLoaded) {
      storage.set(STORAGE_KEYS.HABITS, habits)
      setLastSync(new Date())
    }
  }, [habits, isLoaded])

  // Salvar workouts no localStorage quando mudarem (com debounce)
  useEffect(() => {
    if (isLoaded) {
      storage.set(STORAGE_KEYS.WORKOUTS, workoutSessions)
      setLastSync(new Date())
    }
  }, [workoutSessions, isLoaded])

  // Funções de Meals
  const addMeal = (meal: Omit<Meal, "id">) => {
    const newMeal: Meal = {
      ...meal,
      id: generateId(),
    }
    setMeals((prev) => [...prev, newMeal])
  }

  const updateMeal = (id: string, updates: Partial<Meal>) => {
    setMeals((prev) =>
      prev.map((meal) => (meal.id === id ? { ...meal, ...updates } : meal))
    )
  }

  const deleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== id))
  }

  const getTodayMeals = () => {
    const today = new Date().toISOString().split("T")[0]
    return meals.filter((meal) => meal.date === today)
  }

  const getTodayCalories = () => {
    return getTodayMeals().reduce(
      (sum, meal) => sum + (meal.completed ? meal.calories : 0),
      0
    )
  }

  // Funções de Habits
  const addHabit = (habit: Omit<Habit, "id">) => {
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
    }
    setHabits((prev) => [...prev, newHabit])
  }

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          const newCompleted = !habit.completed
          // Atualizar pontos totais
          if (newCompleted) {
            setTotalPoints((points) => points + habit.points)
          } else {
            setTotalPoints((points) => points - habit.points)
          }
          return { ...habit, completed: newCompleted }
        }
        return habit
      })
    )
  }

  const getTodayHabits = () => {
    const today = new Date().toISOString().split("T")[0]
    return habits.filter((habit) => habit.date === today)
  }

  const getTodayPoints = () => {
    return getTodayHabits().reduce(
      (sum, habit) => sum + (habit.completed ? habit.points : 0),
      0
    )
  }

  // Funções de Workouts
  const addWorkoutSession = (session: Omit<WorkoutSession, "id">) => {
    const newSession: WorkoutSession = {
      ...session,
      id: generateId(),
    }
    setWorkoutSessions((prev) => [...prev, newSession])
  }

  const getTodayWorkouts = () => {
    const today = new Date().toISOString().split("T")[0]
    return workoutSessions.filter((session) => session.date === today)
  }

  const getWeekWorkouts = () => {
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    return workoutSessions.filter((session) => {
      const sessionDate = new Date(session.date)
      return sessionDate >= weekAgo && sessionDate <= today
    })
  }

  const forceSync = () => {
    setLastSync(new Date())
  }

  return (
    <AppContext.Provider
      value={{
        meals,
        addMeal,
        updateMeal,
        deleteMeal,
        getTodayMeals,
        getTodayCalories,
        habits,
        addHabit,
        toggleHabit,
        getTodayHabits,
        getTodayPoints,
        totalPoints,
        workoutSessions,
        addWorkoutSession,
        getTodayWorkouts,
        getWeekWorkouts,
        lastSync,
        forceSync,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
