import { notFound } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ProductCard } from "@/components/ui/product-card"
import { getLocalizedProducts, getCityPlaces, getCategories } from "@/lib/data"

const PREDEFINED_CITIES = [
  "islamabad",
  "rawalpindi",
  "lahore",
  "karachi",
  "peshawar",
]

interface PageProps {
  params: Promise<{
    city: string
  }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params
  const city = resolvedParams.city.toLowerCase()
  if (!PREDEFINED_CITIES.includes(city)) {
    return {
      title: "City Not Found | Fleur & Co.",
    }
  }

  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1)
  
  return {
    title: `Premium Flower Delivery in ${capitalizedCity} | Fleur & Co.`,
    description: `Send luxury, hand-tied flower bouquets to ${capitalizedCity} with Fleur & Co. Same-day delivery available for premium floral arrangements.`,
  }
}

export default async function CityDeliveryPage({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams])
  const city = resolvedParams.city.toLowerCase()
  const category = resolvedSearchParams.category
  
  if (!PREDEFINED_CITIES.includes(city)) {
    notFound()
  }

  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1)
  
  // Fetch products that are available nationwide OR specifically in this city
  const productsPromise = getLocalizedProducts(city, category)
  
  // Fetch available places for this city
  const placesPromise = getCityPlaces(city)

  // Fetch categories for filtering
  const categoriesPromise = getCategories()

  const [products, places, categories] = await Promise.all([productsPromise, placesPromise, categoriesPromise])

  function buildUrl(catSlug: string | undefined) {
    if (catSlug) {
      return `/delivery/${city}/${catSlug}-in-${city}`
    }
    return `/delivery/${city}`
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar transparent={false} />

      <main className="flex-1">
        {/* City Hero Section */}
        <section className="bg-cream py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-8 text-center space-y-6">
            <span className="text-sm uppercase tracking-[0.3em] text-primary font-medium">
              Local Delivery
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-foreground max-w-4xl mx-auto leading-tight">
              Premium Flower Delivery in {capitalizedCity}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Send breathtaking, hand-tied luxury bouquets to your loved ones in {capitalizedCity}. Same-day delivery available on selected arrangements.
            </p>
          </div>
        </section>

        {/* Delivery Areas Section */}
        {places.length > 0 && (
          <section className="py-12 bg-muted/10 border-b border-border">
            <div className="container mx-auto px-4 md:px-8 text-center">
              <h2 className="text-2xl font-serif text-foreground mb-6">Delivery Areas in {capitalizedCity}</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {places.map((place) => (
                  <Link 
                    key={place.id}
                    href={`/delivery/${city}/${place.slug}`}
                    className="px-5 py-2.5 bg-background border border-border rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    {place.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products Grid */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 md:px-8 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 gap-6">
              <div>
                <h2 className="text-3xl font-serif text-foreground">Available in {capitalizedCity}</h2>
                <p className="text-muted-foreground mt-2">Showing products available for delivery to your area.</p>
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-wrap items-center">
                <Link
                  href={buildUrl(undefined)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    !category
                      ? "bg-primary text-white border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  All
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={buildUrl(cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      category === cat.slug
                        ? "bg-primary text-white border-primary"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
              <div className="text-center py-24 bg-cream/30 rounded-2xl border border-border">
                <p className="text-lg text-muted-foreground">
                  We're sorry, but we currently have no products available for delivery in {capitalizedCity}.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
