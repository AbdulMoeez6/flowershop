import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ProductCard } from "@/components/ui/product-card"
import { getAllProducts, getCategories } from "@/lib/data"
import Link from "next/link"

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const currentPage = Number(params.page ?? "1")
  const limit = 12
  const offset = (currentPage - 1) * limit

  const [{ products, total }, categories] = await Promise.all([
    getAllProducts({
      category: params.category,
      sort: params.sort,
      limit,
      offset,
    }),
    getCategories(),
  ])

  const totalPages = Math.ceil(total / limit)

  // Build URL helper
  function buildUrl(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams()
    const merged = { category: params.category, sort: params.sort, page: params.page, ...overrides }
    for (const [k, v] of Object.entries(merged)) {
      if (v) p.set(k, v)
    }
    return `/shop?${p.toString()}`
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif text-foreground">The Collection</h1>
            <p className="text-muted-foreground max-w-xl">
              Browse our curated selection of fresh, premium blooms crafted for every occasion.
            </p>
          </div>

          {/* Filters — using links instead of form submit */}
          <div className="flex gap-3 flex-wrap">
            {/* Category links */}
            <div className="flex gap-2 flex-wrap">
              <Link
                href={buildUrl({ category: undefined, page: undefined })}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  !params.category
                    ? "bg-forest text-white border-forest"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-forest/40"
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildUrl({ category: cat.slug, page: undefined })}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    params.category === cat.slug
                      ? "bg-forest text-white border-forest"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-forest/40"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sort bar */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-muted-foreground">{total} products</p>
          <div className="flex gap-2">
            {[
              { label: "Featured", value: "" },
              { label: "Price: Low → High", value: "price-asc" },
              { label: "Price: High → Low", value: "price-desc" },
            ].map((sort) => (
              <Link
                key={sort.value}
                href={buildUrl({ sort: sort.value || undefined, page: undefined })}
                className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                  (params.sort ?? "") === sort.value
                    ? "bg-forest/10 text-forest font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {sort.label}
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
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No products found in this category.</p>
            <Link href="/shop" className="text-sm text-forest underline underline-offset-4 mt-4 inline-block">
              View all products
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-14">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={buildUrl({ page: String(page) })}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-forest text-white"
                    : "bg-muted text-foreground hover:bg-muted-foreground/10"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
