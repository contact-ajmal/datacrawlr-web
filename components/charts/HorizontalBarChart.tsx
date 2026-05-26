"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { formatNumber } from "@/lib/utils"

interface HorizontalBarChartProps {
  data: { label: string; value: number }[]
  maxBars?: number
  height?: number
  className?: string
}

// Per-bar reveal: scale-x from 0 to 1, anchored on the left, staggered by
// ~40ms so the bars feel like they're filling in one by one rather than
// snapping in unison.
const BAR_DELAY_MS = 40

export function HorizontalBarChart({
  data,
  maxBars = 8,
  height,
  className,
}: HorizontalBarChartProps) {
  const bars = data.slice(0, maxBars)
  const peak = bars.reduce((m, d) => Math.max(m, d.value), 0)

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      style={height ? { minHeight: height } : undefined}
    >
      {bars.length === 0 ? (
        <p className="text-tertiary text-caption">No data available.</p>
      ) : (
        bars.map((d, i) => {
          const pct = peak > 0 ? (d.value / peak) * 100 : 0
          return (
            <div
              key={d.label}
              className="grid items-center gap-4"
              style={{ gridTemplateColumns: "140px 1fr" }}
            >
              <span
                className="text-secondary text-caption truncate capitalize"
                title={d.label}
              >
                {d.label.replace(/_/g, " ")}
              </span>
              <div className="flex items-center gap-3">
                <div className="bg-elevated relative h-7 flex-1 overflow-hidden rounded-r-md">
                  <motion.div
                    className="bg-accent/60 absolute left-0 top-0 h-full origin-left rounded-r-md"
                    style={{ width: `${pct}%` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                      delay: (i * BAR_DELAY_MS) / 1000,
                    }}
                  />
                </div>
                <span className="text-tertiary text-caption w-16 shrink-0 text-right font-mono tabular-nums">
                  {formatNumber(d.value)}
                </span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
