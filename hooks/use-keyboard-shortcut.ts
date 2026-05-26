"use client"

import { useEffect, useRef } from "react"

interface ParsedCombo {
  key: string
  mod: boolean
  shift: boolean
  alt: boolean
}

interface KeyboardShortcutOptions {
  preventDefault?: boolean
  enabled?: boolean
}

const KEY_ALIASES: Record<string, string> = {
  esc: "escape",
  return: "enter",
  enter: "enter",
  space: " ",
  spacebar: " ",
  up: "arrowup",
  down: "arrowdown",
  left: "arrowleft",
  right: "arrowright",
}

function parseStep(step: string): ParsedCombo {
  const parts = step.toLowerCase().split("+").filter(Boolean)
  const rawKey = parts.pop() ?? ""
  const key = KEY_ALIASES[rawKey] ?? rawKey
  return {
    key,
    mod: parts.includes("mod"),
    shift: parts.includes("shift"),
    alt: parts.includes("alt"),
  }
}

function parseSpec(spec: string): ParsedCombo[] {
  return spec
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(parseStep)
}

function isMacPlatform(): boolean {
  if (typeof navigator === "undefined") return false
  // navigator.platform is deprecated but still the most reliable indicator across browsers
  return /Mac|iPhone|iPad/i.test(navigator.platform)
}

function isInputFocused(): boolean {
  if (typeof document === "undefined") return false
  const el = document.activeElement as HTMLElement | null
  if (!el) return false
  if (el.isContentEditable) return true
  const tag = el.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
}

function comboMatches(combo: ParsedCombo, e: KeyboardEvent, mac: boolean): boolean {
  const modPressed = mac ? e.metaKey : e.ctrlKey
  if (combo.mod !== modPressed) return false
  if (combo.shift !== e.shiftKey) return false
  if (combo.alt !== e.altKey) return false
  const eventKey = e.key.toLowerCase()
  return eventKey === combo.key
}

export function useKeyboardShortcut(
  keys: string | string[],
  callback: () => void,
  options: KeyboardShortcutOptions = {}
): void {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const { preventDefault = false, enabled = true } = options
  const keysKey = Array.isArray(keys) ? keys.join("|") : keys

  useEffect(() => {
    if (!enabled) return
    const specs = (Array.isArray(keys) ? keys : [keys]).map(parseSpec)
    const progress: number[] = specs.map(() => 0)
    const mac = isMacPlatform()
    let resetTimer: number | null = null

    const resetSequences = () => {
      for (let i = 0; i < progress.length; i++) progress[i] = 0
      if (resetTimer) {
        window.clearTimeout(resetTimer)
        resetTimer = null
      }
    }

    const onKey = (e: KeyboardEvent) => {
      const isEscape = e.key === "Escape"
      if (isInputFocused() && !isEscape) return

      let fired = false
      for (let i = 0; i < specs.length; i++) {
        const seq = specs[i]
        const idx = progress[i]
        if (comboMatches(seq[idx], e, mac)) {
          if (idx + 1 === seq.length) {
            progress[i] = 0
            if (preventDefault) e.preventDefault()
            callbackRef.current()
            fired = true
            break
          }
          progress[i] = idx + 1
          if (resetTimer) window.clearTimeout(resetTimer)
          resetTimer = window.setTimeout(resetSequences, 1000)
        } else if (idx > 0) {
          progress[i] = 0
        }
      }

      if (fired) resetSequences()
    }

    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      if (resetTimer) window.clearTimeout(resetTimer)
    }
  }, [keysKey, preventDefault, enabled, keys])
}
