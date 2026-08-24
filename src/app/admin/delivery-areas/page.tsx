"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { CityPlace } from "@/lib/data"

const PREDEFINED_CITIES = [
  "islamabad",
  "rawalpindi",
  "lahore",
  "karachi",
  "peshawar",
]

function capitalize(str: string) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export default function AdminDeliveryAreasPage() {
  const supabase = createClient()
  const [places, setPlaces] = useState<CityPlace[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<CityPlace | null>(null)
  
  const [selectedCity, setSelectedCity] = useState(PREDEFINED_CITIES[0])

  const [formName, setFormName] = useState("")
  const [formCity, setFormCity] = useState(PREDEFINED_CITIES[0])
  const [saving, setSaving] = useState(false)

  const fetchPlaces = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("city_places")
      .select("*")
      .eq("city_slug", selectedCity)
      .order("name")
    
    if (error) {
      console.error("Error fetching places:", error)
    }

    if (data) {
      setPlaces(data)
    } else {
      setPlaces([])
    }
    setLoading(false)
  }

  useEffect(() => { fetchPlaces() }, [selectedCity])

  const openCreate = () => {
    setEditing(null)
    setFormName("")
    setFormCity(selectedCity)
    setShowModal(true)
  }

  const openEdit = (place: CityPlace) => {
    setEditing(place)
    setFormName(place.name)
    setFormCity(place.city_slug)
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    const data = { 
      name: formName, 
      slug, 
      city_slug: formCity,
      is_active: true
    }

    let error;
    if (editing) {
      const res = await supabase.from("city_places").update(data).eq("id", editing.id)
      error = res.error
    } else {
      const res = await supabase.from("city_places").insert(data)
      error = res.error
    }

    if (error) {
      console.error("Error saving place:", error)
      alert("Error saving: " + error.message)
    }

    setSaving(false)
    setShowModal(false)
    
    if (formCity === selectedCity) {
      fetchPlaces()
    } else {
      setSelectedCity(formCity)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this delivery area?")) return
    await supabase.from("city_places").delete().eq("id", id)
    fetchPlaces()
  }

  const toggleStatus = async (place: CityPlace) => {
    await supabase.from("city_places").update({ is_active: !place.is_active }).eq("id", place.id)
    fetchPlaces()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-serif">Delivery Areas</h1>
        <Button onClick={openCreate} className="rounded-lg">
          <Plus className="w-4 h-4 mr-2" /> Add Area
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-card p-4 rounded-xl border border-border shadow-sm">
        <span className="text-sm font-medium flex items-center text-muted-foreground mr-2">Filter by City:</span>
        {PREDEFINED_CITIES.map(city => (
          <button 
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCity === city 
                ? "bg-primary text-white" 
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {capitalize(city)}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
            ) : places.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No delivery areas found for this city.</td></tr>
            ) : (
              places.map((place) => (
                <tr key={place.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-medium">{place.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{place.slug}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(place)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${place.is_active ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-red-50 text-red-700 ring-red-600/20"}`}
                    >
                      {place.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(place)} className="p-2 text-muted-foreground hover:text-primary rounded-md hover:bg-muted"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(place.id)} className="p-2 text-muted-foreground hover:text-rose rounded-md hover:bg-rose/5"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card rounded-2xl shadow-xl border border-border w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl">{editing ? "Edit Area" : "Add Area"}</h2>
              <button onClick={() => setShowModal(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">City</label>
                <select 
                  value={formCity} 
                  onChange={(e) => setFormCity(e.target.value)} 
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {PREDEFINED_CITIES.map(city => (
                    <option key={city} value={city}>{capitalize(city)}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Area/Neighborhood Name</label>
                <input 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  placeholder="e.g., DHA Phase 5"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                />
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
