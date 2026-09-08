"use client"

import * as React from "react"
import { ProductCard } from "@/components/ui/product-card"
import { Play, Pause } from "lucide-react"

interface ProductData {
  id: string
  name: string
  slug: string
  base_price: number
  compare_at_price: number | null
  image: string
  category: string
}

interface ProductCarouselProps {
  products: ProductData[]
  speedSeconds?: number
}

export function ProductCarousel({ products, speedSeconds }: ProductCarouselProps) {
  const [isPaused, setIsPaused] = React.useState(false)
  const resumeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  if (!products || products.length === 0) {
    return null
  }

  // Ensure there are at least 8 items in base list so that -50% translation is completely seamless
  let baseList = [...products]
  while (baseList.length < 8) {
    baseList = [...baseList, ...products]
  }

  // Two identical sets so translateX(-50%) resets back to 0% imperceptibly
  const duplicatedList = [...baseList, ...baseList]

  // Calculated duration: relaxed ~8.5s per item in baseList, or custom speedSeconds
  const duration = speedSeconds ?? Math.max(65, baseList.length * 8.5)

  const handleTouchStart = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    setIsPaused(true)
  }

  const handleTouchEnd = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 1800)
  }

  return (
    <div className="relative w-full overflow-hidden group/carousel">
      {/* Edge gradient fades for luxury boutique look */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 sm:w-8 md:w-16 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 sm:w-8 md:w-16 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Subtle play/pause control button visible on hover/active */}
      <button
        type="button"
        onClick={() => setIsPaused((prev) => !prev)}
        aria-label={isPaused ? "Resume product carousel" : "Pause product carousel"}
        className="absolute bottom-2 right-4 z-20 hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 hover:bg-background border border-border/60 text-muted-foreground hover:text-foreground text-[11px] shadow-sm backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-all duration-300"
      >
        {isPaused ? (
          <>
            <Play className="w-3 h-3 fill-current" />
            <span>Play</span>
          </>
        ) : (
          <>
            <Pause className="w-3 h-3 fill-current" />
            <span>Pause</span>
          </>
        )}
      </button>

      {/* Continuously moving track */}
      <div
        className={`animate-continuous-marquee py-2 px-3 sm:px-4 flex gap-3 sm:gap-4 md:gap-6 ${
          isPaused ? "is-paused" : ""
        }`}
        style={{
          // @ts-expect-error CSS variable for animation duration
          "--marquee-duration": `${duration}s`,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedList.map((product, idx) => (
          <div
            key={`${product.id}-${idx}`}
            className="w-[calc((100vw-40px)/2)] sm:w-[220px] md:w-[260px] lg:w-[280px] shrink-0 select-none"
          >
            <ProductCard
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.base_price}
              compareAtPrice={product.compare_at_price}
              image={product.image}
              category={product.category}
              animateOnView={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
