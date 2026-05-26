"use client"

import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"

interface OpenAllLinksProps {
  slugs: string[]
}

export function OpenAllLinks({ slugs }: OpenAllLinksProps) {
  const open = () => {
    for (const slug of slugs) {
      // `noopener` keeps each tab a separate browser context.
      window.open(`/models/${slug}`, "_blank", "noopener,noreferrer")
    }
  }
  return (
    <Button variant="secondary" size="sm" onClick={open} disabled={slugs.length === 0}>
      <ExternalLink className="size-4" aria-hidden="true" />
      Open all in new tabs
    </Button>
  )
}
