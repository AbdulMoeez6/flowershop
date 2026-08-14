import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ProductCard } from "@/components/ui/product-card"
import { getLocalizedProducts } from "@/lib/data"
import Link from "next/link"
import { notFound } from "next/navigation"

interface LocalizedCategoryPageProps {
  params: Promise<{ city: string; slug: string }>
}

// Function to capitalize city names (e.g., "islamabad" -> "Islamabad")
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ')
}

export async function generateMetadata({ params }: LocalizedCategoryPageProps) {
  const resolvedParams = await params
  const city = capitalize(resolvedParams.city)
  const fullSlug = resolvedParams.slug
  
  // Extract category from "bouquets-in-islamabad" -> "bouquets"
  const categorySlug = fullSlug.replace(/-in-.*$/, "")
  const categoryName = capitalize(categorySlug)

  return {
    title: `Premium ${categoryName} Delivery in ${city} | Flower Shop Islamabad`,
    description: `Send the freshest ${categoryName} to your loved ones in ${city}. Enjoy same-day delivery for premium floral arrangements and gifts.`,
  }
}

export default async function LocalizedCategoryPage({ params }: LocalizedCategoryPageProps) {
  const resolvedParams = await params
  const citySlug = resolvedParams.city
  const fullSlug = resolvedParams.slug

  // Validate the URL matches the expected format: category-in-city
  if (!fullSlug.endsWith(`-in-${citySlug}`)) {
    notFound()
  }

  const categorySlug = fullSlug.replace(`-in-${citySlug}`, "")
  
  // Fetch products specific to this category and city
  const products = await getLocalizedProducts(categorySlug, citySlug)

  const cityName = capitalize(citySlug)
  const categoryName = capitalize(categorySlug)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-10">
        {/* Localized Header */}
        <div className="flex flex-col mb-10 gap-4 text-center md:text-left">
          <div className="space-y-4">
            <span className="text-sm font-medium text-primary tracking-wider uppercase">
              Same-Day Delivery in {cityName}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-foreground">
              Send Fresh {categoryName} to {cityName}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Browse our curated selection of beautiful {categoryName.toLowerCase()}, hand-delivered fresh across {cityName}. Perfect for any occasion.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.base_price}
                compareAtPrice={product.compare_at_price}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-border/50">
            <h3 className="text-2xl font-serif text-foreground mb-3">No {categoryName} Available</h3>
            <p className="text-muted-foreground mb-6">
              We currently don't have any {categoryName.toLowerCase()} available for delivery in {cityName}.
            </p>
            <Link href="/shop" className="text-sm font-medium text-white bg-primary px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
              Browse All Products
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
