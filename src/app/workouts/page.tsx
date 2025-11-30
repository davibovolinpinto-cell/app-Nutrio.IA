"use client"

import { useState } from "react"
import { ChevronLeft, Dumbbell, Clock, Zap, Play, Home, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUserProfile } from "@/hooks/useUserProfile"
import { calculateCaloriesBurned } from "@/lib/types"

export default function WorkoutsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedDuration, setSelectedDuration] = useState<string>("all")
  const { profile } = useUserProfile()

  const workouts = [
    {
      id: 1,
      title: "Treino HIIT Matinal",
      duration: 15,
      level: "intermediate",
      location: "home",
      intensity: "intense" as const,
      exercises: 8,
      description: "Alta intensidade para queimar gordura"
    },
    {
      id: 2,
      title: "Abdômen Definido",
      duration: 10,
      level: "beginner",
      location: "home",
      intensity: "moderate" as const,
      exercises: 6,
      description: "Foco em core e abdômen"
    },
    {
      id: 3,
      title: "Cardio Rápido",
      duration: 5,
      level: "beginner",
      location: "anywhere",
      intensity: "moderate" as const,
      exercises: 4,
      description: "Perfeito para o dia a dia"
    },
    {
      id: 4,
      title: "Força Total",
      duration: 20,
      level: "advanced",
      location: "home",
      intensity: "intense" as const,
      exercises: 10,
      description: "Treino completo de força"
    },
    {
      id: 5,
      title: "Mobilidade e Flexibilidade",
      duration: 15,
      level: "beginner",
      location: "anywhere",
      intensity: "light" as const,
      exercises: 7,
      description: "Alongamento e mobilidade"
    },
    {
      id: 6,
      title: "Pernas e Glúteos",
      duration: 20,
      level: "intermediate",
      location: "home",
      intensity: "intense" as const,
      exercises: 9,
      description: "Fortalecimento de membros inferiores"
    }
  ]

  const levelLabels: Record<string, string> = {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado"
  }

  const locationLabels: Record<string, string> = {
    home: "Em Casa",
    anywhere: "Qualquer Lugar"
  }

  const filteredWorkouts = workouts.filter(workout => {
    const levelMatch = selectedLevel === "all" || workout.level === selectedLevel
    const durationMatch = selectedDuration === "all" || workout.duration.toString() === selectedDuration
    return levelMatch && durationMatch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-6 text-white">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Treinos Rápidos</h1>
        </div>

        {/* Stats */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-xs text-cyan-100">Esta semana</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">2.450</p>
              <p className="text-xs text-cyan-100">Calorias</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">180</p>
              <p className="text-xs text-cyan-100">Minutos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="px-6 py-6 space-y-4">
        <div>
          <p className="text-sm text-gray-400 mb-2">Nível</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedLevel === "all" ? "default" : "outline"}
              onClick={() => setSelectedLevel("all")}
              className={selectedLevel === "all" ? "bg-blue-600" : "border-slate-600 text-gray-300"}
            >
              Todos
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "beginner" ? "default" : "outline"}
              onClick={() => setSelectedLevel("beginner")}
              className={selectedLevel === "beginner" ? "bg-blue-600" : "border-slate-600 text-gray-300"}
            >
              Iniciante
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "intermediate" ? "default" : "outline"}
              onClick={() => setSelectedLevel("intermediate")}
              className={selectedLevel === "intermediate" ? "bg-blue-600" : "border-slate-600 text-gray-300"}
            >
              Intermediário
            </Button>
            <Button
              size="sm"
              variant={selectedLevel === "advanced" ? "default" : "outline"}
              onClick={() => setSelectedLevel("advanced")}
              className={selectedLevel === "advanced" ? "bg-blue-600" : "border-slate-600 text-gray-300"}
            >
              Avançado
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-2">Duração</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={selectedDuration === "all" ? "default" : "outline"}
              onClick={() => setSelectedDuration("all")}
              className={selectedDuration === "all" ? "bg-cyan-600" : "border-slate-600 text-gray-300"}
            >
              Todos
            </Button>
            <Button
              size="sm"
              variant={selectedDuration === "5" ? "default" : "outline"}
              onClick={() => setSelectedDuration("5")}
              className={selectedDuration === "5" ? "bg-cyan-600" : "border-slate-600 text-gray-300"}
            >
              5 min
            </Button>
            <Button
              size="sm"
              variant={selectedDuration === "10" ? "default" : "outline"}
              onClick={() => setSelectedDuration("10")}
              className={selectedDuration === "10" ? "bg-cyan-600" : "border-slate-600 text-gray-300"}
            >
              10 min
            </Button>
            <Button
              size="sm"
              variant={selectedDuration === "15" ? "default" : "outline"}
              onClick={() => setSelectedDuration("15")}
              className={selectedDuration === "15" ? "bg-cyan-600" : "border-slate-600 text-gray-300"}
            >
              15 min
            </Button>
            <Button
              size="sm"
              variant={selectedDuration === "20" ? "default" : "outline"}
              onClick={() => setSelectedDuration("20")}
              className={selectedDuration === "20" ? "bg-cyan-600" : "border-slate-600 text-gray-300"}
            >
              20 min
            </Button>
          </div>
        </div>
      </div>

      {/* Workouts List */}
      <div className="px-6 space-y-4">
        {filteredWorkouts.map((workout) => {
          const calories = calculateCaloriesBurned(
            workout.duration,
            workout.intensity,
            profile.weight || 70
          )

          return (
            <Link key={workout.id} href={`/workouts/${workout.id}`}>
              <Card className="bg-slate-800/50 border-slate-700 p-5 hover:bg-slate-800/70 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-1">{workout.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{workout.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {workout.duration} min
                      </span>
                      <span className="text-xs bg-cyan-600/20 text-cyan-300 px-3 py-1 rounded-full">
                        {levelLabels[workout.level]}
                      </span>
                      <span className="text-xs bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full flex items-center gap-1">
                        {workout.location === "home" ? <Home className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                        {locationLabels[workout.location]}
                      </span>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-2">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">{workout.exercises} exercícios</span>
                    <span className="text-sm text-amber-400 flex items-center gap-1 font-semibold">
                      <Zap className="w-4 h-4" />
                      ~{calories} kcal
                    </span>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Iniciar
                  </Button>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Weekly Goal */}
      <div className="px-6 mt-8 mb-8">
        <Card className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border-emerald-500/30 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Meta Semanal</p>
              <p className="text-2xl font-bold text-white">3 de 5 treinos</p>
            </div>
            <TrendingUp className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2 mt-3">
            <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full" style={{ width: "60%" }} />
          </div>
        </Card>
      </div>
    </div>
  )
}
