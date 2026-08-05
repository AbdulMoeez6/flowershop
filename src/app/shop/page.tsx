import { Navbar } from "@/components/ui/navbar"
import { ProductCard } from "@/components/ui/product-card"

export default function ShopPage() {
  // In Phase 4, we use mock data. This will be replaced with Supabase data fetching later.
  const products = [
    {
      id: "1",
      name: "Crimson Elegance",
      price: 8500,
      compareAtPrice: 10000,
      category: "Flower Bouquet",
      image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "2",
      name: "White Whisper",
      price: 6500,
      category: "Occasions",
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "3",
      name: "Pastel Dream",
      price: 7200,
      category: "Custom Bouquets",
      image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "4",
      name: "Golden Hour",
      price: 5500,
      compareAtPrice: 6000,
      category: "Flower Deals",
      image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "5",
      name: "Midnight Romance",
      price: 12000,
      category: "Valentine's Day",
      image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "6",
      name: "Sunny Morning",
      price: 4500,
      category: "Flower Bouquet",
      image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=600&auto=format&fit=crop"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif text-foreground">The Collection</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Browse our curated selection of fresh, premium blooms crafted for every occasion.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option>All Categories</option>
              <option>Flower Bouquet</option>
              <option>Cakes</option>
              <option>Occasions</option>
            </select>
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  )
}
