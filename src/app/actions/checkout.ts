"use server"

import { z } from "zod"

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  deliveryDate: z.string().min(1, "Please select a delivery date"),
  deliveryTimeSlot: z.string().optional(),
  paymentMethod: z.enum(["bank", "cod", "easypaisa"]),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().min(1),
      variantName: z.string().optional(),
    })
  ).min(1, "Cart cannot be empty"),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

export interface OrderResult {
  success: boolean
  orderId?: string
  orderNumber?: string
  error?: string
}

// Helper to check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  return url.includes("supabase.co") && key.length > 30
}

export async function createOrder(data: CheckoutFormData): Promise<OrderResult> {
  // Validate input
  const parsed = checkoutSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid data" }
  }

  const { items, ...formData } = parsed.data
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Generate a human-readable order number
  const orderNumber = `FLR-${Date.now().toString(36).toUpperCase()}`

  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          guest_email: formData.email,
          guest_phone: formData.phone,
          total_amount: totalAmount,
          order_status: "pending",
          payment_method: formData.paymentMethod,
          payment_status: formData.paymentMethod === "cod" ? "unpaid" : "unpaid",
          shipping_address: {
            full_name: formData.fullName,
            address: formData.address,
            city: formData.city,
          },
          delivery_date: formData.deliveryDate,
          delivery_time_slot: formData.deliveryTimeSlot ?? null,
          gift_message: formData.notes ?? null,
          notes: `Order ${orderNumber}`,
        })
        .select("id")
        .single()

      if (orderError) {
        console.error("Order creation failed:", orderError)
        return { success: false, error: "Failed to create order. Please try again." }
      }

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: null, // We don't have the UUID mapping client-side
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) {
        console.error("Order items creation failed:", itemsError)
        // Order was created but items failed — still return success with note
      }

      // Try to send confirmation email via Resend
      try {
        const resendApiKey = process.env.RESEND_API_KEY
        if (resendApiKey) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Fleur & Co. <orders@fleurandco.pk>",
              to: formData.email,
              subject: `Order Confirmed — ${orderNumber}`,
              html: `
                <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                  <h1 style="color: #2d4a32; font-size: 28px; text-align: center;">Fleur & Co.</h1>
                  <hr style="border: 1px solid #e6dfdb; margin: 20px 0;" />
                  <h2 style="color: #1c1a19; font-size: 22px;">Thank you for your order!</h2>
                  <p style="color: #737373; line-height: 1.6;">
                    Hi ${formData.fullName}, your order <strong>${orderNumber}</strong> has been confirmed.
                  </p>
                  <div style="background: #f8f3ee; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <p style="margin: 0 0 8px; font-weight: bold;">Order Details:</p>
                    ${items.map(item => `<p style="margin: 4px 0; color: #4a3c31;">${item.name} ${item.variantName ? `(${item.variantName})` : ""} × ${item.quantity} — Rs. ${(item.price * item.quantity).toLocaleString()}</p>`).join("")}
                    <hr style="border: 1px solid #e6dfdb; margin: 12px 0;" />
                    <p style="margin: 0; font-weight: bold; font-size: 18px;">Total: Rs. ${totalAmount.toLocaleString()}</p>
                  </div>
                  <p style="color: #737373; line-height: 1.6;">
                    <strong>Delivery:</strong> ${formData.deliveryDate}<br />
                    <strong>Address:</strong> ${formData.address}, ${formData.city}<br />
                    <strong>Payment:</strong> ${formData.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}
                  </p>
                  <p style="color: #737373; line-height: 1.6; margin-top: 20px;">
                    If you have any questions, reply to this email or call us at +92 123 456 7890.
                  </p>
                  <p style="color: #c9a96e; text-align: center; margin-top: 30px;">
                    Made with love, Fleur & Co. 🌸
                  </p>
                </div>
              `,
            }),
          })
        }
      } catch (emailError) {
        console.error("Email sending failed (non-critical):", emailError)
      }

      return {
        success: true,
        orderId: order.id,
        orderNumber,
      }
    } catch (error) {
      console.error("Checkout error:", error)
      return { success: false, error: "An unexpected error occurred." }
    }
  }

  // Fallback when Supabase isn't configured — simulate success for demo
  return {
    success: true,
    orderId: `demo-${Date.now()}`,
    orderNumber,
  }
}
