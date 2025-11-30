"use client"

import { useState, useRef } from "react"
import { Camera, ChevronLeft, Upload, Loader2, CheckCircle2, AlertCircle, Lock, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePlanRestriction } from "@/hooks/usePlanRestriction"
import { UpgradeDialog } from "@/components/custom/UpgradeDialog"
import { MealAnalysis } from "@/lib/types"

export default function ScanMealPage() {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<MealAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRateLimitError, setIsRateLimitError] = useState(false)
  const [retryCountdown, setRetryCountdown] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  
  const { checkFeatureAccess, requestFeatureAccess, showUpgradeDialog, setShowUpgradeDialog, restrictedFeature } = usePlanRestriction()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setError(null)
        setIsRateLimitError(false)
        analyzeImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const startRetryCountdown = () => {
    setRetryCountdown(30)
    const interval = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const analyzeImage = async (imageData: string) => {
    setAnalyzing(true)
    setError(null)
    setIsRateLimitError(false)
    
    try {
      const includeMicronutrients = checkFeatureAccess('micronutrients')
      
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: imageData,
          includeMicronutrients 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Detectar erro de rate limit
        if (response.status === 429) {
          setIsRateLimitError(true)
          startRetryCountdown()
        }
        throw new Error(data.error || 'Não foi possível identificar sua refeição. Tente outra foto ou ajuste a iluminação.')
      }

      setResult(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Não foi possível identificar sua refeição. Tente outra foto ou ajuste a iluminação.'
      setError(errorMessage)
      console.error('Erro na análise:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleRetry = () => {
    if (image) {
      analyzeImage(image)
    }
  }

  const saveToHistory = () => {
    // Salvar no histórico (em produção, salvar no banco)
    router.push("/meals")
  }

  const handleViewMicronutrients = () => {
    if (!requestFeatureAccess('Análise completa de micronutrientes', 'micronutrients')) {
      return
    }
    // Lógica para exibir micronutrientes
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-6 py-6 text-white">
        <div className="flex items-center gap-4">
          <Link href="/meals">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Escanear Refeição</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Upload Area */}
        {!image && (
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-cyan-600/20 flex items-center justify-center">
                <Camera className="w-12 h-12 text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Tire uma foto da sua refeição</h2>
              <p className="text-gray-400 mb-6">A IA irá identificar os alimentos e calcular os nutrientes automaticamente</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <div className="space-y-3">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Tirar Foto
                </Button>
                
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-cyan-600 text-cyan-400 hover:bg-cyan-600/10"
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Escolher da Galeria
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Image Preview & Analysis */}
        {image && (
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
              <img src={image} alt="Refeição" className="w-full h-64 object-cover" />
            </Card>

            {analyzing && (
              <Card className="bg-slate-800/50 border-slate-700 p-8">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-cyan-400 animate-spin" />
                  <h3 className="text-lg font-bold text-white mb-2">Analisando sua refeição...</h3>
                  <p className="text-gray-400">Identificando alimentos e calculando nutrientes com precisão</p>
                </div>
              </Card>
            )}

            {error && (
              <Card className={`${isRateLimitError ? 'bg-amber-600/20 border-amber-500/30' : 'bg-red-600/20 border-red-500/30'} p-5`}>
                <div className="flex items-start gap-3 mb-4">
                  {isRateLimitError ? (
                    <Clock className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-white mb-1">
                      {isRateLimitError ? 'Serviço Temporariamente Ocupado' : 'Erro na Análise'}
                    </p>
                    <p className={`text-sm ${isRateLimitError ? 'text-amber-300' : 'text-red-300'}`}>
                      {error}
                    </p>
                    {isRateLimitError && retryCountdown > 0 && (
                      <p className="text-sm text-amber-400 mt-2 font-semibold">
                        Você poderá tentar novamente em {retryCountdown} segundos
                      </p>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={isRateLimitError ? handleRetry : () => {
                    setImage(null)
                    setError(null)
                    setResult(null)
                    setIsRateLimitError(false)
                  }}
                  variant="outline"
                  className={`w-full ${isRateLimitError ? 'border-amber-500 text-amber-400 hover:bg-amber-500/10' : 'border-red-500 text-red-400 hover:bg-red-500/10'}`}
                  disabled={isRateLimitError && retryCountdown > 0}
                >
                  {isRateLimitError 
                    ? (retryCountdown > 0 ? `Aguarde ${retryCountdown}s` : 'Tentar Novamente')
                    : 'Tentar Novamente'
                  }
                </Button>
              </Card>
            )}

            {result && !analyzing && (
              <div className="space-y-4">
                {/* Success Message */}
                <Card className="bg-emerald-600/20 border-emerald-500/30 p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <div>
                      <p className="font-bold text-white">Análise Concluída!</p>
                      <p className="text-sm text-emerald-300">Identificamos {result.foods.length} alimento(s)</p>
                    </div>
                  </div>
                </Card>

                {/* Totals */}
                <Card className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/30 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Total da Refeição</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-cyan-400">{result.totals.calories}</p>
                      <p className="text-sm text-gray-300">Calorias</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-blue-400">{result.totals.protein.toFixed(2)}g</p>
                        <p className="text-xs text-gray-400">Prot.</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-emerald-400">{result.totals.carbs.toFixed(2)}g</p>
                        <p className="text-xs text-gray-400">Carb.</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-amber-400">{result.totals.fat.toFixed(2)}g</p>
                        <p className="text-xs text-gray-400">Gord.</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Micronutrients Section */}
                {result.micronutrients ? (
                  <Card className="bg-purple-600/20 border-purple-500/30 p-5">
                    <h3 className="text-lg font-bold text-white mb-4">Micronutrientes</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Vitamina A</p>
                        <p className="text-sm font-bold text-purple-400">{result.micronutrients.vitaminA.toFixed(2)}mg</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Vitamina C</p>
                        <p className="text-sm font-bold text-purple-400">{result.micronutrients.vitaminC.toFixed(2)}mg</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Vitamina D</p>
                        <p className="text-sm font-bold text-purple-400">{result.micronutrients.vitaminD.toFixed(2)}mg</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Cálcio</p>
                        <p className="text-sm font-bold text-purple-400">{result.micronutrients.calcium.toFixed(2)}mg</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Ferro</p>
                        <p className="text-sm font-bold text-purple-400">{result.micronutrients.iron.toFixed(2)}mg</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Fibras</p>
                        <p className="text-sm font-bold text-purple-400">{result.micronutrients.fiber.toFixed(2)}g</p>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="bg-slate-800/50 border-slate-700 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-amber-400" />
                        <div>
                          <p className="font-semibold text-white">Análise de Micronutrientes</p>
                          <p className="text-sm text-gray-400">Disponível nos planos Intermediário e Premium</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleViewMicronutrients}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Desbloquear
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Foods Detected */}
                <Card className="bg-slate-800/50 border-slate-700 p-5">
                  <h3 className="text-lg font-bold text-white mb-4">Alimentos Identificados</h3>
                  <div className="space-y-3">
                    {result.foods.map((food, idx) => (
                      <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-white">{food.name}</p>
                            <p className="text-sm text-gray-400">{food.portion}</p>
                          </div>
                          <p className="text-lg font-bold text-cyan-400">{food.calories} cal</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">P: </span>
                            <span className="text-blue-400 font-semibold">{food.protein.toFixed(2)}g</span>
                          </div>
                          <div>
                            <span className="text-gray-400">C: </span>
                            <span className="text-emerald-400 font-semibold">{food.carbs.toFixed(2)}g</span>
                          </div>
                          <div>
                            <span className="text-gray-400">G: </span>
                            <span className="text-amber-400 font-semibold">{food.fat.toFixed(2)}g</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {result.notes && (
                  <Card className="bg-blue-600/10 border-blue-500/30 p-4">
                    <p className="text-sm text-blue-300">
                      <span className="font-semibold">Observação:</span> {result.notes}
                    </p>
                  </Card>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  <Button 
                    onClick={saveToHistory}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    size="lg"
                  >
                    Salvar no Histórico
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setImage(null)
                      setResult(null)
                      setError(null)
                      setIsRateLimitError(false)
                      setRetryCountdown(0)
                    }}
                    variant="outline"
                    className="w-full border-slate-600 text-gray-300 hover:bg-slate-700"
                    size="lg"
                  >
                    Escanear Outra Refeição
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <UpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        featureName={restrictedFeature}
      />
    </div>
  )
}
