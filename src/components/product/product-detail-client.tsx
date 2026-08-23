"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { useSettings } from "@/components/providers/settings-provider"
import { Minus, Plus, ShoppingBag, Heart, Truck, Shield, Clock } from "lucide-react"
import { motion } from "framer-motion"

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsLDA4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgrFBX/2wBDAQMEBAUEBQkFBQkXDQsNFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AqwA//9k="

interface ProductData {
  id: string
  name: string
  slug: string
  short_description: string
  long_description?: string
  base_price: number
  compare_at_price: number | null
  stock: number
  image: string
  images?: string[]
  category: string
  variants?: { id: string; name: string; price_adjustment: number; stock: number }[]
}

export function ProductDetailClient({ product }: { product: ProductData }) {
  const images = product.images?.length ? product.images : [product.image]
  const [activeImage, setActiveImage] = useState(images[0])
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] ?? null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const settings = useSettings()

  const effectivePrice = product.base_price + (selectedVariant?.price_adjustment ?? 0)

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariant?.id ?? "default"}`,
      name: product.name,
      price: effectivePrice,
      image: images[0],
      variantName: selectedVariant?.name,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="relative aspect-[4/5] bg-cream rounded-2xl overflow-hidden">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
            {/* CSS Watermark */}
            <div className="absolute bottom-4 right-5 pointer-events-none opacity-70 z-10">
              <span className="text-white text-sm md:text-base font-bold tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                floral village islamabad
              </span>
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                    activeImage === img
                      ? "border-gold shadow-md"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          {product.category && (
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-3">
              {product.category}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground leading-tight">
            {product.name}
          </h1>

          {!settings.hide_prices && (
            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl font-semibold text-foreground">
                Rs. {effectivePrice.toLocaleString()}
              </span>
              {product.compare_at_price && product.compare_at_price > product.base_price && (
                <span className="text-lg text-muted-foreground line-through">
                  Rs. {product.compare_at_price.toLocaleString()}
                </span>
              )}
              {product.compare_at_price && product.compare_at_price > product.base_price && (
                <span className="text-xs font-semibold text-white bg-rose px-2.5 py-1 rounded-full">
                  Save {Math.round(((product.compare_at_price - product.base_price) / product.compare_at_price) * 100)}%
                </span>
              )}
            </div>
          )}

          <p className="text-muted-foreground leading-relaxed mt-6">
            {product.short_description}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-8 space-y-3">
              <h3 className="text-sm font-medium text-foreground">Size / Variant</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-5 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      selectedVariant?.id === variant.id
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20"
                        : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {variant.name}
                    {!settings.hide_prices && variant.price_adjustment > 0 && (
                      <span className="text-xs text-muted-foreground ml-1.5">
                        (+Rs. {variant.price_adjustment.toLocaleString()})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-8 space-y-4 border-t border-border pt-8">
            <div className="flex items-center gap-4">
              {/* Quantity selector */}
              {!settings.hide_prices && (
                <>
                  <div className="flex items-center border border-border rounded-lg h-12">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 h-full text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 h-full text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to cart button */}
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className={`flex-1 h-12 text-base font-medium rounded-lg transition-all ${
                      addedToCart ? "bg-green-600 hover:bg-green-700" : ""
                    }`}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    {addedToCart ? "Added! âœ“" : "Add to Cart"}
                  </Button>
                </>
              )}

              {/* Wishlist */}
              <Button variant="outline" size="icon" className="h-12 w-12 shrink-0 rounded-lg">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
            </div>

            {/* WhatsApp order */}
            <Button
              variant="accent"
              className="w-full h-12 bg-[#25D366] text-white hover:bg-[#1ebe57] border-0 shadow-sm font-medium rounded-lg"
              onClick={() => {
                const productUrl = typeof window !== 'undefined' ? window.location.href : '';
                const msg = encodeURIComponent(
                  settings.hide_prices
                    ? `Hi! I'd like to order "${product.name}" (${selectedVariant?.name ?? "Standard"})\n\nProduct Link: ${productUrl}`
                    : `Hi! I'd like to order "${product.name}" (${selectedVariant?.name ?? "Standard"}) — Rs. ${effectivePrice.toLocaleString()}\n\nProduct Link: ${productUrl}`
                )
                window.open(`https://wa.me/${settings.whatsapp_number}?text=${msg}`, "_blank")
              }}
            >
              Order via WhatsApp
            </Button>
          </div>

          {/* Info badges */}
          <div className="bg-cream rounded-xl p-6 mt-8 space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Same Day Delivery</p>
                <p className="text-muted-foreground">Order before 6:00 PM for delivery in Islamabad & Rawalpindi.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Freshness Guaranteed</p>
                <p className="text-muted-foreground">3-day freshness guarantee on all arrangements.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Scheduled Delivery</p>
                <p className="text-muted-foreground">Choose your preferred date and 2-hour time slot.</p>
              </div>
            </div>
          </div>

          {/* Long description */}
          {product.long_description && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="font-serif text-xl mb-4">Description</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {product.long_description}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
