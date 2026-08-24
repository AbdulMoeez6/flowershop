"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createRole, updateRole, deleteRole } from "@/app/actions/admin"

export function RolesClient({ initialRoles, allPermissions }: { initialRoles: any[], allPermissions: any[] }) {
  const [roles, setRoles] = useState(initialRoles)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<any | null>(null)
  
  // Form State
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const openCreate = () => {
    setEditingRole(null)
    setName("")
    setDescription("")
    setSelectedPermissions([])
    setIsModalOpen(true)
  }

  const openEdit = (role: any) => {
    setEditingRole(role)
    setName(role.name)
    setDescription(role.description || "")
    setSelectedPermissions(role.role_permissions.map((rp: any) => rp.permission_id))
    setIsModalOpen(true)
  }

  const togglePermission = (id: string) => {
    setSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingRole) {
        await updateRole(editingRole.id, name, description, selectedPermissions)
      } else {
        await createRole(name, description, selectedPermissions)
      }
      setIsModalOpen(false)
      window.location.reload() // Quick refresh to get updated server data
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (role: any) => {
    setRoleToDelete(role)
  }

  const handleDelete = async () => {
    if (!roleToDelete) return
    setLoading(true)
    try {
      await deleteRole(roleToDelete.id)
      window.location.reload()
    } catch (err: any) {
      alert(err.message)
      setLoading(false)
      setRoleToDelete(null)
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Role Name</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Permissions</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {roles.map(role => (
              <tr key={role.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium">
                  {role.name}
                  {role.is_system && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                      System
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{role.description}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {role.role_permissions.length > 0 ? (
                      role.role_permissions.map((rp: any) => {
                        const perm = allPermissions.find(p => p.id === rp.permission_id)
                        return (
                          <span key={rp.permission_id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                            {perm?.name}
                          </span>
                        )
                      })
                    ) : (
                      <span className="text-muted-foreground italic text-xs">None</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(role)} disabled={role.is_system}>
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => confirmDelete(role)} disabled={role.is_system}>
                    <Trash2 className="w-4 h-4 text-rose/70" />
                  </Button>
                </td>
              </tr>
            ))}
            {roles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b">
                <h2 className="text-xl font-serif">{editingRole ? "Edit Role" : "Create Role"}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                <div className="pt-2">
                  <label className="block text-sm font-medium mb-2">Permissions</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                    {allPermissions.map(perm => (
                      <label key={perm.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{perm.name}</span>
                          <span className="text-xs text-muted-foreground">{perm.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3 bg-muted/20">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Role"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {roleToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-xl shadow-xl overflow-hidden p-6 space-y-6">
            <div>
              <h2 className="text-xl font-serif">Delete Role</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Are you sure you want to delete the <strong>{roleToDelete.name}</strong> role? Any users assigned to this role will lose their permissions.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setRoleToDelete(null)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={loading}
                className="bg-rose hover:bg-rose/90 text-white"
              >
                {loading ? "Deleting..." : "Delete Role"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
