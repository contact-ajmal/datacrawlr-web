import type { Metadata } from "next"
import {
  AlertTriangle,
  ArrowUp,
  Beaker,
  Bot,
  Brain,
  Check,
  Cloud,
  Code,
  Database,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  Library,
  Mail,
  Plug,
  Sparkles,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import { HeroCard, StandardCard, WhisperCard } from "@/components/shared/Cards"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Datacrawlr — A metadata index for the open data ecosystem",
  description:
    "Datacrawlr indexes dataset metadata from HuggingFace, Kaggle, Zenodo, and more — through official APIs, respecting licenses, never mirroring data.",
  openGraph: {
    title: "About Datacrawlr",
    description:
      "A metadata index for the open data ecosystem. Built API-first, license-aware, never a mirror.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Datacrawlr",
    description:
      "A metadata index for the open data ecosystem — what's where, what it contains, what you can do with it.",
  },
}

export default function AboutPage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-6 pb-32">
      <Hero />
      <WhatItIs />
      <HowItWorks />
      <SourcesWeIndex />
      <Compliance />
      <Mission />
      <Team />
      <Contact />

      <div className="mt-20 text-center">
        <a
          href="#main"
          className="text-tertiary text-caption hover:text-primary inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowUp className="size-3.5" aria-hidden="true" />
          Back to top
        </a>
      </div>
    </main>
  )
}

// --------------------------------------------------------------------------
// 1. Hero
// --------------------------------------------------------------------------

function Hero() {
  return (
    <section className="py-20">
      <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
        About Datacrawlr
      </p>
      <h1 className="text-h1 mt-4 font-semibold tracking-tight">
        An index for every dataset that matters.
      </h1>
      <p className="text-secondary text-lead mt-8">
        Datacrawlr is a metadata layer for the open data ecosystem. We index
        dataset metadata from across the public internet — what&apos;s where,
        what it contains, what you can do with it — and make it searchable.
        We don&apos;t host data. We tell you where to find it.
      </p>
    </section>
  )
}

// --------------------------------------------------------------------------
// 2. What it is
// --------------------------------------------------------------------------

function WhatItIs() {
  return (
    <section className="mt-20">
      <SectionHeading>What is Datacrawlr?</SectionHeading>
      <div className="mt-6 flex flex-col gap-4">
        <Prose>
          The open dataset ecosystem is fragmented. HuggingFace knows about
          HuggingFace, Kaggle knows about Kaggle, every government portal
          knows about itself, and academic repositories live in their own
          worlds. An ML engineer trying to pick the right training or
          evaluation data spends hours bouncing between sites that
          don&apos;t talk to each other — and still finishes with the
          uneasy feeling that something better exists somewhere they
          didn&apos;t look.
        </Prose>
        <Prose>
          Datacrawlr harvests structured metadata from those platforms
          through their official APIs, normalizes it into a single schema,
          enriches it with task classifications, license analysis, and
          semantic embeddings, and exposes the result as a searchable
          catalog. Every dataset entry on Datacrawlr is described by the
          same fields — name, modality, license, size, schema, creators —
          regardless of which source it came from.
        </Prose>
        <Prose>
          We index two kinds of things: datasets and models. The dataset
          side maps what data exists; the model side maps what&apos;s been
          trained on it. Together they give you the full picture for any
          ML decision — pick the right training corpus, then see every
          model that&apos;s been trained on it, with benchmark scores and
          license terms side by side.
        </Prose>
        <Prose>
          Datacrawlr is{" "}
          <strong className="text-primary">not</strong> a hosting service,
          not a scraper, and not a CDN. We never download or redistribute
          the datasets themselves. Every page on Datacrawlr links back to
          the original source; we&apos;re the index that points there, not
          the place that holds the files.
        </Prose>
        <Prose>
          The audience is concrete: ML engineers picking corpora to
          fine-tune on, researchers hunting for the right benchmark,
          data-science teams comparing licenses before a commercial build,
          and AI teams choosing pre-training data. If you&apos;ve ever
          thought &ldquo;there has to be a better dataset for this,&rdquo;
          Datacrawlr is the place that answers.
        </Prose>
      </div>
    </section>
  )
}

// --------------------------------------------------------------------------
// 3. How it works
// --------------------------------------------------------------------------

interface PipelineStep {
  icon: LucideIcon
  title: string
  body: string
}

const PIPELINE: PipelineStep[] = [
  {
    icon: Cloud,
    title: "Discover",
    body:
      "We index from a curated list of sources via their official APIs — HuggingFace, OpenML, Zenodo, Kaggle, CKAN portals, figshare, Harvard Dataverse, GitHub. For sources without APIs, we follow DOI graphs and schema.org Dataset markup to find new datasets. Every source has a refresh cadence and a rate-limit budget.",
  },
  {
    icon: Layers,
    title: "Normalize",
    body:
      "Each source returns metadata in its own format. We map each one to a single canonical schema — name, modality, license, size, schema, creators, citations — so every dataset is comparable. Cross-source duplicates (same dataset published on multiple platforms) are detected and merged.",
  },
  {
    icon: Sparkles,
    title: "Enrich",
    body:
      "We add classifications the source doesn't provide: ML task type, refined modality, license risk analysis, completeness scoring, and semantic embeddings for related-dataset discovery. AI-generated summaries explain why you'd choose each dataset and what to watch out for.",
  },
  {
    icon: Plug,
    title: "Serve",
    body:
      "A FastAPI service exposes the index through a REST API. The frontend you're using right now reads from it. Search is BM25 over OpenSearch with vector similarity for related datasets via pgvector.",
  },
]

function HowItWorks() {
  return (
    <section className="mt-20">
      <SectionHeading>How it works</SectionHeading>
      <Prose className="mt-6">
        Datacrawlr is built around four pipelines that run continuously.
      </Prose>
      <ol className="mt-8 flex flex-col gap-4">
        {PIPELINE.map(({ icon: Icon, title, body }, i) => (
          <li key={title}>
            <StandardCard className="!p-6">
              <div className="flex items-start gap-4">
                <span
                  className="bg-elevated grid size-10 shrink-0 place-items-center rounded-full"
                  aria-hidden="true"
                >
                  <Icon className="text-accent size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-tertiary text-caption font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-h4 font-semibold tracking-tight">
                      {title}
                    </h3>
                  </div>
                  <p className="text-secondary text-body mt-3 leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            </StandardCard>
          </li>
        ))}
      </ol>

      {/* Model-dataset graph subsection */}
      <div className="mt-12">
        <h3 className="text-h4 font-semibold tracking-tight">
          The model-dataset graph
        </h3>
        <Prose className="mt-3">
          Datacrawlr&apos;s signature feature is the link between models
          and datasets. When a model&apos;s card declares its training
          data, we connect them. When you view a dataset, you see which
          models were trained on it. When you view a model, you see what
          it was trained on. This is the layer that makes Datacrawlr more
          than a directory — it&apos;s an index of ML provenance.
        </Prose>
      </div>
    </section>
  )
}

// --------------------------------------------------------------------------
// 4. Sources
// --------------------------------------------------------------------------

interface SourceLink {
  icon: LucideIcon
  name: string
  domain: string
  href: string
  description: string
}

const SOURCES: SourceLink[] = [
  {
    icon: Brain,
    name: "HuggingFace Datasets",
    domain: "huggingface.co/datasets",
    href: "https://huggingface.co/datasets",
    description:
      "The largest open hub for ML datasets — fine-tuning corpora, benchmarks, and community uploads.",
  },
  {
    icon: Beaker,
    name: "OpenML",
    domain: "openml.org",
    href: "https://www.openml.org",
    description:
      "Research-grade catalog of tabular ML datasets with rich schema metadata and benchmarking tasks.",
  },
  {
    icon: Library,
    name: "Zenodo",
    domain: "zenodo.org",
    href: "https://zenodo.org",
    description:
      "CERN-operated open research repository — peer-reviewed datasets with DOIs across scientific domains.",
  },
  {
    icon: Trophy,
    name: "Kaggle",
    domain: "kaggle.com/datasets",
    href: "https://www.kaggle.com/datasets",
    description:
      "Competition datasets, community contributions, and corporate releases curated by Kaggle.",
  },
  {
    icon: Globe,
    name: "CKAN open data portals",
    domain: "data.gov, EU Open Data, data.gov.uk, +",
    href: "https://ckan.org",
    description:
      "Government and institutional open-data catalogs — public spending, climate, transit, health, statistics.",
  },
  {
    icon: Database,
    name: "figshare",
    domain: "figshare.com",
    href: "https://figshare.com",
    description:
      "General-purpose research outputs platform — datasets, figures, posters, with DOIs and persistent storage.",
  },
  {
    icon: Library,
    name: "Harvard Dataverse",
    domain: "dataverse.harvard.edu",
    href: "https://dataverse.harvard.edu",
    description:
      "Federated academic repository network — strong in social science, replication packages, and survey data.",
  },
  {
    icon: Code,
    name: "GitHub (datasets-as-repos)",
    domain: "github.com",
    href: "https://github.com",
    description:
      "Project repositories that ship CSV/JSONL/Parquet datasets alongside training code and documentation.",
  },
  {
    icon: FileText,
    name: "Schema.org / DCAT discovery",
    domain: "the open web",
    href: "https://schema.org/Dataset",
    description:
      "Structured metadata published as schema.org Dataset markup and DCAT feeds — institutional and long-tail sources.",
  },
  {
    icon: Brain,
    name: "HuggingFace Models",
    domain: "huggingface.co/models",
    href: "https://huggingface.co/models",
    description:
      "Largest open registry of model weights — checkpoints, configs, and benchmark scores for the open-weights ecosystem.",
  },
  {
    icon: Plug,
    name: "OpenRouter",
    domain: "openrouter.ai",
    href: "https://openrouter.ai",
    description:
      "Unified pricing + provider catalog for commercial-API models; the canonical source for context-window and per-token costs.",
  },
]

function SourcesWeIndex() {
  return (
    <section className="mt-20">
      <SectionHeading>Sources</SectionHeading>
      <Prose className="mt-6">
        We focus on official APIs from established repositories. Every
        source listed below is a place where dataset publishers themselves
        choose to put their work.
      </Prose>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {SOURCES.map((s) => (
          <SourceCard key={s.name} source={s} />
        ))}
      </div>
      <Prose className="text-tertiary mt-6">
        If you maintain a dataset repository with an open API and want
        Datacrawlr to index it, we&apos;d love to add you — there&apos;s a
        link to open an issue at the bottom of this page.
      </Prose>
    </section>
  )
}

function SourceCard({ source }: { source: SourceLink }) {
  const Icon = source.icon
  return (
    <WhisperCard className="!p-5">
      <div className="flex items-start gap-3">
        <Icon
          className="text-accent mt-1 size-4 shrink-0"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div className="text-primary text-body font-medium">{source.name}</div>
          <p className="text-secondary text-caption mt-1 leading-relaxed">
            {source.description}
          </p>
          <a
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tertiary hover:text-accent text-micro mt-2 inline-flex items-center gap-1 font-mono transition-colors"
          >
            {source.domain}
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </WhisperCard>
  )
}

// --------------------------------------------------------------------------
// 5. Compliance
// --------------------------------------------------------------------------

interface Commitment {
  title: string
  body: string
}

const COMMITMENTS: Commitment[] = [
  {
    title: "API-first",
    body:
      "Every connector uses the official API of its source. We never scrape behind authentication, paywalls, or rate-limit barriers. If a source doesn't offer an API, we look for structured metadata they publish openly (schema.org markup, OAI-PMH, DCAT) instead.",
  },
  {
    title: "Robots.txt respected",
    body:
      "For the small set of sources we discover via web crawling (schema.org/DCAT pages), we respect robots.txt and crawl-delay directives. We identify ourselves with a clear User-Agent and a contact URL.",
  },
  {
    title: "Rate limits honored",
    body:
      "Every source has a documented rate limit, and we stay well under it. We use exponential backoff on errors and never retry past the source's published quotas.",
  },
  {
    title: "Metadata only — no mirroring",
    body:
      "We index metadata, not data. We never download, cache, or redistribute the actual dataset payloads. Every dataset page on Datacrawlr links to the original host.",
  },
  {
    title: "Attribution preserved",
    body:
      "Every dataset includes its license, creators, and source platform. Citation strings (BibTeX or otherwise) are surfaced when available.",
  },
  {
    title: "Takedown workflow",
    body:
      "If you're the maintainer of a dataset and want it removed from our index, you can request removal through a documented process. We respond within 5 business days.",
  },
  {
    title: "No private datasets",
    body:
      "We do not index gated, authenticated, or private datasets — even if our API key would technically allow it. Public listings only.",
  },
  {
    title: "Public data only",
    body:
      "We index only what is publicly accessible to anonymous users. Datasets requiring institutional credentials, paid subscriptions, or special permissions are not indexed.",
  },
]

function Compliance() {
  return (
    <section className="mt-20">
      <SectionHeading>How we stay compliant</SectionHeading>
      <p className="text-primary text-body mt-6 font-semibold">
        Datacrawlr is a metadata index, not a content host. Our compliance
        posture isn&apos;t an afterthought — it&apos;s the entire
        architecture.
      </p>
      <ul className="mt-8 flex flex-col gap-3">
        {COMMITMENTS.map((c) => (
          <li key={c.title}>
            <StandardCard className="!p-5">
              <div className="flex items-start gap-3">
                <span
                  className="bg-elevated grid size-8 shrink-0 place-items-center rounded-full"
                  aria-hidden="true"
                >
                  <Check className="size-4 text-emerald-400" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-primary text-body font-semibold">
                    {c.title}.
                  </div>
                  <p className="text-secondary text-caption mt-1 leading-relaxed">
                    {c.body}
                  </p>
                </div>
              </div>
            </StandardCard>
          </li>
        ))}
      </ul>
      <p className="text-tertiary text-caption mt-6 italic leading-relaxed">
        Datacrawlr&apos;s classification of licenses, recommendations, and
        AI-generated summaries are aids for discovery — not legal advice.
        Always verify a dataset&apos;s terms on its original source before
        commercial use.
      </p>
    </section>
  )
}

// --------------------------------------------------------------------------
// 6. Mission
// --------------------------------------------------------------------------

function Mission() {
  return (
    <section className="mt-20">
      <SectionHeading>Mission</SectionHeading>
      <div className="mt-6 flex flex-col gap-4">
        <Prose>
          Open machine learning runs on open data. But the open data
          ecosystem is fragmented — HuggingFace knows about HuggingFace,
          Kaggle knows about Kaggle, every government portal knows about
          itself. There&apos;s no single place to ask &ldquo;what&apos;s
          the best dataset for [task] under [license]?&rdquo;
        </Prose>
        <Prose>
          The result: ML engineers default to whatever&apos;s most
          discoverable, not whatever&apos;s best. Important datasets sit
          unused on niche repositories. Researchers reinvent benchmarks
          because they couldn&apos;t find the existing one. Models get
          trained on whatever was easy to find rather than what was right
          for the problem.
        </Prose>
        <Prose>
          Datacrawlr&apos;s mission is to make the entire open dataset
          ecosystem visible and comparable — so the question &ldquo;which
          dataset should I use?&rdquo; has a real answer. We&apos;re a
          discovery layer for the open data web, the way Google was a
          discovery layer for the open web.
        </Prose>
      </div>
    </section>
  )
}

// --------------------------------------------------------------------------
// 7. Team
// --------------------------------------------------------------------------

function Team() {
  return (
    <section className="mt-20">
      <SectionHeading>Who builds this</SectionHeading>
      <Prose className="mt-6">
        Datacrawlr is built and maintained by a small team with a data
        architecture background and an active interest in applied ML for
        scientific domains. We use Datacrawlr ourselves when building
        models — every feature on this site exists because we wanted it
        for our own work and couldn&apos;t find anything that already did
        the job. If a feature feels missing, it&apos;s because we
        haven&apos;t needed it yet — open an issue and tell us why.
      </Prose>
      <div className="text-tertiary text-micro mt-4 inline-flex items-center gap-2 font-mono uppercase tracking-widest">
        <Bot className="size-3.5" aria-hidden="true" />
        Built API-first · Maintained continuously
      </div>
    </section>
  )
}

// --------------------------------------------------------------------------
// 8. Contact
// --------------------------------------------------------------------------

function Contact() {
  return (
    <section className="mt-20">
      <HeroCard className="p-10 text-center">
        <h3 className="text-h3 font-semibold tracking-tight">Get in touch</h3>
        <p className="text-secondary text-body mx-auto mt-3 max-w-xl">
          Found a dataset that should be indexed? A bug? A new source we
          should add? Open an issue on GitHub or email us.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline">
            <a
              href="https://github.com/datacrawlr/datacrawlr/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code className="size-4" aria-hidden="true" />
              GitHub
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="mailto:hello@datacrawlr.com">
              <Mail className="size-4" aria-hidden="true" />
              Email
            </a>
          </Button>
          <Button asChild variant="ghost">
            <a href="mailto:takedowns@datacrawlr.com">
              <AlertTriangle className="size-4" aria-hidden="true" />
              Request a takedown
            </a>
          </Button>
        </div>
      </HeroCard>
    </section>
  )
}

// --------------------------------------------------------------------------
// Reusable bits
// --------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-accent text-h2 border-l-2 pl-4 font-semibold tracking-tight">
      {children}
    </h2>
  )
}

function Prose({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={[
        "text-secondary text-body leading-relaxed",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </p>
  )
}
