import * as React from "react"
import Link from "next/link"
import { Search, ShoppingBag, Menu, User } from "lucide-react"
import { Button } from "./button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-serif text-xl font-medium sm:inline-block">
              Fleur & Co.
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/collections"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Collections
            </Link>
            <Link
              href="/occasions"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Occasions
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between md:justify-end space-x-2 md:space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-serif text-lg font-medium md:hidden ml-2">Fleur & Co.</span>
          </div>
          <nav className="flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
              <span className="sr-only">Cart</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
