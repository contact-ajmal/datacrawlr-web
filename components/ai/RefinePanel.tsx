"use client"

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Send, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { parseRefinement } from "@/lib/refine-parser"
import {
  toSearchFilters,
  useSearchFilters,
  SIZE_MAX,
  SIZE_MIN,
  type UpdatedWithin,
} from "@/lib/stores/search-filters"
import type { Modality, SearchFilters, SourceProvider } from "@/lib/types"
import { cn } from "@/lib/utils"

type Message =
  | { id: string; role: "user"; content: string }
  | { id: string; role: "assistant"; content: string; ok?: boolean }

interface RefinePanelProps {
  open: boolean
  onClose: () => void
}

const SUGGESTIONS = [
  "Exclude proprietary",
  "Under 10M rows",
  "Only audio",
  "MIT only",
  "From huggingface",
  "High quality",
]

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi — describe how you want to refine these results. I can filter by modality, license, source, or size. Try one of the suggestions below to get going.",
}

function applyParsedToStore(parsed: SearchFilters): void {
  const reset = Object.keys(parsed).length === 0
  useSearchFilters.setState((state) => {
    if (reset) {
      return {
        modality: [],
        license: [],
        source: [],
        minSize: SIZE_MIN,
        maxSize: SIZE_MAX,
        minQuality: 0,
        updatedWithin: "any" as UpdatedWithin,
      }
    }
    return {
      modality: (parsed.modality as Modality[]) ?? state.modality,
      license: parsed.license ?? state.license,
      source: (parsed.source as SourceProvider[]) ?? state.source,
      minSize: parsed.minSize ?? state.minSize,
      maxSize: parsed.maxSize ?? state.maxSize,
      minQuality: parsed.minQuality ?? state.minQuality,
      updatedWithin: parsed.updatedWithin ?? state.updatedWithin,
    }
  })
}

export function RefinePanel({ open, onClose }: RefinePanelProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState("")
  const logRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  // Auto-focus the textarea when opened
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 200)
      return () => window.clearTimeout(id)
    }
  }, [open])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey as never)
    return () => window.removeEventListener("keydown", onKey as never)
  }, [open, onClose])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const el = logRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  const send = (raw: string) => {
    const text = raw.trim()
    if (!text) return
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setMessages((prev) => [
      ...prev,
      { id: `u-${id}`, role: "user", content: text },
    ])
    const current = toSearchFilters(useSearchFilters.getState())
    const result = parseRefinement(text, current)
    if (result.ok) {
      applyParsedToStore(result.newFilters)
    }
    setMessages((prev) => [
      ...prev,
      {
        id: `a-${id}`,
        role: "assistant",
        content: result.summary,
        ok: result.ok,
      },
    ])
    setInput("")
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    send(input)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.aside
          key="refine-panel"
          initial={{ x: "100%", opacity: 0.6 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.6 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className={cn(
            "bg-base border-subtle fixed bottom-0 right-0 top-[52px] z-30 flex w-80 flex-col border-l shadow-[-12px_0_60px_rgba(94,234,212,0.04)] md:top-14"
          )}
          role="region"
          aria-label="AI refine panel"
        >
          <header className="border-subtle flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-accent size-4" aria-hidden="true" />
              <h2 className="text-h4 font-semibold">Refine these results</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close refine panel"
              className="text-tertiary hover:text-primary transition-colors"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </header>

          <div
            ref={logRef}
            className="flex-1 space-y-3 overflow-y-auto p-4"
          >
            {messages.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}
          </div>

          <div className="border-subtle border-t p-3">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => send(s)}
                  className="bg-elevated border-subtle hover:border-strong text-secondary hover:text-primary text-micro shrink-0 rounded-full border px-2.5 py-1 transition-colors"
                >
                  {s}
                </motion.button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Try: 'exclude proprietary licenses' or 'only datasets under 1GB'"
                rows={2}
                aria-label="Refinement input"
                className="bg-elevated border-subtle text-primary placeholder:text-tertiary focus-visible:border-accent focus-visible:ring-accent-glow text-caption flex-1 resize-none rounded-md border px-3 py-2 outline-none transition-colors focus-visible:ring-2"
              />
              <Button
                type="submit"
                size="icon-sm"
                aria-label="Send refinement"
                disabled={input.trim().length === 0}
              >
                <Send className="size-3.5" aria-hidden="true" />
              </Button>
            </form>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  return (
    <div
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg border px-3 py-2 text-caption",
          isUser
            ? "bg-accent/10 border-accent/20 text-primary"
            : message.ok === false
              ? "bg-elevated border-subtle text-tertiary"
              : "bg-elevated border-subtle text-secondary"
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
