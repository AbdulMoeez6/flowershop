"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "Do you offer same-day flower delivery in Islamabad?",
    answer: "Yes, we offer same-day flower delivery across Islamabad and Rawalpindi for all orders placed before 4:00 PM."
  },
  {
    question: "Are your flowers fresh?",
    answer: "Absolutely. We source our blooms daily from premium local and international growers to ensure maximum freshness and a longer vase life."
  },
  {
    question: "Can I customize a bouquet?",
    answer: "Yes! We love creating bespoke arrangements. Please contact our team via WhatsApp or phone with your specific requirements and color preferences."
  },
  {
    question: "Do you deliver gift items along with flowers?",
    answer: "Yes, we offer a curated selection of premium chocolates, elegant greeting cards, and luxury teddy bears that can be added to any floral order."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major Credit/Debit cards, online bank transfers, and local mobile wallets (JazzCash/EasyPaisa)."
  },
  {
    question: "Do you deliver at midnight?",
    answer: "Yes, our special midnight delivery service is perfect for birthday and anniversary surprises. Please select the midnight delivery option during checkout."
  }
]

export function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="section-padding bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
        
        <div className="text-center mb-12 flex items-center justify-center gap-3">
          <span className="text-2xl">🌸</span>
          <h2 className="text-3xl md:text-4xl font-serif text-primary">
            FAQs – Floral Village Islamabad
          </h2>
          <span className="text-2xl">🌸</span>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div 
                key={idx} 
                className={`border rounded-xl transition-colors duration-300 ${isOpen ? 'bg-primary/10 border-primary/20' : 'bg-primary/5 border-primary/10 hover:bg-primary/10'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-serif text-lg md:text-xl text-primary font-medium pr-8">
                    {faq.question}
                  </span>
                  <span className="shrink-0 text-primary">
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-foreground/80 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
