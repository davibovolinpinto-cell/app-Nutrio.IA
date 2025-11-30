"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, User, Crown, Settings, LogOut, Check, Zap, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUserProfile } from "@/hooks/useUserProfile"
import { calculateDiscount } from "@/lib/types"

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { profile, isLoaded } = useUserProfile()
  const [currentPlan] = useState("basic") // basic, intermediate, premium
  const [showPlans, setShowPlans] = useState(false)
  const [userPoints] = useState(4500) // Mock - em produção, buscar do banco

  useEffect(() => {
    if (searchParams.get("showPlans") === "true") {
      setShowPlans(true)
    }
  }, [searchParams])

  const discount = calculateDiscount(userPoints)
  const nextTierPoints = Math.ceil(userPoints / 2000) * 2000
  const pointsToNextTier = nextTierPoints - userPoints

  const plans = [
    {
      id: "basic",
      name: "Básico",
      price: 14.99,
      color: "from-slate-600 to-slate-700",
      features: [
        "Registrar refeições",
        "Foto da refeição com análise de calorias",
        "Treinos para iniciantes",
        "Hábitos básicos",
        "Envio de fotos corporais"
      ]
    },
    {
      id: "intermediate",
      name: "Intermediário",
      price: 30.99,
      color: "from-blue-600 to-cyan-600",
      popular: true,
      features: [
        "Tudo do plano básico",
        "Análise nutricional completa",
        "Todos os treinos liberados",
        "Relatórios semanais",
        "Metas personalizadas",
        "Ajustes básicos nas recomendações"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      price: 79.99,
      color: "from-purple-600 to-pink-600",
      features: [
        "Todas as funções liberadas",
        "Sistema completo de metas com IA",
        "Rotinas personalizadas",
        "Análise avançada das fotos corporais",
        "Histórico completo e ilimitado",
        "Sugestões automáticas de refeição",
        "Ajustes inteligentes semanais",
        "Relatórios avançados"
      ]
    }
  ]

  const planLabels: Record<string, string> = {
    basic: "Básico",
    intermediate: "Intermediário",
    premium: "Premium"
  }

  const calculateFinalPrice = (basePrice: number) => {
    const discountAmount = basePrice * (discount / 100)
    return (basePrice - discountAmount).toFixed(2)
  }

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
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>

        {/* User Info */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isLoaded ? profile.name : "Carregando..."}
              </h2>
              <p className="text-purple-100">
                {isLoaded ? profile.email : ""}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <span className="text-purple-100">Plano Atual</span>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white">{planLabels[currentPlan]}</span>
            </div>
          </div>
        </Card>
      </div>

      {!showPlans ? (
        <div className="px-6 py-6 space-y-4">
          {/* Points & Discount Card */}
          <Card className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-500/30 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-600/30 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">Sistema de Pontos</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Complete hábitos para ganhar pontos e descontos na mensalidade!
                </p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-amber-400">{userPoints} pontos</span>
                      {discount > 0 && (
                        <span className="text-lg font-bold text-emerald-400">{discount}% OFF</span>
                      )}
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full transition-all"
                        style={{ width: `${((userPoints % 2000) / 2000) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Faltam {pointsToNextTier} pontos para {discount + 5}% de desconto
                    </p>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3 space-y-1 text-xs">
                    <p className="text-gray-300">📊 Regras de desconto:</p>
                    <p className="text-gray-400">• 2.000 pontos = 5% de desconto</p>
                    <p className="text-gray-400">• 4.000 pontos = 10% de desconto</p>
                    <p className="text-gray-400">• 6.000 pontos = 15% de desconto</p>
                    <p className="text-emerald-400 font-semibold">• Desconto máximo: 25%</p>
                  </div>

                  {discount > 0 && (
                    <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg p-3">
                      <p className="text-sm text-emerald-300 font-semibold">
                        🎉 Você economiza R$ {((currentPlan === 'basic' ? 14.99 : currentPlan === 'intermediate' ? 30.99 : 79.99) * (discount / 100)).toFixed(2)} por mês!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-slate-800/50 border-slate-700 p-5">
            <h3 className="text-lg font-bold text-white mb-4">Estatísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cyan-400">28</p>
                <p className="text-xs text-gray-400">Dias de uso</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">-3.5kg</p>
                <p className="text-xs text-gray-400">Progresso</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">42</p>
                <p className="text-xs text-gray-400">Treinos</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">156</p>
                <p className="text-xs text-gray-400">Refeições</p>
              </div>
            </div>
          </Card>

          {/* Upgrade CTA */}
          {currentPlan !== "premium" && (
            <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-2">Desbloqueie Todo o Potencial</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Upgrade para Premium e tenha acesso a rotinas personalizadas com IA, análise avançada e muito mais!
                  </p>
                  {discount > 0 && (
                    <p className="text-sm text-emerald-400 font-semibold mb-4">
                      💰 Seu desconto de {discount}% será aplicado automaticamente!
                    </p>
                  )}
                  <Button 
                    onClick={() => setShowPlans(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Ver Planos
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Menu Options */}
          <Card className="bg-slate-800/50 border-slate-700 divide-y divide-slate-700">
            <Link href="/profile/settings">
              <div className="flex items-center justify-between p-5 hover:bg-slate-700/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="text-white">Configurações</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
              </div>
            </Link>
            
            <div className="flex items-center justify-between p-5 hover:bg-slate-700/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-white">Gerenciar Assinatura</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </div>

            <div className="flex items-center justify-between p-5 hover:bg-slate-700/30 transition-colors cursor-pointer text-red-400">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="px-6 py-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Escolha seu Plano</h2>
            <Button 
              variant="ghost" 
              onClick={() => setShowPlans(false)}
              className="text-gray-400"
            >
              Voltar
            </Button>
          </div>

          {discount > 0 && (
            <Card className="bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 border-emerald-500/30 p-5">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-emerald-400" />
                <div>
                  <p className="font-bold text-white">Desconto Ativo: {discount}%</p>
                  <p className="text-sm text-emerald-300">Seus pontos garantem desconto em todos os planos!</p>
                </div>
              </div>
            </Card>
          )}

          {plans.map((plan) => {
            const finalPrice = calculateFinalPrice(plan.price)
            const savings = (plan.price - parseFloat(finalPrice)).toFixed(2)

            return (
              <Card 
                key={plan.id}
                className={`border-2 ${
                  plan.id === currentPlan 
                    ? "border-cyan-500 bg-cyan-600/10" 
                    : "border-slate-700 bg-slate-800/50"
                } p-6 relative overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    MAIS POPULAR
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    {discount > 0 ? (
                      <>
                        <span className="text-2xl text-gray-500 line-through">R$ {plan.price.toFixed(2)}</span>
                        <span className="text-4xl font-bold text-emerald-400">R$ {finalPrice}</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-white">R$ {plan.price.toFixed(2)}</span>
                    )}
                    <span className="text-gray-400">/mês</span>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-emerald-400 font-semibold mt-1">
                      💰 Economize R$ {savings}/mês com seus pontos!
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.id === currentPlan ? (
                  <Button 
                    disabled
                    className="w-full bg-slate-600"
                    size="lg"
                  >
                    Plano Atual
                  </Button>
                ) : (
                  <Button 
                    className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90`}
                    size="lg"
                  >
                    {plan.id === "premium" ? "Fazer Upgrade" : "Selecionar Plano"}
                  </Button>
                )}
              </Card>
            )
          })}

          <Card className="bg-blue-600/20 border-blue-500/30 p-5">
            <p className="text-sm text-gray-300 text-center">
              💳 Pagamento seguro • Cancele quando quiser • Sem taxas ocultas
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}
