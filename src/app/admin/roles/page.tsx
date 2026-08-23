import { getRoles, getPermissions } from "@/app/actions/admin"
import { RolesClient } from "./roles-client"

export const dynamic = "force-dynamic"

export default async function RolesPage() {
  try {
    const [roles, permissions] = await Promise.all([
      getRoles(),
      getPermissions()
    ])

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Roles & Permissions</h1>
          <p className="mt-2 text-muted-foreground">Manage roles and their access permissions.</p>
        </div>
        
        <RolesClient initialRoles={roles} allPermissions={permissions} />
      </div>
    )
  } catch (error: any) {
    return (
      <div className="p-6 text-rose">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error.message}</p>
      </div>
    )
  }
}
