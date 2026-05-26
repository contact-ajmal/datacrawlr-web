import type { Metadata } from "next"

import { CompliancePillars } from "@/components/marketing/CompliancePillars"
import { FeatureShowcase } from "@/components/marketing/FeatureShowcase"
import { MarketingCTA } from "@/components/marketing/MarketingCTA"
import { SourcesGrid } from "@/components/marketing/SourcesGrid"
import { HeroCard, StandardCard } from "@/components/shared/Cards"
import { GitCompare, LineChart, ReceiptText, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Models — Datacrawlr",
  description:
    "Open-weights and commercial LLMs indexed with normalized benchmark scores, per-token pricing, license risk, and the datasets they were trained on.",
}

const TRACKS = [
  {
    icon: LineChart,
    title: "Benchmark transparency",
    body: "Twelve benchmarks tracked, with their source labelled on every score. Vendor-reported scores are flagged so you know what to trust.",
  },
  {
    icon: ReceiptText,
    title: "Pricing without lookup spreadsheets",
    body: "Per-million-token input/output cost on commercial APIs, plus a calculator that compares your usage mix against the cheapest alternatives.",
  },
  {
    icon: GitCompare,
    title: "Side-by-side comparison",
    body: "Stack up to four models across identity, architecture, benchmarks, pricing, and provenance. Highest score wins each row.",
  },
  {
    icon: ShieldCheck,
    title: "License risk you can scan",
    body: "Every license is classified into a risk band (low / medium / high) with commercial-use, attribution, redistribution, and modification flags.",
  },
]

export default function ModelsMarketingPage() {
  return (
    <main id="main">
      <section className="border-subtle border-b py-16 lg:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            Models
          </p>
          <h1 className="text-h1 mt-3 font-semibold tracking-tight">
            Every model worth knowing about.
          </h1>
          <p className="text-secondary text-lead mt-5">
            Open-weights from HuggingFace, commercial APIs from OpenRouter
            and the major vendors, benchmark scores from the Open LLM
            Leaderboard and Chatbot Arena. One catalog, the same shape for
            every row.
          </p>
        </div>
      </section>

      <FeatureShowcase
        eyebrow="Directory"
        title="A directory that respects how you actually pick."
        body="Sort by composite score, parameters, newest, popularity, cheapest output cost, or largest context window. Eight quick-filter chips for the common slices — frontier open-weights, free tiers, multimodal, code-focused, latest releases."
        bullets={[
          "URL-synced filter strip — share a view by pasting the link.",
          "Hover-only 'Compare' button on every card.",
          "Composite score weighted across MMLU-Pro, GPQA, HumanEval, MATH, IFEval, and Arena ELO.",
        ]}
        screenshot={{
          src: "/screenshots/model-leaderboard.png",
          alt: "Models directory list page sorted by composite score, with filter rail and result cards.",
          url: "datacrawlr.com/models",
          captureRoute: "/models",
        }}
        cta={{ label: "Open the directory", href: "/models" }}
        imageSide="right"
      />

      <FeatureShowcase
        eyebrow="Benchmarks"
        title="Normalized, sourced, and honest about the limits."
        body="Each benchmark page links the methodology, surfaces score format (% accuracy / pass@1 / ELO), and flags the source (Open LLM Leaderboard / Artificial Analysis / Vendor-reported / Paper-reported). The trust callout reminds you that public benchmarks are a signal, not the only signal."
        screenshot={{
          src: "/screenshots/model-benchmarks.png",
          alt: "Model detail Benchmarks tab with composite header and per-benchmark cards.",
          url: "datacrawlr.com/models/<slug>",
          captureRoute: "/models/<frontier-slug> → Benchmarks tab",
        }}
        cta={{ label: "Open MMLU-Pro leaderboard", href: "/models/leaderboard/mmlu-pro" }}
        imageSide="left"
      />

      {/* Four tracks */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 max-w-2xl">
            <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
              What we track per model
            </p>
            <h2 className="text-h2 mt-3 font-semibold tracking-tight">
              Four axes that actually drive decisions.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {TRACKS.map(({ icon: Icon, title, body }) => (
              <StandardCard key={title} className="!p-6">
                <Icon className="text-accent size-5" aria-hidden="true" />
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
        eyebrow="Provenance"
        title="The link to the data."
        body="Every model's training-data declarations are indexed. Open a model and see the datasets it was trained or fine-tuned on. Open a dataset and see which models picked it up. That bidirectional link is the layer that turns this into provenance, not just listing."
        bullets={[
          "Trained-on / fine-tuned-on / evaluated-on, with per-link confidence.",
          "Cross-page navigation in both directions.",
          "Inferred links are explicitly labelled as such — never silently surfaced.",
        ]}
        screenshot={{
          src: "/screenshots/dataset-detail.png",
          alt: "Dataset detail page showing the 'Models trained on this dataset' rail.",
          url: "datacrawlr.com/datasets/<slug>",
          captureRoute: "/datasets/<popular-slug>",
        }}
        cta={{ label: "See the graph", href: "/explore" }}
        imageSide="right"
      />

      <FeatureShowcase
        eyebrow="Compare"
        title="Four models, every dimension."
        body="Add models from the directory or the detail page. The comparison view stacks Identity, Architecture, Benchmarks, Pricing, and Provenance — with the winning value in each row highlighted by a left-border accent and an AI summary card up top."
        screenshot={{
          src: "/screenshots/model-comparison.png",
          alt: "Compare view with two models side by side across themed sections.",
          url: "datacrawlr.com/models/compare?ids=<a>,<b>",
          captureRoute: "/models/compare?ids=<a>,<b>",
        }}
        cta={{ label: "Pick models to compare", href: "/models" }}
        imageSide="left"
      />

      <SourcesGrid
        category="models"
        title="Two model sources, official feeds only"
        subtitle="HuggingFace for open weights, OpenRouter for the commercial pricing + provider catalog."
      />

      <CompliancePillars />

      {/* Honest disclaimer */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6">
          <HeroCard className="p-6">
            <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
              Benchmarks aren&apos;t the whole story
            </p>
            <p className="text-secondary text-body mt-3 leading-relaxed">
              Public benchmarks are subject to contamination, methodology
              drift, and overfitting. For production decisions we recommend
              running a private holdout evaluation on prompts that match
              your actual workload. Datacrawlr is the place you start that
              decision — not the place it ends.
            </p>
          </HeroCard>
        </div>
      </section>

      <MarketingCTA
        title="Pick the right weights without spreadsheets."
        primaryLabel="Open the models directory"
        primaryHref="/models"
        secondaryLabel="See dataset coverage"
        secondaryHref="/product/datasets"
      />
    </main>
  )
}
