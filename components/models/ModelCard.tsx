import Link from "next/link"
import {
  AudioLines,
  FileText,
  Film,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react"

import { ModelCompareAction } from "@/components/models/ModelCompareAction"
import { StandardCard } from "@/components/shared/Cards"
import { Shimmer } from "@/components/shared/Shimmer"
import { Badge } from "@/components/ui/badge"
import type { BenchmarkName, Model, ModelAccessType, Modality } from "@/lib/types"
import { cn, formatNumber, formatRelativeTime } from "@/lib/utils"

interface ModelCardProps {
  model: Model
  className?: string
}

const ACCESS_VARIANT: Record<
  ModelAccessType,
  "default" | "neutral" | "warn" | "success"
> = {
  "open-weights": "default",
  "open-source": "success",
  "commercial-api": "warn",
  "closed-weights": "neutral",
}

const ACCESS_LABEL: Record<ModelAccessType, string> = {
  "open-weights": "Open weights",
  "open-source": "Open source",
  "commercial-api": "Commercial API",
  "closed-weights": "Closed weights",
}

const MODALITY_ICONS: Partial<Record<Modality, LucideIcon>> = {
  text: FileText,
  image: ImageIcon,
  audio: AudioLines,
  video: Film,
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

function formatParams(n?: number): string | null {
  if (!n || n <= 0) return null
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T params`
  if (n >= 1e9) return `${(n / 1e9).toFixed(n >= 100e9 ? 0 : 0)}B params`
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M params`
  return `${formatNumber(n)} params`
}

function formatContext(n?: number): string | null {
  if (!n || n <= 0) return null
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M ctx`
  if (n >= 1000) return `${Math.round(n / 1000)}K ctx`
  return `${n} ctx`
}

function shortLicense(model: Model): string | null {
  if (!model.license) return null
  // Trim long license strings to the head — the badge can't fit much.
  const trimmed = model.license.replace(/Community License|Commercial/gi, "").trim()
  return trimmed.length > 18 ? `${trimmed.slice(0, 18)}…` : trimmed || model.license
}

function topBenchmarks(model: Model, max: number): typeof model.benchmarkScores {
  return [...model.benchmarkScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
}

export function ModelCard({ model, className }: ModelCardProps) {
  const access = ACCESS_VARIANT[model.accessType] ?? "neutral"
  const params = formatParams(model.parameters)
  const ctx = formatContext(model.contextWindow)
  const license = shortLicense(model)
  const benches = topBenchmarks(model, 3)
  const updated = model.lastUpdated ?? model.indexedAt

  return (
    <Link
      href={`/models/${model.slug}`}
      className={cn(
        "group block transition-transform duration-150",
        "hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        className
      )}
      aria-label={`${model.name} by ${model.organization ?? "unknown"}`}
    >
      <StandardCard className="relative !p-5 group-hover:border-strong">
        {/* Hover-only "Compare" action — absolute so it doesn't reflow the
            card and stops propagation so the wrapping Link doesn't fire. */}
        <ModelCompareAction
          slug={model.slug}
          name={model.name}
          className="absolute right-3 top-3 z-10"
        />

        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {model.organization ? (
                <Badge variant="neutral" className="capitalize">
                  {model.organization}
                </Badge>
              ) : null}
              <h3 className="text-primary text-h4 truncate font-semibold tracking-tight">
                {model.name}
              </h3>
            </div>
            <p className="text-secondary text-caption mt-2 line-clamp-2">
              {model.shortDescription}
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-col items-end gap-1">
            <Badge variant={access}>{ACCESS_LABEL[model.accessType]}</Badge>
            {typeof model.compositeRank === "number" ? (
              <span className="text-accent text-micro font-mono tabular-nums">
                #{model.compositeRank} overall
              </span>
            ) : null}
          </div>
        </div>

        {/* Specs strip */}
        {(params || ctx || license || model.modalitiesInput.length > 0) && (
          <div className="text-tertiary text-micro mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono">
            {params ? <span>{params}</span> : null}
            {ctx ? <span>{ctx}</span> : null}
            {model.modalitiesInput.length > 0 ? (
              <span className="inline-flex items-center gap-1">
                {model.modalitiesInput
                  .map((m) => MODALITY_ICONS[m as Modality])
                  .filter((Icon): Icon is LucideIcon => Boolean(Icon))
                  .map((Icon, i) => (
                    <Icon
                      key={i}
                      className="size-3 shrink-0"
                      aria-hidden="true"
                    />
                  ))}
              </span>
            ) : null}
            {license ? <span className="truncate">{license}</span> : null}
          </div>
        )}

        {/* Pricing */}
        {model.pricing ? (
          <div className="text-secondary text-caption mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono">
            {typeof model.pricing.inputPerMillionTokens === "number" ? (
              <span>
                In:{" "}
                <span className="text-primary">
                  ${model.pricing.inputPerMillionTokens.toFixed(2)}/M
                </span>
              </span>
            ) : null}
            {typeof model.pricing.outputPerMillionTokens === "number" ? (
              <span>
                Out:{" "}
                <span className="text-primary">
                  ${model.pricing.outputPerMillionTokens.toFixed(2)}/M
                </span>
              </span>
            ) : null}
            {model.pricing.freeTierAvailable ? (
              <Badge variant="default" className="ml-auto">
                Free tier
              </Badge>
            ) : null}
          </div>
        ) : null}

        {/* Benchmarks */}
        {(benches.length > 0 || typeof model.compositeScore === "number") && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {typeof model.compositeScore === "number" ? (
              <Badge variant="default" className="font-mono">
                Composite: {model.compositeScore.toFixed(1)}
              </Badge>
            ) : null}
            {benches.map((b) => (
              <Badge
                key={b.benchmark}
                variant="neutral"
                className="font-mono"
              >
                {BENCHMARK_LABEL[b.benchmark]}: {b.score.toFixed(1)}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="border-subtle text-tertiary text-caption mt-4 flex items-center justify-between border-t pt-4">
          <span className="truncate">
            By {model.organization ?? "Unknown"}
            <span className="text-tertiary/60 mx-2" aria-hidden="true">
              ·
            </span>
            {formatRelativeTime(updated)}
          </span>
          <span className="text-accent inline-flex shrink-0 items-center font-medium">
            View details →
          </span>
        </div>
      </StandardCard>
    </Link>
  )
}

export function ModelCardSkeleton() {
  return (
    <StandardCard className="!p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Shimmer className="h-5 w-20 rounded-full" />
            <Shimmer className="h-5 w-44 rounded-md" />
          </div>
          <Shimmer className="mt-3 h-4 w-full rounded" />
          <Shimmer className="mt-1.5 h-4 w-4/5 rounded" />
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-1">
          <Shimmer className="h-5 w-24 rounded-full" />
          <Shimmer className="h-3 w-16" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[0, 1, 2].map((i) => (
          <Shimmer key={i} className="h-3 w-16" />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <Shimmer key={i} className="h-5 w-20 rounded-full" />
        ))}
      </div>
      <div className="border-subtle mt-4 flex items-center justify-between border-t pt-4">
        <Shimmer className="h-3 w-32" />
        <Shimmer className="h-3 w-24" />
      </div>
    </StandardCard>
  )
}
