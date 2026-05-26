"use client"

import { useState } from "react"
import { ChevronDown, ExternalLink } from "lucide-react"

import { StandardCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SOURCE_ICON, SOURCE_LABEL } from "@/lib/source-icons"
import type { Source } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SourcesTabProps {
  sources: Source[]
}

export function SourcesTab({ sources }: SourcesTabProps) {
  return (
    <div className="space-y-6">
      <ul className="space-y-3">
        {sources.map((source, i) => (
          <li key={source.url}>
            <SourceRow source={source} primary={i === 0} />
          </li>
        ))}
      </ul>
      <IndexingExplainer />
    </div>
  )
}

function SourceRow({
  source,
  primary,
}: {
  source: Source
  primary: boolean
}) {
  const Icon = SOURCE_ICON[source.provider]
  return (
    <StandardCard className="hover:translate-y-0 hover:bg-elevated">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="bg-overlay text-accent inline-flex size-12 shrink-0 items-center justify-center rounded-full">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-primary text-body truncate font-medium">
              {source.title}
            </span>
            {primary ? <Badge variant="default">primary</Badge> : null}
          </div>
          <div className="text-tertiary text-caption mt-0.5 max-w-xl truncate font-mono">
            {source.url}
          </div>
          <div className="text-tertiary text-micro mt-1 font-mono uppercase tracking-wider">
            {SOURCE_LABEL[source.provider]}
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={source.url} target="_blank" rel="noopener noreferrer">
            Open
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </Button>
      </div>
    </StandardCard>
  )
}

function IndexingExplainer() {
  const [open, setOpen] = useState(false)
  return (
    <StandardCard className="hover:translate-y-0 hover:bg-elevated">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="-m-1 flex w-full items-start gap-3 rounded p-1 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="text-primary text-body font-semibold">
            How we indexed this
          </div>
          <p className="text-secondary text-caption mt-1">
            A short rundown of how Datacrawlr collected, deduped, and embedded
            this dataset.
          </p>
        </div>
        <ChevronDown
          className={cn(
            "text-tertiary mt-1 size-4 shrink-0 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div className="text-secondary text-caption border-subtle mt-4 space-y-3 border-t pt-4 leading-relaxed">
          <p>
            Datacrawlr crawls each registered source on an hourly cadence,
            normalizing dataset metadata into a single shape. For this entry, we
            pulled the canonical record from the primary source, then enriched
            it with mirrored references found across the other listed providers
            so attribution and licensing stay traceable.
          </p>
          <p>
            Records pass a deduplication step keyed on a triple of (canonical
            URL, content hash, semantic embedding). Schema fields are extracted
            from sample manifests and verified against published documentation
            when available, then surfaced under the Schema tab with type and
            nullability inferred from the source.
          </p>
          <p>
            Finally, every dataset is embedded with a multi-vector model that
            captures name, description, modality, and tag signals. Those
            embeddings drive both semantic search and the lineage graph you see
            on the Lineage tab — derived, similar, benchmark, and citation
            relationships are all computed from this index.
          </p>
        </div>
      ) : null}
    </StandardCard>
  )
}
