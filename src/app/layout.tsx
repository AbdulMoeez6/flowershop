import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Flower Shop Islamabad",
    default: "Flower Shop Islamabad | Premium Florist in Pakistan",
  },
  description: "Luxury flower delivery in Islamabad, Rawalpindi, Lahore, and Karachi. Same-day delivery of premium floral arrangements, bouquets, and occasion flowers.",
  metadataBase: new URL("https://flowershopislamabad.com"), // Setting back to their original domain
  openGraph: {
    title: "Flower Shop Islamabad | Premium Florist",
    description: "Luxury flower delivery in Islamabad, Rawalpindi, Lahore, and Karachi.",
    url: "https://flowershopislamabad.com",
    siteName: "Flower Shop Islamabad",
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flower Shop Islamabad | Premium Florist",
    description: "Luxury flower delivery in Islamabad, Rawalpindi, Lahore, and Karachi.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Florist",
    "name": "Flower Shop Islamabad",
    "url": "https://flowershopislamabad.com",
    "description": "Premium Florist in Pakistan offering luxury flower delivery.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Office No 4, 1st Floor, VIP Plaza, I-8 Markaz",
      "addressLocality": "Islamabad",
      "addressRegion": "ICT",
      "addressCountry": "PK"
    },
    "telephone": "+92-344-5130554",
    "priceRange": "$$"
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
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
