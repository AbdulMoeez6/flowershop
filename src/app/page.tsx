import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { HeroSection } from "@/components/home/hero"
import { CategoryStrip } from "@/components/home/category-strip"
import { CategorySection } from "@/components/home/category-section"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { Testimonials } from "@/components/home/testimonials"
import { DeliveryLocations } from "@/components/home/delivery-locations"
import { FAQs } from "@/components/home/faqs"
import { getCategories, getProductsByCategorySlug } from "@/lib/data"

export default async function HomePage() {
  const categories = await getCategories()
  
  // Fetch products for all categories in parallel
  const categoryProductsPromises = categories.map((cat: any) => 
    getProductsByCategorySlug(cat.slug, 10)
  )
  const productsArrays = await Promise.all(categoryProductsPromises)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <HeroSection />

        {/* Shop by Category Strip */}
        <CategoryStrip categories={categories} />

        {/* Dynamic Category Sections */}
        <div className="bg-background">
          {categories.map((cat: any, index: number) => (
            <CategorySection
              key={cat.id}
              title={cat.name}
              slug={cat.slug}
              products={productsArrays[index]}
            />
          ))}
        </div>

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Testimonials */}
        <Testimonials />

        {/* Delivery Locations */}
        <DeliveryLocations />

        {/* FAQs */}
        <FAQs />
      </main>

      <Footer />
    </div>
  )
}
