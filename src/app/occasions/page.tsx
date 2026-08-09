import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const occasions = [
  {
    id: "birthday",
    title: "Birthday Blooms",
    description: "Celebrate another trip around the sun with bright, cheerful arrangements designed to make them smile.",
    image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=800&auto=format&fit=crop",
    color: "bg-orange-50",
    href: "/shop?q=birthday"
  },
  {
    id: "anniversary",
    title: "Anniversary Romance",
    description: "Mark your milestone with timeless red roses or their favorite blooms to say 'I love you' all over again.",
    image: "https://images.unsplash.com/photo-1518882515068-8b54289e3bca?q=80&w=800&auto=format&fit=crop",
    color: "bg-red-50",
    href: "/shop?q=anniversary"
  },
  {
    id: "wedding",
    title: "Wedding Elegance",
    description: "From bridal bouquets to venue centerpieces, discover our bespoke floral designs for your special day.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop",
    color: "bg-slate-50",
    href: "/shop?category=wedding"
  },
  {
    id: "valentines",
    title: "Valentine's Day",
    description: "Express your deepest affections with our luxury romantic collections, available for pre-order.",
    image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop",
    color: "bg-pink-50",
    href: "/shop?q=valentine"
  },
  {
    id: "sympathy",
    title: "Sympathy & Grace",
    description: "Convey your heartfelt condolences with elegant, subtle arrangements of white lilies and soft pastels.",
    image: "https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=800&auto=format&fit=crop",
    color: "bg-blue-50",
    href: "/shop?q=sympathy"
  }
]

export default function OccasionsPage() {
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
            {occasions.map((occasion, idx) => {
              const isEven = idx % 2 === 0
              return (
                <div 
                  key={occasion.id} 
                  id={occasion.id}
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-20`}
                >
                  <div className="w-full md:w-1/2">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
                      <Image
                        src={occasion.image}
                        alt={occasion.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-3xl md:text-5xl font-serif text-foreground">
                        {occasion.title}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                        {occasion.description}
                      </p>
                    </div>
                    <Link 
                      href={occasion.href}
                      className="inline-flex items-center text-primary font-medium hover:text-gold transition-colors group"
                    >
                      Shop {occasion.title}
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
