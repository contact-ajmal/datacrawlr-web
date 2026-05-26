import { DatasetCardSkeleton } from "@/components/shared/LoadingSkeleton"
import { Shimmer } from "@/components/shared/Shimmer"

export default function MarketingLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <Shimmer className="h-12 w-2/3 rounded-md" />
      <Shimmer className="mt-4 h-6 w-1/2 rounded-md" />
      <div className="border-subtle mt-12 grid grid-cols-2 gap-8 border-y py-12 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Shimmer className="h-10 w-24 rounded-md" />
            <Shimmer className="mt-2 h-3 w-20 rounded-md" />
          </div>
        ))}
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <DatasetCardSkeleton key={i} />
        ))}
      </div>
    </main>
  )
}
