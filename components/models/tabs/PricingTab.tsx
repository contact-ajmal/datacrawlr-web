import { PricingCalculator } from "@/components/models/PricingCalculator"
import { HeroCard, StandardCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type { Model } from "@/lib/types"
import { formatRelativeTime } from "@/lib/utils"

interface PricingTabProps {
  model: Model
  comparisons: Model[]
}

export function PricingTab({ model, comparisons }: PricingTabProps) {
  if (!model.pricing) {
    return (
      <p className="text-tertiary text-caption">
        No pricing information available for this model.
      </p>
    )
  }
  const p = model.pricing
  const lastUpdated = model.lastUpdated ?? model.indexedAt

  return (
    <div className="flex flex-col gap-8">
      {/* Intro */}
      <HeroCard className="p-6">
        <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
          API pricing
        </p>
        <p className="text-secondary text-body mt-3 leading-relaxed">
          As of {formatRelativeTime(lastUpdated)}. Source: OpenRouter
          aggregator. Verify on the provider&apos;s site before signing
          contracts — list prices can change without notice.
        </p>
      </HeroCard>

      {/* Big pricing grid */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <PriceCell
          label="Input"
          value={fmtPrice(p.inputPerMillionTokens)}
          unit="per 1M tokens"
        />
        <PriceCell
          label="Output"
          value={fmtPrice(p.outputPerMillionTokens)}
          unit="per 1M tokens"
        />
        <PriceCell
          label="Cached input"
          value={fmtPrice(p.cachedInputPerMillionTokens)}
          unit="per 1M tokens"
          dimmed={p.cachedInputPerMillionTokens === null}
        />
        <PriceCell
          label="Image"
          value={fmtPrice(p.imagePerMillion)}
          unit="per 1M images"
          dimmed={p.imagePerMillion === null}
        />
      </section>

      {/* Cost calculator */}
      <PricingCalculator model={model} comparisons={comparisons} />

      {/* Free tier */}
      {p.freeTierAvailable ? (
        <HeroCard className="bg-success/10 border-success/30 p-6">
          <Badge variant="success">Free tier available</Badge>
          <p className="text-secondary text-body mt-3 leading-relaxed">
            {p.freeTierNotes ??
              "This model has a free tier through one or more providers — usually with rate limits."}
          </p>
        </HeroCard>
      ) : null}

      {/* Provider availability */}
      <section>
        <h4 className="text-primary text-h4 font-semibold tracking-tight">
          Where to use it
        </h4>
        <p className="text-secondary text-caption mt-1">
          Provider routes we know about for {model.name}.
        </p>
        <ul className="mt-4 flex flex-col gap-2">
          <ProviderRow
            label={p.provider}
            href={model.sourceUrl}
            badge={p.currency}
          />
          {model.huggingfaceRepo ? (
            <ProviderRow
              label="HuggingFace"
              href={`https://huggingface.co/${model.huggingfaceRepo}`}
              badge="weights"
            />
          ) : null}
        </ul>
      </section>
    </div>
  )
}

function PriceCell({
  label,
  value,
  unit,
  dimmed,
}: {
  label: string
  value: string
  unit: string
  dimmed?: boolean
}) {
  return (
    <StandardCard
      className={dimmed ? "!p-4 opacity-50" : "!p-4"}
      data-dimmed={dimmed}
    >
      <div className="text-tertiary text-micro font-mono uppercase tracking-widest">
        {label}
      </div>
      <div className="text-primary text-h3 mt-2 font-mono tabular-nums">
        {value}
      </div>
      <div className="text-tertiary text-micro mt-1 font-mono">{unit}</div>
    </StandardCard>
  )
}

function ProviderRow({
  label,
  href,
  badge,
}: {
  label: string
  href: string
  badge?: string
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="border-subtle bg-elevated/40 hover:border-strong flex items-center justify-between rounded-md border px-4 py-3 transition-colors"
      >
        <span className="text-secondary text-body font-medium capitalize">
          {label.replace(/_/g, " ")}
        </span>
        {badge ? (
          <Badge variant="neutral" className="font-mono">
            {badge}
          </Badge>
        ) : null}
      </a>
    </li>
  )
}

function fmtPrice(v: number | null): string {
  if (v === null) return "—"
  if (v === 0) return "Free"
  if (v < 0.01) return `$${v.toFixed(4)}`
  return `$${v.toFixed(2)}`
}
