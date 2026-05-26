import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { StandardCard, WhisperCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import {
  relatedScore,
  syntheticCreatedDate,
} from "@/lib/dataset-derivations"
import { SOURCE_ICON, SOURCE_LABEL } from "@/lib/source-icons"
import type { Dataset } from "@/lib/types"
import { formatNumber, formatRelativeTime } from "@/lib/utils"

interface DatasetRailProps {
  dataset: Dataset
  related: Dataset[]
}

export function DatasetRail({ dataset, related }: DatasetRailProps) {
  const created = syntheticCreatedDate(dataset.slug, dataset.lastUpdated)
  const citationCount = dataset.citations?.length ?? 0
  const downloads = dataset.downloads ?? 0

  return (
    <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
      <StandardCard className="hover:translate-y-0 hover:bg-elevated p-5">
        <SectionLabel>Sources</SectionLabel>
        <ul className="flex flex-col">
          {dataset.sources.map((source, i) => {
            const Icon = SOURCE_ICON[source.provider]
            const isPrimary = i === 0
            return (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-overlay -mx-2 flex items-center gap-3 rounded-md px-2 py-2 transition-colors"
                >
                  <Icon
                    className="text-tertiary size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-primary text-caption flex items-center gap-2">
                      <span className="truncate">{source.title}</span>
                      {isPrimary ? (
                        <Badge variant="default" className="shrink-0">
                          primary
                        </Badge>
                      ) : null}
                    </div>
                    <div className="text-tertiary text-micro mt-0.5 font-mono">
                      {SOURCE_LABEL[source.provider]}
                    </div>
                  </div>
                  <ExternalLink
                    className="text-tertiary size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </StandardCard>

      <WhisperCard className="p-5">
        <SectionLabel>Details</SectionLabel>
        <dl className="border-subtle divide-subtle divide-y border-y">
          <Row k="License" v={dataset.license} />
          <Row k="Created" v={created} />
          <Row k="Last updated" v={dataset.lastUpdated} />
          <Row k="Downloads" v={formatNumber(downloads)} />
          <Row k="Citations" v={String(citationCount)} />
          <Row k="Quality" v={`${dataset.quality}/100`} />
          <Row k="Popularity" v={`${dataset.popularity}/100`} />
        </dl>
      </WhisperCard>

      <WhisperCard className="p-5">
        <SectionLabel>Related</SectionLabel>
        {related.length === 0 ? (
          <p className="text-tertiary text-caption">
            No related datasets yet.
          </p>
        ) : (
          <ul>
            {related.map((rel, i) => (
              <li
                key={rel.id}
                className="border-subtle border-b last:border-0"
              >
                <Link
                  href={`/datasets/${rel.slug}`}
                  className="hover:bg-overlay -mx-2 block rounded-md px-2 py-3 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-caption min-w-0 flex-1 truncate font-medium">
                      {rel.name}
                    </span>
                    <span className="text-accent text-micro shrink-0 font-mono">
                      {relatedScore(rel, i)}%
                    </span>
                  </div>
                  <p className="text-tertiary text-micro mt-1 line-clamp-1">
                    {rel.description}
                  </p>
                  <p className="text-tertiary text-micro mt-1 font-mono">
                    updated {formatRelativeTime(rel.lastUpdated)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </WhisperCard>
    </aside>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <dt className="text-tertiary text-caption">{k}</dt>
      <dd className="text-primary text-caption truncate font-mono">{v}</dd>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-secondary text-caption mb-3 font-semibold uppercase tracking-wider">
      {children}
    </div>
  )
}
