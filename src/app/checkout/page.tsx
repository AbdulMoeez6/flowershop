"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCartStore } from "@/store/useCartStore"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { createOrder } from "@/app/actions/checkout"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, ShoppingBag, CreditCard, Truck } from "lucide-react"

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsLDA4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgrFBX/2wBDAQMEBAUEBQkFBQkXDQsNFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxf/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AqwA//9k="

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  deliveryDate: z.string().min(1, "Please select a delivery date"),
  deliveryTimeSlot: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank"]),
  notes: z.string().optional(),
})

type CheckoutValues = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCartStore()
  const [orderResult, setOrderResult] = useState<{
    success: boolean
    orderNumber?: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
      city: "Islamabad",
    },
  })

  const onSubmit = async (data: CheckoutValues) => {
    const result = await createOrder({
      ...data,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variantName: item.variantName,
      })),
    })

    if (result.success) {
      setOrderResult({ success: true, orderNumber: result.orderNumber })
      clearCart()
    } else {
      alert(result.error ?? "Something went wrong. Please try again.")
    }
  }

  // ── Order Confirmation ──
  if (orderResult?.success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-lg w-full text-center space-y-6 py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your order. Your order number is:
            </p>
            <div className="bg-cream rounded-xl p-6 inline-block">
              <span className="text-2xl font-serif font-bold text-forest">
                {orderResult.orderNumber}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent. We&apos;ll notify you when your flowers are on their way! 🌸
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button asChild variant="outline" className="rounded-full px-6">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <Button asChild className="rounded-full px-6">
                <Link href="/account">View Orders</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Empty Cart ──
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
          <p className="text-lg font-serif text-foreground">Your cart is empty</p>
          <Button asChild className="rounded-full px-8">
            <Link href="/shop">Browse Flowers</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Get minimum delivery date (tomorrow) ──
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-serif mb-8 text-foreground">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-forest text-white text-xs flex items-center justify-center font-bold">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Full Name</label>
                  <input {...register("fullName")} className="input-premium" placeholder="Ahmed Khan" />
                  {errors.fullName && <p className="text-xs text-rose">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" {...register("email")} className="input-premium" placeholder="ahmed@example.com" />
                  {errors.email && <p className="text-xs text-rose">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input {...register("phone")} className="input-premium" placeholder="+92 300 1234567" />
                  {errors.phone && <p className="text-xs text-rose">{errors.phone.message}</p>}
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-forest text-white text-xs flex items-center justify-center font-bold">2</span>
                Delivery Details
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Complete Address</label>
                  <input {...register("address")} className="input-premium" placeholder="House 12, Street 4, F-7/2" />
                  {errors.address && <p className="text-xs text-rose">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">City</label>
                    <select {...register("city")} className="input-premium">
                      <option value="">Select City</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Lahore">Lahore</option>
                    </select>
                    {errors.city && <p className="text-xs text-rose">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Delivery Date</label>
                    <input type="date" {...register("deliveryDate")} min={minDate} className="input-premium" />
                    {errors.deliveryDate && <p className="text-xs text-rose">{errors.deliveryDate.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Preferred Time Slot</label>
                  <select {...register("deliveryTimeSlot")} className="input-premium">
                    <option value="">Any time</option>
                    <option value="9am-12pm">Morning (9 AM – 12 PM)</option>
                    <option value="12pm-3pm">Afternoon (12 PM – 3 PM)</option>
                    <option value="3pm-6pm">Evening (3 PM – 6 PM)</option>
                    <option value="6pm-9pm">Night (6 PM – 9 PM)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Order Notes / Gift Message</label>
                  <textarea {...register("notes")} rows={3} className="input-premium !h-auto" placeholder="Any special instructions or a message for the recipient..." />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-forest text-white text-xs flex items-center justify-center font-bold">3</span>
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-4 border border-border p-4 rounded-xl cursor-pointer hover:bg-cream/50 transition-colors has-[:checked]:border-forest has-[:checked]:bg-forest/5">
                  <input type="radio" value="cod" {...register("paymentMethod")} className="w-4 h-4 accent-forest" />
                  <Truck className="h-5 w-5 text-forest" />
                  <div>
                    <span className="font-medium text-sm">Cash on Delivery</span>
                    <p className="text-xs text-muted-foreground">Pay when your flowers arrive</p>
                  </div>
                </label>
                <label className="flex items-center gap-4 border border-border p-4 rounded-xl cursor-pointer hover:bg-cream/50 transition-colors has-[:checked]:border-forest has-[:checked]:bg-forest/5">
                  <input type="radio" value="bank" {...register("paymentMethod")} className="w-4 h-4 accent-forest" />
                  <CreditCard className="h-5 w-5 text-forest" />
                  <div>
                    <span className="font-medium text-sm">Bank Transfer / EasyPaisa</span>
                    <p className="text-xs text-muted-foreground">Transfer details will be shared after order</p>
                  </div>
                </label>
              </div>
            </section>

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full h-13 text-base font-medium rounded-lg"
            >
              {isSubmitting ? "Placing Order..." : `Place Order — Rs. ${getCartTotal().toLocaleString()}`}
            </Button>
          </form>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-cream p-6 rounded-2xl sticky top-24">
              <h2 className="font-serif text-xl mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                      <div className="absolute -top-1 -right-1 bg-forest text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 flex justify-between text-sm min-w-0">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        {item.variantName && (
                          <p className="text-muted-foreground text-xs">{item.variantName}</p>
                        )}
                      </div>
                      <p className="font-medium shrink-0 ml-2">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
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
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-xl">
                  <span>Total</span>
                  <span>Rs. {getCartTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
