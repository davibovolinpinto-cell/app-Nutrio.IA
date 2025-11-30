"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { UserProfile } from "@/types"
import { storage, STORAGE_KEYS } from "@/lib/storage"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    height: "",
    weight: "",
    age: "",
    activityLevel: "moderate" as UserProfile["activityLevel"],
    goal: "maintain" as UserProfile["goal"],
  })

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    // Criar perfil do usuário
    const profile: UserProfile = {
      id: `user_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      height: parseInt(formData.height),
      weight: parseFloat(formData.weight),
      age: parseInt(formData.age),
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Salvar perfil
    storage.setImmediate(STORAGE_KEYS.USER_PROFILE, profile)

    // Criar assinatura inicial (gratuita)
    storage.setImmediate(STORAGE_KEYS.USER_SUBSCRIPTION, {
      plan: "free",
      startDate: new Date().toISOString(),
      points: 0,
      discount: 0,
    })

    // Redirecionar para home
    router.push("/")
  }

  const activityLevels = [
    { value: "sedentary", label: "Sedentário", description: "Pouco ou nenhum exercício" },
    { value: "light", label: "Levemente Ativo", description: "Exercício leve 1-3 dias/semana" },
    { value: "moderate", label: "Moderadamente Ativo", description: "Exercício moderado 3-5 dias/semana" },
    { value: "active", label: "Muito Ativo", description: "Exercício intenso 6-7 dias/semana" },
    { value: "very_active", label: "Extremamente Ativo", description: "Exercício muito intenso diariamente" },
  ]

  const goals = [
    { value: "lose_weight", label: "Perder Peso", icon: "📉" },
    { value: "gain_muscle", label: "Ganhar Massa", icon: "💪" },
    { value: "maintain", label: "Manter Peso", icon: "⚖️" },
    { value: "improve_fitness", label: "Melhorar Condicionamento", icon: "🏃" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Passo {step} de 3</span>
            <span className="text-sm text-cyan-400">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Informações Básicas */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo! 👋</h2>
              <p className="text-gray-400">Vamos começar com suas informações básicas</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="age" className="text-white">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="25"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Medidas Físicas */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Suas Medidas 📏</h2>
              <p className="text-gray-400">Precisamos dessas informações para personalizar seu plano</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="height" className="text-white">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="175"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-white">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="70.5"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <Label className="text-white mb-3 block">Nível de Atividade Física</Label>
                <div className="space-y-2">
                  {activityLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          activityLevel: level.value as UserProfile["activityLevel"],
                        })
                      }
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        formData.activityLevel === level.value
                          ? "bg-cyan-600/20 border-cyan-600 text-white"
                          : "bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-700"
                      }`}
                    >
                      <div className="font-semibold">{level.label}</div>
                      <div className="text-xs text-gray-400">{level.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Objetivo */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Seu Objetivo 🎯</h2>
              <p className="text-gray-400">O que você quer alcançar?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {goals.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() =>
                    setFormData({ ...formData, goal: goal.value as UserProfile["goal"] })
                  }
                  className={`p-6 rounded-lg border transition-all ${
                    formData.goal === goal.value
                      ? "bg-gradient-to-br from-cyan-600 to-blue-600 border-cyan-500 text-white scale-105"
                      : "bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  <div className="text-4xl mb-3">{goal.icon}</div>
                  <div className="font-semibold text-sm">{goal.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 border-slate-700 text-gray-300 hover:bg-slate-700"
            >
              Voltar
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={
              (step === 1 && (!formData.name || !formData.email || !formData.age)) ||
              (step === 2 && (!formData.height || !formData.weight))
            }
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            {step === 3 ? "Começar" : "Próximo"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
