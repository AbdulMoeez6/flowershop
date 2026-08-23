"use client"

import { useState } from "react"
import { Plus, Edit2, Copy, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createStaffUser, updateStaffRole, deleteStaffUser } from "@/app/actions/admin"

export function UsersClient({ initialUsers, allRoles }: { initialUsers: any[], allRoles: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [userToDelete, setUserToDelete] = useState<any | null>(null)
  
  // Create Form State
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [roleId, setRoleId] = useState("")
  const [newPassword, setNewPassword] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  
  const [loading, setLoading] = useState(false)

  const openCreate = () => {
    setEmail("")
    setFullName("")
    setRoleId(allRoles[0]?.id || "")
    setNewPassword(null)
    setCopied(false)
    setIsCreateModalOpen(true)
  }

  const handleCopy = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openEdit = (user: any) => {
    setEditingUser(user)
    setRoleId(user.role_id || "")
    setIsEditModalOpen(true)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await createStaffUser(email, fullName, roleId)
      setNewPassword(res.tempPassword)
      // We don't close modal immediately so they can copy the password
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateStaffRole(editingUser.id, roleId)
      setIsEditModalOpen(false)
      window.location.reload()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (user: any) => {
    setUserToDelete(user)
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    setLoading(true)
    try {
      await deleteStaffUser(userToDelete.id)
      window.location.reload()
    } catch (err: any) {
      alert(err.message)
      setLoading(false)
      setUserToDelete(null)
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Staff User
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 font-medium">{user.full_name || "Unknown"}</td>
                <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                    {user.role?.name || "None"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(user)} title="Edit user">
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => confirmDelete(user)} title="Delete user">
                    <Trash2 className="w-4 h-4 text-rose/70" />
                  </Button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                  No staff users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            {newPassword ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold">User Created!</h2>
                <p className="text-sm text-muted-foreground">Please share this temporary password with the user securely. They can log in with their email.</p>
                <div className="flex items-center justify-between p-4 bg-muted rounded-md border">
                  <span className="font-mono text-lg tracking-wider text-foreground">
                    {newPassword}
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy password">
                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
                  </Button>
                </div>
                <Button className="w-full mt-4" onClick={() => window.location.reload()}>
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleCreateSubmit}>
                <div className="p-6 border-b">
                  <h2 className="text-xl font-serif">Create Staff User</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      required
                      value={roleId}
                      onChange={e => setRoleId(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="" disabled>Select a role...</option>
                      {allRoles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="p-6 border-t flex justify-end gap-3 bg-muted/20">
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create User"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            <form onSubmit={handleEditSubmit}>
              <div className="p-6 border-b">
                <h2 className="text-xl font-serif">Edit User Role</h2>
                <p className="text-sm text-muted-foreground mt-1">Update role for {editingUser?.full_name}</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    required
                    value={roleId}
                    onChange={e => setRoleId(e.target.value)}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {allRoles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3 bg-muted/20">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
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
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-xl shadow-xl overflow-hidden p-6 space-y-6">
            <div>
              <h2 className="text-xl font-serif">Delete User</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Are you sure you want to delete <strong>{userToDelete.full_name}</strong>? This action cannot be undone and will permanently remove their access.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setUserToDelete(null)}>
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={loading}
                className="bg-rose hover:bg-rose/90 text-white"
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
