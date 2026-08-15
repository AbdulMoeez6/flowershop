import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Flower Shop',
  description: 'Privacy policy for Flower Shop',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
      <h1 className="font-serif text-3xl md:text-5xl mb-8">Privacy Policy</h1>
      <div className="prose prose-stone max-w-none text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">1. Information We Collect</h2>
        <p>We collect information that you provide directly to us when you create an account, make a purchase, or contact us for support. This may include your name, email address, phone number, shipping address, and payment information.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">2. How We Use Your Information</h2>
        <p>We use the information we collect to fulfill your orders, communicate with you about your orders, provide customer support, and improve our services.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">3. Information Sharing</h2>
        <p>We do not sell or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">4. Data Security</h2>
        <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>

        <h2 className="text-xl font-serif mt-8 mb-4 text-foreground">5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at info@flowershopislamabad.com.</p>
      </div>
    </div>
  )
}
