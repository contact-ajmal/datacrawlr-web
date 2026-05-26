"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

interface LeaderboardAccessToggleProps {
  benchmark: string
}

const OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "open-weights,open-source", label: "Open-weights" },
  { value: "commercial-api", label: "Commercial" },
]

export function LeaderboardAccessToggle({
  benchmark,
}: LeaderboardAccessToggleProps) {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get("access") ?? ""

  const select = useCallback(
    (value: string) => {
      const next = new URLSearchParams(params.toString())
      if (value) next.set("access", value)
      else next.delete("access")
      const qs = next.toString()
      router.replace(
        `/models/leaderboard/${benchmark}${qs ? `?${qs}` : ""}`,
        { scroll: false }
      )
    },
    [params, router, benchmark]
  )

  return (
    <div
      className="bg-base/90 border-subtle sticky top-14 z-30 -mx-6 border-y px-6 py-3 backdrop-blur-md"
      role="tablist"
      aria-label="Filter leaderboard by access type"
    >
      <div className="flex items-center gap-2 overflow-x-auto">
        {OPTIONS.map((opt) => {
          const isActive = active === opt.value
          return (
            <button
              key={opt.value || "all"}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => select(opt.value)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-caption font-medium transition-colors",
                "outline-none focus-visible:ring-2 focus-visible:ring-accent-glow",
                isActive
                  ? "bg-accent/15 text-accent border-accent/40"
                  : "bg-elevated text-secondary border-subtle hover:border-strong hover:text-primary"
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
