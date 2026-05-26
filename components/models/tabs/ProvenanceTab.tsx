import Link from "next/link"
import { ExternalLink } from "lucide-react"

import { HeroCard, StandardCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type { Model } from "@/lib/types"

interface ProvenanceTabProps {
  model: Model
  /** Resolved base-model row if we have one indexed; null otherwise. */
  baseModel?: Model | null
}

export function ProvenanceTab({ model, baseModel }: ProvenanceTabProps) {
  return (
    <div className="flex flex-col gap-8">
      <HeroCard className="p-6">
        <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
          Provenance chain
        </p>
        <p className="text-secondary text-body mt-3 leading-relaxed">
          Where this model came from — its lineage, the platforms hosting
          it, the people behind it, and the license under which it&apos;s
          available.
        </p>
      </HeroCard>

      {/* Lineage */}
      <section>
        <h4 className="text-primary text-h4 font-semibold">Lineage</h4>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <StandardCard className="!p-5">
            <div className="text-tertiary text-micro font-mono uppercase tracking-widest">
              Base model
            </div>
            <div className="text-primary text-body mt-2 font-medium">
              {model.baseModel ? (
                baseModel ? (
                  <Link
                    href={`/models/${baseModel.slug}`}
                    className="text-accent hover:text-accent-hover underline-offset-4 hover:underline"
                  >
                    {baseModel.name}
                  </Link>
                ) : (
                  model.baseModel
                )
              ) : (
                "From scratch / not declared"
              )}
            </div>
          </StandardCard>
          <StandardCard className="!p-5">
            <div className="text-tertiary text-micro font-mono uppercase tracking-widest">
              Released
            </div>
            <div className="text-primary text-body mt-2 font-medium">
              {model.releasedAt
                ? new Date(model.releasedAt).toLocaleDateString()
                : "—"}
            </div>
          </StandardCard>
        </div>
      </section>

      {/* Source platforms */}
      <section>
        <h4 className="text-primary text-h4 font-semibold">
          Where we found it
        </h4>
        <ul className="mt-3 flex flex-col gap-2">
          <ProvenanceRow
            label={model.sourcePlatform}
            href={model.sourceUrl}
            badge="primary"
          />
          {model.huggingfaceRepo &&
          !model.sourceUrl.includes("huggingface.co") ? (
            <ProvenanceRow
              label="HuggingFace"
              href={`https://huggingface.co/${model.huggingfaceRepo}`}
              badge="weights"
            />
          ) : null}
          {model.paperUrl ? (
            <ProvenanceRow
              label="Paper"
              href={model.paperUrl}
              badge="cite"
            />
          ) : null}
          {model.blogUrl ? (
            <ProvenanceRow
              label="Blog post"
              href={model.blogUrl}
              badge="context"
            />
          ) : null}
        </ul>
      </section>

      {/* Creators */}
      <section>
        <h4 className="text-primary text-h4 font-semibold">Creators</h4>
        {model.creators.length === 0 ? (
          <p className="text-tertiary text-caption mt-2">
            Creators not yet recorded for this model.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {model.creators.map((c, i) => (
              <li
                key={`${c.name}-${i}`}
                className="border-subtle bg-elevated/40 flex items-center justify-between rounded-md border px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="text-primary text-body font-medium">
                    {c.name}
                  </div>
                  {c.affiliation ? (
                    <div className="text-tertiary text-caption mt-0.5">
                      {c.affiliation}
                    </div>
                  ) : null}
                </div>
                {c.orcid ? (
                  <a
                    href={`https://orcid.org/${c.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tertiary text-micro hover:text-accent inline-flex items-center gap-1 font-mono transition-colors"
                  >
                    ORCID
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* License */}
      <section>
        <h4 className="text-primary text-h4 font-semibold">License</h4>
        <StandardCard className="!p-5 mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-primary text-body font-medium">
              {model.license ?? "License not declared"}
            </span>
            <Badge variant="neutral" className="capitalize">
              {model.licenseType.replace(/_/g, " ")}
            </Badge>
            {model.licenseIntelligence ? (
              <Badge
                variant={
                  model.licenseIntelligence.riskLevel === "low"
                    ? "success"
                    : model.licenseIntelligence.riskLevel === "medium"
                      ? "warn"
                      : "danger"
                }
              >
                {model.licenseIntelligence.riskLevel} risk
              </Badge>
            ) : (
              <Badge variant="neutral">risk not yet evaluated</Badge>
            )}
          </div>
          {/* License-intelligence breakdown only renders when the
              enricher has run; freshly indexed rows show the badges
              above and a single "risk not yet evaluated" chip. */}
          {model.licenseIntelligence ? (
            <>
              {model.licenseIntelligence.notes ? (
                <p className="text-secondary text-caption mt-3 leading-relaxed">
                  {model.licenseIntelligence.notes}
                </p>
              ) : null}
              <ul className="text-tertiary text-micro mt-4 grid grid-cols-2 gap-1 font-mono">
                <LicenseFlag
                  label="Commercial use"
                  state={model.licenseIntelligence.commercialUse}
                />
                <LicenseFlag
                  label="Attribution"
                  state={model.licenseIntelligence.attributionRequired}
                />
                <LicenseFlag
                  label="Redistribution"
                  state={model.licenseIntelligence.redistributionAllowed}
                />
                <LicenseFlag
                  label="Modification"
                  state={model.licenseIntelligence.modificationAllowed}
                />
              </ul>
            </>
          ) : null}
        </StandardCard>
      </section>
    </div>
  )
}

function ProvenanceRow({
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
        <span className="flex items-center gap-2">
          {badge ? (
            <Badge variant="neutral" className="font-mono">
              {badge}
            </Badge>
          ) : null}
          <ExternalLink
            className="text-tertiary size-4"
            aria-hidden="true"
          />
        </span>
      </a>
    </li>
  )
}

function LicenseFlag({
  label,
  state,
}: {
  label: string
  state: boolean | null | undefined
}) {
  const display =
    state === true ? "yes" : state === false ? "no" : "—"
  const className =
    state === true
      ? "text-emerald-400"
      : state === false
        ? "text-rose-400"
        : "text-tertiary"
  return (
    <li className="flex items-center justify-between gap-2">
      <span>{label}</span>
      <span className={className}>{display}</span>
    </li>
  )
}
