"use client"

import { useEffect } from "react"

import { useHistory } from "@/lib/stores/history"

interface HistoryRecorderProps {
  slug: string
}

export function HistoryRecorder({ slug }: HistoryRecorderProps) {
  const record = useHistory((s) => s.record)
  useEffect(() => {
    record(slug)
  }, [slug, record])
  return null
}
