"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PLANS, calculateDiscount, calculatePrice } from "@/lib/subscription"
import { storage, STORAGE_KEYS } from "@/lib/storage"
import { UserSubscription } from "@/types"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SubscriptionPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)

  useEffect(() => {
    const sub = storage.get<UserSubscription>(STORAGE_KEYS.USER_SUBSCRIPTION)
    setSubscription(sub)
  }, [])

  const handleUpgrade = (planId: 'free' | 'premium' | 'pro') => {
    if (!subscription) return

    const updatedSubscription: UserSubscription = {
      ...subscription,
      plan: planId,
      startDate: new Date().toISOString(),
    }

    storage.setImmediate(STORAGE_KEYS.USER_SUBSCRIPTION, updatedSubscription)
    router.push("/")
  }

  const discount = subscription ? calculateDiscount(subscription.points) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-6 py-12 text-white">
        <h1 className="text-3xl font-bold mb-2">Escolha seu Plano</h1>
        <p className="text-cyan-100">Desbloqueie todo o potencial do Nutrio.IA</p>
        {discount > 0 && (
          <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-sm font-semibold">
              🎉 Você tem {discount}% de desconto por seus pontos!
            </p>
          </div>
        )}
      </div>

      {/* Plans */}
      <div className="px-6 -mt-6 space-y-4">
        {Object.values(PLANS).map((plan) => {
          const isCurrentPlan = subscription?.plan === plan.id
          const price = calculatePrice(plan.id, discount)

          return (
            <Card
              key={plan.id}
              className={`p-6 ${
                plan.id === "premium"
                  ? "bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-cyan-500"
                  : "bg-slate-800/50 border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">
                      R$ {price.toFixed(2)}
                    </span>
                    {discount > 0 && plan.price > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        R$ {plan.price.toFixed(2)}
                      </span>
                    )}
                    {plan.price > 0 && <span className="text-gray-400">/mês</span>}
                  </div>
                </div>
                {plan.id === "premium" && (
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full ${
                  isCurrentPlan
                    ? "bg-slate-700 text-gray-400 cursor-not-allowed"
                    : plan.id === "premium"
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    : "bg-slate-700 hover:bg-slate-600 text-white"
                }`}
              >
                {isCurrentPlan ? "Plano Atual" : plan.price === 0 ? "Usar Gratuito" : "Assinar"}
              </Button>
            </Card>
          )
        })}
      </div>

      {/* Points Info */}
      {subscription && (
        <div className="px-6 mt-8">
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 p-6">
            <h3 className="text-white font-bold mb-2">Sistema de Pontos</h3>
            <p className="text-gray-300 text-sm mb-4">
              Complete hábitos e treinos para ganhar pontos. A cada 2000 pontos, você ganha 5% de
              desconto (máximo 25%)!
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{subscription.points}</p>
                <p className="text-xs text-gray-400">Pontos acumulados</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-cyan-400">{discount}%</p>
                <p className="text-xs text-gray-400">Desconto atual</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
