import Link from "next/link"
import { ProductCarousel } from "@/components/home/product-carousel"

interface ProductData {
  id: string
  name: string
  slug: string
  base_price: number
  compare_at_price: number | null
  image: string
  category: string
}

interface CategorySectionProps {
  title: string
  slug: string
  products: ProductData[]
}

export function CategorySection({ title, slug, products }: CategorySectionProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-10 md:py-14 border-b border-border/40 last:border-b-0 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-row justify-between items-end mb-6 md:mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-gold font-medium block mb-1">
              Curated Blooms
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground text-primary">
              {title}
            </h2>
          </div>
          <Link
            href={`/shop?category=${slug}`}
            className="shrink-0 text-xs md:text-sm font-medium text-white bg-primary px-4 py-2 md:px-6 rounded-full hover:bg-primary/90 transition-colors shadow-sm"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Continuously Moving Product Carousel */}
      <ProductCarousel products={products} />
    </section>
  )
}
