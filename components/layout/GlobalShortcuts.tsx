"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { ShortcutsModal } from "@/components/shared/ShortcutsModal"
import { CommandPalette } from "@/components/search/CommandPalette"
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut"
import { useCommandPalette } from "@/lib/stores/command-palette"

export function GlobalShortcuts() {
  const togglePalette = useCommandPalette((s) => s.toggle)
  const openPalette = useCommandPalette((s) => s.open)
  const router = useRouter()
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  useKeyboardShortcut("mod+k", togglePalette, { preventDefault: true })
  useKeyboardShortcut("?", () => setShortcutsOpen(true))

  useKeyboardShortcut(
    "/",
    () => {
      const target = document.querySelector<HTMLInputElement>(
        "[data-primary-search]"
      )
      if (target) {
        target.focus()
        target.select()
      } else {
        openPalette()
      }
    },
    { preventDefault: true }
  )

  useKeyboardShortcut("g h", () => router.push("/"))
  useKeyboardShortcut("g s", () => router.push("/search"))
  useKeyboardShortcut("g e", () => router.push("/explore"))
  useKeyboardShortcut("g m", () => router.push("/models"))

  return (
    <>
      <CommandPalette />
      <ShortcutsModal open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </>
  )
}
