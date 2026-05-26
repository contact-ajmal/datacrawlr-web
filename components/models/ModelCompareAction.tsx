"use client"

import { useEffect, useState } from "react"
import { Check, PlusCircle } from "lucide-react"
import { toast } from "sonner"

import {
  MODEL_COMPARISON_MAX,
  useModelComparison,
} from "@/lib/stores/model-comparison"
import { cn } from "@/lib/utils"

interface ModelCompareActionProps {
  slug: string
  name: string
  className?: string
}

/**
 * Floating "Compare" button surfaced in the ModelCard's top-right on
 * hover. Stops Link navigation so the click only mutates the comparison
 * tray. Pairs with a sonner toast for confirmation feedback.
 */
export function ModelCompareAction({
  slug,
  name,
  className,
}: ModelCompareActionProps) {
  const slugs = useModelComparison((s) => s.slugs)
  const add = useModelComparison((s) => s.add)
  const remove = useModelComparison((s) => s.remove)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const present = mounted && slugs.includes(slug)
  const atCap = mounted && !present && slugs.length >= MODEL_COMPARISON_MAX

  return (
    <button
      type="button"
      aria-label={
        present
          ? `Remove ${name} from comparison`
          : `Add ${name} to comparison`
      }
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (atCap) {
          toast(`Comparison full (${MODEL_COMPARISON_MAX} max)`, {
            description: `Remove a model from the tray to add ${name}.`,
          })
          return
        }
        if (present) {
          remove(slug)
          toast(`Removed ${name}`)
        } else {
          add(slug)
          toast(`Added ${name} to comparison`)
        }
      }}
      className={cn(
        "bg-overlay/90 border-subtle text-tertiary backdrop-blur-sm",
        "hover:text-primary hover:border-strong inline-flex items-center gap-1 rounded-full border px-2 py-1 text-micro font-medium transition-colors",
        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
        present ? "text-accent opacity-100" : "",
        atCap ? "cursor-not-allowed opacity-40" : "",
        className
      )}
    >
      {present ? (
        <Check className="size-3" aria-hidden="true" />
      ) : (
        <PlusCircle className="size-3" aria-hidden="true" />
      )}
      {present ? "In comparison" : "Compare"}
    </button>
  )
}
