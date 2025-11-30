"use client"

import { useState } from "react"
import { ChevronLeft, Camera, TrendingDown, Calendar, Target, Award } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ProgressPage() {
  const [currentWeight] = useState(78.5)
  const [goalWeight] = useState(72)
  const [startWeight] = useState(82)

  const progressPercentage = ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-6 text-white">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Meu Progresso</h1>
        </div>

        {/* Main Stats */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-purple-100 mb-1">Peso Atual</p>
            <p className="text-5xl font-bold text-white mb-1">{currentWeight}</p>
            <p className="text-lg text-purple-100">kg</p>
          </div>
          
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="text-center">
              <p className="text-purple-100">Inicial</p>
              <p className="text-xl font-bold text-white">{startWeight} kg</p>
            </div>
            <div className="text-center">
              <TrendingDown className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
              <p className="text-xl font-bold text-emerald-400">-{(startWeight - currentWeight).toFixed(1)} kg</p>
            </div>
            <div className="text-center">
              <p className="text-purple-100">Meta</p>
              <p className="text-xl font-bold text-white">{goalWeight} kg</p>
            </div>
          </div>

          <div className="w-full bg-slate-700/50 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <p className="text-center text-sm text-purple-100">
            {progressPercentage.toFixed(0)}% do objetivo alcançado
          </p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4">
          <Link href="/progress/photos">
            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 p-5 text-center hover:scale-105 transition-transform cursor-pointer">
              <Camera className="w-10 h-10 mx-auto mb-2 text-white" />
              <p className="font-semibold text-white text-sm">Fotos Corporais</p>
            </Card>
          </Link>
          <Link href="/progress/goals">
            <Card className="bg-gradient-to-br from-pink-600 to-pink-700 border-0 p-5 text-center hover:scale-105 transition-transform cursor-pointer">
              <Target className="w-10 h-10 mx-auto mb-2 text-white" />
              <p className="font-semibold text-white text-sm">Definir Metas</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Progresso Semanal</h2>
        <Card className="bg-slate-800/50 border-slate-700 p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-white">Esta Semana</span>
              </div>
              <span className="text-emerald-400 font-bold">-0.8 kg</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-cyan-400" />
                <span className="text-white">Média Semanal</span>
              </div>
              <span className="text-cyan-400 font-bold">-0.7 kg</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-white">Faltam</span>
              </div>
              <span className="text-blue-400 font-bold">{(currentWeight - goalWeight).toFixed(1)} kg</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Weight History Chart */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Histórico de Peso</h2>
        <Card className="bg-slate-800/50 border-slate-700 p-5">
          <div className="space-y-3">
            {[
              { date: "Semana 1", weight: 82.0, change: 0 },
              { date: "Semana 2", weight: 81.2, change: -0.8 },
              { date: "Semana 3", weight: 80.3, change: -0.9 },
              { date: "Semana 4", weight: 79.5, change: -0.8 },
              { date: "Semana 5", weight: 78.5, change: -1.0 }
            ].map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                <span className="text-gray-400">{entry.date}</span>
                <div className="flex items-center gap-4">
                  <span className="text-white font-semibold">{entry.weight} kg</span>
                  {entry.change !== 0 && (
                    <span className="text-emerald-400 text-sm font-semibold">
                      {entry.change.toFixed(1)} kg
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Body Measurements */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Medidas Corporais</h2>
        <Card className="bg-slate-800/50 border-slate-700 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Cintura</p>
              <p className="text-2xl font-bold text-white">85 cm</p>
              <p className="text-xs text-emerald-400 mt-1">-3 cm</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Quadril</p>
              <p className="text-2xl font-bold text-white">98 cm</p>
              <p className="text-xs text-emerald-400 mt-1">-2 cm</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Braço</p>
              <p className="text-2xl font-bold text-white">32 cm</p>
              <p className="text-xs text-cyan-400 mt-1">+1 cm</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Coxa</p>
              <p className="text-2xl font-bold text-white">56 cm</p>
              <p className="text-xs text-emerald-400 mt-1">-1 cm</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
