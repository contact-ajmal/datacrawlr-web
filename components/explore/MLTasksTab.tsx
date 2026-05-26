import Link from "next/link"
import { ExternalLink, Sparkles } from "lucide-react"

import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart"
import { HeroCard, StandardCard, WhisperCard } from "@/components/shared/Cards"
import { Badge } from "@/components/ui/badge"
import type { MLTaskStat } from "@/lib/api-client"
import { formatNumber } from "@/lib/utils"

interface MLTasksTabProps {
  tasks: MLTaskStat[]
}

interface Benchmark {
  name: string
  task: string
  domain: string
  blurb: string
  href: string
}

// Hand-picked benchmarks that most ML engineers recognise. The href points at
// our own /search?q=… for the dataset name — keeps the destination on-site
// even when the canonical dataset slug shape changes per source.
const BENCHMARKS: Benchmark[] = [
  {
    name: "GLUE",
    task: "NLU benchmark suite",
    domain: "NLP",
    blurb:
      "Nine classification and inference tasks bundled together — the standard yardstick for general-purpose text encoders.",
    href: "/search?q=glue",
  },
  {
    name: "ImageNet",
    task: "Image classification",
    domain: "Computer Vision",
    blurb:
      "1.4M images across 1,000 categories. Still the reference benchmark for vision backbones a decade after launch.",
    href: "/search?q=imagenet",
  },
  {
    name: "COCO",
    task: "Detection + segmentation",
    domain: "Computer Vision",
    blurb:
      "Common Objects in Context. The canonical evaluation for object detection, instance segmentation, and image captioning.",
    href: "/search?q=coco",
  },
  {
    name: "SQuAD",
    task: "Extractive QA",
    domain: "NLP",
    blurb:
      "100K+ crowdsourced reading-comprehension questions over Wikipedia paragraphs. Standard for span-based QA.",
    href: "/search?q=squad",
  },
] as const

export function MLTasksTab({ tasks }: MLTasksTabProps) {
  const sorted = tasks.slice().sort((a, b) => b.count - a.count)

  return (
    <div className="flex flex-col gap-10">
      <section>
        <HeroCard className="p-8">
          <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
            What can you train?
          </p>
          <div className="prose mt-4 max-w-3xl">
            <p className="text-secondary text-body">
              ML task is the <em>shape of the problem</em> a dataset is built
              to solve — classification, regression, generation, translation,
              segmentation, and so on. We classify each dataset by its likely
              tasks based on its schema, tags, and labels.
            </p>
            <p className="text-secondary text-body mt-4">
              This view groups the catalog by task so you can answer the
              question: <em>What datasets exist for training a [task]
              model?</em>
            </p>
          </div>
        </HeroCard>
      </section>

      <section>
        <div className="mb-6">
          <h3 className="text-h3 font-semibold tracking-tight">
            All ML tasks
          </h3>
          <p className="text-secondary text-caption mt-1">
            Dataset count per task category, normalized from tags + schema.
          </p>
        </div>
        <WhisperCard className="p-8">
          <HorizontalBarChart
            data={sorted.map((t) => ({ label: t.task, value: t.count }))}
            maxBars={20}
          />
        </WhisperCard>
      </section>

      <section>
        <div className="mb-6">
          <h3 className="text-h3 font-semibold tracking-tight">
            Jump to a task
          </h3>
          <p className="text-secondary text-caption mt-1">
            Click any task to filter the catalog by it.
          </p>
        </div>
        {sorted.length === 0 ? (
          <p className="text-tertiary text-caption">
            No task data available yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sorted.map((t, i) => (
              <Link
                key={t.task}
                href={`/search?ml_task=${encodeURIComponent(t.task)}`}
              >
                <Badge
                  variant={i < 5 ? "default" : "neutral"}
                  className="hover:border-strong cursor-pointer px-4 py-2 text-caption capitalize"
                >
                  <span>{t.task.replace(/_/g, " ")}</span>
                  <span className="text-tertiary ml-2 font-mono">
                    · {formatNumber(t.count)}
                  </span>
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="text-accent size-4" aria-hidden="true" />
          <h3 className="text-h3 font-semibold tracking-tight">
            Featured benchmarks
          </h3>
        </div>
        <p className="text-secondary text-caption mb-6 -mt-4">
          Reference datasets every ML engineer should know.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          {BENCHMARKS.map((b) => (
            <StandardCard key={b.name} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-tertiary text-micro font-mono uppercase tracking-widest">
                    {b.domain}
                  </p>
                  <h4 className="text-h4 mt-1 font-semibold">{b.name}</h4>
                </div>
                <Badge variant="neutral" className="shrink-0">
                  {b.task}
                </Badge>
              </div>
              <p className="text-secondary text-caption mt-3">{b.blurb}</p>
              <Link
                href={b.href}
                className="text-accent text-caption hover:text-accent-hover mt-4 inline-flex items-center gap-1 underline-offset-4 hover:underline"
              >
                Find on Datacrawlr
                <ExternalLink className="size-3" aria-hidden="true" />
              </Link>
            </StandardCard>
          ))}
        </div>
      </section>
    </div>
  )
}
