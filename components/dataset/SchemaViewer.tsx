"use client"

import { useMemo, useState } from "react"
import { FileQuestion, Search } from "lucide-react"

import { EmptyState } from "@/components/shared/EmptyState"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { SchemaField } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SchemaViewerProps {
  schema: SchemaField[] | undefined
}

export function SchemaViewer({ schema }: SchemaViewerProps) {
  const [query, setQuery] = useState("")
  const safeSchema = useMemo(() => schema ?? [], [schema])

  const stats = useMemo(() => {
    const total = safeSchema.length
    const nullable = safeSchema.filter((f) => f.nullable === true).length
    const categorical = safeSchema.filter((f) =>
      /^enum/i.test(f.type.trim())
    ).length
    return { total, nullable, categorical }
  }, [safeSchema])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return safeSchema
    return safeSchema.filter((f) => f.name.toLowerCase().includes(q))
  }, [safeSchema, query])

  if (safeSchema.length === 0) {
    return (
      <EmptyState
        icon={FileQuestion}
        title="Schema not extracted yet"
        description="We'll re-index this dataset and add its schema in the next sweep."
      />
    )
  }

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="text-secondary text-caption">
          <span className="text-primary font-medium">{stats.total}</span>{" "}
          fields ·{" "}
          <span className="text-primary font-medium">{stats.nullable}</span>{" "}
          nullable ·{" "}
          <span className="text-primary font-medium">
            {stats.categorical}
          </span>{" "}
          categorical
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            className="text-tertiary pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter fields by name…"
            aria-label="Filter schema fields"
            className="pl-9"
          />
        </div>
      </div>

      <ul className="mt-6 space-y-2">
        {filtered.length === 0 ? (
          <li className="text-tertiary text-caption px-4 py-6 text-center">
            No fields match &ldquo;{query}&rdquo;.
          </li>
        ) : (
          filtered.map((field) => <SchemaRow key={field.name} field={field} />)
        )}
      </ul>
    </div>
  )
}

function SchemaRow({ field }: { field: SchemaField }) {
  const typeClass = typeColorClass(field.type)
  const useDefault = typeClass === ""
  const isNullable = field.nullable === true

  return (
    <li
      className={cn(
        "hover:bg-overlay grid items-center gap-4 rounded-md border-l-2 border-transparent px-4 py-3 transition-all",
        "hover:border-accent",
        "grid-cols-[160px_120px_1fr_auto] sm:grid-cols-[200px_140px_1fr_auto]"
      )}
    >
      <div className="text-primary truncate font-mono text-caption">
        {field.name}
      </div>
      <div>
        <Badge
          variant={useDefault ? "default" : "neutral"}
          className={cn("font-mono normal-case", typeClass)}
        >
          {field.type}
        </Badge>
      </div>
      <div className="text-secondary text-caption truncate">
        {field.description ?? "—"}
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            tabIndex={0}
            aria-label={isNullable ? "Nullable" : "Required"}
            className={cn(
              "inline-block size-2 rounded-full",
              isNullable ? "bg-accent" : "border-strong border bg-transparent"
            )}
          />
        </TooltipTrigger>
        <TooltipContent>{isNullable ? "Nullable" : "Required"}</TooltipContent>
      </Tooltip>
    </li>
  )
}

function typeColorClass(type: string): string {
  const t = type.toLowerCase().trim()
  if (t === "bool" || t === "boolean")
    return "bg-violet-500/10 text-violet-400 border-violet-500/20"
  if (t === "timestamp" || t === "date" || t === "datetime")
    return "bg-pink-500/10 text-pink-400 border-pink-500/20"
  if (/^int|^number/.test(t))
    return "bg-lime-500/10 text-lime-400 border-lime-500/20"
  if (/^float|^decimal/.test(t))
    return "bg-orange-500/10 text-orange-400 border-orange-500/20"
  if (/^list|^array|^object|^enum/.test(t))
    return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
  // string, markdown, fallback → use Badge default (cyan)
  return ""
}
