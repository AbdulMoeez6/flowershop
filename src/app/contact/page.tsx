"use client"

import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/components/providers/settings-provider"

export default function ContactPage() {
  const settings = useSettings()
  return (
    <main className="min-h-screen bg-cream flex flex-col">
      <Navbar transparent={false} />
      
      <div className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="text-center space-y-4 mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs uppercase tracking-[0.2em] text-gold font-medium"
            >
              Get In Touch
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-serif text-foreground"
            >
              Contact Us
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-xl mx-auto"
            >
              Whether you have a question about an order, need advice on a custom arrangement, or just want to say hello, we'd love to hear from you.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 space-y-8">
                <h3 className="font-serif text-2xl text-foreground">Our Boutique</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Address</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Shop #4, Ground Floor, Beverly Centre<br/>
                        Blue Area, Islamabad, 44000
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Phone & WhatsApp</p>
                      <p className="text-sm text-muted-foreground">+{settings.whatsapp_number}</p>
                      <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1 mt-1">
                        Click to chat on WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Email</p>
                      <p className="text-sm text-muted-foreground">hello@floralvillageislamabad.com</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">Opening Hours</p>
                      <p className="text-sm text-muted-foreground">Mon - Sat: 9:00 AM - 9:00 PM</p>
                      <p className="text-sm text-muted-foreground">Sunday: 11:00 AM - 7:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-border/50"
            >
              <h3 className="font-serif text-2xl text-foreground mb-6">Send a Message</h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">First Name</label>
                    <input type="text" className="input-premium bg-cream/50" placeholder="Jane" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground/80">Last Name</label>
                    <input type="text" className="input-premium bg-cream/50" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Email Address</label>
                  <input type="email" className="input-premium bg-cream/50" placeholder="jane@example.com" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Subject</label>
                  <input type="text" className="input-premium bg-cream/50" placeholder="How can we help?" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground/80">Message</label>
                  <textarea rows={5} className="input-premium bg-cream/50 !h-auto resize-none" placeholder="Your message here..." />
                </div>

                <Button className="w-full rounded-xl py-6 mt-2 group">
                  Send Message
                  <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </motion.div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
