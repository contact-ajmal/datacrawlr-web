import Link from "next/link"
import {
  Activity,
  AudioLines,
  Box,
  FileText,
  Gamepad2,
  GitBranch,
  Image as ImageIcon,
  Layers,
  LineChart,
  Mic,
  Network,
  Table,
  Table2,
  type LucideIcon,
} from "lucide-react"

import { HeroCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import { getDomainStats } from "@/lib/data"
import type { DomainStat } from "@/lib/types"
import { formatNumber } from "@/lib/utils"

// Lucide icons are tree-shaken — we resolve the string from the API through
// a small explicit registry. Multiple names map to the same component so we
// stay compatible with either the frontend's prompt-spec names ("table") or
// the backend's actual values ("table-2"). Unknown strings fall back to Box.
const ICON_MAP: Record<string, LucideIcon> = {
  "file-text": FileText,
  image: ImageIcon,
  mic: Mic,
  "audio-lines": AudioLines,
  table: Table,
  "table-2": Table2,
  layers: Layers,
  "gamepad-2": Gamepad2,
  activity: Activity,
  "line-chart": LineChart,
  "git-branch": GitBranch,
  network: Network,
}

const DOMAIN_DESCRIPTIONS: Record<string, string> = {
  nlp: "Text corpora, language models, translation, summarization.",
  cv: "Image classification, object detection, segmentation, generation.",
  "computer-vision": "Image classification, object detection, segmentation, generation.",
  audio: "Speech recognition, audio classification, music, ambient sound.",
  tabular: "Structured data for classification, regression, and analysis.",
  multimodal: "Datasets combining text, image, audio, or video.",
  rl: "Environments, demonstrations, and trajectory datasets.",
  "reinforcement-learning": "Environments, demonstrations, and trajectory datasets.",
  "time-series": "Forecasting, anomaly detection, sequence modeling.",
  graph: "Knowledge graphs, social networks, molecular structures.",
}

// Static fallback used when the backend returns an empty list (e.g. local
// dev with no data, or the endpoint is unavailable). Numbers are illustrative
// only — the live grid replaces them as soon as /stats/domains responds.
const FALLBACK: DomainStat[] = [
  { slug: "nlp", label: "NLP", icon: "file-text", count: 0, modalities: ["text"] },
  { slug: "cv", label: "Computer Vision", icon: "image", count: 0, modalities: ["image", "video"] },
  { slug: "audio", label: "Audio & Speech", icon: "mic", count: 0, modalities: ["audio"] },
  { slug: "tabular", label: "Tabular", icon: "table", count: 0, modalities: ["tabular"] },
  { slug: "multimodal", label: "Multimodal", icon: "layers", count: 0, modalities: ["multimodal"] },
  { slug: "rl", label: "Reinforcement Learning", icon: "gamepad-2", count: 0, modalities: ["other"] },
  { slug: "time-series", label: "Time series", icon: "activity", count: 0, modalities: ["time_series"] },
  { slug: "graph", label: "Graph", icon: "git-branch", count: 0, modalities: ["graph"] },
]

interface DomainGridProps {
  /** Cap the number of cards rendered (top-N by count). */
  limit?: number
  /** Hide the wrapping `<section>` chrome so the grid can drop into a host
   *  layout that already supplies its own padding + header. */
  bare?: boolean
  /** Override the section heading + subhead when used standalone. */
  title?: string
  subtitle?: string
  /** Override the right-side link target/label. */
  viewAllHref?: string
  viewAllLabel?: string
}

export async function DomainGrid({
  limit,
  bare = false,
  title = "Browse by domain",
  subtitle = "Every dataset, sorted by what it does.",
  viewAllHref = "/search",
  viewAllLabel = "View all →",
}: DomainGridProps = {}) {
  const stats = await getDomainStats().catch(() => [] as DomainStat[])
  const ordered = (stats.length > 0 ? stats : FALLBACK)
    .slice()
    .sort((a, b) => b.count - a.count)
  const domains =
    typeof limit === "number" ? ordered.slice(0, limit) : ordered

  const grid = (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {domains.map((d) => (
        <DomainCard key={d.slug} domain={d} />
      ))}
    </div>
  )

  if (bare) return grid

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-h2 font-semibold tracking-tight">{title}</h2>
          <p className="text-secondary text-lead mt-2">{subtitle}</p>
        </div>
        <Link
          href={viewAllHref}
          className="text-accent text-caption hover:text-accent-hover shrink-0 underline-offset-4 hover:underline"
        >
          {viewAllLabel}
        </Link>
      </div>
      {grid}
    </section>
  )
}

function DomainCard({ domain }: { domain: DomainStat }) {
  const Icon = ICON_MAP[domain.icon] ?? Box
  const description =
    DOMAIN_DESCRIPTIONS[domain.slug] ??
    "Datasets in this domain."
  const href = `/search?${domain.modalities
    .map((m) => `modality=${encodeURIComponent(m)}`)
    .join("&")}`

  return (
    <Link
      href={href}
      className="block transition-transform duration-150 hover:-translate-y-0.5"
    >
      <HeroCard className="flex h-full flex-col">
        <div className="flex items-start justify-between">
          <Icon className="text-accent size-7" aria-hidden="true" />
          <Badge variant="neutral" className="shrink-0 font-mono">
            {formatNumber(domain.count)}
          </Badge>
        </div>
        <div className="text-h4 mt-6 font-semibold">{domain.label}</div>
        <p className="text-tertiary text-caption mt-1 line-clamp-2">
          {description}
        </p>
      </HeroCard>
    </Link>
  )
}
