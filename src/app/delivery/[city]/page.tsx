import { notFound } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ProductCard } from "@/components/ui/product-card"
import { getLocalizedProducts } from "@/lib/data"

const PREDEFINED_CITIES = [
  "islamabad",
  "rawalpindi",
  "lahore",
  "karachi",
  "peshawar",
  "faisalabad",
]

interface PageProps {
  params: {
    city: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const city = params.city.toLowerCase()
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

export default async function CityDeliveryPage({ params }: PageProps) {
  const city = params.city.toLowerCase()
  
  if (!PREDEFINED_CITIES.includes(city)) {
    notFound()
  }

  const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1)
  
  // Fetch products that are available nationwide OR specifically in this city
  const products = await getLocalizedProducts(city)

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

        {/* Products Grid */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 md:px-8 space-y-12">
            <div className="flex items-end justify-between border-b border-border pb-6">
              <div>
                <h2 className="text-3xl font-serif text-foreground">Available in {capitalizedCity}</h2>
                <p className="text-muted-foreground mt-2">Showing products available for delivery to your area.</p>
              </div>
              <p className="text-sm text-muted-foreground hidden md:block">
                {products.length} {products.length === 1 ? "Product" : "Products"}
              </p>
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
