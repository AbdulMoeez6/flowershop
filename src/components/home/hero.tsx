"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

const images = [
  "/1.jpeg",
  "/2.jpeg",
  "/3.jpeg",
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden bg-background">
      {/* Background images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: 8, ease: "linear" }
          }}
          className="absolute -inset-4 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${images[currentIndex]}')`,
          }}
        />
      </AnimatePresence>
      
      {/* Subtle top gradient just for the navigation bar visibility */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

      {/* Content in a glass card for legibility */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 bg-background/90 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border border-white/30"
        >
          <span className="inline-block text-gold text-xs md:text-sm uppercase tracking-[0.3em] font-medium drop-shadow-sm">
            Premium Florist in Pakistan
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-foreground leading-[1.1] tracking-tight drop-shadow-sm">
            2000+ Happy Customers
            <br />
            <span className="italic text-2xl md:text-3xl mt-3 block text-primary drop-shadow-sm">in islamabad, rawalpindi, lahore, karachi</span>
          </h1>
          <p className="text-foreground/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-medium drop-shadow-sm">
            Handcrafted floral arrangements delivered same-day. Made with love, for every moment that matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 py-6 text-base font-medium bg-primary hover:bg-gold hover:text-gold-foreground text-primary-foreground shadow-xl hover:shadow-2xl transition-all"
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-10 py-6 text-base font-medium border-primary/30 bg-transparent text-primary hover:bg-primary/10 hover:border-primary/50 hover:text-primary shadow-xl"
            >
              <Link href="/shop?category=occasions">Shop by Occasion</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  )
}
