import { DatasetCard } from "@/components/dataset/DatasetCard"
import type { Dataset } from "@/lib/types"

interface TrendingRailProps {
  datasets: Dataset[]
}

export function TrendingRail({ datasets }: TrendingRailProps) {
  return (
    <section className="bg-base py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="bg-accent animate-pulse-glow inline-block size-1.5 rounded-full"
          />
          <h2 className="text-h2 font-semibold tracking-tight">
            Trending this week
          </h2>
        </div>
        <p className="text-secondary text-caption mt-1">
          Most-viewed by ML engineers in the past 7 days.
        </p>
        <div className="-mx-6 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4">
          {datasets.map((ds) => (
            <div key={ds.id} className="w-80 shrink-0 snap-start">
              <DatasetCard dataset={ds} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
