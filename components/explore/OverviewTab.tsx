import Link from "next/link"
import {
  Database,
  Layers,
  Plug,
  RefreshCcw,
  Scale,
  Sparkles,
} from "lucide-react"

import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart"
import { DatasetCard } from "@/components/dataset/DatasetCard"
import { DomainGrid } from "@/components/discovery/DomainGrid"
import { HeroCard, StandardCard, WhisperCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type { Dataset } from "@/lib/types"
import type { MLTaskStat } from "@/lib/api-client"
import { formatRelativeTime } from "@/lib/utils"

interface OverviewTabProps {
  trending: Dataset[]
  recent: Dataset[]
  mlTasks: MLTaskStat[]
}

const INTRO_PARAGRAPH_1 =
  "Datacrawlr is an index, not a host. We harvest structured metadata about datasets — their schemas, licenses, sizes, modalities, and provenance — from the places where data lives: HuggingFace, Kaggle, Zenodo, OpenML, government open-data portals, academic repositories, and the long tail of schema.org Dataset markup across the open web."

const INTRO_PARAGRAPH_2 =
  "Every entry on Datacrawlr links back to the original host. We never mirror the data itself, only the information about it. That makes us a discovery layer — the catalog that tells you which dataset to use, then sends you to the place that holds it."

const PRINCIPLES = [
  {
    icon: Database,
    label: "Metadata only",
    body: "No mirroring. Each entry links back to the source.",
  },
  {
    icon: Plug,
    label: "API-first ingestion",
    body: "We use official APIs and structured feeds wherever possible.",
  },
  {
    icon: Scale,
    label: "License-aware",
    body: "Every dataset is tagged with its license category and use terms.",
  },
  {
    icon: RefreshCcw,
    label: "Hourly refresh",
    body: "Sources are re-crawled on a schedule; updates land within the hour.",
  },
] as const

const LENS_PREVIEWS = [
  {
    icon: Layers,
    name: "Modalities",
    description: "Group datasets by data shape — text, image, audio, tabular.",
  },
  {
    icon: Sparkles,
    name: "ML Tasks",
    description: "See what models you can train: classification, generation, more.",
  },
  {
    icon: Plug,
    name: "Sources",
    description: "Browse by platform — HuggingFace, Kaggle, Zenodo, OpenML.",
  },
  {
    icon: Scale,
    name: "Licenses",
    description: "Filter by what you're legally allowed to do with the data.",
  },
  {
    icon: RefreshCcw,
    name: "Freshness",
    description: "Find what's been updated this week, month, or year.",
  },
  {
    icon: Database,
    name: "Catalog",
    description: "The full grid — every dataset, sorted by what fits.",
  },
] as const

export function OverviewTab({ trending, recent, mlTasks }: OverviewTabProps) {
  return (
    <div className="flex flex-col">
      {/* Section A — INTRO BLOCK */}
      <section className="mb-16">
        <WhisperCard className="p-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent size-4" aria-hidden="true" />
            <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
              What is Datacrawlr indexing?
            </p>
          </div>
          <div className="prose mt-5 max-w-3xl">
            <p className="text-secondary text-body">{INTRO_PARAGRAPH_1}</p>
            <p className="text-secondary text-body mt-4">{INTRO_PARAGRAPH_2}</p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {PRINCIPLES.map(({ icon: Icon, label, body }) => (
              <StandardCard key={label} className="!p-4">
                <Icon className="text-accent size-4" aria-hidden="true" />
                <div className="text-primary text-caption mt-3 font-semibold">
                  {label}
                </div>
                <p className="text-tertiary text-micro mt-1 leading-relaxed">
                  {body}
                </p>
              </StandardCard>
            ))}
          </div>
        </WhisperCard>
      </section>

      {/* Section B — TOP DOMAINS RAIL */}
      <section className="mb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-h3 font-semibold tracking-tight">Top domains</h3>
            <p className="text-secondary text-caption mt-1">
              Where the data lives, by what it represents.
            </p>
          </div>
          <Link
            href="/explore?tab=modalities"
            className="text-accent text-caption hover:text-accent-hover shrink-0 underline-offset-4 hover:underline"
          >
            All domains →
          </Link>
        </div>
        <DomainGrid bare limit={6} />
      </section>

      {/* Section C — TRENDING THIS WEEK */}
      <section className="mb-16">
        <div className="mb-6">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="bg-accent animate-pulse-glow inline-block size-1.5 rounded-full"
            />
            <h3 className="text-h3 font-semibold tracking-tight">
              Trending this week
            </h3>
          </div>
          <p className="text-secondary text-caption mt-1">
            The datasets ML engineers are looking at right now.
          </p>
        </div>
        <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4">
          {trending.length === 0 ? (
            <p className="text-tertiary text-caption">
              No trending datasets yet — check back after the next crawl cycle.
            </p>
          ) : (
            trending.map((ds) => (
              <div key={ds.id} className="w-80 shrink-0 snap-start">
                <DatasetCard dataset={ds} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Section D — RECENTLY ADDED */}
      <section className="mb-16">
        <div className="mb-6">
          <h3 className="text-h3 font-semibold tracking-tight">Just indexed</h3>
          <p className="text-secondary text-caption mt-1">
            Datasets that joined the catalog in the past 24 hours.
          </p>
        </div>
        {recent.length === 0 ? (
          <p className="text-tertiary text-caption">
            No new datasets in the last 24 hours.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((ds) => (
              <div key={ds.id} className="relative">
                <DatasetCard dataset={ds} />
                <Badge
                  variant="default"
                  className="absolute right-3 top-3 z-10 font-mono"
                >
                  Just added · {formatRelativeTime(ds.lastUpdated)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section E — CONTEXTUAL CALLOUT */}
      <section className="mb-16">
        <HeroCard className="p-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
                How Explore works
              </p>
              <h3 className="text-h3 mt-3 font-semibold tracking-tight">
                Six lenses, one catalog.
              </h3>
              <div className="prose mt-5 max-w-prose">
                <p className="text-secondary text-body">
                  Each tab above slices the catalog by a different lens.
                  Modalities groups by data shape — text, image, audio,
                  tabular.
                </p>
                <p className="text-secondary text-body mt-4">
                  ML Tasks shows what models you can train. Sources lists the
                  platforms we pull from. Licenses tells you what
                  you&apos;re legally allowed to do with each dataset.
                </p>
                <p className="text-secondary text-body mt-4">
                  Freshness lets you find what&apos;s been updated recently —
                  useful when an old benchmark gets a new release or a new
                  one lands quietly.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {LENS_PREVIEWS.map(({ icon: Icon, name, description }) => (
                <div
                  key={name}
                  className="border-subtle bg-elevated/40 hover:border-strong flex items-start gap-3 rounded-lg border p-4 transition-colors"
                >
                  <Icon
                    className="text-accent mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <div className="text-primary text-caption font-semibold">
                      {name}
                    </div>
                    <p className="text-tertiary text-micro mt-0.5 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </HeroCard>
      </section>

      {/* Section F — POPULAR ML TASKS */}
      <section className="mb-16">
        <div className="mb-6">
          <h3 className="text-h3 font-semibold tracking-tight">
            Popular ML tasks
          </h3>
          <p className="text-secondary text-caption mt-1">
            The task categories with the most coverage.
          </p>
        </div>
        <WhisperCard className="p-8">
          <HorizontalBarChart
            data={mlTasks.map((t) => ({ label: t.task, value: t.count }))}
            maxBars={8}
          />
        </WhisperCard>
        <div className="mt-4">
          <Link
            href="/explore?tab=ml-tasks"
            className="text-accent text-caption hover:text-accent-hover underline-offset-4 hover:underline"
          >
            See full breakdown →
          </Link>
        </div>
      </section>
    </div>
  )
}

