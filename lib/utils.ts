import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "0"
  const abs = Math.abs(n)
  if (abs < 1_000) return String(Math.round(n))
  if (abs < 1_000_000) return `${trim(n / 1_000)}K`
  if (abs < 1_000_000_000) return `${trim(n / 1_000_000)}M`
  return `${trim(n / 1_000_000_000)}B`
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB", "PB"]
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024))
  )
  const value = bytes / Math.pow(1024, i)
  return `${trim(value)} ${units[i]}`
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ""
  const diff = Date.now() - then
  const sec = Math.round(diff / 1000)
  if (sec < 60) return rel(sec, "second")
  const min = Math.round(sec / 60)
  if (min < 60) return rel(min, "minute")
  const hr = Math.round(min / 60)
  if (hr < 24) return rel(hr, "hour")
  const day = Math.round(hr / 24)
  if (day < 30) return rel(day, "day")
  const mo = Math.round(day / 30)
  if (mo < 12) return rel(mo, "month")
  const yr = Math.round(day / 365)
  return rel(yr, "year")
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function trim(n: number): string {
  const rounded = Math.round(n * 10) / 10
  return rounded % 1 === 0 ? String(Math.round(rounded)) : rounded.toFixed(1)
}

function rel(n: number, unit: string): string {
  const abs = Math.abs(n)
  const plural = abs === 1 ? unit : `${unit}s`
  if (n < 0) return `in ${abs} ${plural}`
  if (n === 0) return `just now`
  return `${abs} ${plural} ago`
}
