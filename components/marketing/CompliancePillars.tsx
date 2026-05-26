import { Check } from "lucide-react"

import { StandardCard } from "@/components/shared/Cards"

const PILLARS: { title: string; body: string }[] = [
  {
    title: "API-first ingestion",
    body: "Every connector hits the source's official API or a structured open feed (DCAT, OAI-PMH, schema.org). We never scrape behind authentication or paywalls.",
  },
  {
    title: "Metadata only — no mirroring",
    body: "We index what a dataset or model is — not the bytes themselves. Every page links to the original host; the host stays the source of truth.",
  },
  {
    title: "License-aware by default",
    body: "Each entry is tagged with its license category and use terms. License risk badges surface non-commercial and restrictive terms before you build on them.",
  },
  {
    title: "Robots.txt + rate limits respected",
    body: "Identified User-Agent. Backoff on errors. Crawl-delay honored. Where a source publishes quotas, we stay well under them.",
  },
]

export function CompliancePillars() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            Compliance posture
          </p>
          <h2 className="text-h2 mt-3 font-semibold tracking-tight">
            Index, don&apos;t mirror.
          </h2>
          <p className="text-secondary text-lead mt-3">
            Our architecture is the compliance story. Four commitments that
            apply to every entry in the catalog.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PILLARS.map(({ title, body }) => (
            <StandardCard key={title} className="!p-6">
              <div className="flex items-start gap-3">
                <span
                  className="bg-elevated grid size-8 shrink-0 place-items-center rounded-full"
                  aria-hidden="true"
                >
                  <Check className="size-4 text-emerald-400" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-primary text-body font-semibold">
                    {title}
                  </div>
                  <p className="text-secondary text-caption mt-2 leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            </StandardCard>
          ))}
        </div>
      </div>
    </section>
  )
}
