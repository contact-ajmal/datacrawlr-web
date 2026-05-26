import type { Metadata } from "next"

import { CompliancePillars } from "@/components/marketing/CompliancePillars"
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase"
import { MarketingCTA } from "@/components/marketing/MarketingCTA"
import { SourcesGrid } from "@/components/marketing/SourcesGrid"
import { HeroCard, StandardCard } from "@/components/shared/Cards"
import { Layers, ListTree, Quote, Scale } from "lucide-react"

export const metadata: Metadata = {
  title: "Datasets — Datacrawlr",
  description:
    "Discover every dataset worth knowing about. Datacrawlr indexes schemas, licenses, lineage, and citations from nine open-data sources.",
}

const METADATA_FIELDS = [
  {
    title: "Schema + structure",
    icon: ListTree,
    body: "Field names, types, descriptions, and nullability — parsed from source-platform feeds where available, inferred from sampled rows where not.",
  },
  {
    title: "License + use terms",
    icon: Scale,
    body: "Normalized license category (permissive / copyleft / non-commercial / restrictive / proprietary / public domain), commercial-use signal, and a risk pill.",
  },
  {
    title: "Lineage + provenance",
    icon: Layers,
    body: "Derived-from / similar-to / benchmarked-against edges between datasets, plus the models that report training on them.",
  },
  {
    title: "Citations + attribution",
    icon: Quote,
    body: "BibTeX-quality citation strings when the source publishes them, creator credentials with ORCID when known.",
  },
]

export default function DatasetsMarketingPage() {
  return (
    <main id="main">
      <section className="border-subtle border-b py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            Datasets
          </p>
          <h1 className="text-h1 mt-3 font-semibold tracking-tight">
            Every dataset worth knowing about.
          </h1>
          <p className="text-secondary text-lead mt-5">
            Datacrawlr harvests structured metadata from nine sources of open
            data — research repositories, ML community hubs, government
            portals — and projects every entry into a single canonical
            schema. You compare them like rows in a database.
          </p>
        </div>
      </section>

      <FeatureShowcase
        eyebrow="Discovery"
        title="Type two characters. See what we have."
        body="The hero search runs against every indexed dataset and model. Two-line previews per row. Hit enter for the full search page with AI synthesis and faceted filters."
        screenshot={{
          src: "/screenshots/live-search.png",
          alt: "Homepage hero with the type-ahead dropdown open showing dataset matches.",
          url: "datacrawlr.com",
          captureRoute: "/ (focus the hero input)",
        }}
        cta={{ label: "Open the catalog", href: "/explore" }}
        imageSide="right"
      />

      <FeatureShowcase
        eyebrow="Search + synthesis"
        title="An AI summary at the top of every result list."
        body="Searches return real datasets ranked by BM25 + popularity. The synthesis card above the grid explains what the matches share, where they differ, and which to start with — with citations back to the actual rows."
        screenshot={{
          src: "/screenshots/search-results.png",
          alt: "Search results with AI synthesis card and ranked dataset cards.",
          url: "datacrawlr.com/search?q=medical+imaging",
          captureRoute: "/search?q=medical+imaging",
        }}
        cta={{ label: "Run a query", href: "/search?q=medical+imaging" }}
        imageSide="left"
      />

      {/* Metadata captured */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-2xl">
            <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
              What we capture
            </p>
            <h2 className="text-h2 mt-3 font-semibold tracking-tight">
              Four metadata layers on every entry.
            </h2>
            <p className="text-secondary text-lead mt-3">
              Every dataset is described by the same fields regardless of
              where it came from — so cross-source comparisons actually
              work.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {METADATA_FIELDS.map(({ icon: Icon, title, body }) => (
              <StandardCard key={title} className="!p-6">
                <Icon
                  className="text-accent size-5"
                  aria-hidden="true"
                />
                <div className="text-primary text-body mt-4 font-semibold">
                  {title}
                </div>
                <p className="text-secondary text-caption mt-2 leading-relaxed">
                  {body}
                </p>
              </StandardCard>
            ))}
          </div>
        </div>
      </section>

      <FeatureShowcase
        eyebrow="Detail page"
        title="The dataset page is the work product."
        body="Six tabs cover everything you need to make a build/skip decision: overview with AI summary, schema viewer, source attribution, lineage graph, citations, and a per-dataset discussion thread."
        bullets={[
          "License risk pill prevents you from building on non-commercial data by accident.",
          "Lineage tab links derived-from / similar-to / benchmarked-against datasets.",
          "Models trained on the dataset surface as a rail in the overview.",
        ]}
        screenshot={{
          src: "/screenshots/dataset-detail.png",
          alt: "Dataset detail page with schema, sources, and the models-trained-on rail.",
          url: "datacrawlr.com/datasets/<slug>",
          captureRoute: "/datasets/<popular-slug>",
        }}
        cta={{ label: "Open a dataset", href: "/explore" }}
        imageSide="right"
      />

      <SourcesGrid
        category="datasets"
        title="Nine dataset sources, official APIs only"
        subtitle="Every connector hits the source's published API or a structured open feed. No scraping behind authentication."
      />

      <CompliancePillars />

      {/* Honest disclaimer */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6">
          <HeroCard className="p-6">
            <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
              Honest about what we are
            </p>
            <p className="text-secondary text-body mt-3 leading-relaxed">
              Datacrawlr indexes metadata, not bytes. Every dataset page
              links back to the original host; we never mirror, cache, or
              redistribute the underlying data. License classifications
              are a starting point for discovery — not legal advice. Verify
              on the source before commercial use.
            </p>
          </HeroCard>
        </div>
      </section>

      <MarketingCTA
        title="Find the right dataset without bookmarks."
        primaryLabel="Open the catalog"
        primaryHref="/explore"
        secondaryLabel="See model coverage"
        secondaryHref="/product/models"
      />
    </main>
  )
}
