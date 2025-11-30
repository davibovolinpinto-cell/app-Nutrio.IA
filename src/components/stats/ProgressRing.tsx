"use client"

import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface ProgressRingProps {
  value: number
  max: number
  label: string
  icon?: LucideIcon
  color?: "cyan" | "blue" | "emerald" | "purple" | "pink" | "orange"
  size?: "sm" | "md" | "lg"
  showPercentage?: boolean
}

const colorClasses = {
  cyan: { stroke: "stroke-cyan-500", text: "text-cyan-400", bg: "bg-cyan-600/20" },
  blue: { stroke: "stroke-blue-500", text: "text-blue-400", bg: "bg-blue-600/20" },
  emerald: { stroke: "stroke-emerald-500", text: "text-emerald-400", bg: "bg-emerald-600/20" },
  purple: { stroke: "stroke-purple-500", text: "text-purple-400", bg: "bg-purple-600/20" },
  pink: { stroke: "stroke-pink-500", text: "text-pink-400", bg: "bg-pink-600/20" },
  orange: { stroke: "stroke-orange-500", text: "text-orange-400", bg: "bg-orange-600/20" },
}

const sizeClasses = {
  sm: { ring: 80, stroke: 6, text: "text-lg", label: "text-xs" },
  md: { ring: 120, stroke: 8, text: "text-2xl", label: "text-sm" },
  lg: { ring: 160, stroke: 10, text: "text-3xl", label: "text-base" },
}

export function ProgressRing({
  value,
  max,
  label,
  icon: Icon,
  color = "cyan",
  size = "md",
  showPercentage = false,
}: ProgressRingProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const { ring, stroke, text, label: labelSize } = sizeClasses[size]
  const radius = (ring - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: ring, height: ring }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={ring} height={ring}>
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            fill="none"
            className="text-slate-700"
          />
          {/* Progress circle */}
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${colorClasses[color].stroke} transition-all duration-500`}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {Icon && (
            <div className={`w-8 h-8 rounded-full ${colorClasses[color].bg} flex items-center justify-center mb-1`}>
              <Icon className={`w-4 h-4 ${colorClasses[color].text}`} />
            </div>
          )}
          <span className={`font-bold ${colorClasses[color].text} ${text}`}>
            {showPercentage ? `${Math.round(percentage)}%` : value}
          </span>
          {!showPercentage && (
            <span className="text-xs text-gray-400">/ {max}</span>
          )}
        </div>
      </div>

      <p className={`text-center text-gray-300 font-medium ${labelSize}`}>{label}</p>
    </div>
  )
}
