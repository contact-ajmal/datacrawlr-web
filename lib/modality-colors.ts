import type { Modality } from "@/lib/types"

export const MODALITY_COLOR: Record<Modality, string> = {
  text: "#5EEAD4",
  image: "#A78BFA",
  audio: "#BEF264",
  video: "#F472B6",
  tabular: "#FBBF24",
  multimodal: "url(#modality-mix)",
  graph: "#60A5FA",
  time_series: "#FB923C",
  other: "#94A3B8",
}

// Solid swatch color for legends/checkboxes — multimodal needs a static stand-in
export const MODALITY_SWATCH: Record<Modality, string> = {
  text: "#5EEAD4",
  image: "#A78BFA",
  audio: "#BEF264",
  video: "#F472B6",
  tabular: "#FBBF24",
  multimodal: "linear-gradient(135deg, #5EEAD4 0%, #A78BFA 50%, #F472B6 100%)",
  graph: "#60A5FA",
  time_series: "#FB923C",
  other: "#94A3B8",
}

export const EDGE_COLOR: Record<"derived" | "similar" | "benchmark" | "cites", { stroke: string; opacity: number }> = {
  derived: { stroke: "var(--accent)", opacity: 0.6 },
  similar: { stroke: "var(--border-strong)", opacity: 0.4 },
  benchmark: { stroke: "var(--warn)", opacity: 0.5 },
  cites: { stroke: "var(--text-tertiary)", opacity: 0.3 },
}
