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
  const [occasions, setOccasions] = React.useState<{id: string, name: string, slug: string}[]>([])
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

  React.useEffect(() => {
    // Fetch occasions dynamically on mount
    import("@/app/actions/categories").then((mod) => {
      mod.fetchOccasions().then((data) => {
        if (data && data.length > 0) {
          setOccasions(data)
        }
      })
    })
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
          <Link href="/" className="flex items-center space-x-3 mr-8">
            <div className="relative w-14 h-14 md:w-16 md:h-16 overflow-hidden rounded-full border border-white/20 shadow-sm">
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
            {navLinks.map((link) => {
              if (link.label === "Occasions") {
                return (
                  <div key={link.href} className="relative group">
                    <Link
                      href={link.href}
                      className={`flex items-center text-sm font-medium transition-colors relative py-1 ${
                        showSolid
                          ? pathname.startsWith(link.href)
                            ? "text-primary"
                            : "text-foreground/70 hover:text-foreground"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {link.label}
                      <svg className="w-4 h-4 ml-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {pathname.startsWith(link.href) && (
                        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gold rounded-full" />
                      )}
                    </Link>
                    
                    {/* Dropdown Menu */}
                    {occasions.length > 0 && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="bg-background shadow-lg rounded-md border border-border/40 py-2 min-w-[200px]">
                          {occasions.map((occ) => (
                            <Link
                              key={occ.id}
                              href={`/shop?category=${occ.slug}`}
                              className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-primary transition-colors"
                            >
                              {occ.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
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
              )
            })}
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
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 overflow-hidden rounded-full border border-primary/20 shadow-sm">
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
