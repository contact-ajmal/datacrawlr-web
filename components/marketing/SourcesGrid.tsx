import {
  Beaker,
  Brain,
  Code,
  Database,
  FileText,
  Globe,
  Library,
  Plug,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import { WhisperCard } from "@/components/shared/Cards"

interface Source {
  name: string
  description: string
  icon: LucideIcon
  domain: string
  category: "datasets" | "models"
}

const SOURCES: Source[] = [
  // Dataset sources (9, matching the about page exactly).
  {
    name: "HuggingFace Datasets",
    description:
      "Largest open hub for ML datasets — community uploads and benchmarks.",
    icon: Brain,
    domain: "huggingface.co/datasets",
    category: "datasets",
  },
  {
    name: "OpenML",
    description: "Research-grade tabular ML datasets with rich schema metadata.",
    icon: Beaker,
    domain: "openml.org",
    category: "datasets",
  },
  {
    name: "Zenodo",
    description: "CERN open research repository — peer-reviewed datasets with DOIs.",
    icon: Library,
    domain: "zenodo.org",
    category: "datasets",
  },
  {
    name: "Kaggle",
    description: "Competition datasets and community contributions.",
    icon: Trophy,
    domain: "kaggle.com/datasets",
    category: "datasets",
  },
  {
    name: "CKAN portals",
    description: "Government open-data catalogs — data.gov, EU Open Data, +.",
    icon: Globe,
    domain: "data.gov +",
    category: "datasets",
  },
  {
    name: "figshare",
    description: "Research outputs with DOIs and persistent storage.",
    icon: Database,
    domain: "figshare.com",
    category: "datasets",
  },
  {
    name: "Harvard Dataverse",
    description: "Federated academic repository network.",
    icon: Library,
    domain: "dataverse.harvard.edu",
    category: "datasets",
  },
  {
    name: "GitHub (datasets-as-repos)",
    description: "Project repos shipping CSV/JSONL/Parquet alongside training code.",
    icon: Code,
    domain: "github.com",
    category: "datasets",
  },
  {
    name: "Schema.org / DCAT",
    description: "Structured metadata across the open web — institutional + long tail.",
    icon: FileText,
    domain: "schema.org/Dataset",
    category: "datasets",
  },
  // Model sources.
  {
    name: "HuggingFace Models",
    description: "Largest open registry of model weights, configs, and cards.",
    icon: Brain,
    domain: "huggingface.co/models",
    category: "models",
  },
  {
    name: "OpenRouter",
    description: "Unified pricing + provider catalog for commercial-API models.",
    icon: Plug,
    domain: "openrouter.ai",
    category: "models",
  },
]

interface SourcesGridProps {
  /** Restrict to one half of the catalog when this section is reused on the
   *  /product/datasets or /product/models page. */
  category?: "datasets" | "models" | "all"
  /** Section heading override. */
  title?: string
  /** Section subtitle override. */
  subtitle?: string
}

export function SourcesGrid({
  category = "all",
  title = "Where we index from",
  subtitle = "Every connector uses an official API or structured feed — never scraping behind auth.",
}: SourcesGridProps) {
  const filtered =
    category === "all"
      ? SOURCES
      : SOURCES.filter((s) => s.category === category)

  return (
    <section className="bg-base py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-h2 font-semibold tracking-tight">{title}</h2>
          <p className="text-secondary text-lead mt-3">{subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((source) => (
            <WhisperCard key={source.name} className="!p-5">
              <div className="flex items-start gap-3">
                <source.icon
                  className="text-accent mt-1 size-4 shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-primary text-body font-medium">
                    {source.name}
                  </div>
                  <p className="text-tertiary text-caption mt-1 leading-relaxed">
                    {source.description}
                  </p>
                  <div className="text-tertiary text-micro mt-2 font-mono">
                    {source.domain}
                  </div>
                </div>
              </div>
            </WhisperCard>
          ))}
        </div>
      </div>
    </section>
  )
}
