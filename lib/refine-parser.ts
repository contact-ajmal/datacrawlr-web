import type { Modality, SearchFilters, SourceProvider } from "@/lib/types"

export interface RefinementResult {
  newFilters: SearchFilters
  summary: string
  ok: boolean
}

const MODALITY_VALUES: Modality[] = [
  "text",
  "image",
  "audio",
  "video",
  "tabular",
  "multimodal",
  "graph",
  "time_series",
  "other",
]

const SOURCE_ALIASES: Record<string, SourceProvider> = {
  huggingface: "huggingface",
  "hugging face": "huggingface",
  hf: "huggingface",
  kaggle: "kaggle",
  github: "github",
  paper: "paper",
  papers: "paper",
  arxiv: "paper",
  blog: "blog",
  blogs: "blog",
}

// Permissive set used when the user asks to "exclude proprietary"
const NON_PROPRIETARY_LICENSES = [
  "MIT",
  "Apache-2.0",
  "CC-BY-4.0",
  "CC-BY-2.0",
  "CC-BY-SA-4.0",
  "CC-BY-SA-3.0",
  "CC0-1.0",
  "ODC-BY-1.0",
  "CC-BY-NC-4.0",
  "CC-BY-NC-SA-4.0",
]

const SIZE_UNITS: Record<string, number> = {
  k: 1_000,
  m: 1_000_000,
  b: 1_000_000_000,
}

function modalityFromInput(s: string): Modality | null {
  for (const m of MODALITY_VALUES) {
    if (s.includes(m)) return m
  }
  return null
}

export function parseRefinement(
  input: string,
  current: SearchFilters
): RefinementResult {
  const lower = input.toLowerCase().trim()
  if (!lower) {
    return {
      newFilters: current,
      summary: "Type a refinement and press send.",
      ok: false,
    }
  }

  // 1) Exclude proprietary / no proprietary
  if (/(exclude|no|not?|drop|skip)\s+(proprietary|custom)/.test(lower)) {
    return {
      newFilters: { ...current, license: NON_PROPRIETARY_LICENSES },
      summary:
        "Filtered to permissive + non-commercial open licenses (excludes Proprietary and Custom).",
      ok: true,
    }
  }

  // 2) Under <N>(K|M|B) [rows]
  const sizeMatch = lower.match(/under\s+(\d+(?:\.\d+)?)\s*([kmb])\b/)
  if (sizeMatch) {
    const n = parseFloat(sizeMatch[1])
    const unit = sizeMatch[2]
    const max = Math.round(n * SIZE_UNITS[unit])
    return {
      newFilters: { ...current, maxSize: max },
      summary: `Filtered: max size ${sizeMatch[1]}${unit.toUpperCase()} rows.`,
      ok: true,
    }
  }

  // 2b) Over / at least <N>(K|M|B) — sets minSize
  const minMatch = lower.match(
    /(over|at least|more than|min(?:imum)?)\s+(\d+(?:\.\d+)?)\s*([kmb])\b/
  )
  if (minMatch) {
    const n = parseFloat(minMatch[2])
    const unit = minMatch[3]
    const min = Math.round(n * SIZE_UNITS[unit])
    return {
      newFilters: { ...current, minSize: min },
      summary: `Filtered: min size ${minMatch[2]}${unit.toUpperCase()} rows.`,
      ok: true,
    }
  }

  // 3) Only <modality> / Just <modality>
  const onlyModalityMatch = lower.match(/(?:only|just)\s+([a-z]+)/)
  if (onlyModalityMatch) {
    const m = modalityFromInput(onlyModalityMatch[1])
    if (m) {
      return {
        newFilters: { ...current, modality: [m] },
        summary: `Filtered: only ${m} datasets.`,
        ok: true,
      }
    }
  }

  // 4) MIT only / Apache only / CC-BY only
  if (/\bmit\s+only\b/.test(lower) || /\bonly\s+mit\b/.test(lower)) {
    return {
      newFilters: { ...current, license: ["MIT"] },
      summary: "Filtered: license = MIT only.",
      ok: true,
    }
  }
  if (
    /\bapache\s+only\b/.test(lower) ||
    /\bonly\s+apache\b/.test(lower) ||
    /\bapache\s*-?\s*2\.0\s+only\b/.test(lower)
  ) {
    return {
      newFilters: { ...current, license: ["Apache-2.0"] },
      summary: "Filtered: license = Apache-2.0 only.",
      ok: true,
    }
  }
  if (/\bcc-?by\s+only\b/.test(lower)) {
    return {
      newFilters: { ...current, license: ["CC-BY-4.0", "CC-BY-2.0"] },
      summary: "Filtered: license = CC-BY only.",
      ok: true,
    }
  }

  // 5) From <source>
  const fromMatch = lower.match(/from\s+([a-z\s]+?)(?:\s+(?:only|please)|$|[.!,])/)
  if (fromMatch) {
    const candidate = fromMatch[1].trim()
    const source =
      SOURCE_ALIASES[candidate] ??
      Object.entries(SOURCE_ALIASES).find(([k]) => candidate.includes(k))?.[1]
    if (source) {
      return {
        newFilters: { ...current, source: [source] },
        summary: `Filtered: source = ${source}.`,
        ok: true,
      }
    }
  }

  // 6) High quality / quality > N
  const qMatch = lower.match(/quality\s*[>=≥]+\s*(\d+)/)
  if (qMatch) {
    const q = Math.min(100, Math.max(0, parseInt(qMatch[1], 10)))
    return {
      newFilters: { ...current, minQuality: q },
      summary: `Filtered: quality ≥ ${q}.`,
      ok: true,
    }
  }
  if (/\bhigh\s+quality\b/.test(lower)) {
    return {
      newFilters: { ...current, minQuality: 80 },
      summary: "Filtered: quality ≥ 80.",
      ok: true,
    }
  }

  // 7) Reset / clear
  if (/^(reset|clear|start over|undo all)/.test(lower)) {
    return {
      newFilters: {},
      summary: "Cleared all filters.",
      ok: true,
    }
  }

  return {
    newFilters: current,
    summary: "I'm not sure how to interpret that yet.",
    ok: false,
  }
}
