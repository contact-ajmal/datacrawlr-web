import Link from "next/link"
import { Brain, ExternalLink, FileText, Newspaper, Zap } from "lucide-react"

import { AddToCompareButton } from "@/components/models/AddToCompareButton"
import { StandardCard, WhisperCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { LicenseType, Model } from "@/lib/types"
import { formatRelativeTime } from "@/lib/utils"

interface ModelDetailRailProps {
  model: Model
  related: Model[]
}

const RISK_VARIANT: Record<string, "success" | "warn" | "danger" | "neutral"> = {
  low: "success",
  medium: "warn",
  high: "danger",
  unknown: "neutral",
}

const LICENSE_VARIANT: Record<
  LicenseType,
  "default" | "neutral" | "warn" | "danger" | "success"
> = {
  permissive: "success",
  public_domain: "success",
  copyleft: "warn",
  non_commercial: "warn",
  restrictive: "warn",
  proprietary: "danger",
  unknown: "neutral",
}

export function ModelDetailRail({ model, related }: ModelDetailRailProps) {
  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-32 lg:self-start">
      <AtAGlance model={model} />
      <QuickActions model={model} />
      <CompareCard slug={model.slug} />
      <RelatedCard related={related} />
    </div>
  )
}

function AtAGlance({ model }: { model: Model }) {
  const rows: { label: string; node: React.ReactNode }[] = [
    {
      label: "Access type",
      node: (
        <span className="capitalize">
          {model.accessType.replace(/-/g, " ")}
        </span>
      ),
    },
    {
      label: "License",
      node: (
        <span className="inline-flex items-center gap-1.5">
          <Badge variant={LICENSE_VARIANT[model.licenseType]}>
            {model.licenseType.replace(/_/g, " ")}
          </Badge>
          {/* Risk badge only renders when the license-intelligence
              enricher has run; otherwise the model row is fresh and
              we shouldn't fake a confidence level. */}
          {model.licenseIntelligence ? (
            <Badge
              variant={
                RISK_VARIANT[model.licenseIntelligence.riskLevel] ?? "neutral"
              }
            >
              {model.licenseIntelligence.riskLevel} risk
            </Badge>
          ) : null}
        </span>
      ),
    },
    {
      label: "Organization",
      node: model.organization ?? "Independent",
    },
    {
      label: "Released",
      node: model.releasedAt
        ? new Date(model.releasedAt).toLocaleDateString()
        : "—",
    },
    {
      label: "Last updated",
      node: model.lastUpdated ? formatRelativeTime(model.lastUpdated) : "—",
    },
    {
      label: "Composite rank",
      node:
        typeof model.compositeRank === "number"
          ? `#${model.compositeRank}`
          : "—",
    },
  ]
  return (
    <StandardCard className="!p-5">
      <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
        At a glance
      </p>
      <dl className="mt-4 flex flex-col gap-2 font-mono text-caption">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-3">
            <dt className="text-tertiary shrink-0">{r.label}</dt>
            <dd className="text-secondary text-right">{r.node}</dd>
          </div>
        ))}
      </dl>
    </StandardCard>
  )
}

function QuickActions({ model }: { model: Model }) {
  const actions: { href: string; label: string; icon: React.ReactNode }[] = []
  if (model.huggingfaceRepo) {
    actions.push({
      href: `https://huggingface.co/${model.huggingfaceRepo}`,
      label: "Open on HuggingFace",
      icon: <Brain className="size-4" aria-hidden="true" />,
    })
  }
  if (model.paperUrl) {
    actions.push({
      href: model.paperUrl,
      label: "View paper",
      icon: <FileText className="size-4" aria-hidden="true" />,
    })
  }
  if (model.blogUrl) {
    actions.push({
      href: model.blogUrl,
      label: "Read blog post",
      icon: <Newspaper className="size-4" aria-hidden="true" />,
    })
  }
  if (
    model.accessType === "commercial-api" &&
    (model.sourcePlatform === "openrouter" ||
      model.sourceUrl.includes("openrouter"))
  ) {
    actions.push({
      href: model.sourceUrl,
      label: "Try on OpenRouter",
      icon: <Zap className="size-4" aria-hidden="true" />,
    })
  }
  if (actions.length === 0) {
    actions.push({
      href: model.sourceUrl,
      label: "Open source",
      icon: <ExternalLink className="size-4" aria-hidden="true" />,
    })
  }
  return (
    <WhisperCard>
      <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
        Quick actions
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {actions.map((a) => (
          <Button
            asChild
            key={a.label}
            variant="secondary"
            size="sm"
            className="justify-start"
          >
            <a href={a.href} target="_blank" rel="noopener noreferrer">
              {a.icon}
              {a.label}
              <ExternalLink
                className="text-tertiary ml-auto size-3.5"
                aria-hidden="true"
              />
            </a>
          </Button>
        ))}
      </div>
    </WhisperCard>
  )
}

function CompareCard({ slug }: { slug: string }) {
  return (
    <WhisperCard>
      <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
        Compare
      </p>
      <p className="text-secondary text-caption mt-1 leading-relaxed">
        Add up to 4 models to compare side-by-side.
      </p>
      <div className="mt-3">
        <AddToCompareButton slug={slug} />
      </div>
    </WhisperCard>
  )
}

function RelatedCard({ related }: { related: Model[] }) {
  if (related.length === 0) return null
  return (
    <WhisperCard>
      <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
        Related models
      </p>
      <ul className="mt-3 flex flex-col">
        {related.slice(0, 3).map((m) => (
          <li
            key={m.slug}
            className="border-subtle border-b last:border-0"
          >
            <Link
              href={`/models/${m.slug}`}
              className="hover:bg-elevated -mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors"
            >
              <span className="min-w-0">
                <span className="text-secondary text-caption block truncate font-medium">
                  {m.name}
                </span>
                <span className="text-tertiary text-micro block truncate font-mono">
                  {m.organization ?? "Independent"}
                </span>
              </span>
              {typeof m.compositeScore === "number" ? (
                <Badge variant="neutral" className="shrink-0 font-mono">
                  {m.compositeScore.toFixed(0)}
                </Badge>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </WhisperCard>
  )
}
