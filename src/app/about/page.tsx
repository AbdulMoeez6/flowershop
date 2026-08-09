"use client"

import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { motion } from "framer-motion"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <Navbar transparent={false} />
      
      <div className="flex-1">
        {/* Header Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-4 block"
            >
              Our Story
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6"
            >
              Blooming With Love Since 2018
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-lg"
            >
              Welcome to Flower Shop Islamabad, where passion for floral artistry meets the heartbeat of the twin cities. We believe every petal tells a story.
            </motion.p>
          </div>
        </section>

        {/* Content Section with Image */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 relative"
              >
                <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image 
                    src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1000&auto=format&fit=crop" 
                    alt="Florist arranging flowers" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                </div>
                {/* Decorative blob behind image */}
                <div className="absolute -z-10 -bottom-8 -left-8 w-2/3 h-2/3 bg-primary/20 rounded-full blur-3xl"></div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex-1 space-y-8"
              >
                <div>
                  <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-4">Our Philosophy</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    At Flower Shop Islamabad, we don't just sell flowers; we curate emotions. Founded on the belief that nature’s most delicate creations can convey the most profound feelings, we meticulously source our blooms from the finest local and international growers. 
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-4">The Floral Experience</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our team of artisan florists meticulously hand-crafts each bouquet, ensuring that every stem is perfectly placed. Whether it’s a grand wedding, a subtle apology, or a joyous birthday, our luxurious wrapping and signature aesthetic elevate every occasion into an unforgettable memory.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Our Process Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.2em] text-gold font-medium mb-4 block"
            >
              How We Work
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-serif text-foreground mb-16"
            >
              From Farm to Vase
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-serif">1</div>
                <h4 className="text-xl font-serif text-foreground">Sourcing</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We hand-pick the freshest seasonal blooms daily from trusted local farms and international auctions to guarantee uncompromised quality.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-serif">2</div>
                <h4 className="text-xl font-serif text-foreground">Designing</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our artisan florists carefully condition each stem and arrange them into breathtaking compositions tailored for your special occasion.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-serif">3</div>
                <h4 className="text-xl font-serif text-foreground">Delivering</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your luxury arrangement is carefully packaged and hand-delivered directly to the recipient's door to ensure it arrives in pristine condition.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats / Values */}
        <section className="py-20 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="text-4xl md:text-5xl font-serif text-primary mb-2">10k+</div>
                <div className="text-sm uppercase tracking-widest font-medium text-muted-foreground">Happy Customers</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <div className="text-4xl md:text-5xl font-serif text-primary mb-2">50+</div>
                <div className="text-sm uppercase tracking-widest font-medium text-muted-foreground">Floral Varieties</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <div className="text-4xl md:text-5xl font-serif text-primary mb-2">100%</div>
                <div className="text-sm uppercase tracking-widest font-medium text-muted-foreground">Freshness Guaranteed</div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
