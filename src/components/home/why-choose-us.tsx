"use client"

import { motion } from "framer-motion"
import { Truck, Shield, Leaf, Clock } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Same-Day Delivery",
    description:
      "Order before 6 PM for same-day delivery across Islamabad and Rawalpindi. Every arrangement arrives fresh.",
  },
  {
    icon: Leaf,
    title: "Farm-Fresh Blooms",
    description:
      "We source directly from premium growers. Your flowers are cut fresh and arranged the same day they arrive.",
  },
  {
    icon: Shield,
    title: "Freshness Guaranteed",
    description:
      "Every arrangement is backed by our 3-day freshness guarantee. Not satisfied? We'll replace it free of charge.",
  },
  {
    icon: Clock,
    title: "Scheduled Deliveries",
    description:
      "Plan ahead with our scheduled delivery service. Choose the exact date and 2-hour time window that works best.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="section-padding bg-forest text-forest-foreground">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
            The Fleur & Co. Difference
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-white">
            Why Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center space-y-4"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 border border-white/10">
                <feature.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-serif text-xl text-white">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
