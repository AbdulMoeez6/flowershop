import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/ui/product-card"

export default function DesignSystemPreview() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 space-y-24">
        {/* Header section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-foreground">
            Fleur & Co. Design System
          </h1>
          <p className="text-lg text-muted-foreground">
            A premium, organic design system built with Tailwind CSS v4, Framer Motion, and Next.js 15.
          </p>
        </section>

        {/* Colors */}
        <section className="space-y-8">
          <h2 className="text-2xl font-serif border-b pb-2">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Primary", bg: "bg-primary", text: "text-primary-foreground" },
              { name: "Secondary", bg: "bg-secondary", text: "text-secondary-foreground" },
              { name: "Accent", bg: "bg-accent", text: "text-accent-foreground" },
              { name: "Forest", bg: "bg-forest", text: "text-forest-foreground" },
              { name: "Rose", bg: "bg-rose", text: "text-rose-foreground" },
              { name: "Muted", bg: "bg-muted", text: "text-muted-foreground" },
            ].map((color) => (
              <div key={color.name} className={`h-24 rounded-2xl flex flex-col items-center justify-center shadow-sm ${color.bg} ${color.text}`}>
                <span className="font-medium text-sm">{color.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-8">
          <h2 className="text-2xl font-serif border-b pb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="default">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="accent">Accent Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </section>

        {/* Product Cards */}
        <section className="space-y-8">
          <h2 className="text-2xl font-serif border-b pb-2">Product Cards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <ProductCard
              id="1"
              name="Crimson Elegance"
              price={8500}
              compareAtPrice={10000}
              category="Flower Bouquet"
              image="https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=600&auto=format&fit=crop"
            />
            <ProductCard
              id="2"
              name="White Whisper"
              price={6500}
              category="Occasions"
              image="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop"
            />
            <ProductCard
              id="3"
              name="Pastel Dream"
              price={7200}
              category="Custom Bouquets"
              image="https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=600&auto=format&fit=crop"
            />
            <ProductCard
              id="4"
              name="Golden Hour"
              price={5500}
              compareAtPrice={6000}
              category="Flower Deals"
              image="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop"
            />
          </div>
        </section>
      </main>
    </div>
  )
}
