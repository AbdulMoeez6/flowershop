import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params
  // In a real app, fetch product by ID.
  const productName = "Crimson Elegance"
  const description = "A breathtaking arrangement of deep red roses."

  return {
    title: productName,
    description: description,
    openGraph: {
      title: productName,
      description: description,
      url: `https://flowershopislamabad.com/product/${id}`,
      type: 'website',
      images: ['https://images.unsplash.com/photo-1591886960571-74d43a9d4166']
    },
    alternates: {
      canonical: `/product/${id}`,
    },
  }
}

export default async function ProductLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const { id } = await params
  
  // Example Product Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Crimson Elegance",
    "image": "https://images.unsplash.com/photo-1591886960571-74d43a9d4166",
    "description": "A breathtaking arrangement of deep red roses and complementary foliage.",
    "sku": `FLR-${id}`,
    "offers": {
      "@type": "Offer",
      "url": `https://flowershopislamabad.com/product/${id}`,
      "priceCurrency": "PKR",
      "price": "8500",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  }

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {children}
    </>
  )
}
