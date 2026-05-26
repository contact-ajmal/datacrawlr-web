"use client"

import { useEffect, useState } from "react"

export function useScrollY(): number {
  const [y, setY] = useState(0)

  useEffect(() => {
    let raf = 0
    let ticking = false

    const update = () => {
      setY(window.scrollY)
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      raf = requestAnimationFrame(update)
    }

    setY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return y
}
