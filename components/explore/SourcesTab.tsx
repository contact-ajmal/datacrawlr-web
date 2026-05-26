import Link from "next/link"
import {
  Beaker,
  Book,
  Brain,
  Code,
  Database,
  FileText,
  Globe,
  Library,
  MessageSquarePlus,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import { HeroCard, StandardCard, WhisperCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type { SourceSummary } from "@/lib/api-client"
import { formatNumber, formatRelativeTime } from "@/lib/utils"

interface SourcesTabProps {
  sources: SourceSummary[]
}

const PLATFORM_ICON: Record<string, LucideIcon> = {
  huggingface: Brain,
  kaggle: Trophy,
  github: Code,
  openml: Beaker,
  zenodo: Library,
  figshare: Database,
  dataverse: Database,
  ckan: Globe,
  schema_org: Globe,
  arxiv: FileText,
  other: Book,
}

const STATUS_STYLE: Record<
  SourceSummary["status"],
  { dot: string; label: string }
> = {
  active: { dot: "bg-emerald-400", label: "Active" },
  degraded: { dot: "bg-amber-400", label: "Degraded" },
  failing: { dot: "bg-rose-400", label: "Failing" },
  unknown: { dot: "bg-zinc-400", label: "Unknown" },
}

function iconFor(platform: string): LucideIcon {
  return PLATFORM_ICON[platform.toLowerCase()] ?? PLATFORM_ICON.other
}

export function SourcesTab({ sources }: SourcesTabProps) {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <HeroCard className="p-8">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            Where the data lives
          </p>
          <div className="prose mt-4 max-w-3xl">
            <p className="text-secondary text-body">
              Datacrawlr doesn&apos;t host datasets — we link to them. Every
              dataset on Datacrawlr lives somewhere else: a research
              repository, an ML community hub, a government open-data
              portal, an academic Dataverse instance. We harvest metadata
              from each of these sources through their official APIs and
              refresh on a schedule.
            </p>
            <p className="text-secondary text-body mt-4">
              This is the full list of sources we index. The catalog grows
              when we add new connectors.
            </p>
          </div>
        </HeroCard>
      </section>

      {sources.length === 0 ? (
        <p className="text-tertiary text-caption">
          No source information available right now. Try again in a moment.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {sources.map((s) => (
            <SourceCard key={s.platform} source={s} />
          ))}
        </div>
      )}

      <section>
        <WhisperCard className="flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="bg-accent/10 text-accent grid size-10 shrink-0 place-items-center rounded-full">
              <MessageSquarePlus className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h4 className="text-h4 font-semibold">
                Want to suggest a source?
              </h4>
              <p className="text-tertiary text-caption mt-1 max-w-xl">
                If we don&apos;t index a dataset repository you care about,
                open an issue. We add connectors based on what the community
                asks for.
              </p>
            </div>
          </div>
          <Link
            href="https://github.com/datacrawlr/datacrawlr/issues/new?labels=connector"
            className="text-accent text-caption hover:text-accent-hover shrink-0 underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Open a connector request →
          </Link>
        </WhisperCard>
      </section>
    </div>
  )
}

function SourceCard({ source }: { source: SourceSummary }) {
  const Icon = iconFor(source.platform)
  const status = STATUS_STYLE[source.status] ?? STATUS_STYLE.unknown
  return (
    <StandardCard className="!p-6">
      <div className="flex flex-col items-start gap-5 md:flex-row">
        <span
          className="bg-overlay grid size-12 shrink-0 place-items-center rounded-full"
          aria-hidden="true"
        >
          <Icon className="text-accent size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h4 className="text-h4 font-semibold">{source.name}</h4>
          <p className="text-secondary text-caption mt-1">
            {source.description}
          </p>
        </div>

        <div className="text-right md:min-w-[160px]">
          <div className="text-primary text-h3 font-mono font-medium tabular-nums">
            {formatNumber(source.totalDatasets)}
          </div>
          <div className="text-tertiary text-micro mt-1 uppercase tracking-widest">
            datasets indexed
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`block size-1.5 rounded-full ${status.dot}`}
            />
            <span className="text-tertiary text-micro uppercase tracking-widest">
              {status.label}
              {source.lastRunAt
                ? ` · ${formatRelativeTime(source.lastRunAt)}`
                : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="border-subtle mt-5 flex flex-col items-start gap-3 border-t pt-5 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-tertiary text-micro shrink-0 font-mono uppercase tracking-widest">
            Recently popular →
          </span>
          {source.sampleDatasetSlugs.slice(0, 5).map((slug) => (
            <Link
              key={slug}
              href={`/datasets/${slug}`}
              className="text-secondary hover:text-primary"
            >
              <Badge variant="neutral" className="hover:border-strong">
                {slug}
              </Badge>
            </Link>
          ))}
        </div>
        <Link
          href={`/search?source=${encodeURIComponent(source.platform)}`}
          className="text-accent text-caption hover:text-accent-hover shrink-0 underline-offset-4 hover:underline"
        >
          Browse all from {source.name} →
        </Link>
      </div>
    </StandardCard>
  )
}
