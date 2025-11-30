"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, CheckSquare, Square, Droplet, Moon, Apple, Footprints, Brain, Award, Star } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { calculateDiscount } from "@/lib/types"

export default function HabitsPage() {
  const [mounted, setMounted] = useState(false)
  const [habits, setHabits] = useState([
    { id: "habit-1", title: "Beber 2L de água", icon: Droplet, completed: false, streak: 12, points: 10 },
    { id: "habit-2", title: "Dormir 8 horas", icon: Moon, completed: false, streak: 8, points: 15 },
    { id: "habit-3", title: "Comer 5 porções de frutas/vegetais", icon: Apple, completed: false, streak: 5, points: 10 },
    { id: "habit-4", title: "10.000 passos", icon: Footprints, completed: false, streak: 15, points: 15 },
    { id: "habit-5", title: "Meditar 10 minutos", icon: Brain, completed: false, streak: 3, points: 10 }
  ])
  const [totalUserPoints, setTotalUserPoints] = useState(4500) // Mock - em produção, buscar do banco

  useEffect(() => {
    setMounted(true)
    // Inicializa alguns hábitos como completos apenas no cliente
    setHabits(prev => prev.map(habit => 
      ["habit-1", "habit-2", "habit-4"].includes(habit.id) ? { ...habit, completed: true } : habit
    ))
  }, [])

  const totalPoints = habits.reduce((sum, habit) => sum + (habit.completed ? habit.points : 0), 0)
  const maxPoints = habits.reduce((sum, habit) => sum + habit.points, 0)
  const completionRate = Math.round((totalPoints / maxPoints) * 100)
  const currentDiscount = calculateDiscount(totalUserPoints)

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCompleted = !habit.completed
        // Adicionar ou remover pontos do total do usuário
        if (newCompleted) {
          setTotalUserPoints(prev => prev + habit.points)
        } else {
          setTotalUserPoints(prev => prev - habit.points)
        }
        return { ...habit, completed: newCompleted }
      }
      return habit
    }))
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-6 text-white">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Hábitos Inteligentes</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-6 text-white">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Hábitos Inteligentes</h1>
        </div>

        {/* Daily Score */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-emerald-100 mb-2">Pontuação de Hoje</p>
            <p className="text-5xl font-bold text-white mb-1">{totalPoints}</p>
            <p className="text-lg text-emerald-100">de {maxPoints} pontos</p>
          </div>
          
          <div className="w-full bg-slate-700/50 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-3 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-center text-sm text-emerald-100">{completionRate}% concluído</p>
        </Card>
      </div>

      {/* Points & Discount Info */}
      <div className="px-6 py-4">
        <Card className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-amber-400" />
              <div>
                <p className="font-bold text-white">{totalUserPoints} pontos totais</p>
                <p className="text-sm text-gray-300">
                  {currentDiscount > 0 ? `${currentDiscount}% de desconto ativo!` : 'Complete hábitos para ganhar desconto'}
                </p>
              </div>
            </div>
            {currentDiscount > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-400">{currentDiscount}%</p>
                <p className="text-xs text-gray-400">OFF</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Habits Checklist */}
      <div className="px-6 py-6 space-y-4">
        <h2 className="text-lg font-bold text-white mb-4">Hábitos de Hoje</h2>
        
        {habits.map((habit) => {
          const Icon = habit.icon
          return (
            <Card 
              key={habit.id} 
              className={`border-slate-700 p-5 cursor-pointer transition-all ${
                habit.completed 
                  ? "bg-emerald-600/20 border-emerald-500/30" 
                  : "bg-slate-800/50 hover:bg-slate-800/70"
              }`}
              onClick={() => toggleHabit(habit.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  habit.completed ? "bg-emerald-600/30" : "bg-slate-700/50"
                }`}>
                  {habit.completed ? (
                    <CheckSquare className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Square className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${
                    habit.completed ? "text-white line-through" : "text-white"
                  }`}>
                    {habit.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Icon className="w-4 h-4" />
                      {habit.streak} dias seguidos
                    </span>
                    <span className={habit.completed ? "text-emerald-400" : "text-cyan-400"}>
                      +{habit.points} pts
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Weekly Stats */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Esta Semana</h2>
        <Card className="bg-slate-800/50 border-slate-700 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
              <p className="text-2xl font-bold text-white mb-1">420</p>
              <p className="text-xs text-gray-400">Pontos Totais</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <CheckSquare className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
              <p className="text-2xl font-bold text-white mb-1">28</p>
              <p className="text-xs text-gray-400">Hábitos Completos</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Streaks */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Maiores Sequências</h2>
        <Card className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30 p-5">
          <div className="space-y-3">
            {habits
              .sort((a, b) => b.streak - a.streak)
              .slice(0, 3)
              .map((habit) => {
                const Icon = habit.icon
                return (
                  <div key={`streak-${habit.id}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-600/30 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="text-white">{habit.title}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-amber-400">{habit.streak}</p>
                      <p className="text-xs text-gray-400">dias</p>
                    </div>
                  </div>
                )
              })}
          </div>
        </Card>
      </div>

      {/* Tips */}
      <div className="px-6 mb-8">
        <Card className="bg-blue-600/20 border-blue-500/30 p-5">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Dica Personalizada
          </h3>
          <p className="text-sm text-gray-300">
            Você está indo muito bem com hidratação! Tente adicionar um hábito de meditação pela manhã para melhorar seu foco durante o dia.
          </p>
        </Card>
      </div>
    </div>
  )
}
