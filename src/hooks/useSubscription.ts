"use client"

import { useState, useEffect } from "react"
import { UserSubscription } from "@/types"
import { storage, STORAGE_KEYS } from "@/lib/storage"
import { checkLimit, hasFeature } from "@/lib/subscription"

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: "free",
    startDate: new Date().toISOString(),
    points: 0,
    discount: 0,
  })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Carregar assinatura do localStorage
    const storedSubscription = storage.get<UserSubscription>(STORAGE_KEYS.USER_SUBSCRIPTION)

    if (storedSubscription) {
      setSubscription(storedSubscription)
    } else {
      // Criar assinatura gratuita padrão
      const defaultSubscription: UserSubscription = {
        plan: "free",
        startDate: new Date().toISOString(),
        points: 0,
        discount: 0,
      }
      storage.setImmediate(STORAGE_KEYS.USER_SUBSCRIPTION, defaultSubscription)
      setSubscription(defaultSubscription)
    }

    setIsLoaded(true)
  }, [])

  const addPoints = (points: number) => {
    const updatedSubscription = {
      ...subscription,
      points: subscription.points + points,
    }
    setSubscription(updatedSubscription)
    storage.setImmediate(STORAGE_KEYS.USER_SUBSCRIPTION, updatedSubscription)
  }

  const checkFeature = (feature: Parameters<typeof hasFeature>[1]) => {
    return hasFeature(subscription, feature)
  }

  const checkUsageLimit = (
    feature: 'mealsPerDay' | 'workoutsPerWeek' | 'photoAnalysisPerMonth',
    currentUsage: number
  ) => {
    return checkLimit(subscription, feature, currentUsage)
  }

  return {
    subscription,
    isLoaded,
    addPoints,
    checkFeature,
    checkUsageLimit,
  }
}
