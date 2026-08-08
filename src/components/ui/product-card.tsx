"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag, Heart } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/store/useCartStore"

// Tiny 1x1 blurred placeholder (warm cream tone)
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsLDA4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgrFBX/2wBDAQMEBAUEBQkFBQkXDQsNFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AqwA//9k="

// Fallback image if loading fails
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=60&w=400&auto=format&fit=crop"

interface ProductCardProps {
  id: string
  name: string
  slug?: string
  price: number
  compareAtPrice?: number | null
  image: string
  category?: string
  className?: string
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  category,
  className,
}: ProductCardProps) {
  const [imgSrc, setImgSrc] = React.useState(image)
  const [imgError, setImgError] = React.useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ id, name, price, image: imgSrc })
  }

  const productHref = slug ? `/product/${slug}` : `/product/${id}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={cn("group relative flex flex-col", className)}
    >
      {/* Image Container */}
      <Link href={productHref} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream block">
        <Image
          src={imgError ? FALLBACK_IMAGE : imgSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          onError={() => {
            if (!imgError) {
              setImgError(true)
              setImgSrc(FALLBACK_IMAGE)
            }
          }}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Hover action buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 gap-2 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-rose shadow-md"
            onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            className="rounded-full shadow-lg h-10 px-5 text-sm"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-1.5 h-4 w-4" />
            Add to Cart
          </Button>
        </div>

        {/* Sale badge */}
        {discount && (
          <div className="absolute top-3 left-3 rounded-full bg-rose text-white px-3 py-1 text-xs font-semibold shadow-md">
            -{discount}%
          </div>
        )}
      </Link>

      {/* Text content */}
      <div className="flex flex-col mt-4 space-y-1.5">
        {category && (
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
            {category}
          </span>
        )}
        <Link
          href={productHref}
          className="font-serif text-lg font-medium text-foreground hover:text-forest transition-colors leading-snug"
        >
          {name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            Rs. {price.toLocaleString()}
          </span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-xs text-muted-foreground line-through">
              Rs. {compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
