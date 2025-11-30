"use client"

import { useState } from "react"
import { Camera, Clock, TrendingUp, ChevronLeft, Plus, Trash2, Edit2 } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/contexts/AppContext"
import type { Meal } from "@/contexts/AppContext"

export default function MealsPage() {
  const { getTodayMeals, getTodayCalories, updateMeal, deleteMeal } = useApp()
  const meals = getTodayMeals()
  const totalCalories = getTodayCalories()
  const goalCalories = 2200

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [editForm, setEditForm] = useState<Meal | null>(null)

  const handleDeleteClick = (meal: Meal) => {
    setSelectedMeal(meal)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedMeal) {
      deleteMeal(selectedMeal.id)
      setDeleteDialogOpen(false)
      setSelectedMeal(null)
    }
  }

  const handleEditClick = (meal: Meal) => {
    setSelectedMeal(meal)
    setEditForm({ ...meal })
    setEditDialogOpen(true)
  }

  const handleEditSave = () => {
    if (editForm) {
      updateMeal(editForm.id, editForm)
      setEditDialogOpen(false)
      setSelectedMeal(null)
      setEditForm(null)
    }
  }

  const updateEditForm = (field: keyof Meal, value: any) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-6 py-6 text-white">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Minhas Refeições</h1>
        </div>

        {/* Daily Progress */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-3xl font-bold text-white">{totalCalories}</p>
              <p className="text-sm text-cyan-100">de {goalCalories} calorias</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-400">{Math.round((totalCalories/goalCalories)*100)}%</p>
              <p className="text-xs text-cyan-100">do objetivo</p>
            </div>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-3 rounded-full transition-all"
              style={{ width: `${Math.min((totalCalories/goalCalories)*100, 100)}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4">
          <Link href="/meals/scan">
            <Card className="bg-gradient-to-br from-cyan-600 to-cyan-700 border-0 p-5 text-center hover:scale-105 transition-transform cursor-pointer">
              <Camera className="w-10 h-10 mx-auto mb-2 text-white" />
              <p className="font-semibold text-white text-sm">Escanear Foto</p>
            </Card>
          </Link>
          <Link href="/meals/manual">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 p-5 text-center hover:scale-105 transition-transform cursor-pointer">
              <Plus className="w-10 h-10 mx-auto mb-2 text-white" />
              <p className="font-semibold text-white text-sm">Adicionar Manualmente</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Meals List */}
      <div className="px-6 space-y-4">
        <h2 className="text-lg font-bold text-white mb-4">Hoje</h2>
        
        {meals.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
            <p className="text-gray-400">Nenhuma refeição registrada hoje</p>
            <p className="text-sm text-gray-500 mt-2">Adicione sua primeira refeição!</p>
          </Card>
        ) : (
          meals.map((meal) => (
            <Card key={meal.id} className="bg-slate-800/50 border-slate-700 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{meal.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{meal.time}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="text-right mr-2">
                    <p className="text-2xl font-bold text-cyan-400">{meal.calories}</p>
                    <p className="text-xs text-gray-400">calorias</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                    onClick={() => handleEditClick(meal)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    onClick={() => handleDeleteClick(meal)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">Proteína</p>
                  <p className="text-sm font-bold text-blue-400">{meal.protein.toFixed(2)}g</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">Carboidrato</p>
                  <p className="text-sm font-bold text-emerald-400">{meal.carbs.toFixed(2)}g</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">Gordura</p>
                  <p className="text-sm font-bold text-amber-400">{meal.fat.toFixed(2)}g</p>
                </div>
              </div>

              {/* Foods */}
              <div className="flex flex-wrap gap-2">
                {meal.foods.map((food, idx) => (
                  <span key={idx} className="text-xs bg-cyan-600/20 text-cyan-300 px-3 py-1 rounded-full">
                    {food}
                  </span>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Weekly Stats */}
      <div className="px-6 mt-8 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Esta Semana</h2>
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Média Diária</p>
              <p className="text-2xl font-bold text-white">2.150 cal</p>
            </div>
            <TrendingUp className="w-10 h-10 text-emerald-400" />
          </div>
        </Card>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja excluir a refeição "{selectedMeal?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Refeição</DialogTitle>
            <DialogDescription className="text-gray-400">
              Atualize as informações da refeição
            </DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Refeição</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => updateEditForm('name', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={editForm.time}
                  onChange={(e) => updateEditForm('time', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calorias</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={editForm.calories}
                    onChange={(e) => updateEditForm('calories', parseFloat(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Proteína (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.01"
                    value={editForm.protein}
                    onChange={(e) => updateEditForm('protein', parseFloat(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carboidratos (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.01"
                    value={editForm.carbs}
                    onChange={(e) => updateEditForm('carbs', parseFloat(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Gorduras (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.01"
                    value={editForm.fat}
                    onChange={(e) => updateEditForm('fat', parseFloat(e.target.value) || 0)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditSave}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
