import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { HeroCard, StandardCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type {
  BenchmarkName,
  BenchmarkScore,
  BenchmarkSource,
  Model,
} from "@/lib/types"
import { cn, formatRelativeTime } from "@/lib/utils"

interface BenchmarksTabProps {
  model: Model
  /** Rank + total-with-score for each benchmark this model has. */
  ranks: Record<string, { rank: number; total: number; topScore: number }>
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
  "swe-bench-verified": "SWE-Bench Verified",
  livecodebench: "LiveCodeBench",
}

const BENCHMARK_DESCRIPTION: Record<BenchmarkName, string> = {
  "mmlu-pro": "Anti-contamination general knowledge / reasoning",
  gpqa: "Graduate-level science questions",
  humaneval: "Code synthesis from docstrings",
  math: "Mathematical problem solving",
  ifeval: "Strict instruction following",
  musr: "Multistep reasoning narratives",
  bfcl: "Function calling fidelity",
  "arena-elo": "Human-preference ELO from Chatbot Arena",
  mmlu: "Multi-subject knowledge benchmark (legacy)",
  aime: "American Invitational Mathematics Examination",
  "swe-bench-verified": "Real-world software-engineering tasks (verified split)",
  livecodebench: "Live programming contest problems",
}

const SOURCE_LABEL: Record<BenchmarkSource, string> = {
  "open-llm-leaderboard": "Open LLM Leaderboard",
  "artificial-analysis": "Artificial Analysis",
  "lmsys-arena": "LMSys Arena",
  "vendor-reported": "Vendor-reported",
  "paper-reported": "Paper-reported",
  other: "Other",
}

const SOURCE_VARIANT: Record<
  BenchmarkSource,
  "default" | "neutral" | "warn"
> = {
  "open-llm-leaderboard": "default",
  "artificial-analysis": "default",
  "lmsys-arena": "default",
  "vendor-reported": "warn",
  "paper-reported": "neutral",
  other: "neutral",
}

const SCORE_CONTRIBUTION_WEIGHT: Partial<Record<BenchmarkName, number>> = {
  "mmlu-pro": 1.2,
  gpqa: 1.0,
  humaneval: 1.0,
  math: 1.0,
  ifeval: 0.8,
  "arena-elo": 1.0,
}

export function BenchmarksTab({ model, ranks }: BenchmarksTabProps) {
  const scores = model.benchmarkScores
    .slice()
    .sort((a, b) => b.score - a.score)

  return (
    <div className="flex flex-col">
      {/* Intro */}
      <section className="mb-8">
        <HeroCard className="p-6">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            How to read these scores
          </p>
          <p className="text-secondary text-body mt-3 leading-relaxed">
            Benchmark scores come from public leaderboards — primarily the
            HuggingFace Open LLM Leaderboard v2, which uses
            anti-contamination methodology. Vendor-reported scores are
            marked as such and treated with caution. Scores reflect the
            model at a point in time and may not match the latest provider
            improvements.
          </p>
        </HeroCard>
      </section>

      {/* Composite header */}
      {typeof model.compositeScore === "number" && scores.length > 0 ? (
        <section className="mb-10">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            Composite score
          </p>
          <div className="mt-2 flex items-baseline gap-4">
            <span className="text-accent font-mono tabular-nums"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
            >
              {model.compositeScore.toFixed(1)}
            </span>
            {typeof model.compositeRank === "number" ? (
              <span className="text-secondary text-caption font-mono">
                Rank #{model.compositeRank} overall
              </span>
            ) : null}
          </div>
          <p className="text-secondary text-caption mt-3 max-w-2xl">
            Weighted across the {scores.length} core benchmarks this model
            reports.
          </p>
          <CompositeBar
            scores={scores}
            composite={model.compositeScore}
          />
        </section>
      ) : null}

      {/* Per-benchmark sections */}
      {scores.length === 0 ? (
        <p className="text-tertiary text-caption">
          No benchmark scores recorded for this model yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {scores.map((s) => (
            <BenchmarkRow
              key={s.benchmark}
              score={s}
              rank={ranks[s.benchmark]}
            />
          ))}
        </div>
      )}

      {/* Trust callout */}
      <section className="mt-10">
        <HeroCard className="flex items-start gap-4 p-6">
          <AlertTriangle
            className="text-warn mt-0.5 size-5 shrink-0"
            aria-hidden="true"
          />
          <div>
            <h4 className="text-primary text-body font-semibold">
              Benchmarks are one signal, not the only one.
            </h4>
            <p className="text-secondary text-caption mt-2 leading-relaxed">
              Public benchmarks are subject to contamination, methodology
              drift, and overfitting. For production decisions we recommend
              running a small private holdout evaluation on prompts that
              match your actual workload before committing.
            </p>
          </div>
        </HeroCard>
      </section>
    </div>
  )
}

function BenchmarkRow({
  score,
  rank,
}: {
  score: BenchmarkScore
  rank: { rank: number; total: number; topScore: number } | undefined
}) {
  const pct =
    rank && rank.topScore > 0
      ? Math.min(100, (score.score / rank.topScore) * 100)
      : 0
  const sourceVariant = SOURCE_VARIANT[score.source]
  return (
    <StandardCard className="!p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-h4 font-semibold tracking-tight">
            {BENCHMARK_LABEL[score.benchmark]}
          </h4>
          <p className="text-tertiary text-caption mt-1">
            {BENCHMARK_DESCRIPTION[score.benchmark]}
          </p>
        </div>
        <Badge variant={sourceVariant} className="shrink-0">
          {SOURCE_LABEL[score.source]}
        </Badge>
      </header>
      <div className="mt-4 flex items-center gap-6">
        <span className="text-accent text-h2 font-mono tabular-nums">
          {score.score.toFixed(1)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="bg-elevated h-3 overflow-hidden rounded-full">
            <div
              className={cn("bg-accent/70 h-full rounded-full")}
              style={{ width: `${pct}%` }}
            />
          </div>
          {rank ? (
            <div className="text-tertiary text-micro mt-2 flex items-center justify-between font-mono">
              <span>
                #{rank.rank} of {rank.total}
              </span>
              <span>top: {rank.topScore.toFixed(1)}</span>
            </div>
          ) : null}
        </div>
      </div>
      <footer className="border-subtle text-tertiary text-caption mt-4 flex items-center justify-between border-t pt-4">
        <span>Measured {formatRelativeTime(score.measuredAt)}</span>
        <Link
          href={`/models?leaderboard=${score.benchmark}`}
          className="text-accent hover:text-accent-hover underline-offset-4 hover:underline"
        >
          View leaderboard →
        </Link>
      </footer>
    </StandardCard>
  )
}

function CompositeBar({
  scores,
  composite,
}: {
  scores: BenchmarkScore[]
  composite: number
}) {
  // Each benchmark contributes its score × its weight. We project that into
  // a percentage of the composite for visual emphasis only.
  const weighted = scores.map((s) => ({
    benchmark: s.benchmark,
    weight: SCORE_CONTRIBUTION_WEIGHT[s.benchmark] ?? 1,
    value: s.score * (SCORE_CONTRIBUTION_WEIGHT[s.benchmark] ?? 1),
  }))
  const total = weighted.reduce((a, b) => a + b.value, 0) || 1
  return (
    <div className="mt-5">
      <div className="bg-elevated flex h-3 overflow-hidden rounded-full">
        {weighted.map((seg, i) => (
          <div
            key={seg.benchmark}
            className={cn("bg-accent", i % 2 === 0 ? "opacity-80" : "opacity-50")}
            style={{ width: `${(seg.value / total) * 100}%` }}
            title={`${BENCHMARK_LABEL[seg.benchmark]} contributes ${((seg.value / total) * 100).toFixed(0)}%`}
          />
        ))}
      </div>
      <div className="text-tertiary text-micro mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono">
        {weighted.map((seg) => (
          <span key={seg.benchmark} className="inline-flex items-center gap-1">
            <span
              aria-hidden="true"
              className="bg-accent inline-block size-2 rounded-sm opacity-70"
            />
            {BENCHMARK_LABEL[seg.benchmark]}
          </span>
        ))}
        <span className="ml-auto text-tertiary/70">
          Composite: {composite.toFixed(1)}
        </span>
      </div>
    </div>
  )
}
