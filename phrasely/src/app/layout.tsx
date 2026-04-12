import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phrasely - Sound native, effortlessly",
  description:
    "AI-powered English rewriting tool for non-native speakers. Transform your writing to sound more natural while learning why changes were made.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
