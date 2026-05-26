"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Share2,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MODALITY_ICONS } from "@/lib/modality-icons"
import { useSaved } from "@/lib/stores/saved"
import type { Dataset } from "@/lib/types"
import { formatBytes, formatNumber } from "@/lib/utils"

const MODALITY_LABEL: Record<Dataset["modality"], string> = {
  text: "Text",
  image: "Image",
  audio: "Audio",
  video: "Video",
  tabular: "Tabular",
  multimodal: "Multimodal",
  graph: "Graph",
  time_series: "Time series",
  other: "Other",
}

interface DatasetHeroProps {
  dataset: Dataset
}

export function DatasetHero({ dataset }: DatasetHeroProps) {
  const Icon = MODALITY_ICONS[dataset.modality]
  const ids = useSaved((s) => s.ids)
  const toggle = useSaved((s) => s.toggle)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const saved = mounted && ids.includes(dataset.slug)

  const onToggleSave = () => {
    toggle(dataset.slug)
    const nextSaved = useSaved.getState().ids.includes(dataset.slug)
    toast(nextSaved ? "Dataset saved" : "Removed from saved", {
      action: {
        label: "Undo",
        onClick: () => toggle(dataset.slug),
      },
    })
  }

  const onShare = async () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : `https://datacrawlr.dev/datasets/${dataset.slug}`
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        toast("Copied link")
      } else {
        toast("Copy not supported in this browser")
      }
    } catch {
      toast("Couldn't copy — try again")
    }
  }

  const primarySource = dataset.sources[0]

  return (
    <header className="border-subtle border-b py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <nav
          aria-label="Breadcrumb"
          className="text-tertiary text-caption flex flex-wrap items-center gap-1.5"
        >
          <Link
            href="/"
            className="hover:text-secondary transition-colors"
          >
            Datasets
          </Link>
          <span className="text-tertiary opacity-60">/</span>
          <Link
            href={`/search?modality=${dataset.modality}`}
            className="hover:text-secondary transition-colors"
          >
            {MODALITY_LABEL[dataset.modality]}
          </Link>
          <span className="text-tertiary opacity-60">/</span>
          <span className="text-secondary truncate" aria-current="page">
            {dataset.name}
          </span>
        </nav>

        <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:gap-8">
          <div className="flex-1">
            <h1 className="text-h1 font-semibold tracking-tight">
              {dataset.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="neutral" className="gap-1.5">
                <Icon className="size-3" aria-hidden="true" />
                {MODALITY_LABEL[dataset.modality]}
              </Badge>
              <Badge variant="neutral">
                {formatNumber(dataset.size.rows)} rows
              </Badge>
              <Badge variant="neutral">
                {formatBytes(dataset.size.bytes)}
              </Badge>
              <Badge variant="neutral">{dataset.license}</Badge>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSave}
              aria-pressed={mounted ? saved : undefined}
              aria-label={saved ? "Remove from saved" : "Save dataset"}
            >
              {mounted && saved ? (
                <BookmarkCheck className="text-accent size-4" />
              ) : (
                <Bookmark className="size-4" />
              )}
              {mounted && saved ? "Saved" : "Save"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShare}
              aria-label="Copy link"
            >
              <Share2 className="size-4" />
              Share
            </Button>
            {primarySource ? (
              <Button
                asChild
                size="sm"
                aria-label={`Open dataset on ${primarySource.provider}`}
              >
                <a
                  href={primarySource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4" />
                  Open source
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        <p className="text-secondary text-lead mt-6 max-w-3xl">
          {dataset.description}
        </p>
      </div>
    </header>
  )
}
