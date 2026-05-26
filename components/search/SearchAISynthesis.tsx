"use client"

import { useState } from "react"
import { Sparkles, ThumbsDown, ThumbsUp, Wand2 } from "lucide-react"

import { StreamingText } from "@/components/ai/StreamingText"
import { HeroCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { SynthesisOutput } from "@/lib/synthesis"

interface SearchAISynthesisProps {
  synthesis: SynthesisOutput
  onCitationClick: (resultId: string) => void
}

export function SearchAISynthesis({
  synthesis,
  onCitationClick,
}: SearchAISynthesisProps) {
  const { paragraphs, citationIds } = synthesis
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <HeroCard className="mb-8">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Badge variant="default" className="gap-1.5">
          <Sparkles className="size-3" aria-hidden="true" />
          AI synthesis
        </Badge>
        {citationIds.length > 0 ? (
          <div className="text-tertiary text-micro flex items-center gap-2 font-mono">
            <span className="uppercase tracking-wider">Sources</span>
            {citationIds.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => onCitationClick(id)}
                className="text-accent hover:bg-accent/10 cursor-pointer rounded px-1 transition-colors"
                aria-label={`Jump to source ${i + 1}`}
              >
                [{i + 1}]
              </button>
            ))}
          </div>
        ) : null}
      </header>

      <div className="text-primary text-body space-y-4 leading-relaxed">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={i > activeIdx ? "text-tertiary opacity-60" : undefined}
          >
            {i <= activeIdx ? (
              <StreamingText
                text={p}
                speed={45}
                onComplete={() => {
                  if (i < paragraphs.length - 1)
                    setActiveIdx((prev) => Math.max(prev, i + 1))
                }}
              />
            ) : (
              p
            )}
          </p>
        ))}
      </div>

      <footer className="border-subtle mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
        <Button variant="ghost" size="sm">
          <Wand2 className="size-3.5" aria-hidden="true" />
          Refine answer
        </Button>
        <span className="ml-auto inline-flex items-center gap-2">
          <span className="text-tertiary text-caption">Was this helpful?</span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Mark helpful"
          >
            <ThumbsUp className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Mark not helpful"
          >
            <ThumbsDown className="size-3.5" aria-hidden="true" />
          </Button>
        </span>
      </footer>
    </HeroCard>
  )
}
