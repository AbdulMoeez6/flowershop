import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { fetchOccasions } from "@/app/actions/categories"

export default async function OccasionsPage() {
  const occasions = await fetchOccasions()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar transparent={false} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=2000&auto=format&fit=crop"
            alt="Occasions Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 text-center space-y-4 px-4">
            <span className="text-sm uppercase tracking-[0.3em] text-white/90 font-medium">
              Celebrate Life
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white">
              For Every Occasion
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto font-light">
              Because every moment worth remembering deserves the perfect floral arrangement.
            </p>
          </div>
        </section>

        {/* Occasions List */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-8 space-y-24 md:space-y-40">
            {occasions?.length > 0 ? (
              occasions.map((occasion, idx) => {
                const isEven = idx % 2 === 0
                return (
                  <div
                    key={occasion.id}
                    id={occasion.slug}
                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-20`}
                  >
                    <div className="w-full md:w-1/2">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
                        <Image
                          src={occasion.image_url || "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=800&auto=format&fit=crop"}
                          alt={occasion.name}
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-6">
                      <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-serif text-foreground">
                          {occasion.name}
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                          {occasion.description}
                        </p>
                      </div>
                      <Link
                        href={`/shop?category=${occasion.slug}`}
                        className="inline-flex items-center text-primary font-medium hover:text-gold transition-colors group"
                      >
                        Shop {occasion.name}
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">No occasions found.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
