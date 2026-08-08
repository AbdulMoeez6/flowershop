"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Ayesha R.",
    role: "Anniversary Surprise",
    quote:
      "The 'Midnight Romance' bouquet was absolutely stunning! My husband was blown away. The same-day delivery was a lifesaver — ordered at 4 PM and it arrived by 7 PM. Will definitely order again!",
    rating: 5,
  },
  {
    name: "Bilal K.",
    role: "Wedding Flowers",
    quote:
      "Fleur & Co. handled all the floral arrangements for our nikah ceremony. The bridal bouquet was beyond beautiful, and the table arrangements added such elegance to the venue. Highly recommend!",
    rating: 5,
  },
  {
    name: "Sara M.",
    role: "Birthday Gift",
    quote:
      "I've ordered flowers from many places in Islamabad, but Fleur & Co. is hands down the best. The Pastel Dream bouquet looked exactly like the photos — fresh, vibrant, and beautifully wrapped.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="section-padding bg-cream">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
            Loved by Customers
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card rounded-2xl p-8 shadow-sm border border-border/50 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-gold text-gold"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-foreground/80 leading-relaxed flex-1 italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 pt-4 border-t border-border/40">
                <p className="font-medium text-sm text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
