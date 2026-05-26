import { DatasetCard } from "@/components/dataset/DatasetCard"
import type { Dataset } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DiscoverySectionProps {
  title: string
  subtitle?: string
  datasets: Dataset[]
  variant?: "default" | "curator" | "paper"
  altBg?: boolean
}

export function DiscoverySection({
  title,
  subtitle,
  datasets,
  variant = "default",
  altBg = false,
}: DiscoverySectionProps) {
  return (
    <section
      className={cn(
        "px-6 py-16",
        altBg ? "bg-elevated/40" : "bg-base"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-h2 font-semibold tracking-tight">{title}</h2>
        {subtitle ? (
          <p className="text-secondary text-lead mt-2">{subtitle}</p>
        ) : null}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {datasets.map((ds) => (
            <DatasetCard key={ds.id} dataset={ds} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  )
}
