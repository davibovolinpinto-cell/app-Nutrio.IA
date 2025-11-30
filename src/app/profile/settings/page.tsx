"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Bell, Moon, Globe, Lock, Trash2, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUserProfile } from "@/hooks/useUserProfile"

export default function SettingsPage() {
  const router = useRouter()
  const { profile, updateProfile, isLoaded } = useUserProfile()
  
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState("pt-BR")
  const [showSuccess, setShowSuccess] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    weight: 0,
    height: 0,
    age: 0,
    gender: "",
    activityLevel: ""
  })

  // Carregar dados do perfil quando disponível
  useEffect(() => {
    if (isLoaded) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
        gender: profile.gender,
        activityLevel: profile.activityLevel
      })
    }
  }, [isLoaded, profile])

  const handleSavePersonalInfo = () => {
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    })
    
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleSavePhysicalData = () => {
    updateProfile({
      weight: formData.weight,
      height: formData.height,
      age: formData.age,
      gender: formData.gender,
      activityLevel: formData.activityLevel
    })
    
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top">
          <Save className="w-5 h-5" />
          <span className="font-medium">Alterações salvas com sucesso!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-6 text-white">
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Personal Info */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Informações Pessoais</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Nome Completo</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Telefone</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <Button 
            onClick={handleSavePersonalInfo}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </Card>

        {/* Physical Data */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Dados Físicos</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Peso (kg)</label>
              <input 
                type="number" 
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Altura (cm)</label>
              <input 
                type="number" 
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Idade</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Sexo</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm text-gray-400 mb-1 block">Nível de Atividade</label>
            <select 
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="sedentario">Sedentário</option>
              <option value="leve">Levemente Ativo</option>
              <option value="moderado">Moderadamente Ativo</option>
              <option value="intenso">Muito Ativo</option>
              <option value="extremo">Extremamente Ativo</option>
            </select>
          </div>

          <Button 
            onClick={handleSavePhysicalData}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Atualizar Dados
          </Button>
        </Card>

        {/* App Preferences */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Preferências do App</h3>
          
          <div className="space-y-4">
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">Notificações</p>
                  <p className="text-xs text-gray-400">Receber lembretes e alertas</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notifications ? "bg-cyan-600" : "bg-slate-600"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    notifications ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">Modo Escuro</p>
                  <p className="text-xs text-gray-400">Tema escuro do aplicativo</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  darkMode ? "bg-cyan-600" : "bg-slate-600"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    darkMode ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">Idioma</p>
                  <p className="text-xs text-gray-400">Português (Brasil)</p>
                </div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="pt-BR">Português</option>
                <option value="en-US">English</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Segurança</h3>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-slate-600 text-white hover:bg-slate-700/50"
            >
              <Lock className="w-4 h-4 mr-3" />
              Alterar Senha
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start border-slate-600 text-white hover:bg-slate-700/50"
            >
              <Lock className="w-4 h-4 mr-3" />
              Autenticação em Dois Fatores
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-950/30 border-red-900/50 p-6">
          <h3 className="text-lg font-bold text-red-400 mb-4">Zona de Perigo</h3>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-red-800 text-red-400 hover:bg-red-950/50"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Excluir Conta
          </Button>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Esta ação é irreversível e todos os seus dados serão perdidos
          </p>
        </Card>
      </div>
    </div>
  )
}
