"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const m = window.matchMedia(query)
    const update = () => setMatches(m.matches)
    update()
    m.addEventListener("change", update)
    return () => m.removeEventListener("change", update)
  }, [query])

  return matches
}
