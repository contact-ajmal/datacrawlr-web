"use client"

import { useState } from "react"
import { Lightbulb, RefreshCw, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { StreamingText } from "@/components/ai/StreamingText"
import { HeroCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface DatasetAISummaryProps {
  summary: string
  insights: string[]
}

export function DatasetAISummary({ summary, insights }: DatasetAISummaryProps) {
  const paragraphs = summary
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <HeroCard>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Badge variant="default" className="gap-1.5">
          <Sparkles className="size-3" aria-hidden="true" />
          AI Summary
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast("Refreshed")}
        >
          <RefreshCw className="size-3.5" aria-hidden="true" />
          Regenerate
        </Button>
      </header>

      <div className="text-primary text-body space-y-4 leading-relaxed">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={i > activeIdx ? "text-tertiary opacity-50" : undefined}
          >
            {i <= activeIdx ? (
              <StreamingText
                text={p}
                speed={55}
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

      {insights.length > 0 ? (
        <footer className="border-subtle mt-6 border-t pt-4">
          <div className="text-tertiary text-caption mb-3 font-semibold uppercase tracking-wider">
            Key insights
          </div>
          <div className="flex flex-wrap gap-2">
            {insights.map((insight) => (
              <Badge
                key={insight}
                variant="neutral"
                className="gap-1.5 normal-case"
              >
                <Lightbulb
                  className="text-accent size-3"
                  aria-hidden="true"
                />
                <span>{insight}</span>
              </Badge>
            ))}
          </div>
        </footer>
      ) : null}
    </HeroCard>
  )
}
