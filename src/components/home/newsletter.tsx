"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useState } from "react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-forest to-forest/90 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gold/5 blur-xl" />

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <span className="text-gold text-xs uppercase tracking-[0.2em] font-medium">
              Stay in Bloom
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white">
              Join Our Newsletter
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Be the first to know about new arrivals, seasonal specials, and
              exclusive offers. We promise to keep it beautiful and spam-free.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 rounded-xl p-6 border border-white/10"
              >
                <p className="text-gold font-medium">🌸 Thank you for subscribing!</p>
                <p className="text-white/60 text-sm mt-1">
                  We&apos;ll keep you posted on the freshest blooms.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 h-12 px-5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/60"
                />
                <Button
                  type="submit"
                  className="rounded-full h-12 px-8 bg-gold hover:bg-gold/90 text-white font-medium shadow-lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
