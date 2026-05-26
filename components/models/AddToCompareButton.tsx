"use client"

import { useEffect, useState } from "react"
import { Check, GitCompare } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  MODEL_COMPARISON_MAX,
  useModelComparison,
} from "@/lib/stores/model-comparison"

interface AddToCompareButtonProps {
  slug: string
}

export function AddToCompareButton({ slug }: AddToCompareButtonProps) {
  const slugs = useModelComparison((s) => s.slugs)
  const add = useModelComparison((s) => s.add)
  const remove = useModelComparison((s) => s.remove)

  // Avoid hydration mismatch — the persist middleware rehydrates after mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const present = mounted && slugs.includes(slug)
  const atCap = mounted && slugs.length >= MODEL_COMPARISON_MAX && !present

  return (
    <Button
      variant={present ? "default" : "secondary"}
      size="sm"
      className="w-full justify-start"
      onClick={() => (present ? remove(slug) : add(slug))}
      disabled={atCap}
    >
      {present ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <GitCompare className="size-4" aria-hidden="true" />
      )}
      {atCap
        ? `Comparison full (${MODEL_COMPARISON_MAX})`
        : present
          ? "In comparison"
          : "Add to comparison"}
      {mounted && slugs.length > 0 && !atCap ? (
        <span className="text-tertiary text-micro ml-auto font-mono">
          {slugs.length}/{MODEL_COMPARISON_MAX}
        </span>
      ) : null}
    </Button>
  )
}
