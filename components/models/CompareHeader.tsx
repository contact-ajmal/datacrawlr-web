"use client"

import { useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"

import { useModelComparison } from "@/lib/stores/model-comparison"
import { cn } from "@/lib/utils"

interface CompareHeaderProps {
  /** Ordered list of {slug, name} pairs for the column headers. */
  models: { slug: string; name: string; organization?: string }[]
}

/**
 * Sticky two-row chrome above the comparison sections — provides a label
 * column plus per-model pills that link to the detail page and have an X
 * button to remove the slug from the URL (which re-renders the page).
 *
 * Stays in sync with the zustand tray so removing here also removes the
 * model from the floating tray.
 */
export function CompareHeader({ models }: CompareHeaderProps) {
  const router = useRouter()
  const params = useSearchParams()
  const removeFromStore = useModelComparison((s) => s.remove)

  const remove = useCallback(
    (slug: string) => {
      const ids = (params.get("ids") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && s !== slug)
      const next = new URLSearchParams(params.toString())
      if (ids.length === 0) {
        router.replace("/models", { scroll: false })
      } else {
        next.set("ids", ids.join(","))
        router.replace(`/models/compare?${next.toString()}`, { scroll: false })
      }
      removeFromStore(slug)
    },
    [params, router, removeFromStore]
  )

  // Match the page body's grid template so the columns line up. We set this
  // inline (rather than via Tailwind class) so the column count is dynamic.
  const gridTemplate = `160px repeat(${models.length}, 1fr)`

  return (
    <div
      className={cn(
        "bg-base/90 border-subtle sticky top-14 z-30 -mx-6 border-b px-6 py-4 backdrop-blur-md"
      )}
    >
      <div
        className="grid items-center gap-4"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        <span className="text-tertiary text-micro font-mono uppercase tracking-widest">
          Comparing
        </span>
        {models.map((m) => (
          <div
            key={m.slug}
            className="bg-elevated border-subtle flex items-center justify-between gap-2 rounded-md border px-3 py-2"
          >
            <Link
              href={`/models/${m.slug}`}
              className="text-primary text-caption min-w-0 truncate font-medium hover:underline"
            >
              {m.name}
            </Link>
            <button
              type="button"
              onClick={() => remove(m.slug)}
              className="text-tertiary hover:text-primary shrink-0 transition-colors"
              aria-label={`Remove ${m.name} from comparison`}
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
