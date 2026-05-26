import { ModalityViz } from "@/components/dataset/ModalityViz"
import { QualityRing } from "@/components/dataset/QualityRing"
import { SplitBar } from "@/components/dataset/SplitBar"
import { TagCloud } from "@/components/dataset/TagCloud"
import { StandardCard } from "@/components/shared/Cards"
import { syntheticSubModalities } from "@/lib/dataset-derivations"
import type { Dataset } from "@/lib/types"

interface DatasetMetricsGridProps {
  dataset: Dataset
}

export function DatasetMetricsGrid({ dataset }: DatasetMetricsGridProps) {
  const subModalities = syntheticSubModalities(dataset)

  return (
    <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
      <MetricCell label="Train / Val / Test split">
        <SplitBar />
      </MetricCell>
      <MetricCell label="Modality distribution">
        <ModalityViz
          modality={dataset.modality}
          subModalities={subModalities}
        />
      </MetricCell>
      <MetricCell label="Top tags">
        <TagCloud tags={dataset.tags} />
      </MetricCell>
      <MetricCell label="Quality score">
        <QualityRing score={dataset.quality} />
      </MetricCell>
    </div>
  )
}

function MetricCell({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <StandardCard className="hover:translate-y-0 hover:bg-elevated">
      <div className="text-secondary text-caption mb-3 font-semibold uppercase tracking-wider">
        {label}
      </div>
      {children}
    </StandardCard>
  )
}
