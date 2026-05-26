import type { SearchResult } from "@/lib/types"

export interface SynthesisOutput {
  paragraphs: string[]
  citationIds: string[]
}

function leadSentence(s: string): string {
  const i = s.indexOf(". ")
  if (i === -1) return s
  return s.slice(0, i + 1)
}

export function buildSynthesis(
  query: string,
  results: SearchResult[]
): SynthesisOutput {
  const top = results.slice(0, 3)
  const citationIds = top.map((r) => r.id)

  if (results.length === 0) {
    return {
      paragraphs: [
        `No datasets matched "${query || "your filters"}". Try relaxing the modality or license filters, or use broader terms.`,
      ],
      citationIds: [],
    }
  }

  const subject = query.trim() || "your scope"
  const modalitySet = new Set(top.map((r) => r.modality))
  const modalityList = Array.from(modalitySet).join(" + ")
  const names = top.map((r) => r.name)
  const licenses = Array.from(new Set(top.map((r) => r.license)))

  const p1 = `For "${subject}", the strongest match is ${names[0]} — ${leadSentence(top[0].aiSummary)} It leads on relevance among ${results.length} matching dataset${results.length === 1 ? "" : "s"} and the modality mix skews toward ${modalityList}.`

  const p2 = names[1]
    ? `${names[1]} is the obvious alternative. ${leadSentence(top[1].aiSummary)} ${
        names[2]
          ? `${names[2]} extends coverage with a different angle and is worth a side-by-side comparison before committing.`
          : "Consider it specifically when the first option's licensing or modality is a poor fit."
      }`
    : `Coverage is sparse for this query — broaden the wording or remove a filter to surface more candidates.`

  const p3 = `Licensing across the top results is ${licenses.join(", ")}. For commercial training, prefer permissive options (MIT, Apache-2.0, CC-BY-4.0); non-commercial or share-alike licenses can require legal review before deployment. Always verify size and update cadence against your training budget.`

  return {
    paragraphs: [p1, p2, p3],
    citationIds,
  }
}
