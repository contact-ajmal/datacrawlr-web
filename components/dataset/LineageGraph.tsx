"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import type { GraphEdge, GraphNode } from "@/lib/types"
import { cn } from "@/lib/utils"

interface LineageGraphProps {
  focusId: string
  nodes: GraphNode[]
  edges: GraphEdge[]
  maxNeighbors?: number
}

interface PositionedNode extends GraphNode {
  x: number
  y: number
  radius: number
  isFocus: boolean
}

const VIEWBOX_W = 800
const VIEWBOX_H = 500
const RING_RADIUS = 200

const EDGE_STYLE: Record<GraphEdge["kind"], { stroke: string; opacity: number }> = {
  derived: { stroke: "var(--accent)", opacity: 0.85 },
  similar: { stroke: "var(--border-strong)", opacity: 0.95 },
  benchmark: { stroke: "var(--warn)", opacity: 0.8 },
  cites: { stroke: "var(--text-tertiary)", opacity: 0.7 },
}

export function LineageGraph({
  focusId,
  nodes,
  edges,
  maxNeighbors = 10,
}: LineageGraphProps) {
  const router = useRouter()
  const [hoverId, setHoverId] = useState<string | null>(null)

  const layout = useMemo(() => {
    const focus = nodes.find((n) => n.id === focusId)
    if (!focus) return null

    const focusEdges = edges.filter(
      (e) => e.source === focusId || e.target === focusId
    )
    const neighborWeight = new Map<string, number>()
    for (const e of focusEdges) {
      const otherId = e.source === focusId ? e.target : e.source
      neighborWeight.set(otherId, (neighborWeight.get(otherId) ?? 0) + e.weight)
    }
    const neighbors = nodes
      .filter((n) => n.id !== focusId && neighborWeight.has(n.id))
      .sort(
        (a, b) =>
          (neighborWeight.get(b.id) ?? 0) - (neighborWeight.get(a.id) ?? 0)
      )
      .slice(0, maxNeighbors)

    const keepIds = new Set<string>([focusId, ...neighbors.map((n) => n.id)])

    const centerX = VIEWBOX_W / 2
    const centerY = VIEWBOX_H / 2
    const positioned: PositionedNode[] = [
      {
        ...focus,
        x: centerX,
        y: centerY,
        radius: 16,
        isFocus: true,
      },
      ...neighbors.map((n, i) => {
        const angle = (i / neighbors.length) * 2 * Math.PI - Math.PI / 2
        return {
          ...n,
          x: centerX + Math.cos(angle) * RING_RADIUS,
          y: centerY + Math.sin(angle) * RING_RADIUS,
          radius: scaleRadius(n.size),
          isFocus: false,
        }
      }),
    ]

    const positionById = new Map(positioned.map((p) => [p.id, p]))
    const visibleEdges = focusEdges.filter(
      (e) => keepIds.has(e.source) && keepIds.has(e.target)
    )

    return { positioned, positionById, edges: visibleEdges }
  }, [focusId, nodes, edges, maxNeighbors])

  if (!layout) {
    return (
      <div className="text-tertiary text-caption flex h-full items-center justify-center">
        No lineage data for this dataset.
      </div>
    )
  }

  const hoverNode = hoverId ? layout.positionById.get(hoverId) ?? null : null

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        role="img"
        aria-label="Dataset lineage graph"
      >
        <g>
          {layout.edges.map((e, idx) => {
            const a = layout.positionById.get(e.source)
            const b = layout.positionById.get(e.target)
            if (!a || !b) return null
            const style = EDGE_STYLE[e.kind]
            const isHover =
              hoverId === e.source || hoverId === e.target
            return (
              <line
                key={`edge-${idx}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={style.stroke}
                strokeOpacity={isHover ? 1 : style.opacity}
                strokeWidth={isHover ? 1.6 : 1}
                strokeLinecap="round"
              />
            )
          })}
        </g>
        <g>
          {layout.positioned.map((n) => {
            const isHover = hoverId === n.id
            return (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoverId(n.id)}
                onMouseLeave={() =>
                  setHoverId((curr) => (curr === n.id ? null : curr))
                }
                onClick={() => router.push(`/datasets/${n.slug}`)}
              >
                <circle
                  r={n.radius + 4}
                  fill="var(--bg-base)"
                  fillOpacity={n.isFocus ? 0 : 0.0}
                />
                <circle
                  r={n.radius}
                  fill={n.isFocus ? "var(--accent)" : "var(--bg-elevated)"}
                  stroke={
                    isHover || n.isFocus
                      ? "var(--accent)"
                      : "var(--border-strong)"
                  }
                  strokeWidth={isHover || n.isFocus ? 2 : 1}
                />
                <text
                  y={n.radius + 16}
                  textAnchor="middle"
                  className={cn(
                    "fill-current font-mono",
                    isHover || n.isFocus ? "text-primary" : "text-secondary"
                  )}
                  style={{
                    fontSize: 11,
                    color: isHover || n.isFocus
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                    fill: isHover || n.isFocus
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  }}
                >
                  {truncate(n.label, 28)}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
      {hoverNode ? (
        <div
          aria-hidden="true"
          className="bg-overlay border-subtle text-primary text-caption pointer-events-none absolute rounded-md border px-2.5 py-1.5 shadow-lg"
          style={{
            left: `calc(${(hoverNode.x / VIEWBOX_W) * 100}% + 8px)`,
            top: `calc(${(hoverNode.y / VIEWBOX_H) * 100}% - 12px)`,
          }}
        >
          <div className="font-medium">{hoverNode.label}</div>
          <div className="text-tertiary text-micro mt-0.5 font-mono">
            {hoverNode.modality} · click to open
          </div>
        </div>
      ) : null}
    </div>
  )
}

function scaleRadius(size: number): number {
  // popularity proxy via row-count log, mapped 8-14
  if (size <= 0) return 8
  const t = Math.min(1, Math.max(0, (Math.log10(size) - 3) / 7))
  return 8 + t * 6
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return `${s.slice(0, max - 1)}…`
}
