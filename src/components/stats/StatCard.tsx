"use client"

import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtext?: string
  color?: "cyan" | "blue" | "emerald" | "purple" | "pink" | "orange"
  className?: string
}

const colorClasses = {
  cyan: "from-cyan-600 to-cyan-700",
  blue: "from-blue-600 to-blue-700",
  emerald: "from-emerald-600 to-emerald-700",
  purple: "from-purple-600 to-purple-700",
  pink: "from-pink-600 to-pink-700",
  orange: "from-orange-600 to-orange-700",
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  color = "cyan",
  className = "",
}: StatCardProps) {
  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} border-0 p-4 text-white ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold truncate">{value}</p>
          <p className="text-xs text-white/80 truncate">{label}</p>
          {subtext && <p className="text-xs text-white/60 truncate mt-0.5">{subtext}</p>}
        </div>
      </div>
    </Card>
  )
}
