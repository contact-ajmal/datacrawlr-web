"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { formatNumber } from "@/lib/utils"

interface DonutSlice {
  key: string
  label: string
  value: number
  /** Any CSS color string (hex, var, oklch). */
  color: string
}

interface DonutChartProps {
  data: DonutSlice[]
  /** Total to display in the center. Defaults to sum of slice values. */
  total?: number
  /** Caption rendered under the big number (e.g. "datasets indexed"). */
  totalLabel?: string
  /** Donut diameter in px. */
  size?: number
  /** Stroke width — bigger ⇒ thinner inner hole. */
  strokeWidth?: number
  className?: string
}

const REVEAL_DELAY_MS = 60

export function DonutChart({
  data,
  total,
  totalLabel = "total",
  size = 200,
  strokeWidth = 28,
  className,
}: DonutChartProps) {
  const sum = data.reduce((s, d) => s + d.value, 0)
  const displayedTotal = total ?? sum
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // Cumulative offset for stroke-dasharray drawing.
  let offset = 0

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 sm:flex-row sm:items-start",
        className
      )}
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          role="img"
          aria-label={`Distribution donut chart, total ${displayedTotal}`}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth={strokeWidth}
          />
          {sum > 0 &&
            data.map((slice, i) => {
              const fraction = slice.value / sum
              const arc = fraction * circumference
              // dasharray "len gap" — `len` shows the slice, `gap` hides the rest
              const dasharray = `${arc} ${circumference - arc}`
              const dashoffset = -offset
              offset += arc
              return (
                <motion.circle
                  key={slice.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dasharray}
                  strokeDashoffset={dashoffset}
                  // Rotate so the first slice starts at 12 o'clock.
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: (i * REVEAL_DELAY_MS) / 1000,
                    ease: "easeOut",
                  }}
                />
              )
            })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-primary text-h3 font-mono font-medium tabular-nums">
            {formatNumber(displayedTotal)}
          </div>
          <div className="text-tertiary text-micro mt-1 uppercase tracking-widest">
            {totalLabel}
          </div>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:flex-1">
        {data.map((slice) => {
          const pct = sum > 0 ? (slice.value / sum) * 100 : 0
          return (
            <li
              key={slice.key}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ background: slice.color }}
                />
                <span className="text-secondary text-caption truncate capitalize">
                  {slice.label}
                </span>
              </div>
              <div className="text-tertiary text-micro shrink-0 font-mono tabular-nums">
                {formatNumber(slice.value)}
                <span className="text-tertiary/70 ml-1">
                  ({pct.toFixed(1)}%)
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
