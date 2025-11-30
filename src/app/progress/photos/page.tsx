"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, Camera, Upload, Calendar } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BodyPhotosPage() {
  const [photos, setPhotos] = useState([
    {
      id: 1,
      date: "2024-01-15",
      front: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      side: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      back: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      weight: 82.0
    },
    {
      id: 2,
      date: "2024-02-15",
      front: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      side: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      back: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      weight: 78.5
    }
  ])

  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })
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
          <h1 className="text-2xl font-bold">Fotos Corporais</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Upload Section */}
        <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30 p-6">
          <div className="text-center mb-4">
            <Camera className="w-12 h-12 mx-auto mb-3 text-purple-400" />
            <h2 className="text-lg font-bold text-white mb-2">Adicionar Novas Fotos</h2>
            <p className="text-sm text-gray-300 mb-4">
              Tire fotos de frente, lado e costas para acompanhar sua evolução
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="hidden"
          />

          <div className="space-y-3">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Tirar Fotos
            </Button>
            
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full border-purple-600 text-purple-400 hover:bg-purple-600/10"
              size="lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Escolher da Galeria
            </Button>
          </div>
        </Card>

        {/* Photos Timeline */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Histórico de Fotos</h2>
          
          {photos.map((entry) => (
            <Card key={entry.id} className="bg-slate-800/50 border-slate-700 p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-semibold" suppressHydrationWarning>
                    {mounted ? formatDate(entry.date) : ''}
                  </span>
                </div>
                <span className="text-cyan-400 font-bold">{entry.weight} kg</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <img 
                    src={entry.front} 
                    alt="Frente" 
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs text-center text-gray-400">Frente</p>
                </div>
                <div>
                  <img 
                    src={entry.side} 
                    alt="Lado" 
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs text-center text-gray-400">Lado</p>
                </div>
                <div>
                  <img 
                    src={entry.back} 
                    alt="Costas" 
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs text-center text-gray-400">Costas</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="bg-blue-600/20 border-blue-500/30 p-5">
          <h3 className="font-bold text-white mb-3">💡 Dicas para Melhores Fotos</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Tire fotos sempre no mesmo horário</li>
            <li>• Use roupas justas ou trajes de banho</li>
            <li>• Mantenha a mesma iluminação</li>
            <li>• Fique na mesma posição e distância</li>
            <li>• Tire fotos a cada 2-4 semanas</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
