import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ModelsPaginationProps {
  page: number
  pageSize: number
  total: number
  /**
   * Current URL search params. We rebuild the link href off the same
   * params so existing filter pills survive the page switch.
   */
  searchParams: Record<string, string | string[] | undefined>
  /**
   * Page-route base — set when this pager renders for a different
   * URL than ``/models`` (e.g. a leaderboard sub-route). Defaults to
   * ``/models``.
   */
  basePath?: string
}

/**
 * Numbered page bar for the models list.
 *
 * Server-component-friendly: uses ``<Link>`` so the page index is
 * just a URL change, no client-side state. Layout mirrors
 * :class:`SearchPagination` so the two surfaces feel identical.
 */
export function ModelsPagination({
  page,
  pageSize,
  total,
  searchParams,
  basePath = "/models",
}: ModelsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  const pages = pageWindow(page, totalPages)
  const startIdx = (page - 1) * pageSize + 1
  const endIdx = Math.min(total, page * pageSize)

  const hrefFor = (target: number) => {
    const params = new URLSearchParams()
    for (const [k, raw] of Object.entries(searchParams)) {
      if (raw === undefined || k === "page") continue
      if (Array.isArray(raw)) {
        for (const v of raw) if (v !== undefined) params.append(k, v)
      } else {
        params.set(k, raw)
      }
    }
    if (target > 1) params.set("page", String(target))
    const qs = params.toString()
    return `${basePath}${qs ? `?${qs}` : ""}`
  }

  return (
    <nav
      role="navigation"
      aria-label="Models results pagination"
      className="border-subtle mt-8 flex flex-col items-center gap-3 border-t pt-6 sm:flex-row sm:justify-between"
    >
      <p className="text-tertiary text-caption">
        Showing{" "}
        <span className="text-primary font-medium">{startIdx.toLocaleString()}</span>
        –<span className="text-primary font-medium">{endIdx.toLocaleString()}</span>{" "}
        of{" "}
        <span className="text-primary font-medium">{total.toLocaleString()}</span>
      </p>

      <div className="flex items-center gap-1">
        {page > 1 ? (
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link
              href={hrefFor(page - 1)}
              aria-label="Previous page"
              prefetch={false}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Previous</span>
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" disabled className="gap-1">
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
        )}

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              aria-hidden="true"
              className="text-tertiary px-2 text-caption"
            >
              …
            </span>
          ) : p === page ? (
            <Button
              key={p}
              variant="secondary"
              size="sm"
              aria-current="page"
              aria-label={`Page ${p}`}
              disabled
              className={cn("min-w-9 px-2 tabular-nums pointer-events-none")}
            >
              {p}
            </Button>
          ) : (
            <Button
              key={p}
              asChild
              variant="ghost"
              size="sm"
              className="min-w-9 px-2 tabular-nums"
            >
              <Link
                href={hrefFor(p)}
                aria-label={`Page ${p}`}
                prefetch={false}
              >
                {p}
              </Link>
            </Button>
          )
        )}

        {page < totalPages ? (
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link
              href={hrefFor(page + 1)}
              aria-label="Next page"
              prefetch={false}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" disabled className="gap-1">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </nav>
  )
}

/**
 * Compact page list: first, last, current ±1, with "…" filling the gaps.
 *
 * Mirrors ``SearchPagination::pageWindow`` so the two pagers behave
 * identically on the same total / current pair.
 */
function pageWindow(current: number, total: number): Array<number | "…"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const set = new Set<number>([1, total, current - 1, current, current + 1])
  const pages = Array.from(set)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)
  const out: Array<number | "…"> = []
  for (let i = 0; i < pages.length; i++) {
    out.push(pages[i])
    const next = pages[i + 1]
    if (next !== undefined && next - pages[i] > 1) out.push("…")
  }
  return out
}
