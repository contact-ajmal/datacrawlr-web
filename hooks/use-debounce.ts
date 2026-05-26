"use client"

import { useEffect, useState } from "react"

/**
 * Returns `value` after it has been stable for `delay` ms. Resets the timer
 * on every change. Useful for rate-limiting typeahead requests without
 * dropping the latest keystroke.
 */
export function useDebounce<T>(value: T, delay = 180): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])

  return debounced
}
