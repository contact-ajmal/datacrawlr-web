"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Compass } from "lucide-react"

import { LineageGraph } from "@/components/dataset/LineageGraph"
import { Button } from "@/components/ui/button"
import { getGraph } from "@/lib/data"
import type { GraphEdge, GraphNode } from "@/lib/types"

interface LineageTabProps {
  slug: string
  focusId: string
}

const LEGEND: { kind: string; label: string; color: string }[] = [
  { kind: "derived", label: "Derived from", color: "var(--accent)" },
  { kind: "similar", label: "Similar to", color: "var(--border-strong)" },
  { kind: "benchmark", label: "Benchmarked against", color: "var(--warn)" },
  { kind: "cites", label: "Cites", color: "var(--text-tertiary)" },
]

export function LineageTab({ slug, focusId }: LineageTabProps) {
  const [graph, setGraph] = useState<{
    nodes: GraphNode[]
    edges: GraphEdge[]
  } | null>(null)

  useEffect(() => {
    let active = true
    getGraph(slug)
      .then((g) => {
        if (active) setGraph(g)
      })
      .catch(() => {
        if (active) setGraph({ nodes: [], edges: [] })
      })
    return () => {
      active = false
    }
  }, [slug])

  return (
    <div>
      <div className="bg-elevated border-subtle relative h-[500px] overflow-hidden rounded-xl border">
        {graph ? (
          <LineageGraph
            focusId={focusId}
            nodes={graph.nodes}
            edges={graph.edges}
          />
        ) : (
          <div className="text-tertiary text-caption flex h-full items-center justify-center">
            Loading lineage…
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {LEGEND.map((item) => (
          <span
            key={item.kind}
            className="text-tertiary text-micro inline-flex items-center gap-2 font-mono"
          >
            <span
              aria-hidden="true"
              className="block h-[2px] w-6 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <Button asChild variant="outline" size="sm">
          <Link href={`/explore?focus=${slug}`}>
            <Compass className="size-3.5" aria-hidden="true" />
            Open full constellation
          </Link>
        </Button>
      </div>
    </div>
  )
}
