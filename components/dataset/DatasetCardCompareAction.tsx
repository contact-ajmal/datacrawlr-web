"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Check, PlusCircle } from "lucide-react"
import { toast } from "sonner"

import { useComparison } from "@/lib/stores/comparison"
import { cn } from "@/lib/utils"

interface DatasetCardCompareActionProps {
  slug: string
  name: string
  className?: string
}

export function DatasetCardCompareAction({
  slug,
  name,
  className,
}: DatasetCardCompareActionProps) {
  const ids = useComparison((s) => s.ids)
  const add = useComparison((s) => s.add)
  const remove = useComparison((s) => s.remove)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isAdded = mounted && ids.includes(slug)

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAdded) {
      remove(slug)
      toast(`Removed ${name} from comparison`)
    } else {
      add(slug)
      toast("Added to comparison")
    }
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      aria-label={isAdded ? `Remove ${name} from comparison` : `Add ${name} to comparison`}
      aria-pressed={isAdded}
      className={cn(
        "absolute z-10 inline-flex items-center gap-1 rounded-md p-1.5 transition-opacity",
        "bg-overlay/85 border-subtle border backdrop-blur-sm",
        "text-tertiary hover:text-primary",
        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
        isAdded && "text-accent opacity-100",
        className
      )}
    >
      {isAdded ? (
        <Check className="size-3" aria-hidden="true" />
      ) : (
        <PlusCircle className="size-3" aria-hidden="true" />
      )}
      <span className="text-micro">
        {isAdded ? "Added" : "Compare"}
      </span>
    </motion.button>
  )
}
