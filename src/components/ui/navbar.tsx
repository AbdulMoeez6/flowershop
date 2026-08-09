"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Search, ShoppingBag, Menu, User, X, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./button"
import { useCartStore } from "@/store/useCartStore"

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/occasions", label: "Occasions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

interface NavbarProps {
  transparent?: boolean
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const pathname = usePathname()
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const showSolid = scrolled || !transparent || searchOpen

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

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
            <div className="relative w-10 h-10 overflow-hidden rounded-full border border-white/20 shadow-sm">
              <Image src="/logo.png" alt="Flower Shop Islamabad" fill className="object-cover" />
            </div>
            <span
              className={`font-serif text-xl md:text-2xl font-semibold tracking-tight transition-colors ${
                showSolid ? "text-foreground" : "text-white"
              }`}
            >
              Flower Shop Islamabad
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-center space-x-8 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  showSolid
                    ? pathname === link.href
                      ? "text-primary"
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
              onClick={() => setSearchOpen(true)}
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

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-md z-[60] flex items-center px-4 md:px-8 border-b border-border/40"
            >
              <form onSubmit={handleSearchSubmit} className="flex-1 max-w-3xl mx-auto flex items-center">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for flowers, occasions, bouquets..." 
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 h-full py-4 text-lg"
                  autoFocus
                />
                <Button variant="ghost" size="icon" type="button" onClick={() => setSearchOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
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
                  <div className="relative w-8 h-8 overflow-hidden rounded-full border border-primary/20 shadow-sm">
                    <Image src="/logo.png" alt="Flower Shop Islamabad" fill className="object-cover" />
                  </div>
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
                        ? "bg-primary/10 text-primary"
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
