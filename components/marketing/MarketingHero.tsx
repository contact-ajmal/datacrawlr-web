"use client"

import { Fragment } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

import { BrowserFrame } from "@/components/marketing/BrowserFrame"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useScrollY } from "@/hooks/use-scroll-y"

const LINE_1 = "The dataset and model".split(" ")
const LINE_2 = "intelligence layer.".split(" ")
const WORD_DELAY = 0.03
const LINE_2_OFFSET = 0.05

/**
 * Marketing hero — word-reveal H1, ambient parallax orbs, a real product
 * screenshot in BrowserFrame. The animation respects prefers-reduced-motion
 * via `<MotionConfig reducedMotion="user">` mounted at the app root.
 */
export function MarketingHero() {
  return (
    <section className="bg-hero-gradient relative overflow-hidden border-b border-[var(--border-subtle)] pb-24 pt-16 sm:pb-28 sm:pt-20">
      <Orb size={520} top="-6%" left="-8%" delay={0} duration={16} opacity={0.06} parallax={0.06} />
      <Orb size={380} top="55%" left="62%" delay={2.5} duration={14} opacity={0.05} parallax={0.12} />
      <Orb size={260} top="18%" left="78%" delay={5} duration={12} opacity={0.04} parallax={0.09} />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex justify-center"
        >
          <Badge variant="neutral" className="font-mono">
            New · Models directory + benchmarks
          </Badge>
        </motion.div>

        <h1
          className="mt-6 font-semibold tracking-tight"
          style={{
            fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
            lineHeight: 1.05,
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
                    delay:
                      0.1 + LINE_2_OFFSET + (LINE_1.length + i) * WORD_DELAY,
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
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          className="text-secondary text-lead mx-auto mt-6 max-w-2xl"
        >
          Datacrawlr indexes every dataset and every open or commercial model
          worth knowing about — schemas, licenses, benchmark scores, pricing,
          and the link between the two. Metadata only. We point you to the
          source.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg">
            <Link href="/explore">Open the catalog →</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/features">See features</Link>
          </Button>
        </motion.div>
      </div>

      {/* Screenshot — real product UI */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
        className="relative z-10 mx-auto mt-16 max-w-6xl px-6"
      >
        <BrowserFrame
          src="/screenshots/hero-graph.png"
          alt="Datacrawlr — a dataset detail page showing lineage and the models trained on the dataset"
          url="datacrawlr.com/datasets/hf-meta-llama-llama-4-maverick"
          captureRoute="/datasets/<popular-slug>"
          glow
          tilt
        />
      </motion.div>
    </section>
  )
}

interface OrbProps {
  size: number
  top: string
  left: string
  delay: number
  duration: number
  opacity: number
  parallax: number
}

function Orb({
  size,
  top,
  left,
  delay,
  duration,
  opacity,
  parallax,
}: OrbProps) {
  const scrollY = useScrollY()
  const offset = scrollY * parallax
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
        transform: `translateY(${offset}px)`,
      }}
      animate={{ y: [0, -28, 0] }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    />
  )
}
