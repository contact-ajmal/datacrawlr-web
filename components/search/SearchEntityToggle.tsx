"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Cpu, Database, Layers } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Strip surfaced above the /search results that switches between the
 * dataset surface (current page), the models directory with the same
 * query, or the combined "both" view (still on /search for now — model
 * results will land in the result grid in a future iteration).
 */
export function SearchEntityToggle() {
  const params = useSearchParams()
  const q = params.get("q") ?? ""
  const type = params.get("type") ?? "datasets"

  const targets = useMemo(() => {
    const qs = q ? `?q=${encodeURIComponent(q)}` : ""
    const modelsQs = q ? `?search=${encodeURIComponent(q)}` : ""
    return {
      datasets: `/search${qs}`,
      both: `/search${q ? `${qs}&type=both` : "?type=both"}`,
      models: `/models${modelsQs}`,
    }
  }, [q])

  const OPTIONS: {
    key: "datasets" | "models" | "both"
    label: string
    icon: typeof Database
    href: string
  }[] = [
    { key: "datasets", label: "Datasets", icon: Database, href: targets.datasets },
    { key: "models", label: "Models", icon: Cpu, href: targets.models },
    { key: "both", label: "Both", icon: Layers, href: targets.both },
  ]

  return (
    <div
      className="flex items-center gap-1.5"
      role="tablist"
      aria-label="Search entity type"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon
        const isActive = opt.key === type || (opt.key === "datasets" && type === "")
        return (
          <Link
            key={opt.key}
            href={opt.href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-caption font-medium transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-accent-glow",
              isActive
                ? "bg-accent/15 text-accent border-accent/40"
                : "bg-elevated text-secondary border-subtle hover:border-strong hover:text-primary"
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {opt.label}
          </Link>
        )
      })}
    </div>
  )
}
