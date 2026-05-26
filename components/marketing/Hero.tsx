"use client"

import { Fragment, useRef } from "react"
import { motion } from "framer-motion"

import {
  LiveSearchInput,
  type LiveSearchInputHandle,
} from "@/components/search/LiveSearchInput"
import { Badge } from "@/components/ui/badge"
import { useScrollY } from "@/hooks/use-scroll-y"

const SUGGESTIONS = [
  "medical imaging",
  "financial time series",
  "code completion",
  "low-resource languages",
  "multimodal video",
]

const LINE_1 = "Find the right dataset,".split(" ")
const LINE_2 = "faster than ever.".split(" ")
const WORD_DELAY = 0.03
const LINE_2_OFFSET = 0.05

export function Hero() {
  const searchRef = useRef<LiveSearchInputHandle | null>(null)

  return (
    <section className="bg-hero-gradient relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 py-24">
      <Orb size={400} top="8%" left="6%" delay={0} duration={14} opacity={0.06} parallax={0.1} />
      <Orb size={300} top="62%" left="68%" delay={2.5} duration={16} opacity={0.05} parallax={0.07} />
      <Orb size={250} top="18%" left="72%" delay={5} duration={12} opacity={0.04} parallax={0.13} />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-tertiary text-micro font-medium uppercase tracking-[0.2em]"
        >
          Dataset intelligence layer
        </motion.p>

        <h1
          className="mt-6 font-semibold tracking-tight"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          <div>
            {LINE_1.map((word, i) => (
              <Fragment key={`l1-${i}`}>
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + i * WORD_DELAY,
                    ease: "easeOut",
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
                {i < LINE_1.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </div>
          <div className="text-accent">
            {LINE_2.map((word, i) => (
              <Fragment key={`l2-${i}`}>
                <motion.span
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + LINE_2_OFFSET + (LINE_1.length + i) * WORD_DELAY,
                    ease: "easeOut",
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
                {i < LINE_2.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          className="text-secondary text-lead mx-auto mt-6 max-w-2xl"
        >
          Semantic search across every dataset and model in open ML — with AI
          summaries that tell you what to actually use.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
          className="mt-10"
        >
          <LiveSearchInput ref={searchRef} size="lg" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <span className="text-tertiary text-micro font-mono uppercase tracking-wider">
            Try
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <motion.button
                key={s}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => searchRef.current?.setQuery(s)}
                className="cursor-pointer"
                aria-label={`Try search: ${s}`}
              >
                <Badge variant="neutral" className="hover:border-strong">
                  {s}
                </Badge>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Orb({
  size,
  top,
  left,
  delay,
  duration,
  opacity,
  parallax,
}: {
  size: number
  top: string
  left: string
  delay: number
  duration: number
  opacity: number
  parallax: number
}) {
  // Couple the orb's vertical offset to scroll position so the hero feels
  // physical without resorting to a heavier parallax library. `parallax` is
  // a multiplier (~0.05–0.15) tuned per-orb so the further-back ones drift
  // less than the closer ones.
  const scrollY = useScrollY()
  const scrollOffset = scrollY * parallax

  return (
    <motion.div
      aria-hidden="true"
      className="bg-accent pointer-events-none absolute rounded-full blur-3xl"
      style={{
        width: size,
        height: size,
        top,
        left,
        opacity,
        transform: `translateY(${scrollOffset}px)`,
      }}
      animate={{ y: [0, -30, 0] }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    />
  )
}
