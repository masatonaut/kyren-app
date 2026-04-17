import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Phrasely — Sound native, effortlessly",
  description:
    "AI-powered English rewriting for Japanese speakers. Transform your writing to sound more natural while learning why changes were made.",
  openGraph: {
    title: "Phrasely — Sound native, effortlessly",
    description: "AI-powered English rewriting for Japanese speakers.",
    type: "website",
    url: "https://phrasely.kyren.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
