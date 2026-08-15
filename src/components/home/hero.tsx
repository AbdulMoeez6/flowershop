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
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden bg-black">
      {/* Preload the first two images for performance */}
      <link rel="preload" href={images[0]} as="image" />
      <link rel="preload" href={images[1]} as="image" />

      {/* Background images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
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
      
      {/* Dark gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 pointer-events-none" />

      {/* Hero Content - no card overlay */}
      <div className="relative z-10 text-center px-4 w-full max-w-3xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <span className="inline-block text-gold text-sm md:text-base uppercase tracking-[0.3em] font-medium [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
            Premium Florist in Pakistan
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] tracking-tight [text-shadow:0_4px_12px_rgba(0,0,0,0.7)]">
            2000+ Happy Customers
            <br />
            <span className="italic text-3xl md:text-4xl mt-4 block text-white/95 font-light [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">in islamabad, rawalpindi, lahore, karachi</span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light [text-shadow:0_2px_6px_rgba(0,0,0,0.8)]">
            Handcrafted floral arrangements delivered same-day. Made with love, for every moment that matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 py-7 text-base md:text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl transition-all border-none"
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-10 py-7 text-base md:text-lg font-medium border-white text-white hover:bg-white hover:text-primary bg-transparent shadow-xl transition-all"
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
