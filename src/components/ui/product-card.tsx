import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingBag, Heart } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  id: string
  name: string
  price: number
  compareAtPrice?: number
  image: string
  category: string
  className?: string
}

export function ProductCard({
  id,
  name,
  price,
  compareAtPrice,
  image,
  category,
  className,
}: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("group relative flex flex-col space-y-3", className)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 space-x-2">
          <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full glass hover:bg-white">
            <Heart className="h-5 w-5 text-rose-500" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
          <Button variant="default" className="rounded-full shadow-lg h-10 px-6 font-serif">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
        
        {/* Badges */}
        {compareAtPrice && compareAtPrice > price && (
          <div className="absolute top-4 left-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
            Sale
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{category}</div>
        <Link href={`/product/${id}`} className="font-serif text-lg font-medium hover:underline">
          {name}
        </Link>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Rs. {price.toLocaleString()}</span>
          {compareAtPrice && (
            <span className="text-xs text-muted-foreground line-through">
              Rs. {compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
