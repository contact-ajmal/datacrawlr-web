"use client"

import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ButtonProps = React.ComponentProps<typeof Button>

interface MotionButtonProps extends ButtonProps {
  wrapperClassName?: string
}

export function MotionButton({
  wrapperClassName,
  ...props
}: MotionButtonProps) {
  return (
    <motion.span
      whileTap={{ scale: 0.98 }}
      className={cn("inline-flex", wrapperClassName)}
    >
      <Button {...props} />
    </motion.span>
  )
}
