import type { Metadata } from "next"

import { FeatureShowcase } from "@/components/marketing/FeatureShowcase"
import { MarketingCTA } from "@/components/marketing/MarketingCTA"

export const metadata: Metadata = {
  title: "Features — Datacrawlr",
  description:
    "A walkthrough of every Datacrawlr feature — search, the model-dataset graph, leaderboards, and the explore dashboard.",
}

export default function FeaturesPage() {
  return (
    <main id="main">
      <section className="border-subtle border-b py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            Features
          </p>
          <h1 className="text-h1 mt-3 font-semibold tracking-tight">
            Built around how ML engineers actually pick data and models.
          </h1>
          <p className="text-secondary text-lead mt-5">
            Every surface below is a real page in the running product. The
            screenshots are captured live from the same routes you&apos;ll
            use after you open the app.
          </p>
        </div>
      </section>

      <FeatureShowcase
        eyebrow="Live type-ahead"
        title="Search starts the moment you type."
        body="Two characters in, the dropdown shows the closest dataset and model matches with a one-line description and an entity-type chip. Hit enter to expand into the full search page; pick a row to jump straight into the detail view."
        bullets={[
          "Two-section dropdown (Datasets · Models), four results each.",
          "Cross-search with vector embeddings under the hood.",
          "Keyboard-first — arrow keys traverse the entire list.",
        ]}
        screenshot={{
          src: "/screenshots/live-search.png",
          alt: "Homepage hero with the type-ahead dropdown open showing dataset and model matches.",
          url: "datacrawlr.com",
          captureRoute: "/ (focus the hero input + type 'imagenet')",
        }}
        cta={{ label: "Open the app", href: "/explore" }}
        imageSide="right"
      />

      <FeatureShowcase
        eyebrow="Search results"
        title="An AI summary before the result list."
        body="Every search renders an AI synthesis card explaining what the matches share, where they differ, and which to start with. Citations link back to the underlying datasets so you can verify the recommendation."
        bullets={[
          "Synthesis card streams in alongside the result grid.",
          "Sort by relevance, newest, most-cited, smallest, or largest.",
          "Server-prefetched initial page; filters refetch client-side.",
        ]}
        screenshot={{
          src: "/screenshots/search-results.png",
          alt: "Search results page with AI synthesis card and ranked dataset cards.",
          url: "datacrawlr.com/search?q=medical+imaging",
          captureRoute: "/search?q=medical+imaging",
        }}
        cta={{ label: "Try a query", href: "/search?q=medical+imaging" }}
        imageSide="left"
      />

      <FeatureShowcase
        eyebrow="Dataset detail"
        title="Everything you need before you commit."
        body="Schema, license intelligence, source attribution, citations, related datasets — and the models that have been trained on it. The right rail keeps comparison, save, and recent-history within one click."
        bullets={[
          "Six tabs: Overview · Schema · Sources · Lineage · Citations · Discussion.",
          "License risk pill and use-grid (commercial / attribution / redistribution / modification).",
          "AI summary with insight chips highlighting tradeoffs.",
        ]}
        screenshot={{
          src: "/screenshots/dataset-detail.png",
          alt: "Dataset detail page with schema, sources, lineage, and the 'Models trained on this' rail.",
          url: "datacrawlr.com/datasets/<slug>",
          captureRoute: "/datasets/<popular-slug>",
        }}
        cta={{ label: "Browse datasets", href: "/explore" }}
        imageSide="right"
      />

      <FeatureShowcase
        eyebrow="Models directory"
        title="Frontier and long-tail in one view."
        body="Every open-weights and commercial model worth knowing about, with normalized benchmark scores. Sort by composite score, parameters, newest, popularity, cheapest, or largest context. Eight quick-filter chips for the common slices."
        bullets={[
          "Twelve benchmarks tracked: MMLU-Pro, GPQA, HumanEval, MATH, IFEval, MuSR, BFCL, Arena ELO, AIME, SWE-Bench Verified, LiveCodeBench, legacy MMLU.",
          "Composite score weighted across the core six.",
          "Filter strip syncs to URL params for shareable views.",
        ]}
        screenshot={{
          src: "/screenshots/model-leaderboard.png",
          alt: "MMLU-Pro leaderboard page with ranked models and per-row score badges.",
          url: "datacrawlr.com/models/leaderboard/mmlu-pro",
          captureRoute: "/models/leaderboard/mmlu-pro",
        }}
        cta={{ label: "Open the leaderboard", href: "/models?sort=composite_score" }}
        imageSide="left"
      />

      <FeatureShowcase
        eyebrow="Model detail"
        title="Benchmarks, pricing, and provenance side by side."
        body="The Benchmarks tab shows raw scores against the top of the catalog plus a composite-contribution bar. Pricing surfaces per-token input/output cost with a cost calculator that compares to the three cheapest commercial alternatives. Training data, license risk, and creator credentials all live in one page."
        bullets={[
          "Six tabs: Overview · Benchmarks · Pricing · Training data · Provenance · Discussion.",
          "License risk pill with low/medium/high signal.",
          "Interactive cost calculator with 3-model comparison row.",
        ]}
        screenshot={{
          src: "/screenshots/model-benchmarks.png",
          alt: "Model detail Benchmarks tab with composite header bar and per-benchmark score cards.",
          url: "datacrawlr.com/models/<slug>",
          captureRoute: "/models/<frontier-slug> → Benchmarks tab",
        }}
        cta={{ label: "Open a model", href: "/models?sort=composite_score" }}
        imageSide="right"
      />

      <FeatureShowcase
        eyebrow="Side-by-side comparison"
        title="Up to four models, every dimension."
        body="Add models to the comparison tray from the directory or any detail page. The compare view stacks Identity · Architecture · Benchmarks · Pricing · Provenance — with the winning value in each row highlighted by a left-border accent."
        bullets={[
          "Cheapest output cost wins the pricing row.",
          "Highest score wins each benchmark row, with per-cell mini bars.",
          "AI insight card up top summarizes what's actually different.",
        ]}
        screenshot={{
          src: "/screenshots/model-comparison.png",
          alt: "Compare view with two models stacked across Identity, Architecture, Benchmarks, and Pricing sections.",
          url: "datacrawlr.com/models/compare?ids=<a>,<b>",
          captureRoute: "/models/compare?ids=<a>,<b>",
        }}
        cta={{ label: "Compare models", href: "/models" }}
        imageSide="left"
      />

      <FeatureShowcase
        eyebrow="Explore dashboard"
        title="Slice the catalog by what you care about."
        body="Seven tabs: Overview · Modalities · ML Tasks · Sources · Licenses · Freshness · Models. Each tab pairs a chart (donut, horizontal bars, or timeline) with the underlying entity rails so you go from chart to page in one click."
        bullets={[
          "Live counts from the indexed catalog — no invented numbers.",
          "Per-source health: status pill, last refresh, sample slugs.",
          "Freshness timeline over the last 24 months of updates.",
        ]}
        screenshot={{
          src: "/screenshots/explore-dashboard.png",
          alt: "Explore dashboard overview tab with stats strip, domain grid, and trending rail.",
          url: "datacrawlr.com/explore",
          captureRoute: "/explore",
        }}
        cta={{ label: "Open Explore", href: "/explore" }}
        imageSide="right"
      />

      <MarketingCTA
        title="Eight surfaces, one catalog."
        subtitle="Open the app and start picking the right data and the right weights."
        primaryLabel="Open the app"
        primaryHref="/explore"
      />
    </main>
  )
}
