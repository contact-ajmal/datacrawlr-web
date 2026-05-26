import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { MotionConfig } from "framer-motion"
import { Toaster } from "sonner"

import { MarketingNav } from "@/components/marketing/MarketingNav"
import { MarketingFooter } from "@/components/marketing/MarketingFooter"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PageTransition } from "@/components/motion/PageTransition"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

const SITE_DESCRIPTION =
  "Semantic search across HuggingFace, Kaggle, GitHub, and research papers — with AI summaries that tell you what to actually use."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Datacrawlr — The dataset intelligence layer",
    template: "%s · Datacrawlr",
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Datacrawlr — The dataset intelligence layer",
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: "Datacrawlr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Datacrawlr — The dataset intelligence layer",
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-base text-primary font-sans antialiased selection:bg-accent/20 selection:text-primary`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <MotionConfig reducedMotion="user">
            <TooltipProvider delayDuration={200}>
              <MarketingNav />
              <PageTransition>{children}</PageTransition>
              <MarketingFooter />
              <Toaster
                theme="dark"
                position="bottom-right"
                toastOptions={{
                  classNames: {
                    toast:
                      "!bg-[var(--bg-overlay)] !border !border-[var(--border-subtle)] !text-[var(--text-primary)] !rounded-md",
                    description: "!text-[var(--text-secondary)]",
                  },
                }}
              />
            </TooltipProvider>
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  )
}
