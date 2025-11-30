"use client"

import { Camera, TrendingUp, Dumbbell, CheckSquare, User, Utensils } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useRouter } from "next/navigation"
import { useApp } from "@/contexts/AppContext"
import { useInitializeData } from "@/hooks/useInitializeData"

export default function Home() {
  const { profile, isLoaded } = useUserProfile()
  const router = useRouter()
  const { getTodayMeals, getTodayCalories, getTodayWorkouts } = useApp()

  // Inicializar dados padrão
  useInitializeData()

  const todayMeals = getTodayMeals()
  const todayCalories = getTodayCalories()
  const todayWorkouts = getTodayWorkouts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-6 py-8 text-white">
        <h1 className="text-3xl font-bold mb-2" suppressHydrationWarning>
          Olá, {isLoaded ? profile.name : "Usuário"}! 👋
        </h1>
        <p className="text-cyan-100">Pronto para transformar sua saúde hoje?</p>
      </div>

      {/* Quick Stats */}
      <div className="px-6 -mt-6 mb-6">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-cyan-400">{todayCalories}</p>
              <p className="text-xs text-gray-400">Calorias hoje</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{todayMeals.length}/5</p>
              <p className="text-xs text-gray-400">Refeições</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{todayWorkouts.length}/3</p>
              <p className="text-xs text-gray-400">Treinos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/meals/scan">
            <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 border-0 p-6 text-center hover:scale-105 transition-transform cursor-pointer">
              <Camera className="w-12 h-12 mx-auto mb-3 text-white" />
              <p className="font-semibold text-white">Escanear Refeição</p>
            </Card>
          </Link>
          <Link href="/workouts">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 p-6 text-center hover:scale-105 transition-transform cursor-pointer">
              <Dumbbell className="w-12 h-12 mx-auto mb-3 text-white" />
              <p className="font-semibold text-white">Iniciar Treino</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Today's Plan */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Plano de Hoje</h2>
        <Card className="bg-slate-800/50 border-slate-700 p-5">
          <div className="space-y-4">
            {todayMeals.slice(0, 2).map((meal) => (
              <div key={meal.id} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-600/20 flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{meal.name}</p>
                  <p className="text-sm text-gray-400">{meal.calories} calorias • {meal.time}</p>
                </div>
                {meal.completed && <CheckSquare className="w-5 h-5 text-emerald-400" />}
              </div>
            ))}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Treino Matinal</p>
                <p className="text-sm text-gray-400">15 minutos • 9:00</p>
              </div>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push('/workouts')}
              >
                Iniciar
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Highlight */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Seu Progresso</h2>
        <Link href="/progress">
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 p-6 hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white mb-1">-3.5 kg</p>
                <p className="text-sm text-gray-300">Nas últimas 4 semanas</p>
              </div>
              <TrendingUp className="w-12 h-12 text-emerald-400" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-6 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Link href="/" className="flex flex-col items-center gap-1 text-cyan-400">
            <div className="w-10 h-10 rounded-full bg-cyan-600/20 flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Link href="/meals" className="flex flex-col items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <Utensils className="w-6 h-6" />
            <span className="text-xs">Refeições</span>
          </Link>
          <Link href="/workouts" className="flex flex-col items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs">Treinos</span>
          </Link>
          <Link href="/habits" className="flex flex-col items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <CheckSquare className="w-6 h-6" />
            <span className="text-xs">Hábitos</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Progresso</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-cyan-400 transition-colors">
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
