import { notFound } from "next/navigation"
import { getProductBySlug, getFeaturedProducts } from "@/lib/data"
import { ProductDetailClient } from "@/components/product/product-detail-client"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ProductCard } from "@/components/ui/product-card"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Product Not Found" }
  return {
    title: product.name,
    description: product.short_description,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  // Get related products
  const allProducts = await getFeaturedProducts()
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <ProductDetailClient product={product} />

        {/* Related Products */}
        {related.length > 0 && (
          <section className="section-padding border-t border-border">
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-10">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {related.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    price={p.base_price}
                    compareAtPrice={p.compare_at_price}
                    image={p.image}
                    category={p.category}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
