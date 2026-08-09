"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, X } from "lucide-react"
import Image from "next/image"
import { uploadImage, deleteImage } from "@/app/actions/cloudinary"

function getCloudinaryPublicId(url: string) {
  if (!url || !url.includes("cloudinary.com")) return null;
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  return parts[1].replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
}

export default function AdminCategoriesPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formImageUrl, setFormImageUrl] = useState("")
  const [formFile, setFormFile] = useState<File | null>(null)
  const [formFilePreview, setFormFilePreview] = useState("")
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchCategories = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name")
    if (data) setCategories(data)
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const openCreate = () => {
    setEditing(null)
    setFormName(""); setFormDescription(""); setFormImageUrl("")
    setFormFile(null); setFormFilePreview(""); setFormError(null)
    setShowModal(true)
  }

  const openEdit = (cat: Category) => {
    setEditing(cat)
    setFormName(cat.name)
    setFormDescription(cat.description ?? "")
    setFormImageUrl(cat.image_url ?? "")
    setFormFilePreview(cat.image_url ?? "")
    setFormFile(null)
    setFormError(null)
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setFormError(null)
    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    let finalImageUrl = formFilePreview;

    if (formFile) {
      const formData = new FormData();
      formData.append("file", formFile);
      try {
        const uploaded = await uploadImage(formData) as { url: string; public_id: string };
        finalImageUrl = uploaded.url;
        
        if (editing && editing.image_url) {
          const oldPublicId = getCloudinaryPublicId(editing.image_url);
          if (oldPublicId) {
            await deleteImage(oldPublicId);
          }
        }
      } catch (e) {
        setFormError("Image upload failed");
        setSaving(false);
        return;
      }
    } else if (formImageUrl && formImageUrl !== (editing?.image_url || "")) {
      finalImageUrl = formImageUrl;
      if (editing && editing.image_url) {
        const oldPublicId = getCloudinaryPublicId(editing.image_url);
        if (oldPublicId) {
          await deleteImage(oldPublicId);
        }
      }
    } else if (formImageUrl) {
      finalImageUrl = formImageUrl;
    } else {
      finalImageUrl = "";
    }

    const data = { name: formName, slug, description: formDescription || null, image_url: finalImageUrl || null, is_active: true }

    if (editing) {
      await supabase.from("categories").update(data).eq("id", editing.id)
    } else {
      await supabase.from("categories").insert(data)
    }

    setSaving(false)
    setShowModal(false)
    fetchCategories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return
    await supabase.from("categories").delete().eq("id", id)
    fetchCategories()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-serif">Categories</h1>
        <Button onClick={openCreate} className="rounded-lg">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No categories found.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cat.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cat.is_active ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-red-50 text-red-700 ring-red-600/20"}`}>
                      {cat.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(cat)} className="p-2 text-muted-foreground hover:text-primary rounded-md hover:bg-muted"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-muted-foreground hover:text-rose rounded-md hover:bg-rose/5"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card rounded-2xl shadow-xl border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl">{editing ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category Name</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)} className="input-premium" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Description</label>
                <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={2} className="input-premium !h-auto" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category Image</label>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    placeholder="Paste Image URL here..."
                    value={formImageUrl}
                    onChange={(e) => {
                      setFormImageUrl(e.target.value);
                      setFormFile(null);
                      setFormFilePreview(e.target.value);
                    }}
                    className="input-premium"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground uppercase font-medium">OR Upload:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormFile(e.target.files[0]);
                          setFormImageUrl("");
                          setFormFilePreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                  </div>
                </div>
                {formFilePreview && (
                  <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-cream flex items-center justify-center text-xs text-muted-foreground">
                    <Image src={formFilePreview} alt="Preview" fill className="object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    {!formFile && formImageUrl && <span className="text-center px-2">Invalid URL</span>}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 rounded-lg">Cancel</Button>
                <Button onClick={handleSave} disabled={saving || !formName} className="flex-1 rounded-lg">
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
