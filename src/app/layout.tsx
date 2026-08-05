import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Fleur & Co.",
    default: "Fleur & Co. | Premium Florist in Islamabad",
  },
  description: "Luxury flower delivery in Islamabad and Rawalpindi. Same-day delivery of premium floral arrangements, bouquets, and occasion flowers.",
  metadataBase: new URL("https://flowershopislamabad.com"),
  openGraph: {
    title: "Fleur & Co. | Premium Florist",
    description: "Luxury flower delivery in Islamabad and Rawalpindi.",
    url: "https://flowershopislamabad.com",
    siteName: "Fleur & Co.",
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fleur & Co. | Premium Florist",
    description: "Luxury flower delivery in Islamabad and Rawalpindi.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Florist",
    "name": "Fleur & Co.",
    "url": "https://flowershopislamabad.com",
    "description": "Premium Florist in Islamabad and Rawalpindi offering luxury flower delivery.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Islamabad",
      "addressRegion": "ICT",
      "addressCountry": "PK"
    },
    "telephone": "+92-123-4567890",
    "priceRange": "$$"
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
