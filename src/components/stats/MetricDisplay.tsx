"use client"

import { Card } from "@/components/ui/card"

interface MetricDisplayProps {
  value: string | number
  label: string
  color?: "cyan" | "blue" | "emerald" | "purple" | "pink" | "orange"
  size?: "sm" | "md" | "lg"
}

const colorClasses = {
  cyan: "text-cyan-400",
  blue: "text-blue-400",
  emerald: "text-emerald-400",
  purple: "text-purple-400",
  pink: "text-pink-400",
  orange: "text-orange-400",
}

const sizeClasses = {
  sm: { value: "text-xl", label: "text-xs" },
  md: { value: "text-2xl", label: "text-xs" },
  lg: { value: "text-3xl", label: "text-sm" },
}

export function MetricDisplay({
  value,
  label,
  color = "cyan",
  size = "md",
}: MetricDisplayProps) {
  return (
    <div className="text-center">
      <p className={`font-bold ${colorClasses[color]} ${sizeClasses[size].value}`}>{value}</p>
      <p className={`text-gray-400 ${sizeClasses[size].label}`}>{label}</p>
    </div>
  )
}

interface MetricGridProps {
  metrics: Array<{
    value: string | number
    label: string
    color?: MetricDisplayProps["color"]
  }>
  columns?: 2 | 3 | 4
  className?: string
}

export function MetricGrid({ metrics, columns = 3, className = "" }: MetricGridProps) {
  return (
    <Card className={`bg-white/10 backdrop-blur-sm border-white/20 p-6 ${className}`}>
      <div className={`grid grid-cols-${columns} gap-4`}>
        {metrics.map((metric, index) => (
          <MetricDisplay
            key={index}
            value={metric.value}
            label={metric.label}
            color={metric.color}
          />
        ))}
      </div>
    </Card>
  )
}
