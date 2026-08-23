import { getStaffUsers, getRoles } from "@/app/actions/admin"
import { UsersClient } from "./users-client"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  try {
    const [users, roles] = await Promise.all([
      getStaffUsers(),
      getRoles()
    ])

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Users & Roles</h1>
          <p className="mt-2 text-muted-foreground">Manage your staff users and assign them roles.</p>
        </div>
        
        <UsersClient initialUsers={users} allRoles={roles} />
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
