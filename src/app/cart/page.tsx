"use client"

import { useCartStore } from "@/store/useCartStore"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/components/providers/settings-provider"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsLDA4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgrFBX/2wBDAQMEBAUEBQkFBQkXDQsNFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AqwA//9k="

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore()
  const settings = useSettings()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-10 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-serif mb-8 text-foreground">Your Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <div className="space-y-2">
              <p className="text-xl font-serif text-foreground">Your cart is empty</p>
              <p className="text-muted-foreground text-sm">
                Looks like you haven&apos;t added any flowers to your cart yet.
              </p>
            </div>
            <Button asChild className="rounded-full px-8">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-5 p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-cream">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base font-medium truncate">{item.name}</h3>
                    {item.variantName && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.variantName}</p>
                    )}
                    {!settings.hide_prices && (
                      <p className="text-sm font-semibold mt-1">Rs. {item.price.toLocaleString()}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-rose hover:text-rose/80 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-cream p-6 rounded-2xl sticky top-24">
                <h2 className="font-serif text-xl mb-6">Order Summary</h2>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
                    </span>
                    <span className="font-medium">
                      {settings.hide_prices ? "—" : `Rs. ${getCartTotal().toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-muted-foreground italic text-xs">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      {settings.hide_prices ? "—" : `Rs. ${getCartTotal().toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {settings.hide_prices ? (
                  <div className="space-y-4">
                    <p className="text-sm text-rose font-medium text-center bg-rose/10 py-2 rounded-lg">
                      Online checkout is temporarily disabled.
                    </p>
                    {!settings.hide_phone_number && (
                      <Button
                        variant="accent"
                        className="w-full h-12 bg-[#25D366] text-white hover:bg-[#1ebe57] border-0 shadow-sm font-medium rounded-lg"
                        onClick={() => {
                          const productList = items.map(i => `${i.quantity}x ${i.name}`).join(", ")
                          const msg = encodeURIComponent(`Hi! I'd like to order these items from my cart: ${productList}`)
                          window.open(`https://wa.me/${settings.whatsapp_number}?text=${msg}`, "_blank")
                        }}
                      >
                        Order via WhatsApp
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button asChild className="w-full h-12 text-base font-medium rounded-lg">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                )}

                <p className="text-center text-xs text-muted-foreground mt-4">
                  Taxes and delivery charges calculated at checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
