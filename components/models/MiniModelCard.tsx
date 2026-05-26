import Link from "next/link"

import { StandardCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type { Model } from "@/lib/types"

interface MiniModelCardProps {
  model: Model
}

/**
 * Compact model card for the "similar models" + related-rail surfaces —
 * smaller than the directory-grid ModelCard, name + composite + access.
 */
export function MiniModelCard({ model }: MiniModelCardProps) {
  return (
    <Link
      href={`/models/${model.slug}`}
      className="group block transition-transform duration-150 hover:-translate-y-0.5"
    >
      <StandardCard className="!p-4 group-hover:border-strong">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-tertiary text-micro truncate font-mono">
              {model.organization ?? "Independent"}
            </div>
            <div className="text-primary text-body mt-1 truncate font-semibold">
              {model.name}
            </div>
          </div>
          {typeof model.compositeScore === "number" ? (
            <Badge variant="default" className="shrink-0 font-mono">
              {model.compositeScore.toFixed(0)}
            </Badge>
          ) : null}
        </div>
        <p className="text-tertiary text-caption mt-2 line-clamp-2">
          {model.shortDescription}
        </p>
        <div className="text-tertiary text-micro mt-3 font-mono capitalize">
          {model.accessType.replace(/-/g, " ")}
        </div>
      </StandardCard>
    </Link>
  )
}
