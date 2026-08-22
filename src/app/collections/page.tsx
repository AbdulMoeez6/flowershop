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
          <div className="container mx-auto px-4 md:px-8">
            {collections?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="group relative"
                  >
                    <Link href={`/shop?category=${collection.slug}`} className="block relative w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all">
                      <Image
                        src={collection.image_url || "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=1200&auto=format&fit=crop"}
                        alt={collection.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end gap-3 h-full">
                        <div className="space-y-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <h2 className="text-3xl md:text-4xl font-serif text-white">
                            {collection.name}
                          </h2>
                          <p className="text-sm text-white/90 font-light line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {collection.description}
                          </p>
                          <div className="flex items-center text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                            <span className="border-b border-white/40 pb-0.5">Explore Collection</span>
                            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">No collections found.</p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-secondary text-secondary-foreground py-24 text-center">
          <div className="container mx-auto px-4 space-y-6">
            <h2 className="text-4xl font-serif text-foreground">Not sure what to choose?</h2>
            <p className="text-secondary-foreground/80 max-w-xl mx-auto">
              Let our expert florists create a custom arrangement tailored exactly to your preferences.
            </p>
            <Link
              href="/contact"
              className="inline-block mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-gold hover:text-gold-foreground shadow-md hover:shadow-lg transition-all"
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
