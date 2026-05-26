"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, BookOpen, Check, ExternalLink } from "lucide-react"

import { EmptyState } from "@/components/shared/EmptyState"
import { WhisperCard } from "@/components/shared/Cards"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Citation } from "@/lib/types"

type SortMode = "newest" | "most-cited" | "alphabetical"

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "most-cited", label: "Most cited" },
  { value: "alphabetical", label: "Alphabetical" },
]

interface CitationsTabProps {
  citations: Citation[] | undefined
}

export function CitationsTab({ citations }: CitationsTabProps) {
  const [sort, setSort] = useState<SortMode>("newest")
  const list = useMemo(() => citations ?? [], [citations])
  const sorted = useMemo(() => sortCitations(list, sort), [list, sort])

  if (list.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No citations indexed yet."
        description="When papers cite this dataset they'll show up here."
      />
    )
  }

  const current =
    SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-secondary text-caption">
          <span className="text-primary font-medium">{list.length}</span>{" "}
          {list.length === 1 ? "paper cites" : "papers cite"} this dataset
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" aria-label="Sort citations">
              <ArrowUpDown className="size-3.5" aria-hidden="true" />
              {current.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-overlay border-subtle min-w-44"
          >
            {SORT_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onSelect={() => setSort(opt.value)}
                className="text-secondary data-[highlighted]:bg-elevated data-[highlighted]:text-primary cursor-pointer text-caption"
              >
                <span className="flex-1">{opt.label}</span>
                {sort === opt.value ? (
                  <Check className="text-accent size-3.5" aria-hidden="true" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ul className="space-y-3">
        {sorted.map((c) => (
          <li key={`${c.title}-${c.year}`}>
            <CitationRow citation={c} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function CitationRow({ citation }: { citation: Citation }) {
  return (
    <WhisperCard className="p-4">
      <div className="text-primary text-body font-medium">{citation.title}</div>
      <div className="text-secondary text-caption mt-1">
        {citation.authors.join(", ")} · {citation.venue} · {citation.year}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-tertiary text-micro font-mono">
          {citation.year}
        </div>
        <Button asChild variant="ghost" size="sm">
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open paper: ${citation.title}`}
          >
            View paper
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </WhisperCard>
  )
}

function sortCitations(list: Citation[], sort: SortMode): Citation[] {
  const copy = list.slice()
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => b.year - a.year)
    case "alphabetical":
      return copy.sort((a, b) => a.title.localeCompare(b.title))
    case "most-cited":
      // No per-citation count in mock data; proxy with year recency × authors
      return copy.sort(
        (a, b) =>
          b.year * 10 +
          b.authors.length -
          (a.year * 10 + a.authors.length)
      )
  }
}
