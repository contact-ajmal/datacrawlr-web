"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

import { fadeUp } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: ReactNode
  className?: string
  amount?: number
  variants?: Variants
  asChild?: never
}

export function FadeIn({
  children,
  className,
  amount = 0.2,
  variants = fadeUp,
}: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
