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
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: 8, ease: "linear" }
          }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${images[currentIndex]}')`,
          }}
        />
      </AnimatePresence>
      
      {/* Gradient overlay - stronger at the top to ensure the navbar is always visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/70 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <span className="inline-block text-gold text-xs md:text-sm uppercase tracking-[0.3em] font-medium">
            Premium Florist in Pakistan
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white leading-[1.1] tracking-tight">
            2000+ Happy Customers
            <br />
            <span className="italic text-2xl md:text-4xl mt-2 block">in islamabad, rawalpindi, lahore, karachi</span>
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Handcrafted floral arrangements delivered same-day. Made with love, for every moment that matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-10 py-6 text-base font-medium bg-gold hover:bg-gold/90 text-white shadow-xl hover:shadow-2xl transition-all"
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-10 py-6 text-base font-medium border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
              <Link href="/shop?category=occasions">Shop by Occasion</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </section>
  )
}
