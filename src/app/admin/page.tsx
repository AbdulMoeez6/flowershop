"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react"

interface Stats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  recentOrders: {
    id: string
    guest_email: string | null
    total_amount: number
    order_status: string
    created_at: string
    shipping_address: any
  }[]
}

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from("orders").select("id, guest_email, total_amount, order_status, created_at, shipping_address").order("created_at", { ascending: false }),
        supabase.from("products").select("id", { count: "exact", head: true }),
      ])

      const orders = ordersRes.data ?? []
      const revenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0)

      setStats({
        totalRevenue: revenue,
        totalOrders: orders.length,
        totalProducts: productsRes.count ?? 0,
        recentOrders: orders.slice(0, 5),
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      label: "Total Revenue",
      value: loading ? "—" : `Rs. ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: "Total Orders",
      value: loading ? "—" : stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      label: "Total Products",
      value: loading ? "—" : stats.totalProducts.toString(),
      icon: Package,
      color: "text-purple-600",
    },
  ]

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
    processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
    completed: "bg-green-50 text-green-700 ring-green-600/20",
    cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-serif">Dashboard Overview</h1>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("en-PK", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="p-6 bg-card rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">{card.label}</h3>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <h3 className="font-serif text-xl">Recent Orders</h3>
        </div>
        <div className="divide-y divide-border">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No orders yet.</div>
          ) : (
            stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/10 transition-colors">
                <div>
                  <p className="text-sm font-medium">
                    {order.shipping_address?.full_name ?? order.guest_email ?? "Guest"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-PK", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${
                      statusColors[order.order_status] ?? statusColors.pending
                    }`}
                  >
                    {order.order_status}
                  </span>
                  <span className="font-medium text-sm">
                    Rs. {Number(order.total_amount).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
