import Link from "next/link"

import { DonutChart } from "@/components/charts/DonutChart"
import { MiniModelCard } from "@/components/models/MiniModelCard"
import { HeroCard, WhisperCard } from "@/components/shared/Cards"
import type { Model } from "@/lib/types"
import { formatNumber } from "@/lib/utils"

interface ModelsTabProps {
  totalModels: number
  byAccessType: Record<string, number>
  topOpenWeights: Model[]
  topCommercial: Model[]
  topByComposite: Model[]
}

const ACCESS_LABEL: Record<string, string> = {
  "open-weights": "Open weights",
  "open-source": "Open source",
  "commercial-api": "Commercial API",
  "closed-weights": "Closed weights",
}

const ACCESS_COLOR: Record<string, string> = {
  "open-weights": "#5EEAD4",
  "open-source": "#BEF264",
  "commercial-api": "#FBBF24",
  "closed-weights": "#94A3B8",
}

export function ModelsTab({
  totalModels,
  byAccessType,
  topOpenWeights,
  topCommercial,
  topByComposite,
}: ModelsTabProps) {
  const accessSlices = Object.entries(byAccessType)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      key,
      label: ACCESS_LABEL[key] ?? key,
      value,
      color: ACCESS_COLOR[key] ?? "#94A3B8",
    }))

  const openWeightsCount =
    (byAccessType["open-weights"] ?? 0) + (byAccessType["open-source"] ?? 0)
  const commercialCount = byAccessType["commercial-api"] ?? 0
  const withBenchmarks =
    topByComposite.filter((m) => m.benchmarkScores.length > 0).length

  return (
    <div className="flex flex-col gap-10">
      <section>
        <HeroCard className="p-8">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            What models does Datacrawlr index?
          </p>
          <div className="prose mt-4 max-w-3xl">
            <p className="text-secondary text-body leading-relaxed">
              Open-weights models from HuggingFace (Llama, Qwen, DeepSeek,
              Mistral, ...), commercial APIs aggregated through OpenRouter
              (Anthropic, OpenAI, Google, ...), and benchmark scores from
              the Open LLM Leaderboard. We track parameters, context,
              license, pricing, and the datasets each model was trained
              on.
            </p>
          </div>
        </HeroCard>
      </section>

      <section>
        <dl className="flex flex-wrap gap-x-12 gap-y-4">
          <Stat label="Total models" value={formatNumber(totalModels)} />
          <Stat label="Open-weights" value={formatNumber(openWeightsCount)} />
          <Stat label="Commercial APIs" value={formatNumber(commercialCount)} />
          <Stat label="With benchmarks" value={formatNumber(withBenchmarks)} />
        </dl>
      </section>

      <section>
        <div className="mb-6">
          <h3 className="text-h3 font-semibold tracking-tight">
            Distribution by access type
          </h3>
          <p className="text-secondary text-caption mt-1">
            Open vs closed weights, plus the commercial-API tier.
          </p>
        </div>
        <WhisperCard className="p-8">
          <DonutChart
            data={accessSlices}
            total={totalModels}
            totalLabel="models indexed"
            size={220}
          />
        </WhisperCard>
      </section>

      <ModelGroup
        title="Top open-weights"
        subtitle="By composite benchmark score."
        models={topOpenWeights}
        href="/models?access_type=open-weights"
      />
      <ModelGroup
        title="Top commercial"
        subtitle="API-accessible models with public benchmark scores."
        models={topCommercial}
        href="/models?access_type=commercial-api"
      />
      <ModelGroup
        title="Top by composite score"
        subtitle="Across all access types — what's leading right now."
        models={topByComposite}
        href="/models?sort=composite_score"
      />

      <div>
        <Link
          href="/models"
          className="text-accent text-caption hover:text-accent-hover underline-offset-4 hover:underline"
        >
          Browse all models →
        </Link>
      </div>
    </div>
  )
}

function ModelGroup({
  title,
  subtitle,
  models,
  href,
}: {
  title: string
  subtitle: string
  models: Model[]
  href: string
}) {
  if (models.length === 0) return null
  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-h3 font-semibold tracking-tight">{title}</h3>
          <p className="text-secondary text-caption mt-1">{subtitle}</p>
        </div>
        <Link
          href={href}
          className="text-accent text-caption hover:text-accent-hover shrink-0 underline-offset-4 hover:underline"
        >
          See all →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {models.map((m) => (
          <MiniModelCard key={m.slug} model={m} />
        ))}
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dd className="text-h3 text-primary font-mono font-medium tabular-nums">
        {value}
      </dd>
      <dt className="text-tertiary text-micro mt-1 uppercase tracking-widest">
        {label}
      </dt>
    </div>
  )
}
