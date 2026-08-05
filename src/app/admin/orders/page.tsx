"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Eye, Filter } from "lucide-react"

export default function AdminOrdersPage() {
  const [orders] = useState([
    { id: '#FLR-1029', customer: 'Ayesha Khan', date: 'Aug 5, 2026', total: 8500, status: 'Processing', payment: 'cod' },
    { id: '#FLR-1028', customer: 'Ali Hassan', date: 'Aug 4, 2026', total: 12500, status: 'Completed', payment: 'stripe' },
    { id: '#FLR-1027', customer: 'Zahra Ali', date: 'Aug 4, 2026', total: 4500, status: 'Pending', payment: 'bank' },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif">Orders</h1>
        <Button variant="outline" className="font-serif">
          Export CSV
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-10 px-3">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 font-medium">Rs. {order.total.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.status === 'Completed' 
                        ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                        : order.status === 'Processing'
                        ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
                        : 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-primary transition-colors p-2">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
