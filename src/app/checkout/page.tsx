"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCartStore } from "@/store/useCartStore"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  deliveryDate: z.string().min(1, "Please select a delivery date"),
  paymentMethod: z.enum(["cod", "bank", "stripe"]),
  notes: z.string().optional(),
})

type CheckoutValues = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, getCartTotal } = useCartStore()
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod"
    }
  })

  const onSubmit = async (data: CheckoutValues) => {
    // In a real app, this submits to Supabase/Stripe
    console.log("Order Data:", data, "Items:", items)
    alert("Order placed successfully! Redirecting...")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-lg text-muted-foreground mb-4">Your cart is empty.</p>
          <Button asChild><Link href="/">Return to Shop</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-4xl font-serif mb-8 text-foreground">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <section className="space-y-4">
              <h2 className="text-xl font-medium border-b pb-2">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Full Name</label>
                  <input {...register("fullName")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                  {errors.fullName && <p className="text-xs text-rose-500">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" {...register("email")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                  {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input {...register("phone")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                  {errors.phone && <p className="text-xs text-rose-500">{errors.phone.message}</p>}
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-medium border-b pb-2">Delivery Details</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Complete Address</label>
                  <input {...register("address")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                  {errors.address && <p className="text-xs text-rose-500">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">City</label>
                    <select {...register("city")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                      <option value="">Select City</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Lahore">Lahore</option>
                    </select>
                    {errors.city && <p className="text-xs text-rose-500">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Delivery Date</label>
                    <input type="date" {...register("deliveryDate")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    {errors.deliveryDate && <p className="text-xs text-rose-500">{errors.deliveryDate.message}</p>}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Order Notes / Gift Message</label>
                  <textarea {...register("notes")} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-medium border-b pb-2">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 border p-4 rounded-lg cursor-pointer hover:bg-muted/50">
                  <input type="radio" value="cod" {...register("paymentMethod")} className="w-4 h-4 text-primary" />
                  <span className="font-medium">Cash on Delivery</span>
                </label>
                <label className="flex items-center space-x-3 border p-4 rounded-lg cursor-pointer hover:bg-muted/50">
                  <input type="radio" value="bank" {...register("paymentMethod")} className="w-4 h-4 text-primary" />
                  <span className="font-medium">Bank Transfer / EasyPaisa</span>
                </label>
              </div>
            </section>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-serif">
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </form>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-muted p-6 rounded-2xl sticky top-24">
              <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.variantName && <p className="text-muted-foreground text-xs">{item.variantName}</p>}
                      </div>
                      <p className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">Rs. {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-medium text-xl">
                  <span>Total</span>
                  <span>Rs. {getCartTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  )
}
