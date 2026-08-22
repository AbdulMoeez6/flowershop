import type { Metadata } from "next";
import "./globals.css";
import { WhatsappButton } from "@/components/ui/whatsapp-button";
import { getSettings } from "@/lib/data";
import { SettingsProvider } from "@/components/providers/settings-provider";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

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
      className="h-full antialiased font-sans"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Manrope:wght@400;500;600&family=Parisienne&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Tenor+Sans&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SettingsProvider settings={settings}>
          {children}
          <WhatsappButton />
        </SettingsProvider>
      </body>
    </html>
  );
}
