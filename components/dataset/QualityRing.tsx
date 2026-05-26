"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView } from "framer-motion"

interface QualityRingProps {
  score: number
}

const SIZE = 80
const STROKE = 6
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function QualityRing({ score }: QualityRingProps) {
  const ref = useRef<SVGSVGElement | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, score, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setProgress(v),
    })
    return () => controls.stop()
  }, [inView, score])

  const dashOffset = CIRCUMFERENCE * (1 - progress / 100)

  return (
    <div className="flex items-center gap-4">
      <div className="relative inline-flex">
        <svg
          ref={ref}
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
          aria-label={`Quality score ${score}`}
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-h4 text-primary font-semibold tabular-nums">
            {Math.round(progress)}
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-tertiary text-micro font-mono uppercase tracking-wider">
          Quality
        </span>
        <span className="text-secondary text-caption mt-1">out of 100</span>
      </div>
    </div>
  )
}
