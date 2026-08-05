"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Supabase will automatically send a confirmation email
    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
    } else {
      // Create user profile in our table
      if (data.user) {
        await supabase.from('profiles').insert([
          { id: data.user.id, full_name: fullName, role: 'customer' }
        ])
      }
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-sm border border-border">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif">Create Account</h1>
            <p className="text-muted-foreground">Join Fleur & Co. to track your orders</p>
          </div>

          {success ? (
            <div className="p-6 bg-green-50 text-green-800 rounded-md text-center space-y-4 border border-green-200">
              <h3 className="font-medium text-lg">Check your email</h3>
              <p className="text-sm">We've sent a verification link to {email}. Please verify your account before logging in.</p>
              <Button asChild className="w-full">
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-500 rounded-md text-sm border border-rose-200">
                  {error}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                />
                <p className="text-xs text-muted-foreground">Must be at least 6 characters.</p>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 mt-4">
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
