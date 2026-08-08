"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { Package, Heart, LogOut, MapPin, User, Settings } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  total_amount: number
  order_status: string
  payment_method: string
  created_at: string
  notes?: string
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState("orders")
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (orderData) setOrders(orderData)
      }
    }
    loadData()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const tabs = [
    { id: "orders", label: "Order History", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "profile", label: "Profile Details", icon: User },
  ]

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
    completed: "bg-green-50 text-green-700 ring-green-600/20",
    cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground">My Account</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Welcome back{user?.email ? `, ${user.email}` : ""}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="shrink-0 rounded-lg">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id
                    ? "bg-forest/10 text-forest"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-cream/30">
                <h2 className="text-lg font-medium capitalize">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h2>
              </div>

              <div className="p-6">
                {activeTab === "orders" && (
                  <>
                    {orders.length === 0 ? (
                      <div className="text-center py-16 space-y-4">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
                        <div className="space-y-1">
                          <p className="font-medium">No orders yet</p>
                          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                            When you place an order, its status and tracking details will appear here.
                          </p>
                        </div>
                        <Button asChild variant="outline" className="mt-4 rounded-lg">
                          <Link href="/shop">Start Shopping</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                            <div>
                              <p className="font-medium text-sm">{order.notes || `Order #${order.id.slice(0, 8)}`}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(order.created_at).toLocaleDateString("en-PK", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">Rs. {Number(order.total_amount).toLocaleString()}</p>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset mt-1 capitalize ${
                                  statusColors[order.order_status] ?? statusColors.pending
                                }`}
                              >
                                {order.order_status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeTab === "wishlist" && (
                  <div className="text-center py-16 space-y-4">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <p className="text-muted-foreground text-sm">Your wishlist is empty. Browse our collection and save your favourites.</p>
                    <Button asChild variant="outline" className="rounded-lg">
                      <Link href="/shop">Browse Collection</Link>
                    </Button>
                  </div>
                )}

                {activeTab === "addresses" && (
                  <div className="text-center py-16 space-y-4">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground/30" />
                    <p className="text-muted-foreground text-sm">No saved addresses yet. Add one during your next checkout.</p>
                  </div>
                )}

                {activeTab === "profile" && (
                  <div className="max-w-md space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Email</label>
                      <input
                        type="email"
                        value={user?.email ?? ""}
                        disabled
                        className="input-premium opacity-60"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Full Name</label>
                      <input type="text" className="input-premium" placeholder="Your full name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Phone</label>
                      <input type="tel" className="input-premium" placeholder="+92 300 1234567" />
                    </div>
                    <Button className="rounded-lg">Save Changes</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
