import Link from "next/link"
import { FileText } from "lucide-react"

import { DatasetCardCompareAction } from "@/components/dataset/DatasetCardCompareAction"
import { StandardCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import { MODALITY_ICONS } from "@/lib/modality-icons"
import type { Dataset } from "@/lib/types"
import { cn, formatBytes, formatNumber } from "@/lib/utils"

type DatasetCardVariant = "default" | "curator" | "paper"

interface DatasetCardProps {
  dataset: Dataset
  variant?: DatasetCardVariant
  className?: string
}

export function DatasetCard({
  dataset,
  variant = "default",
  className,
}: DatasetCardProps) {
  const Icon = MODALITY_ICONS[dataset.modality]
  const isCurator = variant === "curator"
  const isPaper = variant === "paper"

  return (
    <Link
      href={`/datasets/${dataset.slug}`}
      className="group block h-full"
      data-slot="dataset-card"
    >
      <StandardCard className={cn("relative h-full", className)}>
        <DatasetCardCompareAction
          slug={dataset.slug}
          name={dataset.name}
          className={cn("right-3", isCurator ? "top-12" : "top-3")}
        />
        {isCurator ? (
          <Badge variant="default" className="absolute right-3 top-3">
            Curator pick
          </Badge>
        ) : null}
        <div
          className={cn(
            "flex items-center gap-2",
            isCurator && "pr-24"
          )}
        >
          <Icon
            className="text-accent size-4 shrink-0"
            aria-hidden="true"
          />
          {isPaper ? (
            <FileText
              className="text-tertiary size-4 shrink-0"
              aria-hidden="true"
            />
          ) : null}
          <div className="text-body min-w-0 flex-1 truncate font-semibold">
            {dataset.name}
          </div>
        </div>
        <p className="text-secondary text-caption mt-2 line-clamp-2">
          {dataset.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {dataset.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="neutral">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="text-tertiary text-micro mt-4 flex items-center gap-2 font-mono">
          <span>{formatNumber(dataset.size.rows)} rows</span>
          <span>·</span>
          <span>{formatBytes(dataset.size.bytes)}</span>
          <span>·</span>
          <span className="truncate">{dataset.license}</span>
        </div>
      </StandardCard>
    </Link>
  )
}
