"use client"

import { Crown, X } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureName: string
}

export function UpgradeDialog({ open, onOpenChange, featureName }: UpgradeDialogProps) {
  const router = useRouter()

  const handleUpgrade = () => {
    onOpenChange(false)
    router.push("/profile?showPlans=true")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400" />
              Recurso Premium
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-300 pt-4">
            <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4 mb-4">
              <p className="font-semibold text-white mb-2">
                Esta função não está disponível no seu plano atual.
              </p>
              <p className="text-sm text-gray-300">
                {featureName} está disponível apenas nos planos superiores.
              </p>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-white">Desbloqueie agora:</p>
              <ul className="space-y-1 text-gray-300">
                <li>✓ Análise completa de micronutrientes</li>
                <li>✓ Rotinas personalizadas com IA</li>
                <li>✓ Relatórios avançados</li>
                <li>✓ Histórico detalhado ilimitado</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-600 text-white hover:bg-slate-700"
          >
            Agora não
          </Button>
          <Button
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <Crown className="w-4 h-4 mr-2" />
            Fazer Upgrade Agora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
