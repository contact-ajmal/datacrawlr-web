"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { MODALITY_ICONS } from "@/lib/modality-icons"
import type { SearchResult } from "@/lib/types"
import {
  cn,
  formatBytes,
  formatNumber,
  formatRelativeTime,
} from "@/lib/utils"

interface SearchResultCardProps {
  result: SearchResult
  index: number
  query: string
  highlighted?: boolean
}

export function SearchResultCard({
  result,
  index,
  query,
  highlighted,
}: SearchResultCardProps) {
  const router = useRouter()
  const Icon = MODALITY_ICONS[result.modality]
  const isHighScore = result.matchScore >= 85
  const matchPercent = Math.min(99, Math.round(result.matchScore * 10))

  const onTagClick = (tag: string) => {
    const next = query.trim()
      ? `${query.trim()} ${tag}`
      : tag
    router.push(`/search?q=${encodeURIComponent(next)}`)
  }

  void index
  return (
    <div
      id={`result-${result.id}`}
      className={cn(
        "group bg-elevated border-subtle relative h-full overflow-hidden rounded-xl border p-5 transition-all duration-150",
        "hover:border-strong hover:bg-[#10131A] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 motion-reduce:transition-none",
        highlighted &&
          "border-accent ring-accent-glow ring-2 transition-shadow"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "bg-accent pointer-events-none absolute left-0 top-0 w-[2px] transition-[height] duration-200 ease-out",
          "h-0 group-hover:h-full",
          highlighted && "h-full"
        )}
      />
      <div
        className="cursor-pointer"
        onClick={() => router.push(`/datasets/${result.slug}`)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Icon
              className="text-accent size-4 shrink-0"
              aria-hidden="true"
            />
            <h3 className="text-h4 truncate font-semibold">{result.name}</h3>
            <span className="text-tertiary text-micro shrink-0 font-mono">
              [{index + 1}]
            </span>
          </div>
          <Badge variant={isHighScore ? "default" : "neutral"} className="shrink-0">
            {matchPercent}% match
          </Badge>
        </div>

        <p className="text-secondary text-caption mt-2">
          <span className="text-primary mr-1 font-semibold">
            Why it matches:
          </span>
          {result.matchExplanation}
        </p>

        <p className="text-primary text-body mt-3 line-clamp-2">
          {result.description}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {result.tags.slice(0, 6).map((tag) => (
          <motion.button
            key={tag}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onTagClick(tag)}
            className="cursor-pointer"
            aria-label={`Add tag to search: ${tag}`}
          >
            <Badge variant="neutral" className="hover:border-strong">
              {tag}
            </Badge>
          </motion.button>
        ))}
      </div>

      <div className="text-tertiary text-micro mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
        <span>{formatNumber(result.size.rows)} rows</span>
        <span>·</span>
        <span>{formatBytes(result.size.bytes)}</span>
        <span>·</span>
        <span>{result.license}</span>
        <span>·</span>
        <span>updated {formatRelativeTime(result.lastUpdated)}</span>
        {typeof result.downloads === "number" ? (
          <>
            <span>·</span>
            <span>{formatNumber(result.downloads)} downloads</span>
          </>
        ) : null}
      </div>
    </div>
  )
}
