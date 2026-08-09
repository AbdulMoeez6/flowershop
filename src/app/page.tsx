import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"
import { HeroSection } from "@/components/home/hero"
import { OccasionStrip } from "@/components/home/occasion-strip"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { Testimonials } from "@/components/home/testimonials"
import { Newsletter } from "@/components/home/newsletter"
import { getFeaturedProducts, getCategories } from "@/lib/data"

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar transparent />

      <main className="flex-1">
        {/* Hero */}
        <HeroSection />

        {/* Shop by Occasion */}
        <OccasionStrip categories={categories} />

        {/* Featured Products */}
        <section className="section-padding">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] text-gold font-medium">Curated for You</span>
                <h2 className="text-3xl md:text-4xl font-serif text-foreground">Featured Arrangements</h2>
              </div>
              <Link
                href="/shop"
                className="mt-4 md:mt-0 text-sm font-medium text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
              >
                View All →
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

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Testimonials */}
        <Testimonials />

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
