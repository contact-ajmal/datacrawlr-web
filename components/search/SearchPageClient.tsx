"use client"

import { Suspense, use, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Compass, SearchX } from "lucide-react"

import { RefinePanel } from "@/components/ai/RefinePanel"
import { StaggerChildren } from "@/components/motion/StaggerChildren"
import { SearchAISynthesis } from "@/components/search/SearchAISynthesis"
import { SearchFiltersPanel } from "@/components/search/SearchFiltersPanel"
import { SearchPagination } from "@/components/search/SearchPagination"
import { SearchResultCard } from "@/components/search/SearchResultCard"
import {
  type SortMode,
} from "@/components/search/SearchSortMenu"
import { SearchEntityToggle } from "@/components/search/SearchEntityToggle"
import { SearchSubHeader } from "@/components/search/SearchSubHeader"
import { EmptyState } from "@/components/shared/EmptyState"
import {
  AISummarySkeleton,
  SearchResultSkeleton,
} from "@/components/shared/LoadingSkeleton"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { searchDatasets } from "@/lib/data"
import {
  toSearchFilters,
  useSearchFilters,
} from "@/lib/stores/search-filters"
import { buildSynthesis } from "@/lib/synthesis"
import type { SearchResponse, SearchResult } from "@/lib/types"

interface SearchPageClientProps {
  query: string
  initialPage: number
  pageSize: number
  initialResultsPromise: Promise<SearchResponse>
}

export function SearchPageClient({
  query,
  initialPage,
  pageSize,
  initialResultsPromise,
}: SearchPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filters = useSearchFilters()
  const clearAll = useSearchFilters((s) => s.clearAll)
  const [sort, setSort] = useState<SortMode>("relevance")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [refineOpen, setRefineOpen] = useState(false)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [resultMeta, setResultMeta] = useState<{
    total: number
    page: number
  } | null>(null)
  const [page, setPage] = useState(initialPage)

  // `currentPromise` starts with the server's pre-fetched search promise and
  // gets re-issued every time filters, query, or page change. The two child
  // sections (synthesis + results) each `use()` it inside their own Suspense
  // boundary so each can stream into the page independently.
  const [currentPromise, setCurrentPromise] = useState(initialResultsPromise)
  const isInitialMount = useRef(true)

  // Filter/query changes always send us back to page 1 — otherwise a user
  // who tweaks a filter can land on an empty page N+1 of the narrower set.
  useEffect(() => {
    if (isInitialMount.current) return
    if (page !== 1) setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query,
    filters.modality,
    filters.license,
    filters.source,
    filters.minSize,
    filters.maxSize,
    filters.minQuality,
    filters.updatedWithin,
  ])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    setResultMeta(null)
    setCurrentPromise(
      searchDatasets(query, toSearchFilters(filters), page, pageSize)
    )
    // filterPayload is rebuilt inside the effect from the same fields we list
    // as deps, so explicit deps stay in sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query,
    page,
    pageSize,
    filters.modality,
    filters.license,
    filters.source,
    filters.minSize,
    filters.maxSize,
    filters.minQuality,
    filters.updatedWithin,
  ])

  // Mirror `page` into the URL so the back button + share-links work. The
  // first page is the canonical URL (no `?page=1` noise); deeper pages
  // get `?page=N`. Other params (q, filters) are left untouched.
  useEffect(() => {
    if (isInitialMount.current) return
    const params = new URLSearchParams(searchParams.toString())
    if (page <= 1) params.delete("page")
    else params.set("page", String(page))
    const qs = params.toString()
    router.replace(`/search${qs ? `?${qs}` : ""}`, { scroll: false })
    // We deliberately omit searchParams from deps — Next replaces the
    // searchParams instance on every render, which would loop forever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, router])

  const onPageChange = useCallback((next: number) => {
    setPage(next)
    if (typeof window !== "undefined") {
      // Jump back to the top of the results list so the user can see the
      // first card on the new page without scrolling.
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [])

  const onCitationClick = (id: string) => {
    const el = document.getElementById(`result-${id}`)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    setHighlightedId(id)
    window.setTimeout(
      () => setHighlightedId((curr) => (curr === id ? null : curr)),
      1500
    )
  }

  return (
    <>
      <SearchSubHeader
        query={query}
        resultCount={resultMeta?.total ?? null}
        sort={sort}
        onSortChange={setSort}
        onOpenFilters={() => setFiltersOpen(true)}
        onToggleRefine={() => setRefineOpen((v) => !v)}
        refineOpen={refineOpen}
      />

      <main id="main" className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <aside className="hidden md:col-span-3 md:block">
            <div className="sticky top-[164px]">
              <SearchFiltersPanel />
            </div>
          </aside>

          <section className="md:col-span-9">
            <div className="mb-4">
              <SearchEntityToggle />
            </div>

            <Suspense fallback={<AISummarySkeleton />}>
              <SynthesisPane
                promise={currentPromise}
                query={query}
                onCitationClick={onCitationClick}
              />
            </Suspense>

            <Suspense fallback={<ResultsSkeletons />}>
              <ResultsPane
                promise={currentPromise}
                query={query}
                sort={sort}
                highlightedId={highlightedId}
                onClearFilters={clearAll}
                onBrowseTrending={() => router.push("/")}
                onResolved={setResultMeta}
                onPageChange={onPageChange}
              />
            </Suspense>
          </section>
        </div>
      </main>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent
          side="right"
          className="bg-base border-subtle w-80 overflow-y-auto border-l p-0"
        >
          <SheetHeader className="border-subtle border-b p-5">
            <SheetTitle className="text-h4">Filters</SheetTitle>
            <SheetDescription className="sr-only">
              Refine search results
            </SheetDescription>
          </SheetHeader>
          <SearchFiltersPanel inSheet />
        </SheetContent>
      </Sheet>

      <RefinePanel open={refineOpen} onClose={() => setRefineOpen(false)} />
    </>
  )
}

interface SynthesisPaneProps {
  promise: Promise<SearchResponse>
  query: string
  onCitationClick: (id: string) => void
}

function SynthesisPane({ promise, query, onCitationClick }: SynthesisPaneProps) {
  const response = use(promise)
  const synthesis = useMemo(
    () => buildSynthesis(query, response.results),
    [query, response.results]
  )
  return (
    <SearchAISynthesis synthesis={synthesis} onCitationClick={onCitationClick} />
  )
}

interface ResultsPaneProps {
  promise: Promise<SearchResponse>
  query: string
  sort: SortMode
  highlightedId: string | null
  onClearFilters: () => void
  onBrowseTrending: () => void
  onResolved: (meta: { total: number; page: number }) => void
  onPageChange: (page: number) => void
}

function ResultsPane({
  promise,
  query,
  sort,
  highlightedId,
  onClearFilters,
  onBrowseTrending,
  onResolved,
  onPageChange,
}: ResultsPaneProps) {
  const response = use(promise)
  const results = useMemo(
    () => sortResults(response.results, sort),
    [response.results, sort]
  )

  useEffect(() => {
    onResolved({ total: response.total, page: response.page })
  }, [response.total, response.page, onResolved])

  if (results.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title={`No datasets matched "${query || "your filters"}"`}
        description="Try broader terms or remove some filters."
        actions={
          <>
            <Button variant="secondary" onClick={onClearFilters}>
              Clear filters
            </Button>
            <Button onClick={onBrowseTrending}>
              <Compass className="size-4" aria-hidden="true" />
              Browse trending
            </Button>
          </>
        }
      />
    )
  }

  return (
    <>
      <StaggerChildren as="ol" className="space-y-4" inView={false}>
        {results.map((r, i) => (
          <SearchResultCard
            key={r.id}
            result={r}
            index={i}
            query={query}
            highlighted={highlightedId === r.id}
          />
        ))}
      </StaggerChildren>
      <SearchPagination
        page={response.page}
        pageSize={response.pageSize}
        total={response.total}
        onPageChange={onPageChange}
      />
    </>
  )
}

function ResultsSkeletons() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <SearchResultSkeleton key={i} />
      ))}
    </div>
  )
}

function sortResults(results: SearchResult[], sort: SortMode): SearchResult[] {
  const copy = results.slice()
  switch (sort) {
    case "relevance":
      return copy
    case "newest":
      return copy.sort(
        (a, b) => +new Date(b.lastUpdated) - +new Date(a.lastUpdated)
      )
    case "most-cited":
      return copy.sort(
        (a, b) =>
          (b.citations?.length ?? 0) - (a.citations?.length ?? 0) ||
          (b.downloads ?? 0) - (a.downloads ?? 0)
      )
    case "smallest":
      return copy.sort((a, b) => a.size.rows - b.size.rows)
    case "largest":
      return copy.sort((a, b) => b.size.rows - a.size.rows)
  }
}
