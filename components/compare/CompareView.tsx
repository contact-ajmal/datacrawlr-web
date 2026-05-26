"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ExternalLink, GitCompare, X } from "lucide-react"

import { CompareSynthesis } from "@/components/compare/CompareSynthesis"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { MODALITY_ICONS } from "@/lib/modality-icons"
import { useComparison } from "@/lib/stores/comparison"
import type { Dataset } from "@/lib/types"
import {
  cn,
  formatBytes,
  formatNumber,
  formatRelativeTime,
} from "@/lib/utils"

interface CompareViewProps {
  datasets: Dataset[]
}

interface CompareRow {
  label: string
  values: string[]
  isDiff: boolean
}

function buildRows(datasets: Dataset[]): CompareRow[] {
  const make = (label: string, fn: (d: Dataset) => string): CompareRow => {
    const values = datasets.map(fn)
    const isDiff = new Set(values).size > 1
    return { label, values, isDiff }
  }
  return [
    make("Modality", (d) => d.modality),
    make("License", (d) => d.license),
    make("Rows", (d) => formatNumber(d.size.rows)),
    make("Size on disk", (d) => formatBytes(d.size.bytes)),
    make("Quality", (d) => `${d.quality}/100`),
    make("Popularity", (d) => `${d.popularity}/100`),
    make("Downloads", (d) => formatNumber(d.downloads ?? 0)),
    make("Last updated", (d) => formatRelativeTime(d.lastUpdated)),
    make("Tags", (d) => `${d.tags.length}`),
    make("Schema fields", (d) => `${d.schema?.length ?? 0}`),
    make("Citations", (d) => `${d.citations?.length ?? 0}`),
    make("Primary source", (d) => d.sources[0]?.title ?? "—"),
  ]
}

export function CompareView({ datasets }: CompareViewProps) {
  const router = useRouter()
  const setIds = useComparison.setState

  // Sync the persisted comparison store with the URL when we land here.
  useEffect(() => {
    setIds({ ids: datasets.map((d) => d.slug) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasets.map((d) => d.slug).join(",")])

  if (datasets.length === 0) {
    return (
      <main id="main" className="mx-auto max-w-7xl px-4 md:px-6">
        <EmptyState
          icon={GitCompare}
          title="No datasets to compare"
          description="Add datasets from any card to get started."
          actions={
            <>
              <Button variant="secondary" onClick={() => router.push("/")}>
                Browse trending
              </Button>
              <Button onClick={() => router.push("/search")}>Open search</Button>
            </>
          }
        />
      </main>
    )
  }

  const handleRemove = (slug: string) => {
    const remaining = datasets.filter((d) => d.slug !== slug)
    setIds({ ids: remaining.map((d) => d.slug) })
    if (remaining.length === 0) {
      router.push("/compare")
    } else {
      router.push(`/compare?ids=${remaining.map((d) => d.slug).join(",")}`)
    }
  }

  const rows = buildRows(datasets)
  const N = datasets.length
  const gridStyle = {
    gridTemplateColumns: `160px repeat(${N}, minmax(0, 1fr))`,
  }
  const minWidth = 200 + N * 200

  return (
    <main id="main" className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
      <div className="bg-base/90 border-subtle sticky top-[52px] z-30 -mx-4 border-b px-4 py-4 backdrop-blur-md md:top-14 md:-mx-6 md:px-6">
        <div className="overflow-x-auto">
          <div
            className="grid items-stretch gap-4"
            style={{ ...gridStyle, minWidth }}
          >
            <div className="text-tertiary text-caption flex items-center gap-2 font-mono uppercase tracking-wider">
              <GitCompare className="size-4" aria-hidden="true" />
              Comparing
            </div>
            {datasets.map((d) => {
              const Icon = MODALITY_ICONS[d.modality]
              return (
                <div
                  key={d.id}
                  className="bg-elevated border-subtle relative flex items-start gap-2 rounded-md border p-3"
                >
                  <Icon
                    className="text-accent mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <Link
                    href={`/datasets/${d.slug}`}
                    className="text-primary hover:text-accent text-body min-w-0 flex-1 line-clamp-2 font-semibold transition-colors"
                  >
                    {d.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(d.slug)}
                    aria-label={`Remove ${d.name} from comparison`}
                    className="text-tertiary hover:text-primary -mr-1 -mt-1 shrink-0 transition-colors"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <CompareSynthesis datasets={datasets} />
      </div>

      <div className="mt-8 overflow-x-auto">
        <div className="grid" style={{ ...gridStyle, minWidth }}>
          {rows.map((row, idx) => (
            <div
              key={row.label}
              className={cn(
                "border-subtle col-span-full grid gap-4 border-b py-3",
                idx === rows.length - 1 && "border-b-0"
              )}
              style={gridStyle}
            >
              <div className="text-tertiary text-caption font-mono uppercase tracking-wider">
                {row.label}
              </div>
              {row.values.map((val, i) => (
                <div
                  key={i}
                  className={cn(
                    "text-primary text-body min-w-0 truncate font-mono",
                    row.isDiff && "border-accent/50 border-l-2 pl-3"
                  )}
                  title={val}
                >
                  {val}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="outline"
          onClick={() => {
            for (const d of datasets) {
              window.open(
                `/datasets/${d.slug}`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          }}
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
          Open all in tabs
        </Button>
      </div>
    </main>
  )
}
