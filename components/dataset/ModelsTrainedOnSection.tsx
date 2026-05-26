import Link from "next/link"
import { Cpu } from "lucide-react"

import { StandardCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type {
  DatasetModelRelation,
  ModelAccessType,
  ModelTrainingLink,
} from "@/lib/types"

interface ModelsTrainedOnSectionProps {
  trainedBy: ModelTrainingLink[]
}

const RELATION_LABEL: Record<DatasetModelRelation, string> = {
  "trained-on": "Trained on",
  "finetuned-on": "Fine-tuned on",
  "evaluated-on": "Evaluated on",
}

const RELATION_VARIANT: Record<
  DatasetModelRelation,
  "default" | "success" | "neutral"
> = {
  "trained-on": "default",
  "finetuned-on": "success",
  "evaluated-on": "neutral",
}

const ACCESS_VARIANT: Record<
  ModelAccessType,
  "default" | "neutral" | "warn" | "success"
> = {
  "open-weights": "default",
  "open-source": "success",
  "commercial-api": "warn",
  "closed-weights": "neutral",
}

const CONFIDENCE_COLOR: Record<string, string> = {
  high: "bg-emerald-400",
  medium: "bg-amber-400",
  low: "bg-zinc-400",
}

/**
 * Surfaces the model side of the model↔dataset graph on a dataset detail
 * page. Switches between a fixed grid and a horizontal scroll rail
 * depending on how many links we have so layout never looks under-filled.
 */
export function ModelsTrainedOnSection({
  trainedBy,
}: ModelsTrainedOnSectionProps) {
  if (trainedBy.length === 0) return null
  const useRail = trainedBy.length > 6

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center gap-2">
        <Cpu className="text-accent size-4" aria-hidden="true" />
        <h3 className="text-h3 font-semibold tracking-tight">
          Models trained on this dataset
        </h3>
      </div>
      <p className="text-secondary text-caption mb-6">
        When known. Datacrawlr discovers training-data links from model
        card metadata.
      </p>

      {useRail ? (
        <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-6 pb-3">
          {trainedBy.map((link) => (
            <div key={link.modelSlug} className="w-72 shrink-0 snap-start">
              <ModelTrainingCard link={link} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {trainedBy.map((link) => (
            <ModelTrainingCard key={link.modelSlug} link={link} />
          ))}
        </div>
      )}
    </section>
  )
}

function ModelTrainingCard({ link }: { link: ModelTrainingLink }) {
  const confidenceClass =
    CONFIDENCE_COLOR[link.confidence ?? "high"] ?? CONFIDENCE_COLOR.high
  return (
    <Link
      href={`/models/${link.modelSlug}`}
      className="group block transition-transform duration-150 hover:-translate-y-0.5"
    >
      <StandardCard className="!p-4 group-hover:border-strong">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-tertiary text-micro truncate font-mono">
              {link.organization ?? "Independent"}
            </div>
            <div className="text-primary text-body mt-1 truncate font-semibold">
              {link.modelName}
            </div>
          </div>
          {typeof link.compositeScore === "number" ? (
            <Badge variant="neutral" className="shrink-0 font-mono">
              {link.compositeScore.toFixed(0)}
            </Badge>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge variant={RELATION_VARIANT[link.relation]}>
            {RELATION_LABEL[link.relation]}
          </Badge>
          {link.accessType ? (
            <Badge variant={ACCESS_VARIANT[link.accessType]} className="capitalize">
              {link.accessType.replace(/-/g, " ")}
            </Badge>
          ) : null}
          <span
            aria-hidden="true"
            className={`ml-auto inline-block size-1.5 shrink-0 rounded-full ${confidenceClass}`}
            title={`${link.confidence ?? "high"} confidence`}
          />
        </div>
      </StandardCard>
    </Link>
  )
}
