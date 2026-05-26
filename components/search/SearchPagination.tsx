"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchPaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

/**
 * Numbered page bar for the search results list.
 *
 * Layout: `[← Prev] [1] [2] … [n-1] [n] [Next →]`. The middle list is
 * windowed — always include the first and last page plus a 3-page
 * neighborhood around the current page. Gaps render as "…" placeholders
 * the user can't click; they just communicate that pages exist between.
 *
 * The component is dumb: it reports clicks via `onPageChange` and lets
 * the parent reconcile URL state, refetches, and scroll.
 */
export function SearchPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: SearchPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  const pages = pageWindow(page, totalPages)
  const startIdx = (page - 1) * pageSize + 1
  const endIdx = Math.min(total, page * pageSize)

  return (
    <nav
      role="navigation"
      aria-label="Search results pagination"
      className="border-subtle mt-6 flex flex-col items-center gap-3 border-t pt-6 sm:flex-row sm:justify-between"
    >
      <p className="text-muted text-sm">
        Showing <span className="text-default font-medium">{startIdx}</span>–
        <span className="text-default font-medium">{endIdx}</span> of{" "}
        <span className="text-default font-medium">{total.toLocaleString()}</span>
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          className="gap-1"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              aria-hidden="true"
              className="text-muted px-2 text-sm"
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "min-w-9 px-2 tabular-nums",
                p === page && "pointer-events-none"
              )}
            >
              {p}
            </Button>
          )
        )}

        <Button
          variant="ghost"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          className="gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}

/**
 * Compact page list: first, last, current ±1, with "…" filling the gaps.
 *
 * Examples (current=6, total=15) → [1, "…", 5, 6, 7, "…", 15].
 * For small page counts we just emit the whole range — no ellipses
 * unless they save space.
 */
function pageWindow(current: number, total: number): Array<number | "…"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const set = new Set<number>([1, total, current - 1, current, current + 1])
  const pages = Array.from(set).filter((p) => p >= 1 && p <= total).sort(
    (a, b) => a - b
  )

  const out: Array<number | "…"> = []
  for (let i = 0; i < pages.length; i++) {
    out.push(pages[i])
    const next = pages[i + 1]
    if (next !== undefined && next - pages[i] > 1) out.push("…")
  }
  return out
}
