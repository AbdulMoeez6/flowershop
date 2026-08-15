"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Search, Edit, Trash2, X, Upload } from "lucide-react"
import Image from "next/image"
import { uploadImage, deleteImage } from "@/app/actions/cloudinary"

interface Product {
  id: string
  name: string
  slug: string
  base_price: number
  stock: number
  is_active: boolean
  short_description: string
  available_nationwide: boolean
  available_cities: string[]
  product_images: { url: string }[]
  product_categories: { categories: { name: string } }[]
}

function getCloudinaryPublicId(url: string) {
  if (!url || !url.includes("cloudinary.com")) return null;
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  return parts[1].replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
}

export default function AdminProductsPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formStock, setFormStock] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formNationwide, setFormNationwide] = useState(true)
  const [formCities, setFormCities] = useState<string[]>([])
  
  const [formFile, setFormFile] = useState<File | null>(null)
  const [formImageUrl, setFormImageUrl] = useState<string>("")
  const [formFilePreview, setFormFilePreview] = useState<string>("")
  const [saving, setSaving] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("products")
      .select(`
        id, name, slug, base_price, stock, is_active, short_description,
        available_nationwide, available_cities,
        product_images (url),
        product_categories (categories (name))
      `)
      .order("created_at", { ascending: false })

    if (!error && data) setProducts(data as unknown as Product[])
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormName("")
    setFormPrice("")
    setFormStock("")
    setFormDescription("")
    setFormNationwide(true)
    setFormCities([])
    setFormFile(null)
    setFormImageUrl("")
    setFormFilePreview("")
    setFormError(null)
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormName(product.name)
    setFormPrice(String(product.base_price))
    setFormStock(String(product.stock))
    setFormDescription(product.short_description || "")
    setFormNationwide(product.available_nationwide ?? true)
    setFormCities(product.available_cities ?? [])
    setFormFile(null)
    const existingUrl = product.product_images?.[0]?.url || ""
    setFormImageUrl(existingUrl)
    setFormFilePreview(existingUrl)
    setFormError(null)
    setShowModal(true)
  }

  const handleSave = async () => {
    setFormError(null)
    setSaving(true)
    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    let finalImageUrl = formFilePreview;

    if (formFile) {
      const formData = new FormData();
      formData.append("file", formFile);
      try {
        const uploaded = await uploadImage(formData) as { url: string; public_id: string };
        finalImageUrl = uploaded.url;
        
        // Delete old image if we are replacing it
        if (editingProduct && editingProduct.product_images?.[0]?.url) {
          const oldUrl = editingProduct.product_images[0].url;
          const oldPublicId = getCloudinaryPublicId(oldUrl);
          if (oldPublicId) {
            await deleteImage(oldPublicId);
          }
        }
      } catch (e) {
        setFormError("Image upload failed");
        setSaving(false);
        return;
      }
    } else if (formImageUrl && formImageUrl !== (editingProduct?.product_images?.[0]?.url || "")) {
      finalImageUrl = formImageUrl;
      // Delete old image if we are replacing a cloudinary image with an external URL
      if (editingProduct && editingProduct.product_images?.[0]?.url) {
        const oldUrl = editingProduct.product_images[0].url;
        const oldPublicId = getCloudinaryPublicId(oldUrl);
        if (oldPublicId) {
          await deleteImage(oldPublicId);
        }
      }
    } else if (formImageUrl) {
      finalImageUrl = formImageUrl;
    }

    const productData = {
      name: formName,
      slug,
      base_price: Number(formPrice),
      stock: Number(formStock),
      short_description: formDescription,
      is_active: true,
      available_nationwide: formNationwide,
      available_cities: formNationwide ? [] : formCities,
    }

    if (editingProduct) {
      // Update
      const { error: updateError } = await supabase.from("products").update(productData).eq("id", editingProduct.id)
      
      if (updateError) {
        setFormError("Failed to update product: " + updateError.message)
        setSaving(false)
        return
      }

      // Update image
      if (finalImageUrl) {
        await supabase.from("product_images").delete().eq("product_id", editingProduct.id)
        const { error: imageError } = await supabase.from("product_images").insert({
          product_id: editingProduct.id,
          url: finalImageUrl,
          alt_text: formName,
          sort_order: 0,
        })
        if (imageError) {
          setFormError("Product saved, but failed to save image: " + imageError.message);
          setSaving(false);
          return;
        }
      }
    } else {
      // Create
      const { data: newProduct, error: insertError } = await supabase
        .from("products")
        .insert(productData)
        .select("id")
        .single()
        
      if (insertError) {
        setFormError("Failed to create product: " + insertError.message)
        setSaving(false)
        return
      }

      if (newProduct && finalImageUrl) {
        const { error: imageError } = await supabase.from("product_images").insert({
          product_id: newProduct.id,
          url: finalImageUrl,
          alt_text: formName,
          sort_order: 0,
        })
        if (imageError) {
          setFormError("Product created, but failed to save image: " + imageError.message);
          setSaving(false);
          return;
        }
      }
    }

    setShowModal(false)
    setSaving(false)
    fetchProducts()
  }

  const confirmDelete = async (product: Product) => {
    if (product.product_images?.[0]?.url) {
      const publicId = getCloudinaryPublicId(product.product_images[0].url);
      if (publicId) {
        await deleteImage(publicId);
      }
    }

    await supabase.from("products").delete().eq("id", product.id)
    setProductToDelete(null)
    fetchProducts()
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-serif">Products</h1>
        <Button onClick={openCreateModal} className="rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-border bg-cream/30">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-premium pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No products found. {products.length === 0 && "Run the seed script to add sample products."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cream overflow-hidden relative shrink-0">
                          {product.product_images?.[0]?.url ? (
                            <Image
                              src={product.product_images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              📷
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {product.product_categories?.[0]?.categories?.name ?? "—"}
                    </td>
                    <td className="px-6 py-4">Rs. {Number(product.base_price).toLocaleString()}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          product.is_active && product.stock > 0
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-rose/10 text-rose ring-rose/20"
                        }`}
                      >
                        {product.is_active && product.stock > 0 ? "Active" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
                          aria-label="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-2 text-muted-foreground hover:text-rose transition-colors rounded-md hover:bg-rose/5"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card rounded-2xl shadow-xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose/10 text-rose text-sm rounded-md border border-rose/20">
                  {formError}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Product Name</label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)} className="input-premium" placeholder="Crimson Elegance" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Price (Rs.)</label>
                  <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} className="input-premium" placeholder="8500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Stock</label>
                  <input type="number" value={formStock} onChange={(e) => setFormStock(e.target.value)} className="input-premium" placeholder="25" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Product Image</label>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    type="text"
                    placeholder="Paste Image URL here..."
                    value={formImageUrl}
                    onChange={(e) => {
                      setFormImageUrl(e.target.value);
                      setFormFile(null); // Clear file if URL is pasted
                      setFormFilePreview(e.target.value);
                    }}
                    className="input-premium"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground uppercase font-medium">OR Upload File:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormFile(e.target.files[0]);
                          setFormImageUrl(""); // Clear URL if file is chosen
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
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Short Description</label>
                <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} rows={3} className="input-premium !h-auto" placeholder="A breathtaking arrangement..." />
              </div>
              <div className="space-y-3 pt-2 border-t border-border mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formNationwide} onChange={(e) => setFormNationwide(e.target.checked)} className="rounded border-border text-primary focus:ring-primary h-4 w-4" />
                  <span className="text-sm font-medium">Available Nationwide (All Cities)</span>
                </label>
                {!formNationwide && (
                  <div className="space-y-2 pl-6">
                    <p className="text-xs text-muted-foreground uppercase font-medium">Select Available Cities</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['islamabad', 'rawalpindi', 'lahore', 'karachi', 'peshawar', 'faisalabad'].map((city) => (
                        <label key={city} className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 p-1.5 rounded transition-colors">
                          <input 
                            type="checkbox" 
                            checked={formCities.includes(city)} 
                            onChange={(e) => {
                              if (e.target.checked) setFormCities([...formCities, city]);
                              else setFormCities(formCities.filter(c => c !== city));
                            }} 
                            className="rounded border-border text-primary focus:ring-primary h-4 w-4" 
                          />
                          <span className="text-sm capitalize">{city}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 rounded-lg">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving || !formName || !formPrice} className="flex-1 rounded-lg">
                  {saving ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setProductToDelete(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card rounded-2xl shadow-xl border border-border w-full max-w-sm p-6 text-center">
            <h3 className="font-serif text-xl mb-2">Delete Product</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Are you sure you want to delete <span className="font-medium">"{productToDelete.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setProductToDelete(null)} className="flex-1 rounded-lg">
                Cancel
              </Button>
              <Button onClick={() => confirmDelete(productToDelete)} className="flex-1 rounded-lg bg-rose hover:bg-rose/90 text-white border-0">
                Delete
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
