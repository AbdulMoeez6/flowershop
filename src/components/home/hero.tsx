"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

/* ───────────────────────────────────────────
   Slide data — edit here to add/change slides
   ─────────────────────────────────────────── */
interface HeroSlide {
  image: string
  imageMobile: string
  headline: string
  subheadline: string
  ctaText: string
  ctaLink: string
  ctaSecondaryText?: string
  ctaSecondaryLink?: string
}

const slides: HeroSlide[] = [
  {
    image: "/hero-slide-1.jpg",
    imageMobile: "/hero-slide-1-mobile.jpg",
    headline: "Fresh Flowers,\nDelivered Today",
    subheadline: "Handcrafted bouquets made with love for every moment that matters",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    ctaSecondaryText: "Browse Collections",
    ctaSecondaryLink: "/collections",
  },
  {
    image: "/hero-slide-2.jpg",
    imageMobile: "/hero-slide-2-mobile.jpg",
    headline: "Weddings,\nBeautifully Arranged",
    subheadline: "From bridal bouquets to grand centerpieces — your dream day, in bloom",
    ctaText: "Shop Wedding Flowers",
    ctaLink: "/shop?category=wedding-flowers",
    ctaSecondaryText: "View Gallery",
    ctaSecondaryLink: "/collections",
  },
  {
    image: "/hero-slide-3.jpg",
    imageMobile: "/hero-slide-3-mobile.jpg",
    headline: "Same-Day Delivery,\nEvery Time",
    subheadline: "Order by 2 PM and let us bring joy to their doorstep — same day, guaranteed",
    ctaText: "Order for Today",
    ctaLink: "/shop",
    ctaSecondaryText: "Delivery Areas",
    ctaSecondaryLink: "/delivery",
  },
  {
    image: "/hero-slide-4.jpg",
    imageMobile: "/hero-slide-4-mobile.jpg",
    headline: "The Art of\na Single Stem",
    subheadline: "Sometimes, one perfect flower says everything",
    ctaText: "Shop Premium Roses",
    ctaLink: "/shop?category=premium-roses",
  },
  {
    image: "/hero-slide-5.jpg",
    imageMobile: "/hero-slide-5-mobile.jpg",
    headline: "Bouquets for\nEvery Occasion",
    subheadline: "Birthdays, anniversaries, celebrations — we craft the perfect arrangement",
    ctaText: "Shop by Occasion",
    ctaLink: "/shop?category=occasions",
    ctaSecondaryText: "Explore All",
    ctaSecondaryLink: "/shop",
  },
]

const AUTO_ADVANCE_MS = 6500
const RESUME_DELAY_MS = 4000

/* ───────────────────────────────────────────
   Foreground SVG Floral Overlay
   Decorative petals / leaves at the bottom edge
   ─────────────────────────────────────────── */
function FloralOverlay({ mouseX }: { mouseX: number }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="w-full h-[80px] md:h-[140px] lg:h-[180px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Leaf cluster left */}
        <g
          style={{
            transform: `translateX(${mouseX * -8}px)`,
            transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <ellipse cx="120" cy="180" rx="90" ry="40" fill="#8a9a7e" opacity="0.45" />
          <ellipse cx="80" cy="160" rx="60" ry="25" fill="#7a8e6e" opacity="0.35"
            transform="rotate(-25, 80, 160)" />
          <ellipse cx="160" cy="150" rx="50" ry="18" fill="#9aaa8e" opacity="0.3"
            transform="rotate(15, 160, 150)" />
        </g>

        {/* Petal cluster center-left */}
        <g
          style={{
            transform: `translateX(${mouseX * 5}px)`,
            transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <ellipse cx="420" cy="175" rx="35" ry="55" fill="#d9a7a0" opacity="0.35"
            transform="rotate(-10, 420, 175)" />
          <ellipse cx="450" cy="165" rx="25" ry="45" fill="#c4918a" opacity="0.25"
            transform="rotate(8, 450, 165)" />
          <ellipse cx="390" cy="185" rx="20" ry="35" fill="#e8c4be" opacity="0.3"
            transform="rotate(-20, 390, 185)" />
        </g>

        {/* Small leaf center */}
        <g
          style={{
            transform: `translateX(${mouseX * -3}px)`,
            transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <ellipse cx="720" cy="185" rx="55" ry="22" fill="#8a9a7e" opacity="0.3"
            transform="rotate(5, 720, 185)" />
          <ellipse cx="750" cy="178" rx="40" ry="15" fill="#7a8e6e" opacity="0.2"
            transform="rotate(-12, 750, 178)" />
        </g>

        {/* Petal cluster center-right */}
        <g
          style={{
            transform: `translateX(${mouseX * 6}px)`,
            transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <ellipse cx="1000" cy="170" rx="30" ry="50" fill="#c4918a" opacity="0.3"
            transform="rotate(15, 1000, 170)" />
          <ellipse cx="1030" cy="180" rx="22" ry="40" fill="#d9a7a0" opacity="0.25"
            transform="rotate(-5, 1030, 180)" />
        </g>

        {/* Leaf cluster right */}
        <g
          style={{
            transform: `translateX(${mouseX * -7}px)`,
            transition: "transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <ellipse cx="1320" cy="175" rx="80" ry="35" fill="#8a9a7e" opacity="0.4" />
          <ellipse cx="1360" cy="155" rx="55" ry="22" fill="#7a8e6e" opacity="0.3"
            transform="rotate(20, 1360, 155)" />
          <ellipse cx="1280" cy="165" rx="45" ry="18" fill="#9aaa8e" opacity="0.25"
            transform="rotate(-18, 1280, 165)" />
        </g>

        {/* Soft bottom blend wave */}
        <path
          d="M0,200 Q200,140 400,170 Q600,200 800,160 Q1000,120 1200,170 Q1400,200 1440,180 L1440,200 Z"
          fill="#fbf6f1"
          opacity="0.7"
        />
        <path
          d="M0,200 Q300,170 600,190 Q900,210 1100,180 Q1300,160 1440,195 L1440,200 Z"
          fill="#fbf6f1"
          opacity="0.9"
        />
      </svg>
    </div>
  )
}

/* ───────────────────────────────────────────
   HeroSection component
   ─────────────────────────────────────────── */
export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [mouseX, setMouseX] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Touch handling
  const touchStartRef = useRef<number | null>(null)
  const touchEndRef = useRef<number | null>(null)

  const goTo = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }, [currentIndex])

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  // Auto-advance timer
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(goNext, AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [isPaused, goNext])

  // Pause on hover with resume delay
  const handlePause = useCallback(() => {
    setIsPaused(true)
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
  }, [])

  const handleResume = useCallback(() => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, RESUME_DELAY_MS)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current?.contains(document.activeElement) &&
          document.activeElement !== sectionRef.current) return
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); handlePause(); handleResume() }
      if (e.key === "ArrowRight") { e.preventDefault(); goNext(); handlePause(); handleResume() }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goNext, goPrev, handlePause, handleResume])

  // Mouse parallax for floral overlays
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2 // -1 to 1
    setMouseX(x)
  }, [])

  // Touch/swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX
    handlePause()
  }, [handlePause])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (touchStartRef.current === null || touchEndRef.current === null) return
    const diff = touchStartRef.current - touchEndRef.current
    const threshold = 50
    if (diff > threshold) goNext()
    else if (diff < -threshold) goPrev()
    touchStartRef.current = null
    touchEndRef.current = null
    handleResume()
  }, [goNext, goPrev, handleResume])

  // Cleanup
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    }
  }, [])

  const slide = slides[currentIndex]

  /* Animation variants for slide images */
  const imageVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.0,
      x: dir > 0 ? 15 : -15,
    }),
    center: {
      opacity: 1,
      scale: 1.0,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 1.0,
      x: dir > 0 ? -15 : 15,
    }),
  }

  return (
    <section
      ref={sectionRef}
      id="hero-carousel"
      className="relative h-screen min-h-[600px] max-h-[920px] flex items-center justify-center overflow-hidden bg-black pt-24 md:pt-0"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onFocus={handlePause}
      onBlur={handleResume}
      tabIndex={0}
      role="region"
      aria-label="Hero carousel"
      aria-roledescription="carousel"
    >
      {/* Preload first slide images */}
      <link rel="preload" href={slides[0].image} as="image" />
      <link rel="preload" href={slides[0].imageMobile} as="image" />

      {/* ─── Background slides with crossfade + subtle slide/scale ─── */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 1.0, ease: "easeInOut" },
            x: { duration: 1.0, ease: "easeInOut" },
          }}
          className="absolute inset-0"
        >
          {/* Desktop image (landscape) — hidden on mobile */}
          <Image
            src={slide.image}
            alt={slide.headline.replace("\n", " ")}
            fill
            priority={currentIndex === 0}
            sizes="100vw"
            className="object-cover object-center hidden md:block"
            quality={85}
          />
          {/* Mobile image (portrait) — hidden on desktop */}
          <Image
            src={slide.imageMobile}
            alt={slide.headline.replace("\n", " ")}
            fill
            priority={currentIndex === 0}
            sizes="100vw"
            className="object-cover object-center block md:hidden"
            quality={80}
          />
        </motion.div>
      </AnimatePresence>

      {/* ─── Gradient overlays for legibility ─── */}
      {/* Desktop overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/55 pointer-events-none z-[1] hidden md:block" />
      {/* Mobile overlay — stronger for contrast on light images */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/60 pointer-events-none z-[1] block md:hidden" />

      {/* Localized text backdrop — stronger for legibility */}
      <div className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center">
        <div
          className="w-full max-w-4xl h-[65%] rounded-3xl"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ─── Slide text content (staggered fade-in per slide) ─── */}
      <div className="relative z-10 text-center px-14 md:px-4 w-full max-w-3xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentIndex}`}
            className="space-y-5"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
              exit: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.08] tracking-tight whitespace-pre-line"
              style={{
                fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                textShadow: "0 4px 20px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)",
              }}
              variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: "easeOut" } },
                exit: { opacity: 0, y: -15, transition: { duration: 0.35 } },
              }}
            >
              {slide.headline}
            </motion.h1>

            {/* Subheadline — prominent burgundy/pink accent */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium"
              style={{
                fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                fontStyle: "italic",
                color: "#f5c6c0",
                textShadow: "0 2px 12px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.6)",
                letterSpacing: "0.01em",
              }}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
              }}
            >
              {slide.subheadline}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
              }}
            >
              <Button
                asChild
                size="lg"
                className="rounded-full px-10 py-7 text-base md:text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl transition-all border-none"
              >
                <Link href={slide.ctaLink}>{slide.ctaText}</Link>
              </Button>
              {slide.ctaSecondaryText && slide.ctaSecondaryLink && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-10 py-7 text-base md:text-lg font-medium border-white/60 text-white hover:bg-white hover:text-primary bg-transparent shadow-xl transition-all"
                >
                  <Link href={slide.ctaSecondaryLink}>{slide.ctaSecondaryText}</Link>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Arrow controls ─── */}
      <button
        id="hero-prev"
        onClick={() => { goPrev(); handlePause(); handleResume() }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white/70 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </button>
      <button
        id="hero-next"
        onClick={() => { goNext(); handlePause(); handleResume() }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white/70 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </button>

      {/* ─── Slide indicator dots ─── */}
      <div
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5"
        role="tablist"
        aria-label="Slide indicators"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => { goTo(i); handlePause(); handleResume() }}
            className={`
              rounded-full transition-all duration-500 cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
              ${i === currentIndex
                ? "w-8 h-2.5 bg-white shadow-lg shadow-white/20"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
              }
            `}
          />
        ))}
      </div>

      {/* ─── Foreground floral overlay ─── */}
      <FloralOverlay mouseX={mouseX} />

      {/* ─── Live region for screen readers ─── */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {slides.length}: {slide.headline.replace("\n", " ")}
      </div>
    </section>
  )
}
