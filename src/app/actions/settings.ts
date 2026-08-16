"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateSettings(settings: Record<string, string>) {
  const supabase = await createClient()

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }

  // Upsert each setting
  for (const [key, value] of Object.entries(settings)) {
    const { error } = await supabase
      .from("settings")
      .upsert({ key, value }, { onConflict: "key" })
  }
  
  revalidatePath("/", "layout")

  return { success: true }
}
