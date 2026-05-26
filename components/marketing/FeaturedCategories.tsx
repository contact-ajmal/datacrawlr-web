import Link from "next/link"
import {
  Activity,
  FileText,
  Gamepad2,
  GitBranch,
  Image as ImageIcon,
  Layers,
  Mic,
  Table,
  type LucideIcon,
} from "lucide-react"

import { HeroCard } from "@/components/shared/Cards"

interface Category {
  title: string
  count: number
  icon: LucideIcon
  href: string
}

const CATEGORIES: Category[] = [
  { title: "NLP", count: 23, icon: FileText, href: "/search?modality=text" },
  { title: "Computer Vision", count: 18, icon: ImageIcon, href: "/search?modality=image" },
  { title: "Audio & Speech", count: 12, icon: Mic, href: "/search?modality=audio" },
  { title: "Tabular", count: 14, icon: Table, href: "/search?modality=tabular" },
  { title: "Multimodal", count: 19, icon: Layers, href: "/search?modality=multimodal" },
  { title: "Reinforcement Learning", count: 7, icon: Gamepad2, href: "/search?domain=reinforcement-learning" },
  { title: "Time Series", count: 11, icon: Activity, href: "/search?domain=time-series" },
  { title: "Graph", count: 6, icon: GitBranch, href: "/search?domain=graph" },
]

export function FeaturedCategories() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-h2 font-semibold tracking-tight">Browse by domain</h2>
        <p className="text-secondary text-lead mt-2">
          Eight domains, hand-curated.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ title, count, icon: Icon, href }) => (
            <Link
              key={title}
              href={href}
              className="block transition-transform duration-150 hover:-translate-y-0.5"
            >
              <HeroCard className="h-full">
                <div className="flex flex-col gap-1">
                  <Icon className="text-accent size-8" aria-hidden="true" />
                  <div className="text-h4 mt-4 font-semibold">{title}</div>
                  <div className="text-tertiary text-caption">
                    {count} datasets
                  </div>
                </div>
              </HeroCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
