"use client"

import Link from "next/link"
import { CloudImage as Image } from "@/components/ui/cloud-image"
import { motion } from "framer-motion"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
}

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsLDA4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgrFBX/2wBDAQMEBAUEBQkFBQkXDQsNFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AqwA//9k="

const organicShapes = [
  "61% 39% 52% 48% / 44% 59% 41% 56%",
  "41% 59% 43% 57% / 51% 41% 59% 49%",
  "54% 46% 36% 64% / 58% 39% 61% 42%",
  "38% 62% 64% 36% / 43% 53% 47% 57%",
  "65% 35% 38% 62% / 53% 66% 34% 47%",
  "48% 52% 68% 32% / 53% 45% 55% 47%"
]

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className="py-8 bg-cream/50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl md:text-4xl font-serif text-foreground">
            Perfect Flowers and Gifts For Every Occasion
          </h2>
          <p className="text-sm text-muted-foreground">
            Browse through our delightful array of floral designs and speciality gifts
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {categories.map((cat, idx) => {
            const shape1 = organicShapes[idx % organicShapes.length]
            const shape2 = organicShapes[(idx + 3) % organicShapes.length]

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="group flex flex-col items-center text-center space-y-3 w-24 md:w-28"
                >
                  <motion.div 
                    className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-md"
                    initial={{ borderRadius: shape1 }}
                    whileHover={{ borderRadius: shape2, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 80px, 96px"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-2xl">🌸</span>
                      </div>
                    )}
                    
                    {/* Soft inner glow overlay */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[inherit]" />
                  </motion.div>
                  <span className="text-xs md:text-sm font-medium text-foreground group-hover:text-gold transition-colors leading-tight">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
