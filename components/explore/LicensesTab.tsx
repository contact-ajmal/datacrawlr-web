import Link from "next/link"
import { AlertTriangle, Check, Minus, X } from "lucide-react"

import { DonutChart } from "@/components/charts/DonutChart"
import { HeroCard, StandardCard, WhisperCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type { Dataset } from "@/lib/types"
import { formatNumber } from "@/lib/utils"

interface LicenseBlock {
  type: LicenseType
  count: number
  samples: Dataset[]
}

interface LicensesTabProps {
  blocks: LicenseBlock[]
  counts: Record<string, number>
}

type LicenseType =
  | "permissive"
  | "copyleft"
  | "non_commercial"
  | "restrictive"
  | "proprietary"
  | "public_domain"
  | "unknown"

interface LicenseProfile {
  label: string
  blurb: string
  color: string
  risk: "low" | "medium" | "high" | "unknown"
  commercial: boolean | "limited"
  attribution: boolean
  redistribution: boolean
  modification: boolean
}

const LICENSE_PROFILE: Record<LicenseType, LicenseProfile> = {
  permissive: {
    label: "Permissive",
    blurb:
      "MIT, Apache-2.0, BSD, CC-BY, CC0 and similar. Generally OK for commercial use with attribution. The default safe bet for production.",
    color: "#5EEAD4",
    risk: "low",
    commercial: true,
    attribution: true,
    redistribution: true,
    modification: true,
  },
  public_domain: {
    label: "Public domain",
    blurb:
      "No rights reserved. You can do essentially anything — including selling derivative works — without crediting the source.",
    color: "#BEF264",
    risk: "low",
    commercial: true,
    attribution: false,
    redistribution: true,
    modification: true,
  },
  copyleft: {
    label: "Copyleft",
    blurb:
      "GPL, CC-BY-SA, and similar. You can use it commercially, but derivative works generally must inherit the same terms.",
    color: "#FBBF24",
    risk: "medium",
    commercial: true,
    attribution: true,
    redistribution: true,
    modification: true,
  },
  non_commercial: {
    label: "Non-commercial",
    blurb:
      "CC-BY-NC and similar. Use for research and education is fine; productizing the dataset (or models trained on it) is not.",
    color: "#FB923C",
    risk: "medium",
    commercial: false,
    attribution: true,
    redistribution: true,
    modification: true,
  },
  restrictive: {
    label: "Restrictive",
    blurb:
      "Hand-rolled or no-derivatives terms. Read the original license carefully — many of these forbid model training entirely.",
    color: "#F472B6",
    risk: "high",
    commercial: "limited",
    attribution: true,
    redistribution: false,
    modification: false,
  },
  proprietary: {
    label: "Proprietary",
    blurb:
      "Custom enterprise or platform-specific terms. Usually requires a contract or paid license before any use.",
    color: "#A78BFA",
    risk: "high",
    commercial: "limited",
    attribution: true,
    redistribution: false,
    modification: false,
  },
  unknown: {
    label: "Unknown",
    blurb:
      "We couldn't parse a license from the source metadata. Treat as restricted and verify directly on the source.",
    color: "#94A3B8",
    risk: "unknown",
    commercial: "limited",
    attribution: true,
    redistribution: false,
    modification: false,
  },
}

const RISK_STYLE: Record<LicenseProfile["risk"], string> = {
  low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  high: "bg-rose-500/15 text-rose-300 border-rose-500/40",
  unknown: "bg-zinc-500/15 text-zinc-300 border-zinc-500/40",
}

export function LicensesTab({ blocks, counts }: LicensesTabProps) {
  const total = Object.values(counts).reduce((s, n) => s + n, 0)
  const slices = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => {
      const profile = LICENSE_PROFILE[key as LicenseType] ?? LICENSE_PROFILE.unknown
      return {
        key,
        label: profile.label,
        value,
        color: profile.color,
      }
    })

  return (
    <div className="flex flex-col gap-10">
      <section>
        <HeroCard className="p-8">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            Read before you train
          </p>
          <div className="prose mt-4 max-w-3xl">
            <p className="text-secondary text-body">
              Dataset licenses determine what you&apos;re legally allowed to
              do with the data. We normalize every license to a standard set
              of categories so you can filter for what fits your use case —
              commercial product, academic research, internal-only.
            </p>
            <p className="text-secondary text-body mt-4">
              <strong className="text-primary">Permissive</strong> licenses
              (MIT, Apache-2.0, CC-BY, CC0) generally allow commercial use
              with minimal restrictions.{" "}
              <strong className="text-primary">Copyleft</strong> licenses
              (GPL, CC-BY-SA) require derivative works under the same terms.{" "}
              <strong className="text-primary">Non-commercial</strong>{" "}
              licenses (CC-BY-NC) restrict use to research and educational
              purposes.{" "}
              <strong className="text-primary">Proprietary</strong> datasets
              have custom restrictions you must read.
            </p>
            <p className="text-secondary text-body mt-4">
              Always verify the license on the original source before using
              a dataset in production. Datacrawlr&apos;s classification is a
              starting point, not legal advice.
            </p>
          </div>
        </HeroCard>
      </section>

      <section>
        <WhisperCard className="p-8">
          <DonutChart
            data={slices}
            total={total}
            totalLabel="datasets indexed"
            size={220}
          />
        </WhisperCard>
      </section>

      <section className="flex flex-col gap-10">
        {blocks.length === 0 ? (
          <p className="text-tertiary text-caption">
            No license rollup available yet.
          </p>
        ) : (
          blocks.map(({ type, count, samples }) => {
            const profile = LICENSE_PROFILE[type] ?? LICENSE_PROFILE.unknown
            return (
              <article key={type}>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <h3 className="text-h4 font-semibold tracking-tight">
                    {profile.label}
                  </h3>
                  <Badge variant="neutral" className="font-mono">
                    {formatNumber(count)} datasets
                  </Badge>
                  <span
                    className={`border rounded-full px-2 py-0.5 text-micro font-mono uppercase tracking-widest ${RISK_STYLE[profile.risk]}`}
                  >
                    {profile.risk} risk
                  </span>
                </div>
                <p className="text-secondary text-caption mb-5 max-w-3xl">
                  {profile.blurb}
                </p>
                <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <UseCell
                    label="Commercial use"
                    state={profile.commercial}
                  />
                  <UseCell label="Attribution" state={profile.attribution} />
                  <UseCell
                    label="Redistribution"
                    state={profile.redistribution}
                  />
                  <UseCell
                    label="Modification"
                    state={profile.modification}
                  />
                </div>
                {samples.length === 0 ? (
                  <p className="text-tertiary text-micro">
                    No samples to show.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {samples.map((d) => (
                      <Link
                        key={d.id}
                        href={`/datasets/${d.slug}`}
                        className="border-subtle bg-elevated/40 hover:border-strong rounded-md border p-3 transition-colors"
                      >
                        <div className="text-primary text-caption truncate font-medium">
                          {d.name}
                        </div>
                        <div className="text-tertiary text-micro mt-1 truncate">
                          {d.modality} · {d.license || "license unknown"}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            )
          })
        )}
      </section>

      <section>
        <StandardCard className="flex items-start gap-4 !p-6">
          <AlertTriangle
            className="text-warn mt-0.5 size-5 shrink-0"
            aria-hidden="true"
          />
          <p className="text-secondary text-caption">
            Datacrawlr classifies licenses for discovery — not legal
            compliance. Verify on the source before commercial use.
          </p>
        </StandardCard>
      </section>
    </div>
  )
}

function UseCell({
  label,
  state,
}: {
  label: string
  state: boolean | "limited"
}) {
  const tone =
    state === true
      ? { icon: Check, klass: "text-emerald-400" }
      : state === false
        ? { icon: X, klass: "text-rose-400" }
        : { icon: Minus, klass: "text-amber-400" }
  const Icon = tone.icon
  return (
    <div className="border-subtle bg-elevated/40 flex items-center gap-2 rounded-md border px-3 py-2">
      <Icon className={`size-4 shrink-0 ${tone.klass}`} aria-hidden="true" />
      <span className="text-secondary text-micro">{label}</span>
    </div>
  )
}
