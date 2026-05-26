import Link from "next/link"
import {
  AudioLines,
  Bookmark,
  ExternalLink,
  FileText,
  Film,
  Image as ImageIcon,
  Share2,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type {
  LicenseType,
  Model,
  ModelAccessType,
  Modality,
} from "@/lib/types"
import { formatNumber } from "@/lib/utils"

interface ModelDetailHeroProps {
  model: Model
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

function formatParamBadge(model: Model): string | null {
  const { parameters, activeParameters } = model
  if (!parameters) return null
  if (activeParameters && activeParameters !== parameters) {
    return `MoE: ${humanParams(activeParameters)} active / ${humanParams(parameters)} total`
  }
  return `${humanParams(parameters)} params`
}

function humanParams(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`
  if (n >= 1e9) return `${(n / 1e9).toFixed(0)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`
  return formatNumber(n)
}

function humanContext(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
  if (n >= 1_000) return `${Math.round(n / 1000)}K`
  return String(n)
}

function curatorInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·"
  )
}

export function ModelDetailHero({ model }: ModelDetailHeroProps) {
  const paramBadge = formatParamBadge(model)
  const ctxBadge = model.contextWindow
    ? `${humanContext(model.contextWindow)} context`
    : null

  return (
    <section className="border-subtle border-b py-12">
      <nav
        className="text-tertiary text-caption mb-6"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/models" className="hover:text-primary">
              Models
            </Link>
          </li>
          {model.organization ? (
            <>
              <li aria-hidden="true">/</li>
              <li className="capitalize">{model.organization}</li>
            </>
          ) : null}
          <li aria-hidden="true">/</li>
          <li className="text-secondary truncate" aria-current="page">
            {model.name}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="bg-elevated border-subtle inline-flex size-7 items-center justify-center rounded-full border text-[10px] font-mono uppercase"
              aria-hidden="true"
            >
              {curatorInitials(model.organization ?? model.name)}
            </span>
            <span className="text-secondary text-caption font-medium">
              {model.organization ?? "Independent"}
            </span>
            <Badge variant={ACCESS_VARIANT[model.accessType]}>
              {ACCESS_LABEL[model.accessType]}
            </Badge>
          </div>

          <h1 className="text-h1 font-semibold tracking-tight">
            {model.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {paramBadge ? (
              <Badge variant="neutral" className="font-mono">
                {paramBadge}
              </Badge>
            ) : null}
            {ctxBadge ? (
              <Badge variant="neutral" className="font-mono">
                {ctxBadge}
              </Badge>
            ) : null}
            {model.modalitiesInput.length > 0 ? (
              <span className="bg-elevated border-subtle text-tertiary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5">
                {model.modalitiesInput
                  .map((m) => MODALITY_ICONS[m])
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
            <Badge variant={LICENSE_VARIANT[model.licenseType]}>
              {model.license ?? model.licenseType.replace(/_/g, " ")}
            </Badge>
          </div>

          <p className="text-secondary text-lead mt-6 max-w-3xl">
            {model.shortDescription}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bookmark className="size-4" aria-hidden="true" />
              Save
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="size-4" aria-hidden="true" />
              Share
            </Button>
            <Button asChild size="sm">
              <a
                href={model.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                Open source
              </a>
            </Button>
          </div>

          {typeof model.compositeRank === "number" ? (
            <div className="bg-overlay border-strong rounded-xl border p-4 text-right">
              <div className="text-accent text-h3 font-mono">
                Rank #{model.compositeRank}
              </div>
              {typeof model.compositeScore === "number" ? (
                <div className="text-secondary text-caption mt-1 font-mono">
                  Composite: {model.compositeScore.toFixed(1)}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
