import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

const footerLinks = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "Bouquets", href: "/shop?category=bouquets" },
    { label: "Roses", href: "/shop?category=roses" },
    { label: "Gift Hampers", href: "/shop?category=gift-hampers" },
    { label: "Plants", href: "/shop?category=plants" },
  ],
  occasions: [
    { label: "Birthday", href: "/shop?occasion=birthday" },
    { label: "Anniversary", href: "/shop?occasion=anniversary" },
    { label: "Wedding", href: "/shop?occasion=wedding" },
    { label: "Valentine's Day", href: "/shop?occasion=valentines" },
    { label: "Sympathy", href: "/shop?occasion=sympathy" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/policies/privacy" },
    { label: "Terms of Service", href: "/policies/terms" },
    { label: "Delivery Policy", href: "/policies/delivery" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main footer */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block flex items-center space-x-2">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border border-white/20 shadow-sm">
                <Image src="/logo.png" alt="Flower Shop Islamabad" fill className="object-cover" />
              </div>
              <span className="font-serif text-2xl font-semibold text-white">Flower Shop Islamabad</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              We are the best flower delivery service in Islamabad, Rawalpindi, Lahore and Karachi. We have been providing the best quality flowers for many years.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-serif text-lg font-medium text-white mb-5">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Occasion links */}
          <div>
            <h3 className="font-serif text-lg font-medium text-white mb-5">Occasions</h3>
            <ul className="space-y-3">
              {footerLinks.occasions.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-serif text-lg font-medium text-white mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                <span>Office No 4, 1st Floor, VIP Plaza, I-8 Markaz, Islamabad, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <a href="tel:+923445130554" className="hover:text-white transition-colors">
                  +92 344 5130554
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="h-4 w-4 shrink-0 text-gold opacity-0" />
                <a href="tel:+923335130554" className="hover:text-white transition-colors">
                  +92 333 5130554
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <a href="mailto:info@flowershopislamabad.com" className="hover:text-white transition-colors">
                  info@flowershopislamabad.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                <div>
                  <p>Mon–Sat: 9:00 AM – 9:00 PM</p>
                  <p>Sunday: 10:00 AM – 6:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Flower Shop Islamabad. All rights reserved.</p>
          <div className="flex gap-6">
            {footerLinks.company.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
