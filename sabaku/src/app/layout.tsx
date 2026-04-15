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
  description: "Flight strip task management with Obsidian Vault sync. 捌く — clear your tasks one by one.",
  metadataBase: new URL("https://sabaku.kyren.app"),
  openGraph: {
    title: "SABAKU — Strip-based Task Control",
    description: "Flight strip task management with Obsidian Vault sync.",
    url: "https://sabaku.kyren.app",
    siteName: "SABAKU",
    type: "website",
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
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  )
}
