import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { fetchCollections } from "@/app/actions/categories"

export default async function CollectionsPage() {
  const collections = await fetchCollections()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar transparent={false} />

      <main className="flex-1">
        {/* Lookbook Hero Section */}
        <section className="bg-cream py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-8 text-center space-y-6">
            <span className="text-sm uppercase tracking-[0.3em] text-gold font-medium">
              The Lookbook
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground max-w-4xl mx-auto">
              Curated Collections by Fleur & Co.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              Explore our defining styles. Each collection is thoughtfully designed to bring a unique aesthetic to your space or gift.
            </p>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-8 space-y-32">
            {collections?.length > 0 ? (
              collections.map((collection) => (
                <div
                  key={collection.id}
                  className="group relative"
                >
                  <Link href={`/shop?category=${collection.slug}`} className="block relative w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-xl shadow-2xl">
                    <Image
                      src={collection.image_url || "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=1200&auto=format&fit=crop"}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 flex flex-col md:flex-row justify-between items-end gap-6">
                      <div className="space-y-4 max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-serif text-white">
                          {collection.name}
                        </h2>
                        <p className="text-lg text-white/80 font-light">
                          {collection.description}
                        </p>
                      </div>
                      <div className="flex items-center text-white font-medium hover:text-gold transition-colors shrink-0">
                        Explore Collection
                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">No collections found.</p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-primary text-white py-24 text-center">
          <div className="container mx-auto px-4 space-y-6">
            <h2 className="text-4xl font-serif">Not sure what to choose?</h2>
            <p className="text-white/80 max-w-xl mx-auto">
              Let our expert florists create a custom arrangement tailored exactly to your preferences.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-4 px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-gold hover:text-white transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
