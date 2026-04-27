import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
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
  openGraph: {
    title: "SABAKU — Strip-based Task Control",
    description: "Flight strip task management with Obsidian Vault sync.",
    url: "https://sabaku.kyren.app",
    siteName: "SABAKU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SABAKU — Strip-based Task Control",
    description: "Flight strip task management with Obsidian Vault sync.",
    site: "@masatobuilds",
  },
  robots: { index: true, follow: true },
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
        {children}
      </body>
    </html>
  )
}
