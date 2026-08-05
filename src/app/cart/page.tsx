"use client"

import { useCartStore } from "@/store/useCartStore"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-4xl font-serif mb-8 text-foreground">Your Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-lg text-muted-foreground">Your cart is currently empty.</p>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-border bg-card">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-serif text-lg font-medium">{item.name}</h3>
                    {item.variantName && <p className="text-sm text-muted-foreground">{item.variantName}</p>}
                    <p className="font-medium mt-1">Rs. {item.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 hover:bg-rose-100 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-muted p-6 rounded-2xl sticky top-24">
                <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">Rs. {getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-muted-foreground italic">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>Rs. {getCartTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <Button asChild className="w-full h-12 text-lg font-serif">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Taxes and delivery charges are calculated during checkout.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
