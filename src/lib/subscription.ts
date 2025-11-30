import { SubscriptionPlan, UserSubscription } from '@/types'

// Definição dos planos disponíveis
export const PLANS: Record<'free' | 'premium' | 'pro', SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    features: [
      '3 refeições por dia',
      '2 treinos por semana',
      '5 análises de foto por mês',
      'Estatísticas básicas',
    ],
    limits: {
      mealsPerDay: 3,
      workoutsPerWeek: 2,
      photoAnalysisPerMonth: 5,
      customWorkouts: false,
      advancedStats: false,
      nutritionPlans: false,
      videoExercises: false,
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 29.90,
    features: [
      'Refeições ilimitadas',
      'Treinos ilimitados',
      '50 análises de foto por mês',
      'Treinos personalizados',
      'Estatísticas avançadas',
      'Vídeos de exercícios',
    ],
    limits: {
      mealsPerDay: Infinity,
      workoutsPerWeek: Infinity,
      photoAnalysisPerMonth: 50,
      customWorkouts: true,
      advancedStats: true,
      nutritionPlans: false,
      videoExercises: true,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 49.90,
    features: [
      'Tudo do Premium',
      'Análises de foto ilimitadas',
      'Planos nutricionais personalizados',
      'Suporte prioritário',
      'Relatórios detalhados',
    ],
    limits: {
      mealsPerDay: Infinity,
      workoutsPerWeek: Infinity,
      photoAnalysisPerMonth: Infinity,
      customWorkouts: true,
      advancedStats: true,
      nutritionPlans: true,
      videoExercises: true,
    },
  },
}

// Calcular desconto baseado em pontos
export function calculateDiscount(points: number): number {
  // A cada 2000 pontos = 5% de desconto (máximo 25%)
  const discountTiers = Math.floor(points / 2000)
  return Math.min(discountTiers * 5, 25)
}

// Calcular preço com desconto
export function calculatePrice(planId: 'free' | 'premium' | 'pro', discount: number): number {
  const basePrice = PLANS[planId].price
  if (basePrice === 0) return 0
  return basePrice * (1 - discount / 100)
}

// Verificar se recurso está disponível
export function hasFeature(
  subscription: UserSubscription,
  feature: keyof SubscriptionPlan['limits']
): boolean {
  const plan = PLANS[subscription.plan]
  return plan.limits[feature] === true || plan.limits[feature] === Infinity
}

// Verificar limite de uso
export function checkLimit(
  subscription: UserSubscription,
  feature: 'mealsPerDay' | 'workoutsPerWeek' | 'photoAnalysisPerMonth',
  currentUsage: number
): { allowed: boolean; limit: number; remaining: number } {
  const plan = PLANS[subscription.plan]
  const limit = plan.limits[feature] as number

  if (limit === Infinity) {
    return { allowed: true, limit: Infinity, remaining: Infinity }
  }

  const remaining = Math.max(0, limit - currentUsage)
  const allowed = currentUsage < limit

  return { allowed, limit, remaining }
}

// Recursos que requerem upgrade
export const PREMIUM_FEATURES = {
  customWorkouts: {
    name: 'Treinos Personalizados',
    description: 'Crie treinos customizados baseados nos seus objetivos',
    requiredPlan: 'premium' as const,
  },
  advancedStats: {
    name: 'Estatísticas Avançadas',
    description: 'Gráficos detalhados e análises de progresso',
    requiredPlan: 'premium' as const,
  },
  nutritionPlans: {
    name: 'Planos Nutricionais',
    description: 'Planos alimentares personalizados por IA',
    requiredPlan: 'pro' as const,
  },
  videoExercises: {
    name: 'Vídeos de Exercícios',
    description: 'Biblioteca completa de vídeos demonstrativos',
    requiredPlan: 'premium' as const,
  },
  unlimitedPhotos: {
    name: 'Análises Ilimitadas',
    description: 'Análise ilimitada de fotos de refeições',
    requiredPlan: 'pro' as const,
  },
}
