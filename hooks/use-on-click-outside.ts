"use client"

import { type RefObject, useEffect } from "react"

/**
 * Invoke `handler` when a pointerdown happens outside `ref`'s element.
 * Listens on the capture phase so we still close before child click
 * handlers fire.
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      const el = ref.current
      if (!el || el.contains(event.target as Node)) return
      handler(event)
    }
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}
