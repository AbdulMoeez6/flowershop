"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Image as ImageIcon,
  FileText,
  LogOut,
  Layers,
  MapPin,
  Menu,
  X,
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: null },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart, permission: "manage_orders" },
  { name: "Products", href: "/admin/products", icon: Package, permission: "manage_products" },
  { name: "Categories", href: "/admin/categories", icon: Layers, permission: "manage_products" },
  { name: "Delivery Areas", href: "/admin/delivery-areas", icon: MapPin, permission: "manage_settings" },
  { name: "Users", href: "/admin/users", icon: Users, permission: "manage_users" },
  { name: "Roles", href: "/admin/roles", icon: FileText, permission: "manage_roles" },
  { name: "Settings", href: "/admin/settings", icon: Settings, permission: "manage_settings" },
]


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userPermissions, setUserPermissions] = useState<string[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Check role from profiles table using new RBAC schema
      const { data: profile } = await supabase
        .from("profiles")
        .select(`
          role:roles (
            name,
            role_permissions (
              permissions (name)
            )
          )
        `)
        .eq("id", user.id)
        .single()

      const roleData = profile?.role as any
      
      // Check if email is in the admin emails env list
      const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || []
      const isAdminEmail = user.email && adminEmails.includes(user.email)

      // If user has no role, they are a regular customer
      if (!roleData) {
        if (isAdminEmail) {
          // Auto-promote to Super Admin if email is in the admin emails env list (failsafe)
          const { data: superAdminRole } = await supabase.from('roles').select('id').eq('name', 'Super Admin').single();
          if (superAdminRole) {
            await supabase.from("profiles").upsert({ 
              id: user.id, 
              role_id: superAdminRole.id,
              full_name: user.user_metadata?.full_name || "Admin",
              created_at: new Date().toISOString()
            })
            setAuthorized(true)
            setUserRole("Super Admin")
            return
          }
        }
        
        // Non-admin trying to access admin area -> redirect
        router.push("/account")
        return
      }

      const permissions = roleData.role_permissions
        ?.map((rp: any) => rp.permissions?.name)
        .filter(Boolean) as string[] || [];

      setUserRole(roleData.name)
      setUserPermissions(permissions)
      setAuthorized(true)
    }

    checkAdmin()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  // Loading state
  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Denied state
  if (authorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4">
          <p className="text-lg font-serif">Access Denied</p>
          <p className="text-sm text-muted-foreground">You do not have admin privileges.</p>
          <Button asChild variant="outline" className="rounded-lg">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <div className="w-64 bg-card border-r border-border flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin" className="inline-flex items-center space-x-3">
            <div className="relative w-8 h-8 overflow-hidden rounded-full border border-primary/20 shadow-sm shrink-0">
              <Image src="/logo.png" alt="Floral Village Islamabad" fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-[family-name:var(--font-parisienne)] text-[22px] leading-[1.1] text-foreground">
                Floral Village
              </span>
              <span className="font-[family-name:var(--font-tenor-sans)] text-[10px] tracking-[0.2em] uppercase mt-[2px] text-muted-foreground">
                Admin
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            // Filter by permission
            if (item.permission && userRole !== 'Super Admin' && !userPermissions.includes(item.permission)) {
              return null;
            }

            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-rose hover:bg-rose/5 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 md:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            <Menu className="h-5 w-5" />
          </button>
          <div className="inline-flex items-center space-x-2">
            <div className="relative w-8 h-8 overflow-hidden rounded-full border border-primary/20 shadow-sm shrink-0">
              <Image src="/logo.png" alt="Floral Village Islamabad" fill className="object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-[family-name:var(--font-parisienne)] text-[18px] leading-[1.1] text-foreground">
                Floral Village
              </span>
              <span className="font-[family-name:var(--font-tenor-sans)] text-[8px] tracking-[0.2em] uppercase mt-[2px] text-muted-foreground">
                Admin
              </span>
            </div>
          </div>
          <div className="w-5" />
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 bottom-0 w-64 bg-card z-50 flex flex-col shadow-xl md:hidden">
              <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                <div className="inline-flex items-center space-x-2">
                  <div className="relative w-8 h-8 overflow-hidden rounded-full border border-primary/20 shadow-sm shrink-0">
                    <Image src="/logo.png" alt="Floral Village Islamabad" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-[family-name:var(--font-parisienne)] text-[20px] leading-[1.1] text-foreground">
                      Floral Village
                    </span>
                    <span className="font-[family-name:var(--font-tenor-sans)] text-[9px] tracking-[0.2em] uppercase mt-[2px] text-muted-foreground">
                      Admin
                    </span>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navigation.map((item) => {
                  // Filter by permission
                  if (item.permission && userRole !== 'Super Admin' && !userPermissions.includes(item.permission)) {
                    return null;
                  }

                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </>
        )}

        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
