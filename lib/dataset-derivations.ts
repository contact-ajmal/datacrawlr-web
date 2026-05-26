import type { Dataset, Modality } from "@/lib/types"

export function deriveInsights(d: Dataset): string[] {
  const out: string[] = []
  if (d.quality >= 85) out.push("Above-average curation quality")
  if (d.size.rows >= 100_000_000) out.push("Sized for full pretraining runs")
  else if (d.size.rows < 100_000) out.push("Best for fine-tuning, not pretraining")
  if (
    d.license.includes("NC") ||
    d.license.toLowerCase() === "custom" ||
    d.license.toLowerCase().includes("proprietary")
  )
    out.push("License blocks commercial use without review")
  if (d.warnings.some((w) => w.level === "danger"))
    out.push("Documented compliance risk — read warnings")
  if (d.warnings.some((w) => /pii|personal/i.test(w.body)))
    out.push("May contain personal data")
  if (d.modality === "multimodal")
    out.push("Multimodal — confirm every modality is needed")
  if ((d.citations?.length ?? 0) >= 3)
    out.push("Well-cited in published research")
  if (d.popularity >= 80) out.push("Widely adopted across teams")
  if (d.popularity < 40 && d.quality >= 75)
    out.push("Underrated relative to its quality score")
  return out.slice(0, 4)
}

export function syntheticCreatedDate(slug: string, lastUpdated: string): string {
  let hash = 0
  for (const c of slug) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  const months = 12 + (hash % 48)
  const d = new Date(lastUpdated)
  d.setMonth(d.getMonth() - months)
  return d.toISOString().slice(0, 10)
}

export function paddedAISummary(d: Dataset): string {
  const base = d.aiSummary
  const sizeNote =
    d.size.rows >= 100_000_000
      ? `At ${formatLargeRows(d.size.rows)} rows, this is a foundation-scale dataset — most teams will only sample from it during fine-tuning.`
      : d.size.rows >= 1_000_000
        ? `Its ${formatLargeRows(d.size.rows)}-row footprint makes it tractable for a single-GPU fine-tune yet large enough to avoid trivial overfitting.`
        : `With ${formatLargeRows(d.size.rows)} rows, treat it as an evaluation or domain-adaptation set — not a pretraining base.`

  const licenseNote =
    d.license.toLowerCase() === "mit" ||
    d.license.toLowerCase().startsWith("apache") ||
    d.license.toLowerCase() === "cc0-1.0" ||
    d.license.toLowerCase() === "cc-by-4.0"
      ? `License (${d.license}) is permissive enough for commercial training in most jurisdictions; attribution is the only practical obligation.`
      : `License (${d.license}) is restrictive — clear redistribution and downstream-model obligations with legal before committing to a production training run.`

  return [base, sizeNote, licenseNote].join("\n\n")
}

function formatLargeRows(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export interface SubModalityShare {
  modality: Modality
  share: number
}

export function syntheticSubModalities(d: Dataset): SubModalityShare[] {
  if (d.modality !== "multimodal") return []
  let h = 0
  for (const c of d.slug) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const candidates: Modality[] = ["text", "image", "audio", "video", "tabular"]
  const subs: Modality[] = []
  for (let i = 0; i < candidates.length && subs.length < 3; i++) {
    if ((h >> i) & 1 || subs.length < 2) subs.push(candidates[i])
  }
  // weights derived from hash, normalized
  const raw = subs.map((_, i) => 30 + ((h >> (i * 3)) & 7) * 8)
  const total = raw.reduce((a, b) => a + b, 0)
  return subs.map((m, i) => ({ modality: m, share: raw[i] / total }))
}

export function relatedScore(d: Dataset, index: number): number {
  // bell-shaped descent, anchored to the related's own quality
  const base = Math.round(d.quality * 0.55 + d.popularity * 0.4)
  return Math.max(55, Math.min(99, base - index * 4))
}

export function tagFrequencies(tags: string[]): { tag: string; weight: number }[] {
  // synthesize a deterministic weight per tag (12-20px font scale upstream)
  const weights = tags.map((t) => {
    let h = 0
    for (const c of t) h = (h * 31 + c.charCodeAt(0)) >>> 0
    return { tag: t, weight: 0.4 + ((h % 7) / 10) }
  })
  return weights
}
