"use client"

import { Children, type ReactNode, isValidElement } from "react"
import { motion } from "framer-motion"

import { fadeUp, staggerContainer } from "@/lib/motion-variants"
import { cn } from "@/lib/utils"

interface StaggerChildrenProps {
  children: ReactNode
  className?: string
  itemClassName?: string
  amount?: number
  as?: "div" | "ul" | "ol"
  inView?: boolean
}

export function StaggerChildren({
  children,
  className,
  itemClassName,
  amount = 0.15,
  as = "div",
  inView = true,
}: StaggerChildrenProps) {
  const Container = as === "div" ? motion.div : as === "ul" ? motion.ul : motion.ol
  const Item = as === "div" ? motion.div : motion.li

  return (
    <Container
      initial="hidden"
      animate={inView ? undefined : "visible"}
      whileInView={inView ? "visible" : undefined}
      viewport={inView ? { once: true, amount } : undefined}
      variants={staggerContainer}
      className={cn(className)}
    >
      {Children.map(children, (child, i) =>
        isValidElement(child) ? (
          <Item
            key={
              "key" in (child as { key?: React.Key }) &&
              (child as { key?: React.Key }).key != null
                ? (child as { key: React.Key }).key
                : i
            }
            variants={fadeUp}
            className={cn(itemClassName)}
          >
            {child}
          </Item>
        ) : null
      )}
    </Container>
  )
}
