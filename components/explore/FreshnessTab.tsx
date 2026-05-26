import Link from "next/link"

import { HeroCard, StandardCard, WhisperCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type { FreshnessSnapshot } from "@/lib/api-client"
import type { Dataset } from "@/lib/types"
import { formatNumber } from "@/lib/utils"

interface FreshnessTabProps {
  snapshot: FreshnessSnapshot
  /** Slug → dataset for hydrating bucket samples. */
  sampleIndex: Map<string, Dataset>
}

const BUCKET_COPY: Record<string, string> = {
  "Updated this week": "Active maintenance — likely to keep evolving.",
  "This month": "Still being touched; safe to assume the metadata is current.",
  "This year": "Stable but not stagnant. Re-verify if you care about new entries.",
  "Older than 1 year":
    "Frozen. Useful as a fixed benchmark; don't expect updates.",
}

export function FreshnessTab({ snapshot, sampleIndex }: FreshnessTabProps) {
  const { buckets, timeline, activeSources } = snapshot

  return (
    <div className="flex flex-col gap-10">
      <section>
        <HeroCard className="p-8">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            When was this data updated?
          </p>
          <div className="prose mt-4 max-w-3xl">
            <p className="text-secondary text-body">
              Datasets age. A medical imaging dataset from 2015 may not
              reflect current diagnostic standards. A market-data dataset
              from 2020 misses the post-COVID era. Datacrawlr tracks when
              each dataset&apos;s source last reported an update, so you can
              find data that matches the era you need.
            </p>
            <p className="text-secondary text-body mt-4">
              This view groups the catalog by recency. We also track which
              sources update most frequently, so you can decide whether a
              dataset is likely to keep evolving.
            </p>
          </div>
        </HeroCard>
      </section>

      <section>
        <div className="mb-6">
          <h3 className="text-h3 font-semibold tracking-tight">
            By recency
          </h3>
          <p className="text-secondary text-caption mt-1">
            Where the catalog sits on the freshness curve right now.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {buckets.map((bucket) => (
            <HeroCard key={bucket.label} className="flex flex-col !p-6">
              <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
                {bucket.label}
              </p>
              <div className="text-primary text-h3 mt-2 font-mono tabular-nums">
                {formatNumber(bucket.count)}
              </div>
              <p className="text-tertiary text-caption mt-2 line-clamp-2">
                {BUCKET_COPY[bucket.label] ?? ""}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {bucket.sampleSlugs.length === 0 ? (
                  <span className="text-tertiary text-micro">
                    No samples for this bucket.
                  </span>
                ) : (
                  bucket.sampleSlugs.map((slug) => {
                    const ds = sampleIndex.get(slug)
                    return (
                      <Link
                        key={slug}
                        href={`/datasets/${slug}`}
                        className="border-subtle bg-elevated/40 hover:border-strong rounded-md border px-3 py-2 transition-colors"
                      >
                        <div className="text-primary text-caption truncate font-medium">
                          {ds?.name ?? slug}
                        </div>
                        {ds ? (
                          <div className="text-tertiary text-micro mt-0.5 line-clamp-1">
                            {ds.description}
                          </div>
                        ) : null}
                      </Link>
                    )
                  })
                )}
              </div>
            </HeroCard>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h3 className="text-h3 font-semibold tracking-tight">
            Update timeline
          </h3>
          <p className="text-secondary text-caption mt-1">
            Datasets last updated, by month, over the past 24 months.
          </p>
        </div>
        <WhisperCard className="p-8">
          {/* TODO: replace this approximation with /v1/stats/freshness when
              the dedicated endpoint lands. */}
          <Timeline points={timeline} />
        </WhisperCard>
      </section>

      <section>
        <div className="mb-6">
          <h3 className="text-h3 font-semibold tracking-tight">
            Most actively maintained sources
          </h3>
          <p className="text-secondary text-caption mt-1">
            Where new updates land most often.
          </p>
        </div>
        {activeSources.length === 0 ? (
          <StandardCard className="!p-6">
            <p className="text-tertiary text-caption">
              Not enough recent activity to rank sources yet.
            </p>
          </StandardCard>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activeSources.map((s) => (
              <Badge
                key={s.platform}
                variant="neutral"
                className="px-4 py-2 capitalize"
              >
                <span>{s.platform.replace(/_/g, " ")}</span>
                <span className="text-tertiary ml-2 font-mono">
                  · {formatNumber(s.updatesLast30d)} updates
                </span>
              </Badge>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function Timeline({
  points,
}: {
  points: { month: string; count: number }[]
}) {
  if (points.length === 0) {
    return (
      <p className="text-tertiary text-caption">
        No timeline data available yet.
      </p>
    )
  }

  const width = 720
  const height = 220
  const padTop = 16
  const padBottom = 24
  const padX = 8
  const innerW = width - padX * 2
  const innerH = height - padTop - padBottom

  const max = points.reduce((m, p) => Math.max(m, p.count), 0) || 1
  const step = points.length > 1 ? innerW / (points.length - 1) : innerW

  const xy = points.map((p, i) => ({
    x: padX + i * step,
    y: padTop + innerH - (p.count / max) * innerH,
  }))

  const linePath = xy
    .map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(" ")
  const areaPath =
    linePath +
    ` L${xy[xy.length - 1].x.toFixed(1)} ${(padTop + innerH).toFixed(1)}` +
    ` L${xy[0].x.toFixed(1)} ${(padTop + innerH).toFixed(1)} Z`

  const labelStride = Math.max(1, Math.ceil(points.length / 6))

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[640px]"
        role="img"
        aria-label="Datasets last updated, by month"
      >
        <defs>
          <linearGradient id="freshness-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#freshness-area)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Month tick labels — show roughly six labels across regardless of
            point count so the axis stays readable on narrow screens. */}
        {points.map((p, i) => {
          if (i % labelStride !== 0 && i !== points.length - 1) return null
          return (
            <text
              key={p.month}
              x={padX + i * step}
              y={height - 6}
              textAnchor="middle"
              fontSize={10}
              fill="var(--text-tertiary)"
              className="font-mono"
            >
              {p.month}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
