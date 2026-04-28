import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://phrasely.kyren.app"),
  title: "Phrasely — Sound native, effortlessly",
  description:
    "AI-powered English rewriting for Japanese speakers. Transform your writing to sound more natural while learning why changes were made.",
  openGraph: {
    title: "Phrasely — Sound native, effortlessly",
    description: "AI-powered English rewriting for Japanese speakers.",
    type: "website",
    url: "https://phrasely.kyren.app",
    siteName: "Phrasely",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Phrasely — Sound native, effortlessly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phrasely — Sound native, effortlessly",
    description: "AI-powered English rewriting for Japanese speakers.",
    site: "@masatobuilds",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Phrasely",
  description:
    "AI-powered English rewriting for Japanese speakers. Transform your writing to sound more natural while learning why changes were made.",
  url: "https://phrasely.kyren.app",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "4.99",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "4.99",
        priceCurrency: "USD",
        unitText: "MONTH",
      },
    },
  ],
  inLanguage: ["en", "ja"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="antialiased">
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
