import Link from "next/link"
import { Quote } from "lucide-react"

import { DatasetCard } from "@/components/dataset/DatasetCard"
import { HeroCard, WhisperCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type { Dataset, Model } from "@/lib/types"

interface TrainingDataTabProps {
  model: Model
  datasets: Dataset[]
}

export function TrainingDataTab({ model, datasets }: TrainingDataTabProps) {
  const trainedSet = new Set(model.trainedOnDatasetSlugs)
  const finetunedSet = new Set(model.finetunedOnDatasetSlugs)

  function relation(slug: string): "trained-on" | "finetuned-on" | "evaluated-on" {
    if (trainedSet.has(slug)) return "trained-on"
    if (finetunedSet.has(slug)) return "finetuned-on"
    return "evaluated-on"
  }

  return (
    <div className="flex flex-col gap-8">
      <HeroCard className="p-6">
        <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
          Discovered links
        </p>
        <p className="text-secondary text-body mt-3 leading-relaxed">
          Datasets this model was trained or evaluated on, when known. We
          discover links from model-card metadata and README citations.
          Confidence reflects how certain we are about each link — published
          recipes score higher than inferred matches.
        </p>
      </HeroCard>

      {datasets.length === 0 ? (
        <WhisperCard>
          <Quote
            className="text-tertiary size-5"
            aria-hidden="true"
          />
          <h4 className="text-primary text-h4 mt-3 font-semibold">
            No training data linked yet
          </h4>
          <p className="text-secondary text-caption mt-2 max-w-2xl">
            Datacrawlr discovers links from model cards. If this
            model&apos;s card doesn&apos;t reference its training data —
            or its training data isn&apos;t indexed by us — we can&apos;t
            link it automatically.
          </p>
          <Link
            href={model.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-caption hover:text-accent-hover mt-4 inline-flex underline-offset-4 hover:underline"
          >
            Open the model card →
          </Link>
        </WhisperCard>
      ) : (
        <div className="flex flex-col gap-4">
          {datasets.map((d) => {
            const rel = relation(d.slug)
            return (
              <div key={d.id} className="relative">
                <DatasetCard dataset={d} />
                <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
                  <Badge
                    variant={
                      rel === "trained-on"
                        ? "default"
                        : rel === "finetuned-on"
                          ? "success"
                          : "neutral"
                    }
                    className="font-mono"
                  >
                    {rel.replace(/-/g, " ")}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
