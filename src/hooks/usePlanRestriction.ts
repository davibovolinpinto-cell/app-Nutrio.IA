"use client"

import { useState } from "react"
import { PlanType, PLAN_FEATURES } from "@/lib/types"

export function usePlanRestriction() {
  // Em produção, buscar do contexto/estado global
  const [currentPlan] = useState<PlanType>("basic")
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [restrictedFeature, setRestrictedFeature] = useState<string>("")

  const checkFeatureAccess = (feature: keyof typeof PLAN_FEATURES.basic): boolean => {
    return PLAN_FEATURES[currentPlan][feature]
  }

  const requestFeatureAccess = (featureName: string, feature: keyof typeof PLAN_FEATURES.basic) => {
    if (!checkFeatureAccess(feature)) {
      setRestrictedFeature(featureName)
      setShowUpgradeDialog(true)
      return false
    }
    return true
  }

  return {
    currentPlan,
    checkFeatureAccess,
    requestFeatureAccess,
    showUpgradeDialog,
    setShowUpgradeDialog,
    restrictedFeature,
  }
}
