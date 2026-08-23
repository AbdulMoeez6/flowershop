import { createClient } from "@/utils/supabase/server"

export type Permission = 
  | 'manage_users'
  | 'manage_roles'
  | 'manage_products'
  | 'manage_orders'
  | 'manage_settings'
  | string; // allowing fallback for new permissions

export async function getUserRoleAndPermissions() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { role: null, permissions: [] as string[] }

    // Fetch the user's role and associated permissions
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        role:roles (
          id,
          name,
          is_system,
          role_permissions (
            permissions (name)
          )
        )
      `)
      .eq('id', user.id)
      .single()

    if (error || !data || !data.role) {
      return { role: null, permissions: [] as string[] }
    }

    const roleData = data.role as any;
    const permissions = roleData.role_permissions
      ?.map((rp: any) => rp.permissions?.name)
      .filter(Boolean) as string[] || [];

    return { 
      role: { id: roleData.id, name: roleData.name, isSystem: roleData.is_system },
      permissions 
    }
  } catch (error) {
    console.error("Error fetching user permissions:", error)
    return { role: null, permissions: [] as string[] }
  }
}

export async function hasPermission(permission: Permission): Promise<boolean> {
  const { permissions, role } = await getUserRoleAndPermissions()
  
  // Super Admin bypass (failsafe)
  if (role?.name === 'Super Admin') return true;
  
  return permissions.includes(permission)
}

export async function requirePermission(permission: Permission) {
  const hasAccess = await hasPermission(permission)
  if (!hasAccess) {
    throw new Error(`Unauthorized: Requires ${permission} permission`)
  }
}
