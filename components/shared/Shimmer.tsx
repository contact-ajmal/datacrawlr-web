import { cn } from "@/lib/utils"

interface ShimmerProps {
  className?: string
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-elevated relative overflow-hidden rounded-md",
        className
      )}
    >
      <div
        className="from-transparent via-overlay to-transparent animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r motion-reduce:hidden"
      />
    </div>
  )
}
