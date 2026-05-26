import Link from "next/link"

import { MiniModelCard } from "@/components/models/MiniModelCard"
import type { Model } from "@/lib/types"

interface TopModelsRailProps {
  models: Model[]
}

/**
 * Horizontal snap-scroll rail of models on the homepage. Built around
 * MiniModelCard so it stays visually distinct from the dataset rail
 * (smaller card, no description, composite chip).
 */
export function TopModelsRail({ models }: TopModelsRailProps) {
  return (
    <section className="bg-base py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="bg-accent animate-pulse-glow inline-block size-1.5 rounded-full"
          />
          <h2 className="text-h2 font-semibold tracking-tight">
            Top models this week
          </h2>
        </div>
        <p className="text-secondary text-caption mt-1">
          By composite benchmark score across open-weights and commercial.
        </p>

        <div className="-mx-6 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4">
          {models.length === 0 ? (
            <p className="text-tertiary text-caption">
              Model index is warming up — check back shortly.
            </p>
          ) : (
            models.map((m) => (
              <div key={m.slug} className="w-72 shrink-0 snap-start">
                <MiniModelCard model={m} />
              </div>
            ))
          )}
        </div>

        <div className="mt-4">
          <Link
            href="/models"
            className="text-accent text-caption hover:text-accent-hover underline-offset-4 hover:underline"
          >
            Browse all models →
          </Link>
        </div>
      </div>
    </section>
  )
}
