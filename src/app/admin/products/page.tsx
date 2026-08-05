"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

export default function AdminProductsPage() {
  const [products] = useState([
    { id: '1', name: 'Crimson Elegance', price: 8500, stock: 12, status: 'Active', category: 'Flower Bouquet' },
    { id: '2', name: 'White Whisper', price: 6500, stock: 0, status: 'Out of Stock', category: 'Occasions' },
    { id: '3', name: 'Pastel Dream', price: 7200, stock: 5, status: 'Active', category: 'Custom Bouquets' },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif">Products</h1>
        <Button className="font-serif">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option>All Categories</option>
              <option>Flower Bouquet</option>
              <option>Cakes</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-muted"></div>
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{product.category}</td>
                  <td className="px-6 py-4">Rs. {product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.status === 'Active' 
                        ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                        : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-muted-foreground hover:text-primary transition-colors p-2">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-rose-500 transition-colors p-2">
                      <Trash2 className="w-4 h-4" />
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
