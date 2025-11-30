"use client"

import { useEffect } from "react"
import { useApp } from "@/contexts/AppContext"
import { storage, STORAGE_KEYS } from "@/lib/storage"

export function useInitializeData() {
  const { meals, habits, addMeal, addHabit, getTodayMeals, getTodayHabits } = useApp()

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const profile = storage.get(STORAGE_KEYS.USER_PROFILE)

    if (!profile) return

    // Inicializar refeições padrão se não existirem para hoje
    if (getTodayMeals().length === 0) {
      const defaultMeals = [
        {
          userId: profile.id,
          name: "Café da Manhã",
          time: "08:00",
          calories: 450,
          protein: 25,
          carbs: 55,
          fat: 12,
          foods: ["Ovos mexidos", "Pão integral", "Abacate"],
          completed: true,
          date: today,
        },
        {
          userId: profile.id,
          name: "Lanche da Manhã",
          time: "10:30",
          calories: 180,
          protein: 8,
          carbs: 25,
          fat: 5,
          foods: ["Iogurte grego", "Granola"],
          completed: true,
          date: today,
        },
        {
          userId: profile.id,
          name: "Almoço",
          time: "12:30",
          calories: 650,
          protein: 45,
          carbs: 70,
          fat: 18,
          foods: ["Frango grelhado", "Arroz integral", "Salada"],
          completed: true,
          date: today,
        },
      ]

      defaultMeals.forEach((meal) => addMeal(meal))
    }

    // Inicializar hábitos padrão se não existirem para hoje
    if (getTodayHabits().length === 0) {
      const defaultHabits = [
        {
          userId: profile.id,
          title: "Beber 2L de água",
          icon: "💧",
          completed: false,
          streak: 0,
          points: 10,
          date: today,
        },
        {
          userId: profile.id,
          title: "Dormir 8h",
          icon: "😴",
          completed: false,
          streak: 0,
          points: 15,
          date: today,
        },
        {
          userId: profile.id,
          title: "Comer frutas",
          icon: "🍎",
          completed: false,
          streak: 0,
          points: 10,
          date: today,
        },
      ]

      defaultHabits.forEach((habit) => addHabit(habit))
    }
  }, [])
}
