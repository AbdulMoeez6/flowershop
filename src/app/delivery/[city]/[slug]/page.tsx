import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ProductCard } from "@/components/ui/product-card"
import { getLocalizedProducts, getCityPlaces, getCategories } from "@/lib/data"
import Link from "next/link"
import { notFound } from "next/navigation"

interface LocalizedCategoryPageProps {
  params: Promise<{ city: string; slug: string }>
  searchParams: Promise<{ category?: string }>
}

// Function to capitalize city names (e.g., "islamabad" -> "Islamabad")
function capitalize(str: string) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export async function generateMetadata({ params }: LocalizedCategoryPageProps) {
  const resolvedParams = await params
  const city = capitalize(resolvedParams.city)
  const fullSlug = resolvedParams.slug
  
  let categoryName = "Flowers"
  let locationSlug = fullSlug

  if (fullSlug.includes("-in-")) {
    const parts = fullSlug.split("-in-")
    categoryName = capitalize(parts[0])
    locationSlug = parts[1]
  }
  
  let locationName = city
  
  // If locationSlug is not the city, we are targeting a specific place
  if (locationSlug !== resolvedParams.city) {
    const places = await getCityPlaces(resolvedParams.city)
    const place = places.find(p => p.slug === locationSlug)
    if (place) {
      locationName = `${place.name}, ${city}`
    } else {
      // It's a place but not found in DB
      return { title: "Not Found" }
    }
  }

  return {
    title: `Premium ${categoryName} Delivery in ${locationName} | Flower Shop`,
    description: `Send the freshest ${categoryName} to your loved ones in ${locationName}. Enjoy same-day delivery for premium floral arrangements and gifts.`,
  }
}

export default async function LocalizedCategoryPage({ params, searchParams }: LocalizedCategoryPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams])
  const citySlug = resolvedParams.city
  const fullSlug = resolvedParams.slug

  let pathCategorySlug = undefined
  let locationSlug = fullSlug
  let categoryName = "Flowers"

  if (fullSlug.includes("-in-")) {
    const parts = fullSlug.split("-in-")
    pathCategorySlug = parts[0]
    locationSlug = parts[1]
    categoryName = capitalize(pathCategorySlug)
  }
  
  // searchParams.category overrides path category if present
  const activeCategorySlug = resolvedSearchParams.category || pathCategorySlug

  const cityName = capitalize(citySlug)
  
  // Determine if this is a city-wide page or a place-specific page
  const isCityWide = locationSlug === citySlug
  let locationName = cityName
  let displayLocation = cityName
  
  if (!isCityWide) {
    const places = await getCityPlaces(citySlug)
    const place = places.find(p => p.slug === locationSlug)
    
    // If the place doesn't exist in our DB for this city, return 404
    if (!place) {
      notFound()
    }
    
    locationName = place.name
    displayLocation = `${place.name}, ${cityName}`
  }

  // Fetch products specific to this category (if any) and city
  const productsPromise = getLocalizedProducts(citySlug, activeCategorySlug)
  const categoriesPromise = getCategories()

  const [products, categories] = await Promise.all([productsPromise, categoriesPromise])

  function buildUrl(catSlug: string | undefined) {
    if (catSlug) {
      return `/delivery/${citySlug}/${catSlug}-in-${locationSlug}`
    }
    // If it's the city-wide page, return to city page root when clearing category
    if (isCityWide) {
      return `/delivery/${citySlug}`
    }
    return `/delivery/${citySlug}/${locationSlug}`
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-10">
        {/* Localized Header */}
        <div className="flex flex-col mb-10 gap-4 text-center md:text-left">
          <div className="space-y-4">
            <span className="text-sm font-medium text-primary tracking-wider uppercase">
              Same-Day Delivery in {displayLocation}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-foreground">
              Send Fresh {categoryName} to {locationName}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Browse our curated selection of beautiful {categoryName.toLowerCase()}, hand-delivered fresh across {displayLocation}. Perfect for any occasion.
            </p>
          </div>
        </div>

        {/* Filters and Count */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-serif text-foreground">Available in {locationName}</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {products.length} {products.length === 1 ? "Product" : "Products"}
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap items-center">
            <Link
              href={buildUrl(undefined)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                !activeCategorySlug
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
                  activeCategorySlug === cat.slug
                    ? "bg-primary text-white border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {cat.name}
              </Link>
            ))}
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
              We currently don't have any {categoryName.toLowerCase()} available for delivery in {displayLocation}.
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
