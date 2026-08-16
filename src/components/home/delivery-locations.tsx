import Link from "next/link"
import { MapPin } from "lucide-react"

const CITIES = [
  "Islamabad",
  "Rawalpindi",
  "Lahore",
  "Karachi",
  "Peshawar",
]

export function DeliveryLocations() {
  return (
    <section className="py-20 md:py-24 bg-cream relative overflow-hidden">
      {/* Decorative background floral element (optional) */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
        <span className="text-sm uppercase tracking-[0.3em] text-primary font-medium">
          Nationwide Reach
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-foreground mt-4 mb-6">
          Where We Deliver
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          We bring the freshest, most luxurious floral arrangements straight to your doorstep across major cities in Pakistan. 
          Experience premium delivery wherever you are.
        </p>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {CITIES.map((city) => (
            <Link
              key={city}
              href={`/delivery/${city.toLowerCase()}`}
              className="group flex items-center gap-2 bg-background/80 backdrop-blur border border-border px-6 py-4 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
            >
              <MapPin className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                {city}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
