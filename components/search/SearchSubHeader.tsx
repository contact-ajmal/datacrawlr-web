"use client"

import { type FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Filter, Search, Sparkles, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  SearchSortMenu,
  type SortMode,
} from "@/components/search/SearchSortMenu"
import { MODALITY_ICONS } from "@/lib/modality-icons"
import {
  countActiveFilters,
  SIZE_MAX,
  SIZE_MIN,
  useSearchFilters,
} from "@/lib/stores/search-filters"
import type { Modality, SourceProvider } from "@/lib/types"
import { cn, formatNumber } from "@/lib/utils"

interface SearchSubHeaderProps {
  query: string
  resultCount: number | null
  sort: SortMode
  onSortChange: (next: SortMode) => void
  onOpenFilters?: () => void
  onToggleRefine?: () => void
  refineOpen?: boolean
}

export function SearchSubHeader({
  query,
  resultCount,
  sort,
  onSortChange,
  onOpenFilters,
  onToggleRefine,
  refineOpen,
}: SearchSubHeaderProps) {
  const router = useRouter()
  const [draft, setDraft] = useState(query)

  useEffect(() => {
    setDraft(query)
  }, [query])

  const filters = useSearchFilters()
  const activeCount = countActiveFilters(filters)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = draft.trim()
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : `/search`)
  }

  return (
    <div className="bg-base/90 border-subtle sticky top-[52px] z-40 border-b backdrop-blur-md md:top-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:px-6">
        <form onSubmit={onSubmit}>
          <div className="bg-elevated border-subtle focus-within:border-accent focus-within:ring-accent-glow flex h-11 items-center gap-2 rounded-md border px-3 transition-colors focus-within:ring-2">
            <Search
              className="text-tertiary size-4 shrink-0"
              aria-hidden="true"
            />
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search datasets…"
              aria-label="Search datasets"
              data-primary-search="true"
              className="text-primary text-body placeholder:text-tertiary flex-1 bg-transparent outline-none"
            />
            {draft ? (
              <button
                type="button"
                onClick={() => setDraft("")}
                aria-label="Clear search"
                className="text-tertiary hover:text-primary"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-secondary text-caption">
              {query ? (
                <>
                  Results for{" "}
                  <span className="text-primary font-medium">
                    &ldquo;{query}&rdquo;
                  </span>
                </>
              ) : (
                "Showing all datasets"
              )}
            </span>
            <Badge variant="neutral">
              {resultCount === null ? "…" : `${resultCount} datasets`}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {onOpenFilters ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenFilters}
                className="md:hidden"
                aria-label="Open filters"
              >
                <Filter className="size-3.5" aria-hidden="true" />
                Filters
                {activeCount > 0 ? (
                  <Badge variant="default" className="ml-1">
                    {activeCount}
                  </Badge>
                ) : null}
              </Button>
            ) : null}
            <SearchSortMenu value={sort} onChange={onSortChange} />
            {onToggleRefine ? (
              <Button
                variant={refineOpen ? "default" : "secondary"}
                size="sm"
                onClick={onToggleRefine}
                aria-label="Refine results with AI"
                aria-pressed={refineOpen}
              >
                <Sparkles className="size-3.5" aria-hidden="true" />
                Refine with AI
              </Button>
            ) : null}
          </div>
        </div>

        {activeCount > 0 ? <ActiveFilterChips /> : null}
      </div>
    </div>
  )
}

function ActiveFilterChips() {
  const {
    modality,
    license,
    source,
    minSize,
    maxSize,
    minQuality,
    updatedWithin,
    toggleModality,
    toggleLicense,
    toggleSource,
    setSizeRange,
    setMinQuality,
    setUpdatedWithin,
  } = useSearchFilters()

  const sizeChanged = minSize !== SIZE_MIN || maxSize !== SIZE_MAX

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-tertiary text-micro mr-1 font-mono uppercase tracking-wider">
        Active
      </span>
      {modality.map((m) => (
        <FilterChip
          key={`m-${m}`}
          label={`Modality: ${m}`}
          icon={
            <ModalitySwatch modality={m} />
          }
          onRemove={() => toggleModality(m)}
        />
      ))}
      {license.map((l) => (
        <FilterChip
          key={`l-${l}`}
          label={`License: ${l}`}
          onRemove={() => toggleLicense(l)}
        />
      ))}
      {source.map((s) => (
        <FilterChip
          key={`s-${s}`}
          label={`Source: ${sourceLabel(s)}`}
          onRemove={() => toggleSource(s)}
        />
      ))}
      {sizeChanged ? (
        <FilterChip
          label={`Size: ${formatNumber(minSize)} – ${formatNumber(maxSize)} rows`}
          onRemove={() => setSizeRange(SIZE_MIN, SIZE_MAX)}
        />
      ) : null}
      {minQuality > 0 ? (
        <FilterChip
          label={`Quality ≥ ${minQuality}`}
          onRemove={() => setMinQuality(0)}
        />
      ) : null}
      {updatedWithin !== "any" ? (
        <FilterChip
          label={`Updated: last ${updatedWithin}`}
          onRemove={() => setUpdatedWithin("any")}
        />
      ) : null}
    </div>
  )
}

function ModalitySwatch({ modality }: { modality: Modality }) {
  const Icon = MODALITY_ICONS[modality]
  return <Icon className="size-3" aria-hidden="true" />
}

function sourceLabel(s: SourceProvider): string {
  switch (s) {
    case "huggingface":
      return "HuggingFace"
    case "kaggle":
      return "Kaggle"
    case "github":
      return "GitHub"
    case "paper":
      return "Papers"
    case "blog":
      return "Blogs"
  }
}

interface FilterChipProps {
  label: string
  icon?: React.ReactNode
  onRemove: () => void
}

function FilterChip({ label, icon, onRemove }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter: ${label}`}
      className={cn(
        "group inline-flex items-center gap-1.5",
        "bg-elevated border-subtle hover:border-strong text-secondary hover:text-primary",
        "rounded-full border px-2.5 py-0.5 text-micro font-medium transition-colors"
      )}
    >
      {icon}
      <span>{label}</span>
      <X className="size-3 opacity-60 group-hover:opacity-100" aria-hidden="true" />
    </button>
  )
}
