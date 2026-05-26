"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { fadeUp } from "@/lib/motion-variants"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
