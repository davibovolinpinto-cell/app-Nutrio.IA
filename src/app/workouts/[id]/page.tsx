"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Play, Pause, Clock, Zap, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Exercise, calculateCaloriesBurned } from "@/lib/types"
import { useUserProfile } from "@/hooks/useUserProfile"

export default function WorkoutDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { profile } = useUserProfile()
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])

  // Mock workout data - em produção, buscar do banco
  const workout = {
    id: parseInt(params.id),
    title: "Treino HIIT Matinal",
    duration: 15,
    level: "intermediate" as const,
    location: "home" as const,
    intensity: "intense" as const,
    description: "Alta intensidade para queimar gordura",
    exercises: [
      {
        id: "1",
        name: "Polichinelos",
        duration: 45,
        instructions: [
          "Fique em pé com os pés juntos e braços ao lado do corpo",
          "Pule abrindo as pernas e levantando os braços acima da cabeça",
          "Retorne à posição inicial com outro pulo",
          "Mantenha um ritmo constante e respiração controlada"
        ],
        commonMistakes: [
          "Não dobrar os joelhos ao pousar",
          "Movimentos muito rápidos sem controle",
          "Não aquecer antes de começar"
        ],
        videoUrl: "https://www.youtube.com/embed/c4DAnQ6DtF8",
        images: [
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        ]
      },
      {
        id: "2",
        name: "Agachamento",
        duration: 45,
        sets: 3,
        reps: "15",
        instructions: [
          "Fique em pé com os pés na largura dos ombros",
          "Desça o quadril como se fosse sentar em uma cadeira",
          "Mantenha o peso nos calcanhares",
          "Suba de volta à posição inicial"
        ],
        commonMistakes: [
          "Joelhos ultrapassando a linha dos pés",
          "Costas arqueadas",
          "Não descer o suficiente"
        ],
        images: [
          "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=400&h=300&fit=crop"
        ]
      },
      {
        id: "3",
        name: "Flexão de Braço",
        duration: 45,
        sets: 3,
        reps: "10-12",
        instructions: [
          "Posição de prancha com mãos na largura dos ombros",
          "Desça o corpo mantendo o core ativado",
          "Cotovelos a 45 graus do corpo",
          "Empurre de volta à posição inicial"
        ],
        commonMistakes: [
          "Quadril muito alto ou muito baixo",
          "Cotovelos muito abertos",
          "Não descer completamente"
        ],
        videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
        images: [
          "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop"
        ]
      },
      {
        id: "4",
        name: "Mountain Climbers",
        duration: 45,
        instructions: [
          "Comece em posição de prancha alta",
          "Traga um joelho em direção ao peito",
          "Alterne rapidamente as pernas",
          "Mantenha o core contraído"
        ],
        commonMistakes: [
          "Quadril muito alto",
          "Movimento muito lento",
          "Não manter o core ativado"
        ],
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
        ]
      },
      {
        id: "5",
        name: "Prancha",
        duration: 60,
        instructions: [
          "Apoie-se nos antebraços e dedos dos pés",
          "Mantenha o corpo em linha reta",
          "Contraia abdômen e glúteos",
          "Respire normalmente"
        ],
        commonMistakes: [
          "Quadril caído",
          "Ombros tensos",
          "Prender a respiração"
        ],
        videoUrl: "https://www.youtube.com/embed/pSHjTRCQxIw",
        images: [
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
        ]
      }
    ] as Exercise[]
  }

  const caloriesBurned = calculateCaloriesBurned(
    workout.duration,
    workout.intensity,
    profile.weight || 70
  )

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false)
            handleCompleteExercise()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, timeRemaining])

  const handleStartExercise = () => {
    setTimeRemaining(workout.exercises[currentExercise].duration)
    setIsPlaying(true)
  }

  const handleCompleteExercise = () => {
    setCompletedExercises([...completedExercises, currentExercise])
    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setTimeRemaining(0)
    } else {
      // Treino completo
      router.push("/workouts?completed=true")
    }
  }

  const handleSkipExercise = () => {
    setIsPlaying(false)
    setTimeRemaining(0)
    if (currentExercise < workout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
    }
  }

  const exercise = workout.exercises[currentExercise]
  const progress = ((currentExercise + 1) / workout.exercises.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/workouts">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{workout.title}</h1>
            <p className="text-sm text-cyan-100">{workout.description}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Exercício {currentExercise + 1} de {workout.exercises.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Calories Info */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-sm">Calorias estimadas</span>
            </div>
            <span className="text-xl font-bold">{caloriesBurned} kcal</span>
          </div>
          <p className="text-xs text-cyan-100 mt-1">
            Baseado em {workout.duration} min de intensidade {workout.intensity === 'intense' ? 'alta' : workout.intensity === 'moderate' ? 'moderada' : 'leve'}
          </p>
        </Card>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Exercise Name */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">{exercise.name}</h2>
          {exercise.sets && exercise.reps && (
            <p className="text-gray-400">{exercise.sets} séries × {exercise.reps} repetições</p>
          )}
        </div>

        {/* Timer */}
        {timeRemaining > 0 && (
          <Card className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/30 p-8">
            <div className="text-center">
              <p className="text-6xl font-bold text-white mb-2">{timeRemaining}s</p>
              <p className="text-gray-300">Continue assim!</p>
            </div>
          </Card>
        )}

        {/* Video or Images */}
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          {exercise.videoUrl ? (
            <div className="aspect-video">
              <iframe
                src={exercise.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : exercise.images && exercise.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 p-2">
              {exercise.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${exercise.name} - posição ${idx + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="aspect-video bg-slate-700/50 flex items-center justify-center">
              <p className="text-gray-400">Sem mídia disponível</p>
            </div>
          )}
        </Card>

        {/* Instructions */}
        <Card className="bg-slate-800/50 border-slate-700 p-5">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Como Executar
          </h3>
          <ol className="space-y-2">
            {exercise.instructions.map((instruction, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <span className="text-gray-300 text-sm">{instruction}</span>
              </li>
            ))}
          </ol>
        </Card>

        {/* Common Mistakes */}
        <Card className="bg-amber-600/10 border-amber-500/30 p-5">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Erros Comuns a Evitar
          </h3>
          <ul className="space-y-2">
            {exercise.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-amber-400">•</span>
                <span className="text-gray-300 text-sm">{mistake}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isPlaying && timeRemaining === 0 ? (
            <Button
              onClick={handleStartExercise}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar Exercício
            </Button>
          ) : (
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              size="lg"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Continuar
                </>
              )}
            </Button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCompleteExercise}
              variant="outline"
              className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Concluir
            </Button>
            <Button
              onClick={handleSkipExercise}
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              Pular
            </Button>
          </div>
        </div>

        {/* Completed Exercises */}
        {completedExercises.length > 0 && (
          <Card className="bg-emerald-600/10 border-emerald-500/30 p-4">
            <p className="text-sm text-emerald-300 text-center">
              ✓ {completedExercises.length} exercício(s) concluído(s)
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
