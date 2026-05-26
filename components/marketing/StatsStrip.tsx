"use client"

import { CountUp } from "@/components/marketing/CountUp"
import type { PublicStats } from "@/lib/data"

interface StatsStripProps {
  stats: PublicStats | null
}

interface StatSlot {
  value: number | null
  format: (n: number) => string
  label: string
  staticText?: string
}

const FALLBACK = "—"

function buildSlots(stats: PublicStats | null): StatSlot[] {
  return [
    {
      value: stats?.totalDatasets ?? null,
      format: (n) =>
        n >= 1_000 ? `${Math.round(n / 1_000)}K+` : Math.round(n).toString(),
      label: "Datasets indexed",
    },
    {
      value: stats?.totalSources ?? null,
      format: (n) => Math.round(n).toString(),
      label: "Sources",
    },
    {
      value: stats?.totalRelationships ?? null,
      format: (n) =>
        n >= 1_000_000
          ? `${(n / 1_000_000).toFixed(1)}M`
          : n >= 1_000
            ? `${Math.round(n / 1_000)}K`
            : Math.round(n).toString(),
      label: "Relations mapped",
    },
    {
      value: null,
      format: () => "Hourly",
      label: "Update frequency",
      staticText: "Hourly",
    },
  ]
}

export function StatsStrip({ stats }: StatsStripProps) {
  const slots = buildSlots(stats)
  return (
    <section className="border-subtle bg-base border-y py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {slots.map((slot) => (
            <div key={slot.label} className="flex flex-col">
              <div className="text-h2 text-primary font-mono font-medium tabular-nums">
                {slot.staticText ? (
                  slot.staticText
                ) : slot.value === null ? (
                  FALLBACK
                ) : (
                  <CountUp value={slot.value} format={slot.format} />
                )}
              </div>
              <div className="text-tertiary text-micro mt-1 uppercase tracking-widest">
                {slot.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
