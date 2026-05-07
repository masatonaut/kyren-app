import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { ToastProvider } from "@/components/ToastProvider"
import Analytics from "@/components/Analytics"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SABAKU — Strip-based Task Control",
  description: "Flight strip task management with Obsidian Vault sync. Clear your tasks one by one.",
  metadataBase: new URL("https://sabaku.kyren.app"),
  manifest: "/manifest.json",
  openGraph: {
    title: "SABAKU — Strip-based Task Control",
    description: "Flight strip task management with Obsidian Vault sync.",
    url: "https://sabaku.kyren.app",
    siteName: "SABAKU",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SABAKU — ATC-inspired task management" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SABAKU — Strip-based Task Control",
    description: "Flight strip task management with Obsidian Vault sync.",
    site: "@masatobuilds",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SABAKU",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/icon-192.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <ErrorBoundary>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
