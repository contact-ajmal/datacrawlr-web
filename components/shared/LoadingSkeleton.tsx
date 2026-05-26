import { HeroCard, StandardCard, WhisperCard } from "@/components/shared/Cards"
import { Shimmer } from "@/components/shared/Shimmer"
import { cn } from "@/lib/utils"

export function DatasetCardSkeleton({ className }: { className?: string }) {
  return (
    <StandardCard
      className={cn(
        "hover:translate-y-0 hover:border-subtle hover:bg-elevated",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Shimmer className="size-4 shrink-0 rounded-full" />
        <Shimmer className="h-4 w-3/5" />
      </div>
      <div className="mt-3 space-y-2">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-4/5" />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Shimmer className="h-5 w-20 rounded-full" />
        <Shimmer className="h-5 w-16 rounded-full" />
        <Shimmer className="h-5 w-24 rounded-full" />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-12" />
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-3 w-14" />
      </div>
    </StandardCard>
  )
}

export function SearchResultSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-elevated border-subtle rounded-xl border p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Shimmer className="size-4 shrink-0 rounded-full" />
          <Shimmer className="h-6 w-2/5" />
          <Shimmer className="h-3 w-6 shrink-0" />
        </div>
        <Shimmer className="h-5 w-20 shrink-0 rounded-full" />
      </div>
      <Shimmer className="mt-3 h-3 w-3/5" />
      <div className="mt-3 space-y-2">
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-5/6" />
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Shimmer className="h-5 w-20 rounded-full" />
        <Shimmer className="h-5 w-16 rounded-full" />
        <Shimmer className="h-5 w-24 rounded-full" />
        <Shimmer className="h-5 w-20 rounded-full" />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-12" />
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-3 w-16" />
      </div>
    </div>
  )
}

export function AISummarySkeleton({ className }: { className?: string }) {
  return (
    <HeroCard className={cn("mb-8", className)}>
      <div className="flex items-center justify-between">
        <Shimmer className="h-5 w-28 rounded-full" />
        <Shimmer className="h-4 w-32" />
      </div>
      <div className="mt-5 space-y-3">
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-11/12" />
        <Shimmer className="h-4 w-3/4" />
      </div>
      <div className="mt-5 space-y-3">
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-5/6" />
      </div>
      <div className="mt-5 space-y-3">
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-4/5" />
      </div>
      <div className="border-subtle mt-6 flex items-center gap-3 border-t pt-4">
        <Shimmer className="h-7 w-28" />
        <div className="ml-auto flex items-center gap-2">
          <Shimmer className="h-4 w-28" />
          <Shimmer className="size-7 rounded-md" />
          <Shimmer className="size-7 rounded-md" />
        </div>
      </div>
    </HeroCard>
  )
}

export function DatasetHeroSkeleton({ className }: { className?: string }) {
  return (
    <header
      className={cn("border-subtle border-b py-12", className)}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Shimmer className="h-3 w-48" />
        <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:gap-8">
          <div className="flex-1">
            <Shimmer className="h-12 w-3/4" />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Shimmer className="h-5 w-20 rounded-full" />
              <Shimmer className="h-5 w-24 rounded-full" />
              <Shimmer className="h-5 w-20 rounded-full" />
              <Shimmer className="h-5 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shimmer className="h-8 w-20 rounded-md" />
            <Shimmer className="h-8 w-20 rounded-md" />
            <Shimmer className="h-8 w-28 rounded-md" />
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <Shimmer className="h-5 w-11/12 max-w-3xl" />
          <Shimmer className="h-5 w-3/4 max-w-3xl" />
        </div>
      </div>
    </header>
  )
}

export function DatasetMetricsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("mt-12 grid grid-cols-1 gap-4 md:grid-cols-2", className)}>
      {[0, 1, 2, 3].map((i) => (
        <StandardCard
          key={i}
          className="hover:translate-y-0 hover:border-subtle hover:bg-elevated"
        >
          <Shimmer className="h-3 w-32" />
          <div className="mt-4 space-y-3">
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-3/4" />
            <Shimmer className="h-4 w-5/6" />
          </div>
        </StandardCard>
      ))}
    </div>
  )
}

export function DatasetRailSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <StandardCard className="hover:translate-y-0 hover:border-subtle hover:bg-elevated p-5">
        <Shimmer className="h-3 w-16" />
        <div className="mt-4 space-y-3">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-5/6" />
          <Shimmer className="h-4 w-4/5" />
        </div>
      </StandardCard>
      <WhisperCard className="p-5">
        <Shimmer className="h-3 w-16" />
        <div className="mt-4 space-y-3">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <Shimmer className="h-3 w-16" />
              <Shimmer className="h-3 w-24" />
            </div>
          ))}
        </div>
      </WhisperCard>
      <WhisperCard className="p-5">
        <Shimmer className="h-3 w-16" />
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="mt-1 h-3 w-full" />
            </div>
          ))}
        </div>
      </WhisperCard>
    </div>
  )
}

export function GraphSkeleton() {
  // Pseudo-random but stable layout — 12 dots within a 400×400 box
  const dots = Array.from({ length: 12 }, (_, i) => {
    const t = (i * 31) % 100
    const u = (i * 47) % 100
    return {
      key: i,
      cx: 80 + t * 2.4,
      cy: 60 + u * 2.4,
      r: 4 + (i % 3) * 2,
      delay: (i % 4) * 0.4,
    }
  })

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 400 400"
        className="size-[min(400px,80vmin)]"
        aria-hidden="true"
      >
        {dots.map((d) => (
          <circle
            key={d.key}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill="var(--accent)"
            fillOpacity={0.4}
            className="animate-pulse-glow"
            style={{ animationDelay: `${d.delay}s` }}
          />
        ))}
      </svg>
      <div className="text-tertiary text-caption absolute font-mono uppercase tracking-wider">
        Building constellation…
      </div>
    </div>
  )
}
