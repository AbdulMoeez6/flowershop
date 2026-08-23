import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Floral Village',
  description: 'Terms of Service for Floral Village',
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
      <h1 className="font-serif text-3xl md:text-5xl mb-8">Terms of Service</h1>
      <div className="prose prose-stone max-w-none text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">1. Agreement to Terms</h2>
        <p>By accessing or using our website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">2. Products and Pricing</h2>
        <p>All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for all products are subject to change without notice.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">3. Orders and Payments</h2>
        <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. You agree to provide current, complete, and accurate purchase and account information for all purchases made.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">4. Substitutions</h2>
        <p>Due to the seasonal nature of flowers, occasionally, substitutions may be necessary. We will make every effort to maintain the "look and feel" of the arrangement by considering the overall shape, size, style, and color combinations.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">5. Changes to Terms</h2>
        <p>We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes.</p>
      </div>
    </div>
  )
}
