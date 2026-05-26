import type { Variants } from "framer-motion"

const SMOOTH_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: SMOOTH_OUT },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.18, ease: "easeOut" },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: SMOOTH_OUT },
  },
}

export const slideRight: Variants = {
  hidden: { x: -8, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: SMOOTH_OUT },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
}

export const STAGGER_CAP = 8

export const fadeUpIndexed: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: SMOOTH_OUT,
      delay: Math.min(i, STAGGER_CAP) * 0.04,
    },
  }),
}
