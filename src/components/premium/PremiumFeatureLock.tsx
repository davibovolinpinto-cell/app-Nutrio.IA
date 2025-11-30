"use client"

import { Lock } from "lucide-react"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PREMIUM_FEATURES } from "@/lib/subscription"

interface PremiumFeatureLockProps {
  children: ReactNode
  featureKey: keyof typeof PREMIUM_FEATURES
  isLocked: boolean
  className?: string
}

export function PremiumFeatureLock({
  children,
  featureKey,
  isLocked,
  className = "",
}: PremiumFeatureLockProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const router = useRouter()
  const feature = PREMIUM_FEATURES[featureKey]

  if (!isLocked) {
    return <>{children}</>
  }

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Conteúdo com blur e overlay */}
        <div className="relative">
          <div className="blur-sm grayscale opacity-60 pointer-events-none">
            {children}
          </div>

          {/* Overlay com cadeado */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm cursor-pointer hover:bg-slate-900/70 transition-colors"
            onClick={() => setShowUpgradeModal(true)}
          >
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <p className="text-white font-semibold mb-2">{feature.name}</p>
              <p className="text-sm text-gray-300 mb-4">{feature.description}</p>
              <Button
                size="sm"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowUpgradeModal(true)
                }}
              >
                Desbloquear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Upgrade */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Recurso Premium
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Este recurso não está disponível no seu plano atual
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">{feature.name}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-sm text-gray-300 mb-2">
                <span className="font-semibold text-white">Plano necessário:</span>{" "}
                {feature.requiredPlan === "premium" ? "Premium" : "Pro"}
              </p>
              <p className="text-xs text-gray-400">
                Faça upgrade para desbloquear este e outros recursos exclusivos
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpgradeModal(false)}
              className="border-slate-700 text-gray-300 hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setShowUpgradeModal(false)
                router.push("/subscription")
              }}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              Ver Planos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
