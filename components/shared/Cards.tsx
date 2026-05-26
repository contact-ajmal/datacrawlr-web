import * as React from "react"

import { cn } from "@/lib/utils"

type DivProps = React.ComponentPropsWithoutRef<"div"> & {
  ref?: React.Ref<HTMLDivElement>
}

export function WhisperCard({ className, ref, ...props }: DivProps) {
  return (
    <div
      ref={ref}
      data-slot="whisper-card"
      className={cn(
        "bg-elevated border-subtle rounded-lg border p-4",
        className
      )}
      {...props}
    />
  )
}

export function StandardCard({ className, ref, ...props }: DivProps) {
  return (
    <div
      ref={ref}
      data-slot="standard-card"
      className={cn(
        "bg-elevated border-subtle rounded-xl border p-5 transition-all duration-150",
        "hover:border-strong hover:bg-[#10131A] hover:-translate-y-0.5",
        "motion-reduce:hover:translate-y-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

export function HeroCard({ className, children, ref, ...props }: DivProps) {
  return (
    <div
      ref={ref}
      data-slot="hero-card"
      className={cn(
        "relative isolate rounded-xl p-px",
        "bg-[conic-gradient(from_140deg_at_50%_50%,var(--accent)_0deg,transparent_120deg,transparent_240deg,var(--accent)_360deg)]",
        className
      )}
      {...props}
    >
      <div className="bg-elevated relative h-full w-full rounded-[inherit] p-6 shadow-[inset_0_0_40px_rgba(94,234,212,0.04)]">
        {children}
      </div>
    </div>
  )
}
