"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Demo = "fadeUp" | "scaleIn" | "stagger"

export function MotionSamples() {
  const [demo, setDemo] = useState<Demo>("fadeUp")
  const [tick, setTick] = useState(0)

  const trigger = (d: Demo) => {
    setDemo(d)
    setTick((t) => t + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button
          variant={demo === "fadeUp" ? "default" : "secondary"}
          size="sm"
          onClick={() => trigger("fadeUp")}
        >
          Fade up
        </Button>
        <Button
          variant={demo === "scaleIn" ? "default" : "secondary"}
          size="sm"
          onClick={() => trigger("scaleIn")}
        >
          Scale in
        </Button>
        <Button
          variant={demo === "stagger" ? "default" : "secondary"}
          size="sm"
          onClick={() => trigger("stagger")}
        >
          Stagger
        </Button>
      </div>
      <div className="bg-elevated border-subtle flex h-[100px] w-[200px] items-center justify-center overflow-hidden rounded-md border">
        {demo === "fadeUp" && (
          <motion.div
            key={`fade-${tick}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            <Badge>fade up</Badge>
          </motion.div>
        )}
        {demo === "scaleIn" && (
          <motion.div
            key={`scale-${tick}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <Badge>scale in</Badge>
          </motion.div>
        )}
        {demo === "stagger" && (
          <div key={`stagger-${tick}`} className="flex gap-2">
            {["one", "two", "three"].map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: i * 0.08, ease: "easeOut" }}
              >
                <Badge variant="neutral">{label}</Badge>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
