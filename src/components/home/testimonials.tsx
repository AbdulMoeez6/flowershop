"use client"

import { useEffect, useRef } from "react"

import { motion } from "framer-motion"
import { Star, ChevronRight } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Ayesha R.",
    role: "Local Guide",
    quote:
      "The 'Midnight Romance' bouquet was absolutely stunning! My husband was blown away. The same-day delivery was a lifesaver — ordered at 4 PM and it arrived by 7 PM. Will definitely order again!",
    rating: 5,
  },
  {
    name: "Bilal K.",
    role: "14 Reviews",
    quote:
      "Fleur & Co. handled all the floral arrangements for our nikah ceremony. The bridal bouquet was beyond beautiful, and the table arrangements added such elegance to the venue. Highly recommend!",
    rating: 5,
  },
  {
    name: "Sara M.",
    role: "Local Guide",
    quote:
      "I've ordered flowers from many places in Islamabad, but Fleur & Co. is hands down the best. The Pastel Dream bouquet looked exactly like the photos — fresh, vibrant, and beautifully wrapped.",
    rating: 5,
  },
  {
    name: "Omer F.",
    role: "6 Reviews",
    quote:
      "Excellent customer service! I needed a custom arrangement for my mother's birthday and they delivered perfectly. The flowers lasted for over a week. Top notch quality in twin cities.",
    rating: 5,
  },
  {
    name: "Zainab A.",
    role: "Local Guide",
    quote:
      "Such a premium experience from start to finish. The packaging alone is gorgeous. It's my go-to shop whenever I need to send luxury flowers to family in Rawalpindi.",
    rating: 5,
  },
]

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const maxScroll = scrollWidth - clientWidth
        
        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
        } else {
          scrollRef.current.scrollBy({ left: 344, behavior: "smooth" })
        }
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="section-padding bg-cream">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center space-y-4 mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
            Loved by Customers
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground">
            Our Google Verified Reviews
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4">
          
          {/* Business Summary Card (Fixed) */}
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 shadow-md flex flex-col items-center justify-center min-w-[320px] w-[320px] h-[320px] shrink-0 text-center relative overflow-hidden mx-auto lg:mx-0">
            <div className="relative w-24 h-24 mb-4">
              <Image src="/logo.png" alt="Floral Village Islamabad Logo" fill className="object-contain" quality={100} sizes="96px" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Floral Village Islamabad</h3>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm font-medium text-primary-foreground/80 mb-6">
              142 Google reviews
            </p>
            <a 
              href="https://share.google/yZmryGcrh7KOZpy0f" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-auto px-6 py-2.5 rounded-full border border-gold text-gold font-medium text-sm hover:bg-gold hover:text-white transition-colors"
            >
              Write a review
            </a>
          </div>

          {/* Scrolling Reviews Container */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-primary/5 rounded-3xl p-8 shadow-sm border border-primary/15 flex flex-col min-w-[320px] w-[320px] h-[320px] shrink-0 snap-center"
              >
                {/* Header with Google G */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-gold text-gold"
                      />
                    ))}
                  </div>
                  {/* Minimalist Google 'G' icon */}
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>

                {/* Quote */}
                <p className="text-sm text-foreground/80 leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
