import type { Metadata } from "next"

import { CompliancePillars } from "@/components/marketing/CompliancePillars"
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase"
import { LiveStatsStrip } from "@/components/marketing/LiveStatsStrip"
import { MarketingCTA } from "@/components/marketing/MarketingCTA"
import { MarketingHero } from "@/components/marketing/MarketingHero"
import { SourcesGrid } from "@/components/marketing/SourcesGrid"
import { getModelStats, getStats } from "@/lib/data"

export const metadata: Metadata = {
  title: {
    absolute: "Datacrawlr — The dataset and model intelligence layer",
  },
  description:
    "Datacrawlr indexes datasets and models from across the open ML ecosystem — schemas, licenses, benchmarks, pricing, and the link between data and weights.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Datacrawlr — The dataset and model intelligence layer",
    description:
      "Index every dataset and every model worth knowing about. Metadata only — we point to the source.",
    type: "website",
    url: "/",
  },
}

export const revalidate = 600

export default async function MarketingHome() {
  // Live counters where we have them, "—" where we don't. No invented
  // numbers anywhere in marketing copy.
  const [stats, modelStats] = await Promise.all([
    getStats().catch(() => null),
    getModelStats().catch(() => null),
  ])

  return (
    <main id="main">
      <MarketingHero />

      <LiveStatsStrip
        stats={stats}
        modelsCount={modelStats?.totalModels ?? null}
      />

      {/* Problem statement */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            The problem
          </p>
          <h2 className="text-h2 mt-3 font-semibold tracking-tight">
            The open ML ecosystem is fragmented.
          </h2>
          <p className="text-secondary text-lead mt-5 leading-relaxed">
            HuggingFace knows about HuggingFace, Kaggle knows about Kaggle,
            every government portal knows about itself. There&apos;s no single
            place to ask <em>which dataset should I train on, and which model
            should I use it with?</em> So engineers default to whatever&apos;s
            most discoverable, not whatever&apos;s right for the problem.
          </p>
          <p className="text-secondary text-lead mt-4 leading-relaxed">
            Datacrawlr is the discovery layer that closes the loop —
            datasets and the models trained on them, in one searchable index.
          </p>
        </div>
      </section>

      {/* Feature showcases — real screenshots from the running product */}
      <FeatureShowcase
        eyebrow="Search"
        title="Semantic search with AI synthesis."
        body="Type-ahead suggestions while you type. Full-text search across every indexed entry. An AI synthesis card at the top of every result page explains what the matches share and what to actually pick — with citations back to the underlying datasets."
        bullets={[
          "BM25 over OpenSearch with vector similarity for related entries.",
          "Filters by modality, license, source, and freshness.",
          "Free-tier results respect the same ranking as paid ones.",
        ]}
        screenshot={{
          src: "/screenshots/search-results.png",
          alt: "Search results for 'medical imaging' showing an AI synthesis card and ranked dataset cards.",
          url: "datacrawlr.com/search?q=medical+imaging",
          captureRoute: "/search?q=medical+imaging",
        }}
        cta={{ label: "Try the search", href: "/search?q=medical+imaging" }}
        imageSide="right"
      />

      <FeatureShowcase
        eyebrow="The model-dataset graph"
        title="See what was trained on what."
        body="When a model card declares its training data, we connect them. Open a dataset and see which models were trained on it. Open a model and see what it learned from. This is the layer that turns Datacrawlr from a directory into an index of ML provenance."
        bullets={[
          "Trained-on / fine-tuned-on / evaluated-on, with confidence per link.",
          "Bidirectional: every dataset surfaces its downstream models.",
          "Lineage edges between related datasets where source platforms expose them.",
        ]}
        screenshot={{
          src: "/screenshots/dataset-detail.png",
          alt: "Dataset detail page with overview, schema, and the 'Models trained on this' rail.",
          url: "datacrawlr.com/datasets/<slug>",
          captureRoute: "/datasets/<popular-slug>",
        }}
        cta={{ label: "Browse datasets", href: "/explore" }}
        imageSide="left"
      />

      <FeatureShowcase
        eyebrow="Models directory"
        title="Every model worth knowing about."
        body="Open-weights and commercial. Benchmark scores normalized across the Open LLM Leaderboard, vendor reports, and Chatbot Arena. License risk pills, per-token pricing, context windows — and a leaderboard surface for every benchmark we track."
        bullets={[
          "Filter by access type, organization, parameters, license, and modality.",
          "Composite score blends MMLU-Pro, GPQA, HumanEval, MATH, and IFEval.",
          "Side-by-side comparison up to four models.",
        ]}
        screenshot={{
          src: "/screenshots/model-detail.png",
          alt: "Model detail page showing benchmark bars, license risk pill, and pricing rows.",
          url: "datacrawlr.com/models/<slug>",
          captureRoute: "/models/<frontier-slug>",
        }}
        cta={{ label: "Open the leaderboard", href: "/models?sort=composite_score" }}
        imageSide="right"
      />

      <FeatureShowcase
        eyebrow="Explore"
        title="Every angle on the catalog."
        body="Modality, ML task, source, license, freshness — and now models. The Explore dashboard slices the index by what you care about, so you can answer 'what's actually in here?' without typing a query."
        bullets={[
          "Donut breakdowns by modality and license type.",
          "Per-source health and refresh cadence.",
          "Trending + freshness rails reflect the last index pass.",
        ]}
        screenshot={{
          src: "/screenshots/explore-dashboard.png",
          alt: "Explore dashboard with stats, domain grid, and trending rail.",
          url: "datacrawlr.com/explore",
          captureRoute: "/explore",
        }}
        cta={{ label: "Open Explore", href: "/explore" }}
        imageSide="left"
      />

      <SourcesGrid />

      <CompliancePillars />

      <MarketingCTA />
    </main>
  )
}
