import Link from "next/link"
import { ProductCard } from "@/components/ui/product-card"

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
    <section className="py-12 border-b border-border/40 last:border-b-0">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground text-primary">
              {title}
            </h2>
          </div>
          <Link
            href={`/shop?category=${slug}`}
            className="mt-4 md:mt-0 text-sm font-medium text-white bg-primary px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            View All
          </Link>
        </div>
        
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
      </div>
    </section>
  )
}
