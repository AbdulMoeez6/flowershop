import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delivery Policy - Flower Shop',
  description: 'Delivery Policy for Flower Shop',
}

export default function DeliveryPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
      <h1 className="font-serif text-3xl md:text-5xl mb-8">Delivery Policy</h1>
      <div className="prose prose-stone max-w-none text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">1. Delivery Areas</h2>
        <p>We offer delivery services to select areas in Islamabad, Rawalpindi, Lahore, Karachi, Peshawar, and Faisalabad. Delivery availability may vary depending on the specific location and the product selected.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">2. Delivery Times</h2>
        <p>Our standard delivery times are between 9:00 AM and 9:00 PM. While we strive to deliver within the requested time frame, we cannot guarantee exact delivery times due to factors such as traffic, weather, and order volume.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">3. Delivery Process</h2>
        <p>If the recipient is not available at the time of delivery, our courier will attempt to contact them by phone. If we cannot reach the recipient, we may leave the delivery with a receptionist, neighbor, or in a safe place at the delivery address, or we may return the items to our shop and schedule a redelivery.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">4. Incorrect Addresses</h2>
        <p>Please ensure that all delivery details are correct. We are not responsible for failed deliveries due to incorrect or incomplete addresses provided by the sender. Additional charges may apply for redelivery to a corrected address.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">5. Delivery Charges</h2>
        <p>Delivery charges may vary based on the delivery location and the time of delivery. Any applicable delivery charges will be displayed during the checkout process.</p>
      </div>
    </div>
  )
}
