import { Sparkles } from "lucide-react"

import { HeroCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type { Dataset } from "@/lib/types"

interface CompareSynthesisProps {
  datasets: Dataset[]
}

function joinNames(names: string[]): string {
  if (names.length === 0) return ""
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  const last = names[names.length - 1]
  return `${names.slice(0, -1).join(", ")}, and ${last}`
}

function buildParagraphs(datasets: Dataset[]): string[] {
  if (datasets.length < 2) {
    return [
      "Add at least one more dataset to see a side-by-side breakdown of trade-offs.",
    ]
  }

  const names = datasets.map((d) => d.name)
  const list = joinNames(names)

  const largest = [...datasets].sort((a, b) => b.size.rows - a.size.rows)[0]
  const cleanest = [...datasets].sort((a, b) => b.quality - a.quality)[0]
  const restrictive = datasets.find(
    (d) =>
      /-NC|CC-BY-NC|CC-BY-SA|GPL|custom|proprietary/i.test(d.license) ||
      d.license.toLowerCase().includes("nc")
  )
  const permissive = datasets.find((d) =>
    /^MIT$|^Apache|^CC0|^CC-BY-4\.0$|^CC-BY-2\.0$|^ODC-BY/i.test(d.license)
  )

  const p1 = `Comparing ${list} surfaces meaningful trade-offs across modality, scale, and license posture. ${largest.name} is the largest at ${formatRows(largest.size.rows)} rows, while ${cleanest.name} leads on curation quality (${cleanest.quality}/100).`

  const p2 = restrictive
    ? `Pick ${cleanest.name} when curation matters more than raw scale, and reach for ${largest.name} when you need volume for pretraining-scale runs. Note that ${restrictive.name}'s license (${restrictive.license}) restricts commercial use without review${permissive ? `, whereas ${permissive.name} (${permissive.license}) is unambiguously permissive` : ""}.`
    : `Pick ${cleanest.name} when curation matters more than raw scale, and reach for ${largest.name} when you need volume for pretraining-scale runs. Licensing is broadly compatible across these candidates, so the choice comes down to fit and update cadence.`

  const p3 = `Verify license compatibility before mixing — combining permissive and Share-Alike sources is the most common gotcha when multi-sourcing for a training run. If you need only one, default to ${cleanest.name}; if you need breadth, sample from ${largest.name}.`

  return [p1, p2, p3]
}

function formatRows(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

export function CompareSynthesis({ datasets }: CompareSynthesisProps) {
  const paragraphs = buildParagraphs(datasets)

  return (
    <HeroCard>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Badge variant="default" className="gap-1.5">
          <Sparkles className="size-3" aria-hidden="true" />
          What&apos;s the difference?
        </Badge>
        <span className="text-tertiary text-micro font-mono uppercase tracking-wider">
          AI synthesis
        </span>
      </header>
      <div className="text-primary text-body space-y-4 leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </HeroCard>
  )
}
