"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Cpu, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Shimmer } from "@/components/shared/Shimmer"
import { useDebounce } from "@/hooks/use-debounce"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import { searchCross } from "@/lib/data"
import { MODALITY_ICONS } from "@/lib/modality-icons"
import { fadeIn } from "@/lib/motion-variants"
import type {
  DatasetSuggestion,
  Modality,
  Model,
  ModelAccessType,
} from "@/lib/types"
import { cn } from "@/lib/utils"

export interface LiveSearchInputHandle {
  setQuery: (q: string) => void
  focus: () => void
}

interface LiveSearchInputProps {
  placeholder?: string
  size?: "lg" | "md"
  autoFocus?: boolean
  onSubmit?: (q: string) => void
  className?: string
}

const MIN_LEN = 2
const DEBOUNCE_MS = 180
const PER_SECTION = 4

type Row =
  | { kind: "dataset"; data: DatasetSuggestion }
  | { kind: "model"; data: Model }

export const LiveSearchInput = forwardRef<
  LiveSearchInputHandle,
  LiveSearchInputProps
>(function LiveSearchInput(
  {
    placeholder = "Find datasets or models…",
    size = "md",
    autoFocus,
    onSubmit,
    className,
  },
  ref
) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const [datasets, setDatasets] = useState<DatasetSuggestion[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)

  // Flat ordered list of indexable rows — datasets first, then models, so
  // arrow-key navigation crosses the section boundary naturally.
  const rows = useMemo<Row[]>(() => {
    const datasetRows: Row[] = datasets
      .slice(0, PER_SECTION)
      .map((d) => ({ kind: "dataset", data: d }))
    const modelRows: Row[] = models
      .slice(0, PER_SECTION)
      .map((m) => ({ kind: "model", data: m }))
    return [...datasetRows, ...modelRows]
  }, [datasets, models])

  // Race-safe fetch: each effect run aborts the previous before writing.
  useEffect(() => {
    if (debouncedQuery.trim().length < MIN_LEN) {
      setDatasets([])
      setModels([])
      setIsLoading(false)
      return
    }
    let active = true
    setIsLoading(true)
    searchCross(debouncedQuery, PER_SECTION + 2)
      .then((result) => {
        if (!active) return
        setDatasets(result.datasets)
        setModels(result.models)
        setActiveIndex(-1)
        setIsLoading(false)
      })
      .catch(() => {
        if (!active) return
        setDatasets([])
        setModels([])
        setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [debouncedQuery])

  useImperativeHandle(ref, () => ({
    setQuery: (q) => {
      setQuery(q)
      inputRef.current?.focus()
    },
    focus: () => inputRef.current?.focus(),
  }))

  useOnClickOutside(containerRef, () => {
    setFocused(false)
    setActiveIndex(-1)
  })

  const trimmed = query.trim()
  const hasQuery = trimmed.length >= MIN_LEN
  const showDropdown = focused && hasQuery && (isLoading || rows.length > 0 || true)

  const submit = useCallback(
    (q: string) => {
      const final = q.trim()
      if (!final) return
      onSubmit?.(final)
      router.push(`/search?q=${encodeURIComponent(final)}`)
    },
    [onSubmit, router]
  )

  const navigateRow = useCallback(
    (row: Row) => {
      if (row.kind === "dataset") {
        router.push(`/datasets/${row.data.slug}`)
      } else {
        router.push(`/models/${row.data.slug}`)
      }
      setFocused(false)
    },
    [router]
  )

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown && e.key !== "Enter") return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) =>
        rows.length === 0 ? -1 : (i + 1) % rows.length
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) =>
        rows.length === 0 ? -1 : (i - 1 + rows.length) % rows.length
      )
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex >= 0 && rows[activeIndex]) navigateRow(rows[activeIndex])
      else submit(query)
    } else if (e.key === "Escape") {
      e.preventDefault()
      setQuery("")
      setFocused(false)
      setActiveIndex(-1)
      inputRef.current?.blur()
    }
  }

  const dims = useMemo(
    () =>
      size === "lg"
        ? {
            wrapper: "h-16 rounded-xl px-2",
            input: "text-lead",
            icon: "size-5",
            iconWrap: "ml-3",
          }
        : {
            wrapper: "h-11 rounded-md px-2",
            input: "text-body",
            icon: "size-4",
            iconWrap: "ml-2",
          },
    [size]
  )

  const datasetRowStart = 0
  const modelRowStart = Math.min(PER_SECTION, datasets.length)

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "bg-elevated border-subtle focus-within:border-accent focus-within:ring-accent-glow flex items-center gap-2 border transition-all duration-150 focus-within:ring-2",
          dims.wrapper
        )}
      >
        <Search
          className={cn("text-tertiary shrink-0", dims.icon, dims.iconWrap)}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search datasets and models"
          aria-autocomplete="list"
          aria-controls={showDropdown ? "live-search-listbox" : undefined}
          aria-expanded={showDropdown}
          role="combobox"
          autoFocus={autoFocus}
          data-primary-search="true"
          className={cn(
            "text-primary placeholder:text-tertiary flex-1 border-0 bg-transparent outline-none focus:ring-0",
            dims.input
          )}
        />
      </div>

      <AnimatePresence>
        {showDropdown ? (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            id="live-search-listbox"
            role="listbox"
            className="bg-overlay border-strong absolute left-0 right-0 mt-2 max-h-[520px] overflow-y-auto rounded-xl border p-2 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md"
          >
            {isLoading && rows.length === 0 ? (
              <SkeletonRows />
            ) : rows.length === 0 ? (
              <NoMatchesRow query={trimmed} onSubmit={() => submit(query)} />
            ) : (
              <>
                {datasets.length > 0 ? (
                  <Section
                    title="Datasets"
                    viewAllHref={`/search?q=${encodeURIComponent(trimmed)}`}
                    viewAllLabel="View all dataset matches"
                  >
                    <ul className="flex flex-col">
                      {datasets.slice(0, PER_SECTION).map((d, i) => {
                        const idx = datasetRowStart + i
                        return (
                          <DatasetSuggestionRow
                            key={d.slug}
                            suggestion={d}
                            active={idx === activeIndex}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() =>
                              navigateRow({ kind: "dataset", data: d })
                            }
                          />
                        )
                      })}
                    </ul>
                  </Section>
                ) : null}

                {models.length > 0 ? (
                  <Section
                    title="Models"
                    viewAllHref={`/models?search=${encodeURIComponent(trimmed)}`}
                    viewAllLabel="View all model matches"
                  >
                    <ul className="flex flex-col">
                      {models.slice(0, PER_SECTION).map((m, i) => {
                        const idx = modelRowStart + i
                        return (
                          <ModelSuggestionRow
                            key={m.slug}
                            model={m}
                            active={idx === activeIndex}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() =>
                              navigateRow({ kind: "model", data: m })
                            }
                          />
                        )
                      })}
                    </ul>
                  </Section>
                ) : null}
              </>
            )}
            <Footer query={trimmed} onSubmit={() => submit(query)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
})

// --------------------------------------------------------------------------
// Section + row pieces
// --------------------------------------------------------------------------

function Section({
  title,
  viewAllHref,
  viewAllLabel,
  children,
}: {
  title: string
  viewAllHref: string
  viewAllLabel: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-1 last:mb-0">
      <div className="text-tertiary text-micro flex items-center justify-between px-3 pb-1 pt-2 font-mono uppercase tracking-widest">
        <span>{title}</span>
        <Link
          href={viewAllHref}
          className="hover:text-primary inline-flex items-center transition-colors normal-case tracking-normal"
        >
          {viewAllLabel} →
        </Link>
      </div>
      {children}
    </section>
  )
}

function DatasetSuggestionRow({
  suggestion,
  active,
  onClick,
  onMouseEnter,
}: {
  suggestion: DatasetSuggestion
  active: boolean
  onClick: () => void
  onMouseEnter: () => void
}) {
  const Icon =
    MODALITY_ICONS[suggestion.modality as Modality] ?? MODALITY_ICONS.other
  return (
    <li
      role="option"
      aria-selected={active}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-colors",
        active ? "bg-elevated" : "hover:bg-elevated"
      )}
    >
      <Icon className="text-accent size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="text-primary text-body truncate font-medium">
          {suggestion.name}
        </div>
        <div className="text-tertiary text-micro line-clamp-1">
          {suggestion.description}
        </div>
      </div>
      <Badge variant="neutral" className="shrink-0 capitalize">
        {String(suggestion.sourcePlatform).replace(/_/g, " ")}
      </Badge>
    </li>
  )
}

const MODEL_ACCESS_BADGE: Record<
  ModelAccessType,
  "default" | "neutral" | "warn" | "success"
> = {
  "open-weights": "default",
  "open-source": "success",
  "commercial-api": "warn",
  "closed-weights": "neutral",
}

function ModelSuggestionRow({
  model,
  active,
  onClick,
  onMouseEnter,
}: {
  model: Model
  active: boolean
  onClick: () => void
  onMouseEnter: () => void
}) {
  return (
    <li
      role="option"
      aria-selected={active}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 transition-colors",
        active ? "bg-elevated" : "hover:bg-elevated"
      )}
    >
      <Cpu className="text-accent size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="text-primary text-body truncate font-medium">
          {model.name}
        </div>
        <div className="text-tertiary text-micro line-clamp-1">
          {model.organization ?? "Independent"} ·{" "}
          {model.shortDescription}
        </div>
      </div>
      <Badge variant={MODEL_ACCESS_BADGE[model.accessType]} className="shrink-0">
        {model.accessType.replace(/-/g, " ")}
      </Badge>
    </li>
  )
}

function SkeletonRows() {
  return (
    <ul className="flex flex-col">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 rounded-md px-3 py-2.5">
          <Shimmer className="size-4 rounded" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Shimmer className="h-4 w-2/3 rounded" />
            <Shimmer className="h-3 w-4/5 rounded" />
          </div>
          <Shimmer className="h-5 w-16 rounded-full" />
        </li>
      ))}
    </ul>
  )
}

function NoMatchesRow({
  query,
  onSubmit,
}: {
  query: string
  onSubmit: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSubmit}
      className="hover:bg-elevated text-secondary text-caption flex w-full items-center justify-between rounded-md px-3 py-2.5 transition-colors"
    >
      <span>
        No matches for{" "}
        <span className="text-primary font-medium">&ldquo;{query}&rdquo;</span>
      </span>
      <span className="text-tertiary text-micro font-mono uppercase tracking-wider">
        Press ↵ to search anyway
      </span>
    </button>
  )
}

function Footer({
  query,
  onSubmit,
}: {
  query: string
  onSubmit: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSubmit}
      className="border-subtle text-text-secondary hover:text-primary text-caption mt-2 flex w-full items-center justify-between border-t px-3 py-1.5 pt-2 text-left transition-colors"
    >
      <span>
        Press ↵ to search for{" "}
        <span className="text-primary font-medium">&ldquo;{query}&rdquo;</span>
      </span>
    </button>
  )
}
