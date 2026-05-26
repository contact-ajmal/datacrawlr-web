"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown, Filter, X } from "lucide-react"

import { ModelFilterPanel } from "@/components/models/ModelFilterPanel"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export type ModelsSortMode =
  | "composite_score"
  | "params_desc"
  | "newest"
  | "popularity"
  | "cheapest"
  | "largest_context"

const SORT_OPTIONS: { value: ModelsSortMode; label: string }[] = [
  { value: "composite_score", label: "Composite score" },
  { value: "params_desc", label: "Largest parameters" },
  { value: "newest", label: "Newest" },
  { value: "popularity", label: "Popularity" },
  { value: "cheapest", label: "Cheapest (commercial)" },
  { value: "largest_context", label: "Largest context window" },
]

interface ActiveChip {
  key: string
  value: string
  label: string
}

interface ModelsResultHeaderProps {
  count: number
  /** Distinct organization values surfaced to the mobile filter sheet. */
  organizations: string[]
  /** Active-filter count surfaced in the sheet footer. */
  activeCount: number
  /** Renderable chip set computed server-side from search params. */
  chips: ActiveChip[]
}

export function ModelsResultHeader({
  count,
  organizations,
  activeCount,
  chips,
}: ModelsResultHeaderProps) {
  const router = useRouter()
  const params = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const sort = (params.get("sort") as ModelsSortMode | null) ?? "composite_score"
  const current =
    SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0]

  const setSort = (next: ModelsSortMode) => {
    const p = new URLSearchParams(params.toString())
    if (next === "composite_score") p.delete("sort")
    else p.set("sort", next)
    const qs = p.toString()
    router.replace(`/models${qs ? `?${qs}` : ""}`, { scroll: false })
  }

  const removeChip = (chip: ActiveChip) => {
    const p = new URLSearchParams(params.toString())
    // Multi-valued keys: rebuild without the offending value. Scalar keys: just delete.
    const existing = p.getAll(chip.key)
    p.delete(chip.key)
    existing
      .filter((v) => v !== chip.value)
      .forEach((v) => p.append(chip.key, v))
    const qs = p.toString()
    router.replace(`/models${qs ? `?${qs}` : ""}`, { scroll: false })
  }

  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="text-secondary text-caption">
          Showing{" "}
          <span className="text-primary font-medium tabular-nums">{count}</span>{" "}
          models
        </span>
        {chips.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <li key={`${chip.key}:${chip.value}`}>
                <button
                  type="button"
                  onClick={() => removeChip(chip)}
                  className="bg-elevated border-subtle text-secondary hover:border-strong inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-micro font-medium transition-colors"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  {chip.label}
                  <X className="size-3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="secondary" size="sm" className="lg:hidden">
              <Filter className="size-3.5" aria-hidden="true" />
              Filters
              {activeCount > 0 ? (
                <span className="bg-accent text-base ml-1 inline-flex size-4 items-center justify-center rounded-full text-[10px] font-mono tabular-nums">
                  {activeCount}
                </span>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-base border-subtle w-80 overflow-y-auto border-l p-0"
          >
            <SheetHeader className="border-subtle border-b p-5">
              <SheetTitle className="text-h4">Filters</SheetTitle>
              <SheetDescription className="sr-only">
                Narrow the model list
              </SheetDescription>
            </SheetHeader>
            <div className="p-5">
              <ModelFilterPanel
                organizations={organizations}
                activeCount={activeCount}
              />
            </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" aria-label="Sort models">
              <ArrowUpDown className="size-3.5" aria-hidden="true" />
              {current.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-overlay border-subtle min-w-52"
          >
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onSelect={() => setSort(opt.value)}
                className="data-[highlighted]:bg-elevated text-primary"
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
