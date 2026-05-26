import { Lightbulb, Sparkles } from "lucide-react"

import { MarkdownBlock } from "@/components/dataset/MarkdownBlock"
import { MiniModelCard } from "@/components/models/MiniModelCard"
import { HeroCard, StandardCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type { BenchmarkName, Model } from "@/lib/types"
import { cn, formatNumber } from "@/lib/utils"

interface OverviewTabProps {
  model: Model
  related: Model[]
  /** Pre-computed per-benchmark snapshot — top score in the catalog and
   *  this model's rank for each benchmark it has scored. */
  snapshots: BenchmarkSnapshot[]
}

export interface BenchmarkSnapshot {
  benchmark: BenchmarkName
  score: number
  topScore: number
  rank: number
  totalWithScore: number
}

const BENCHMARK_LABEL: Record<BenchmarkName, string> = {
  "mmlu-pro": "MMLU-Pro",
  gpqa: "GPQA",
  humaneval: "HumanEval",
  math: "MATH",
  ifeval: "IFEval",
  musr: "MuSR",
  bfcl: "BFCL",
  "arena-elo": "Arena ELO",
  mmlu: "MMLU",
  aime: "AIME",
  "swe-bench-verified": "SWE-Bench",
  livecodebench: "LiveCodeBench",
}

function humanParams(n?: number): string {
  if (!n) return "—"
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `${(n / 1e9).toFixed(0)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`
  return formatNumber(n)
}

function humanContext(n?: number): string {
  if (!n) return "—"
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1_000) return `${Math.round(n / 1000)}K`
  return String(n)
}

export function OverviewTab({ model, related, snapshots }: OverviewTabProps) {
  const paramsSub =
    model.activeParameters && model.activeParameters !== model.parameters
      ? `${humanParams(model.activeParameters)} active`
      : "total"

  return (
    <div className="flex flex-col">
      {/* a. AI summary */}
      {model.aiSummary || model.aiInsights.length > 0 ? (
        <section className="mb-8">
          <HeroCard className="p-6">
            <Badge variant="default" className="gap-1.5">
              <Sparkles className="size-3" aria-hidden="true" />
              AI Summary
            </Badge>
            {model.aiSummary ? (
              <p className="text-secondary text-body mt-4 leading-relaxed">
                {model.aiSummary}
              </p>
            ) : null}
            {model.aiInsights.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2 pt-5 border-t border-subtle">
                {model.aiInsights.map((insight) => (
                  <Badge
                    key={insight}
                    variant="neutral"
                    className="gap-1.5"
                  >
                    <Lightbulb className="size-3" aria-hidden="true" />
                    {insight}
                  </Badge>
                ))}
              </div>
            ) : null}
          </HeroCard>
        </section>
      ) : null}

      {/* b. Key specs grid */}
      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <SpecCell
          label="Architecture"
          value={model.architecture ?? "Unknown"}
          sub={model.baseModel ? `Based on ${model.baseModel}` : undefined}
        />
        <SpecCell
          label="Parameters"
          value={humanParams(model.parameters)}
          sub={model.parameters ? paramsSub : "unknown"}
        />
        <SpecCell
          label="Context"
          value={humanContext(model.contextWindow)}
          sub="tokens"
        />
        <SpecCell
          label="Max output"
          value={humanContext(model.maxOutputTokens)}
          sub="tokens"
        />
      </section>

      {/* c. Long description */}
      {model.longDescription ? (
        <section className="mb-12 max-w-3xl">
          <MarkdownBlock content={model.longDescription} />
        </section>
      ) : null}

      {/* d. At-a-glance benchmarks */}
      {snapshots.length > 0 ? (
        <section className="mb-12">
          <h3 className="text-h3 font-semibold tracking-tight">
            Benchmark snapshot
          </h3>
          <p className="text-secondary text-caption mt-1">
            How this model ranks across the catalog on its strongest tests.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {snapshots.map((snap) => {
              const pct =
                snap.topScore > 0
                  ? Math.min(100, (snap.score / snap.topScore) * 100)
                  : 0
              return (
                <StandardCard key={snap.benchmark} className="!p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-secondary text-caption font-medium">
                      {BENCHMARK_LABEL[snap.benchmark]}
                    </span>
                    <span className="text-tertiary text-micro font-mono">
                      #{snap.rank} of {snap.totalWithScore}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-accent text-h3 font-mono tabular-nums">
                      {snap.score.toFixed(1)}
                    </span>
                    <span className="text-tertiary text-micro font-mono">
                      / {snap.topScore.toFixed(1)} top
                    </span>
                  </div>
                  <div className="bg-elevated mt-3 h-2 overflow-hidden rounded-full">
                    <div
                      className={cn("bg-accent/70 h-full rounded-full")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </StandardCard>
              )
            })}
          </div>
        </section>
      ) : null}

      {/* e. Related models */}
      {related.length > 0 ? (
        <section className="mb-4">
          <h3 className="text-h3 font-semibold tracking-tight">
            Similar models
          </h3>
          <p className="text-secondary text-caption mt-1">
            Comparable in size, modality, or capability.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {related.slice(0, 6).map((m) => (
              <MiniModelCard key={m.slug} model={m} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function SpecCell({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <StandardCard className="!p-4">
      <div className="text-tertiary text-micro font-mono uppercase tracking-widest">
        {label}
      </div>
      <div className="text-primary text-h4 mt-2 font-semibold capitalize">
        {value.replace(/-/g, " ")}
      </div>
      {sub ? (
        <div className="text-tertiary text-micro mt-1 font-mono">{sub}</div>
      ) : null}
    </StandardCard>
  )
}
