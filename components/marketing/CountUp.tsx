"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView } from "framer-motion"

interface CountUpProps {
  value: number
  format?: (n: number) => string
  duration?: number
  amount?: number
}

export function CountUp({
  value,
  format = (n) => Math.round(n).toString(),
  duration = 1.4,
  amount = 0.4,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, amount })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  return <span ref={ref}>{format(display)}</span>
}
