"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"
import { Minus, Plus, ShoppingBag, Heart, Truck } from "lucide-react"

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addItem } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState("Standard")

  // Mock product data
  const product = {
    id: id as string,
    name: "Crimson Elegance",
    price: 8500,
    description: "A breathtaking arrangement of deep red roses and complementary foliage, perfect for expressing profound love and admiration. Hand-tied by our expert florists with premium wrapping.",
    careInstructions: "Keep in a cool place out of direct sunlight. Change water every 2 days and trim stems by 1 inch.",
    images: [
      "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop"
    ],
    variants: ["Standard", "Premium", "Luxury"]
  }

  const [activeImage, setActiveImage] = useState(product.images[0])

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      variantName: selectedVariant
    })
    alert("Added to cart!")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-muted rounded-2xl overflow-hidden">
              <Image src={activeImage} alt={product.name} fill className="object-cover" priority />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif text-foreground">{product.name}</h1>
              <p className="text-2xl font-medium">Rs. {product.price.toLocaleString()}</p>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            
            <div className="space-y-4">
              <h3 className="font-medium">Size / Variant</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map(variant => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-6 py-3 rounded-md border transition-colors ${
                      selectedVariant === variant 
                        ? 'border-primary bg-primary/10 text-foreground' 
                        : 'border-border hover:border-primary/50 text-muted-foreground'
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-8">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-border rounded-md h-12">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 h-full text-muted-foreground hover:text-foreground">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 h-full text-muted-foreground hover:text-foreground">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <Button onClick={handleAddToCart} size="lg" className="flex-1 h-12 font-serif text-lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                
                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              <Button variant="accent" className="w-full h-12 bg-[#25D366] text-white hover:bg-[#1ebe57] border-0 shadow-sm font-medium">
                Order via WhatsApp
              </Button>
            </div>

            <div className="bg-muted p-6 rounded-xl space-y-4 text-sm mt-8">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Same Day Delivery in Islamabad & Rawalpindi</p>
                  <p className="text-muted-foreground">Order before 6:00 PM for same day delivery.</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  )
}
