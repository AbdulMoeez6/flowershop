"use server"

import { createAdminClient } from "@/utils/supabase/admin"
import { requirePermission } from "@/lib/permissions"
import { revalidatePath } from "next/cache"

// --- ROLES & PERMISSIONS ---

export async function getRoles() {
  await requirePermission("manage_roles")
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from("roles")
    .select(`
      id, name, description, is_system,
      role_permissions (
        permission_id
      )
    `)
    .order("created_at")

  if (error) throw new Error(error.message)
  return data
}

export async function getPermissions() {
  await requirePermission("manage_roles")
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from("permissions")
    .select("id, name, description")
    .order("name")

  if (error) throw new Error(error.message)
  return data
}

export async function createRole(name: string, description: string, permissionIds: string[]) {
  await requirePermission("manage_roles")
  const supabase = createAdminClient()

  // 1. Create role
  const { data: role, error: roleError } = await supabase
    .from("roles")
    .insert({ name, description })
    .select("id")
    .single()

  if (roleError) throw new Error(roleError.message)

  // 2. Assign permissions
  if (permissionIds.length > 0) {
    const rolePermissions = permissionIds.map(pid => ({ role_id: role.id, permission_id: pid }))
    const { error: permError } = await supabase.from("role_permissions").insert(rolePermissions)
    if (permError) throw new Error(permError.message)
  }

  revalidatePath("/admin/roles")
  return { success: true }
}

export async function updateRole(roleId: string, name: string, description: string, permissionIds: string[]) {
  await requirePermission("manage_roles")
  const supabase = createAdminClient()

  // Check if system role
  const { data: existing } = await supabase.from("roles").select("is_system").eq("id", roleId).single()
  if (existing?.is_system) throw new Error("Cannot edit a system role directly.")

  // 1. Update role details
  const { error: roleError } = await supabase
    .from("roles")
    .update({ name, description })
    .eq("id", roleId)

  if (roleError) throw new Error(roleError.message)

  // 2. Sync permissions (delete old, insert new)
  await supabase.from("role_permissions").delete().eq("role_id", roleId)
  
  if (permissionIds.length > 0) {
    const rolePermissions = permissionIds.map(pid => ({ role_id: roleId, permission_id: pid }))
    const { error: permError } = await supabase.from("role_permissions").insert(rolePermissions)
    if (permError) throw new Error(permError.message)
  }

  revalidatePath("/admin/roles")
  return { success: true }
}

export async function deleteRole(roleId: string) {
  await requirePermission("manage_roles")
  const supabase = createAdminClient()

  const { data: existing } = await supabase.from("roles").select("is_system").eq("id", roleId).single()
  if (existing?.is_system) throw new Error("Cannot delete a system role.")

  const { error } = await supabase.from("roles").delete().eq("id", roleId)
  if (error) throw new Error(error.message)

  revalidatePath("/admin/roles")
  return { success: true }
}

// --- USERS ---

export async function getStaffUsers() {
  await requirePermission("manage_users")
  const supabase = createAdminClient()
  
  // We only want users who have a role_id assigned
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id, full_name, phone, role_id,
      role:roles ( name )
    `)
    .not("role_id", "is", null)
    .order("created_at")

  if (error) throw new Error(error.message)
  
  // To get emails, we need to fetch from auth.users (requires service role)
  // But doing a join isn't directly possible via standard queries sometimes,
  // so we fetch all auth users and merge them
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
  if (authError) throw new Error(authError.message)

  const usersWithEmails = data.map((profile: any) => {
    const authUser = authData.users.find(u => u.id === profile.id)
    return {
      ...profile,
      email: authUser?.email || "Unknown"
    }
  })

  return usersWithEmails
}

export async function createStaffUser(email: string, fullName: string, roleId: string) {
  await requirePermission("manage_users")
  const supabase = createAdminClient()

  // 1. Create user in auth
  // Generating a random temporary password. Real apps might send an invite email.
  const tempPassword = Math.random().toString(36).slice(-10) + "A1!" 
  
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  })

  if (authError) throw new Error(authError.message)

  // 2. Ensure profile exists and assign role
  // Auth trigger might create profile, so we upsert
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: authUser.user.id,
    full_name: fullName,
    role_id: roleId
  })

  if (profileError) throw new Error(profileError.message)

  revalidatePath("/admin/users")
  return { success: true, tempPassword }
}

export async function updateStaffRole(userId: string, roleId: string | null) {
  await requirePermission("manage_users")
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("profiles")
    .update({ role_id: roleId })
    .eq("id", userId)

  if (error) throw new Error(error.message)

  revalidatePath("/admin/users")
  return { success: true }
}

export async function deleteStaffUser(userId: string) {
  await requirePermission("manage_users")
  const supabase = createAdminClient()

  // First we should ensure they aren't the ONLY super admin? 
  // It's probably better to just allow it for now, but deleteUser in auth will delete the profile if cascade is set.
  // Actually, sometimes auth delete doesn't cascade if the user has foreign keys elsewhere.
  // Let's just try to delete the auth user, which removes their login access.
  const { error } = await supabase.auth.admin.deleteUser(userId)
  
  if (error) throw new Error(error.message)

  revalidatePath("/admin/users")
  return { success: true }
}
