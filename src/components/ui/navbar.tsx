"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingBag, Menu, User, X, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./button"
import { useCartStore } from "@/store/useCartStore"

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=bouquets", label: "Collections" },
  { href: "/shop?category=occasions", label: "Occasions" },
  { href: "/about", label: "About" },
]

interface NavbarProps {
  transparent?: boolean
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()
  const items = useCartStore((s) => s.items)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const showSolid = scrolled || !transparent

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showSolid
            ? "bg-background/95 backdrop-blur-lg shadow-sm border-b border-border/40"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 md:h-20 items-center px-4 md:px-8">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 mr-8">
            <span className={`transition-colors ${showSolid ? "text-pink-500" : "text-pink-400"}`}>
              {/* Replace with actual logo image later */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 3.18.5"/><path d="M12 7.5A4.5 4.5 0 1 0 8.82 8"/><path d="M12 7.5V14"/><path d="M12 14a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 0 1-4.5-4.5"/><path d="M12 14a4.5 4.5 0 1 0-4.5 4.5A4.5 4.5 0 0 0 12 14"/></svg>
            </span>
            <span
              className={`font-serif text-xl md:text-2xl font-semibold tracking-tight transition-colors ${
                showSolid ? "text-foreground" : "text-white"
              }`}
            >
              Flower Shop Islamabad
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  showSolid
                    ? pathname === link.href
                      ? "text-forest"
                      : "text-foreground/70 hover:text-foreground"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gold rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right-side icons */}
          <div className="flex items-center space-x-1 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className={showSolid ? "" : "text-white/80 hover:text-white hover:bg-white/10"}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Link href="/account">
              <Button
                variant="ghost"
                size="icon"
                className={showSolid ? "" : "text-white/80 hover:text-white hover:bg-white/10"}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className={`relative ${showSolid ? "" : "text-white/80 hover:text-white hover:bg-white/10"}`}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-gold text-white text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-background z-[70] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center space-x-2">
                  <span className="text-pink-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 7.5a4.5 4.5 0 1 1 3.18.5"/><path d="M12 7.5A4.5 4.5 0 1 0 8.82 8"/><path d="M12 7.5V14"/><path d="M12 14a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 0 1-4.5-4.5"/><path d="M12 14a4.5 4.5 0 1 0-4.5 4.5A4.5 4.5 0 0 0 12 14"/></svg>
                  </span>
                  <span className="font-serif text-xl font-semibold">Flower Shop Islamabad</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 overflow-y-auto py-6 px-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-forest/10 text-forest"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-border space-y-3">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground"
                >
                  <User className="h-5 w-5" /> My Account
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground"
                >
                  <ShoppingBag className="h-5 w-5" /> Cart
                  {itemCount > 0 && (
                    <span className="ml-auto bg-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar — only when NOT transparent (non-hero pages) */}
      {!transparent && <div className="h-16 md:h-20" />}
    </>
  )
}
