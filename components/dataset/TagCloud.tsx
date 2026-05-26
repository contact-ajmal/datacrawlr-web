import Link from "next/link"

import { tagFrequencies } from "@/lib/dataset-derivations"

interface TagCloudProps {
  tags: string[]
}

export function TagCloud({ tags }: TagCloudProps) {
  const topTags = tags.slice(0, 10)
  const weighted = tagFrequencies(topTags)

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
      {weighted.map(({ tag, weight }) => {
        const fontSize = 12 + Math.round(weight * 8)
        return (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="text-secondary hover:text-accent transition-colors"
            style={{ fontSize: `${fontSize}px` }}
          >
            {tag}
          </Link>
        )
      })}
    </div>
  )
}
