"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { Package, Heart, LogOut, MapPin, User, Bell } from "lucide-react"

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-serif text-foreground">My Account</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back{user?.email ? `, ${user.email}` : ""}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="shrink-0">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Nav */}
          <div className="md:col-span-1 space-y-2">
            <Button variant="secondary" className="w-full justify-start h-11 bg-muted">
              <Package className="mr-3 h-5 w-5 text-muted-foreground" />
              Order History
            </Button>
            <Button variant="ghost" className="w-full justify-start h-11">
              <Heart className="mr-3 h-5 w-5 text-muted-foreground" />
              Wishlist
            </Button>
            <Button variant="ghost" className="w-full justify-start h-11">
              <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
              Saved Addresses
            </Button>
            <Button variant="ghost" className="w-full justify-start h-11">
              <Bell className="mr-3 h-5 w-5 text-muted-foreground" />
              Notifications
            </Button>
            <Button variant="ghost" className="w-full justify-start h-11">
              <User className="mr-3 h-5 w-5 text-muted-foreground" />
              Profile Details
            </Button>
          </div>

          {/* Main Dashboard Panel */}
          <div className="md:col-span-3">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/20">
                <h2 className="text-xl font-medium">Recent Orders</h2>
              </div>
              
              <div className="p-6">
                {/* Empty State Mock */}
                <div className="text-center py-12 space-y-4">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <div className="space-y-1">
                    <p className="text-lg font-medium">No orders yet</p>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                      When you place an order, its status and tracking details will appear here.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => router.push("/shop")} className="mt-4">
                    Start Shopping
                  </Button>
                </div>
                
                {/* 
                Mock Order item (Hidden for now until DB fetching is done)
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">Order #FLR-1029</p>
                    <p className="text-sm text-muted-foreground">Placed on Aug 5, 2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Rs. 8,500</p>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Delivered
                    </span>
                  </div>
                </div> 
                */}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
