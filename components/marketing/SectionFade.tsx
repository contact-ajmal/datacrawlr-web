"use client"

import type { ReactNode } from "react"

import { FadeIn } from "@/components/motion/FadeIn"

interface SectionFadeProps {
  children: ReactNode
  className?: string
  amount?: number
}

// Backwards-compatible alias for FadeIn — kept so older homepage imports continue to work.
export function SectionFade(props: SectionFadeProps) {
  return <FadeIn {...props} />
}
