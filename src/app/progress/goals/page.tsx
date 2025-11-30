"use client"

import { useState } from "react"
import { ChevronLeft, Target, TrendingUp, Calendar, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function GoalsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    currentWeight: "78.5",
    height: "175",
    age: "28",
    gender: "male",
    activityLevel: "moderate",
    restrictions: "",
    experience: "intermediate",
    goal: "lose_weight",
    targetWeight: "72",
    timeframe: "12"
  })

  const [calculatedPlan, setCalculatedPlan] = useState<any>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Cálculo automático baseado nos dados
    const bmr = formData.gender === "male" 
      ? 88.362 + (13.397 * parseFloat(formData.currentWeight)) + (4.799 * parseFloat(formData.height)) - (5.677 * parseFloat(formData.age))
      : 447.593 + (9.247 * parseFloat(formData.currentWeight)) + (3.098 * parseFloat(formData.height)) - (4.330 * parseFloat(formData.age))

    const activityMultiplier = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }[formData.activityLevel] || 1.55

    const tdee = Math.round(bmr * activityMultiplier)
    const weeklyWeightLoss = (parseFloat(formData.currentWeight) - parseFloat(formData.targetWeight)) / parseFloat(formData.timeframe)
    const dailyDeficit = Math.round((weeklyWeightLoss * 7700) / 7) // 7700 cal = 1kg
    const dailyCalories = tdee - dailyDeficit

    setCalculatedPlan({
      dailyCalories,
      protein: Math.round(parseFloat(formData.currentWeight) * 2),
      carbs: Math.round((dailyCalories * 0.4) / 4),
      fat: Math.round((dailyCalories * 0.3) / 9),
      weeklyWeightLoss: weeklyWeightLoss.toFixed(1),
      estimatedDate: new Date(Date.now() + parseFloat(formData.timeframe) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
    })
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-6 text-white">
        <div className="flex items-center gap-4">
          <Link href="/progress">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Definir Metas</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {!calculatedPlan ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Data */}
            <Card className="bg-slate-800/50 border-slate-700 p-5">
              <h2 className="text-lg font-bold text-white mb-4">Dados Pessoais</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Peso Atual (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.currentWeight}
                      onChange={(e) => updateField("currentWeight", e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Altura (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => updateField("height", e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Idade</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => updateField("age", e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Sexo</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                      required
                    >
                      <option value="male">Masculino</option>
                      <option value="female">Feminino</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Nível de Atividade</label>
                  <select
                    value={formData.activityLevel}
                    onChange={(e) => updateField("activityLevel", e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                    required
                  >
                    <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
                    <option value="light">Leve (1-3 dias/semana)</option>
                    <option value="moderate">Moderado (3-5 dias/semana)</option>
                    <option value="active">Ativo (6-7 dias/semana)</option>
                    <option value="very_active">Muito Ativo (2x por dia)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Experiência com Treinos</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => updateField("experience", e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                    required
                  >
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Restrições Alimentares</label>
                  <textarea
                    value={formData.restrictions}
                    onChange={(e) => updateField("restrictions", e.target.value)}
                    placeholder="Ex: Intolerância à lactose, vegetariano..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white h-24 resize-none"
                  />
                </div>
              </div>
            </Card>

            {/* Goals */}
            <Card className="bg-slate-800/50 border-slate-700 p-5">
              <h2 className="text-lg font-bold text-white mb-4">Seus Objetivos</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Objetivo Principal</label>
                  <select
                    value={formData.goal}
                    onChange={(e) => updateField("goal", e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                    required
                  >
                    <option value="lose_weight">Emagrecer</option>
                    <option value="tone">Tonificar</option>
                    <option value="health">Saúde Geral</option>
                    <option value="gain_muscle">Ganhar Massa Muscular</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Meta de Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.targetWeight}
                      onChange={(e) => updateField("targetWeight", e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Prazo (semanas)</label>
                    <input
                      type="number"
                      value={formData.timeframe}
                      onChange={(e) => updateField("timeframe", e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              <Target className="w-5 h-5 mr-2" />
              Calcular Plano Personalizado
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <Card className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border-emerald-500/30 p-6">
              <div className="text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                <h2 className="text-2xl font-bold text-white mb-2">Plano Criado com Sucesso!</h2>
                <p className="text-gray-300">Seu plano personalizado está pronto</p>
              </div>
            </Card>

            {/* Daily Calories */}
            <Card className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/30 p-6">
              <div className="text-center">
                <p className="text-sm text-cyan-300 mb-2">Calorias Diárias Recomendadas</p>
                <p className="text-5xl font-bold text-white mb-2">{calculatedPlan.dailyCalories}</p>
                <p className="text-sm text-gray-300">calorias por dia</p>
              </div>
            </Card>

            {/* Macros */}
            <Card className="bg-slate-800/50 border-slate-700 p-5">
              <h3 className="text-lg font-bold text-white mb-4">Distribuição de Macronutrientes</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-600/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-300 mb-1">Proteína</p>
                  <p className="text-3xl font-bold text-blue-400">{calculatedPlan.protein}g</p>
                </div>
                <div className="bg-emerald-600/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-300 mb-1">Carboidrato</p>
                  <p className="text-3xl font-bold text-emerald-400">{calculatedPlan.carbs}g</p>
                </div>
                <div className="bg-amber-600/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-300 mb-1">Gordura</p>
                  <p className="text-3xl font-bold text-amber-400">{calculatedPlan.fat}g</p>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="bg-slate-800/50 border-slate-700 p-5">
              <h3 className="text-lg font-bold text-white mb-4">Previsão de Resultados</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="text-white">Perda Semanal</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{calculatedPlan.weeklyWeightLoss} kg/semana</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <span className="text-white">Data Prevista</span>
                  </div>
                  <span className="text-cyan-400 font-bold">{calculatedPlan.estimatedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span className="text-white">Total a Perder</span>
                  </div>
                  <span className="text-amber-400 font-bold">
                    {(parseFloat(formData.currentWeight) - parseFloat(formData.targetWeight)).toFixed(1)} kg
                  </span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={() => router.push("/")}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                Começar Agora
              </Button>
              
              <Button 
                onClick={() => setCalculatedPlan(null)}
                variant="outline"
                className="w-full border-slate-600 text-gray-300"
                size="lg"
              >
                Ajustar Metas
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
