"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Search, Eye, ChevronDown } from "lucide-react"

interface Order {
  id: string
  guest_email: string | null
  guest_phone: string | null
  total_amount: number
  order_status: string
  payment_method: string
  payment_status: string
  shipping_address: any
  delivery_date: string | null
  notes: string | null
  created_at: string
}

const statusOptions = ["pending", "processing", "completed", "cancelled"]
const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
  processing: "bg-blue-50 text-blue-700 ring-blue-600/20",
  completed: "bg-green-50 text-green-700 ring-green-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
}

export default function AdminOrdersPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (statusFilter) {
      query = query.eq("order_status", statusFilter)
    }

    const { data, error } = await query
    if (!error && data) setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from("orders").update({ order_status: newStatus }).eq("id", orderId)
    fetchOrders()
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: newStatus })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-serif">Orders</h1>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-premium h-10 w-auto min-w-[140px]"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-medium">
                      {order.notes?.includes("FLR-")
                        ? order.notes.match(/FLR-\w+/)?.[0]
                        : `#${order.id.slice(0, 8)}`}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm">{order.shipping_address?.full_name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{order.guest_email ?? "—"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-PK", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium">Rs. {Number(order.total_amount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        {order.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.order_status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-3 py-1 ring-1 ring-inset appearance-none cursor-pointer ${
                          statusColors[order.order_status] ?? statusColors.pending
                        }`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
                        aria-label="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setSelectedOrder(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card rounded-2xl shadow-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedOrder.shipping_address?.full_name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrder.guest_email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedOrder.guest_phone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment</p>
                  <p className="font-medium uppercase">{selectedOrder.payment_method}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Delivery Date</p>
                  <p className="font-medium">{selectedOrder.delivery_date ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium text-lg">Rs. {Number(selectedOrder.total_amount).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">
                  {selectedOrder.shipping_address?.address ?? "—"}, {selectedOrder.shipping_address?.city ?? ""}
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-muted-foreground mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateOrderStatus(selectedOrder.id, s)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors capitalize ${
                        selectedOrder.order_status === s
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40 text-muted-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
