"use client"

import { useEffect, useRef, useState } from "react"

interface StreamingTextProps {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
}

export function StreamingText({
  text,
  speed = 40,
  onComplete,
  className,
}: StreamingTextProps) {
  const [shown, setShown] = useState(0)
  const [reduce, setReduce] = useState(false)
  const completeRef = useRef(onComplete)
  completeRef.current = onComplete

  useEffect(() => {
    if (typeof window === "undefined") return
    const m = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduce(m.matches)
    const onChange = (e: MediaQueryListEvent) => setReduce(e.matches)
    m.addEventListener("change", onChange)
    return () => m.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    setShown(0)
    if (reduce) {
      setShown(text.length)
      completeRef.current?.()
      return
    }
    const ms = Math.max(8, Math.floor(1000 / speed))
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setShown(i)
      if (i >= text.length) {
        window.clearInterval(id)
        completeRef.current?.()
      }
    }, ms)
    return () => window.clearInterval(id)
  }, [text, speed, reduce])

  const isComplete = shown >= text.length

  return (
    <span className={className}>
      {text.slice(0, shown)}
      {!isComplete ? (
        <span
          aria-hidden="true"
          className="text-accent animate-caret-blink ml-0.5 inline-block"
        >
          ▍
        </span>
      ) : null}
    </span>
  )
}
