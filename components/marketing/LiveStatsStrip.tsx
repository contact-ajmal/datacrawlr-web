import type { PublicStats } from "@/lib/api-client"
import { formatNumber } from "@/lib/utils"

interface LiveStatsStripProps {
  stats: PublicStats | null
  /** Number of HF/OpenRouter connectors we actually have for models. The
   *  marketing copy mentions models as a separate axis, so we surface it
   *  as a counter even though /v1/stats doesn't break it out yet. Pass a
   *  real count when ready, otherwise leave undefined for "—". */
  modelsCount?: number | null
}

/**
 * Strip of four numbers across the bottom of the homepage hero band.
 * Pulls every value live from `/v1/stats` — anything missing renders as
 * "—" so we never invent a number. The dataset-sources count is computed
 * from the existing connector roster (see SOURCES in SourcesGrid); we
 * hard-code it as 9 because that IS the truth on disk.
 */
const DATASET_SOURCE_COUNT = 9 // HuggingFace, OpenML, Zenodo, Kaggle, CKAN, figshare, Dataverse, GitHub, schema.org.

export function LiveStatsStrip({ stats, modelsCount }: LiveStatsStripProps) {
  const datasets = stats?.totalDatasets ?? null
  const updated = stats?.lastUpdatedAt
    ? new Date(stats.lastUpdatedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null

  return (
    <section className="border-subtle bg-base/60 border-y py-12">
      <div className="mx-auto max-w-7xl px-6">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <Stat label="Datasets indexed" value={fmt(datasets)} />
          <Stat label="Dataset sources" value={String(DATASET_SOURCE_COUNT)} />
          <Stat label="Models indexed" value={fmt(modelsCount ?? null)} />
          <Stat label="Last refreshed" value={updated ?? "—"} />
        </dl>
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dd className="text-h2 text-primary font-mono font-medium tabular-nums">
        {value}
      </dd>
      <dt className="text-tertiary text-micro mt-1 uppercase tracking-widest">
        {label}
      </dt>
    </div>
  )
}

function fmt(n: number | null): string {
  if (n === null || n === undefined) return "—"
  return formatNumber(n)
}
