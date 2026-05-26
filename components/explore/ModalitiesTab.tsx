import Link from "next/link"

import { DonutChart } from "@/components/charts/DonutChart"
import { DatasetCard } from "@/components/dataset/DatasetCard"
import { HeroCard, WhisperCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import { MODALITY_SWATCH } from "@/lib/modality-colors"
import { MODALITY_ICONS } from "@/lib/modality-icons"
import type { Dataset, Modality } from "@/lib/types"
import { formatNumber } from "@/lib/utils"

interface ModalityBlock {
  modality: Modality
  count: number
  datasets: Dataset[]
}

interface ModalitiesTabProps {
  blocks: ModalityBlock[]
  modalityCounts: Record<string, number>
}

const MODALITY_LABELS: Record<Modality, string> = {
  text: "Text",
  image: "Image",
  audio: "Audio",
  video: "Video",
  tabular: "Tabular",
  multimodal: "Multimodal",
  graph: "Graph",
  time_series: "Time series",
  other: "Other",
}

const MODALITY_DESCRIPTIONS: Record<Modality, string> = {
  text: "Documents, conversations, code, and natural-language corpora — the raw material for language models.",
  image: "Photographs, illustrations, and rendered images. Used for classification, detection, segmentation, and generative models.",
  audio: "Speech, music, ambient sound. Used for ASR, audio classification, and TTS training.",
  video: "Action recognition, video understanding, generative video models.",
  tabular: "Structured rows and columns — the bread and butter of classical ML and analytical workflows.",
  multimodal: "Datasets that combine two or more modalities — image+text pairs, audio+video, captioned media.",
  graph: "Networks of nodes and edges — knowledge graphs, citation graphs, molecular structures.",
  time_series: "Sequential observations indexed by time — sensor traces, financial ticks, log streams.",
  other: "Datasets that don't fit neatly into a single modality bucket.",
}

const SLICE_COLOR: Record<Modality, string> = {
  text: "#5EEAD4",
  image: "#A78BFA",
  audio: "#BEF264",
  video: "#F472B6",
  tabular: "#FBBF24",
  multimodal: "var(--accent)",
  graph: "#60A5FA",
  time_series: "#FB923C",
  other: "#94A3B8",
}

export function ModalitiesTab({
  blocks,
  modalityCounts,
}: ModalitiesTabProps) {
  const total = Object.values(modalityCounts).reduce((s, n) => s + n, 0)
  const slices = (Object.entries(modalityCounts) as [Modality, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([modality, value]) => ({
      key: modality,
      label: MODALITY_LABELS[modality] ?? modality,
      value,
      color: SLICE_COLOR[modality] ?? "#94A3B8",
    }))

  return (
    <div className="flex flex-col">
      <section className="mb-10">
        <HeroCard className="p-8">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            What&apos;s a modality?
          </p>
          <div className="prose mt-4 max-w-3xl">
            <p className="text-secondary text-body">
              A modality is the kind of data inside a dataset — text, images,
              audio, tabular rows, video, or a combination. Datacrawlr
              classifies every dataset into one or more modalities so you can
              find datasets shaped the way your model expects them.
            </p>
            <p className="text-secondary text-body mt-4">
              The modality often determines what kinds of models you can
              train. Text modalities feed language models; image modalities
              feed vision models; multimodal datasets feed models that span
              both.
            </p>
          </div>
        </HeroCard>
      </section>

      <section className="mb-10">
        <WhisperCard className="p-8">
          <DonutChart
            data={slices}
            total={total}
            totalLabel="datasets indexed"
            size={220}
          />
        </WhisperCard>
      </section>

      {blocks.length === 0 ? (
        <p className="text-tertiary text-caption">
          No modality breakdowns available yet — try again after the next
          crawl cycle.
        </p>
      ) : (
        blocks.map(({ modality, count, datasets }) => {
          const Icon = MODALITY_ICONS[modality] ?? MODALITY_ICONS.other
          const swatch = MODALITY_SWATCH[modality] ?? "#94A3B8"
          return (
            <section key={modality} className="mt-12">
              <div className="mb-4 flex items-center gap-4">
                <span
                  className="grid size-12 shrink-0 place-items-center rounded-full"
                  style={{ background: swatch, opacity: 0.18 }}
                  aria-hidden="true"
                />
                <span
                  className="text-accent -ml-12 grid size-12 shrink-0 place-items-center"
                  aria-hidden="true"
                >
                  <Icon className="size-5" />
                </span>
                <h3 className="text-h4 font-semibold tracking-tight">
                  {MODALITY_LABELS[modality]}
                </h3>
                <Badge variant="neutral" className="font-mono">
                  {formatNumber(count)} datasets
                </Badge>
                <Link
                  href={`/search?modality=${encodeURIComponent(modality)}`}
                  className="text-accent text-caption hover:text-accent-hover ml-auto shrink-0 underline-offset-4 hover:underline"
                >
                  Browse all →
                </Link>
              </div>
              <p className="text-secondary text-caption mb-5 max-w-3xl">
                {MODALITY_DESCRIPTIONS[modality]}
              </p>
              {datasets.length === 0 ? (
                <p className="text-tertiary text-caption">
                  Nothing indexed for this modality yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {datasets.map((d) => (
                    <DatasetCard key={d.id} dataset={d} />
                  ))}
                </div>
              )}
            </section>
          )
        })
      )}
    </div>
  )
}
