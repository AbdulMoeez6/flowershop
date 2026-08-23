"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function WelcomeModal({ categories }: { categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)

  useEffect(() => {
    // Only show once per session or you can use localStorage for persistent dismissal
    const hasSeen = sessionStorage.getItem("welcome-seen")
    if (!hasSeen) {
      const timer = setTimeout(() => setIsOpen(true), 1500) // delay a bit for dramatic effect
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem("welcome-seen", "true")
  }

  const handleNext = () => {
    setStep(2)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/50 p-2 text-neutral-500 backdrop-blur-md transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content Area */}
            <div className="relative">
              {/* Decorative Header */}
              <div className="h-32 w-full bg-primary/10 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1000')] bg-cover bg-center opacity-30" />
                 <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                 <div className="relative z-10 h-16 w-16 mb-4 rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-sm flex items-center justify-center">
                   <Image src="/logo.png" alt="Floral Village Logo" width={48} height={48} className="object-contain" />
                 </div>
              </div>

              <div className="px-8 pb-8 pt-2">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <h2 className="mb-3 font-serif text-3xl font-semibold tracking-tight text-neutral-900">
                        Welcome to Floral Village
                      </h2>
                      <p className="mb-8 text-neutral-600 leading-relaxed">
                        Discover Islamabad's most premium floral arrangements. Handcrafted with love, delivered with care to make every moment unforgettable.
                      </p>
                      
                      <Button 
                        onClick={handleNext}
                        className="w-full rounded-full py-6 text-lg"
                      >
                        Explore Collections
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="mb-4 text-center font-serif text-2xl font-semibold tracking-tight text-neutral-900">
                        Find the Perfect Arrangement
                      </h2>
                      
                      <div className="mb-6 grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {categories.slice(0, 6).map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug}`}
                            onClick={handleClose}
                            className="group relative flex h-20 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 text-center"
                          >
                            {cat.image_url && (
                              <div 
                                className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${cat.image_url})` }}
                              />
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                            <span className="relative z-10 font-medium text-white shadow-sm drop-shadow-md px-2">
                              {cat.name}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setStep(1)}
                          className="rounded-full w-1/3"
                        >
                          Back
                        </Button>
                        <Button 
                          asChild
                          onClick={handleClose}
                          className="w-2/3 rounded-full"
                        >
                          <Link href="/shop">View All Flowers</Link>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
