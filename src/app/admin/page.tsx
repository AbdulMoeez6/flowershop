"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Assuming we will create these or just use standard HTML
import { DollarSign, Users, ShoppingBag, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif">Dashboard Overview</h1>
        <div className="text-sm text-muted-foreground">Last updated: Just now</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">Rs. 1,245,000</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +20.1% from last month
            </p>
          </div>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Orders</h3>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +15% from last month
            </p>
          </div>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Active Customers</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +7% from last month
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="font-serif text-xl mb-4">Revenue Overview</h3>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md border border-dashed">
            [Chart Area - Integrate Recharts here]
          </div>
        </div>
        
        <div className="col-span-3 bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="font-serif text-xl mb-4">Recent Sales</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Customer {i}</p>
                  <p className="text-sm text-muted-foreground">customer{i}@example.com</p>
                </div>
                <div className="ml-auto font-medium">+Rs. {Math.floor(Math.random() * 10000)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
