/**
 * Data access layer — fetches from Supabase.
 */

// Helper: Check if Supabase is configured with real credentials
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  // Reject obvious placeholders
  return (
    url.includes("supabase.co") &&
    key.length > 30
  )
}

interface ProductData {
  id: string
  name: string
  slug: string
  short_description: string
  base_price: number
  compare_at_price: number | null
  stock: number
  image: string
  category: string
  images?: string[]
  long_description?: string
  variants?: { id: string; name: string; price_adjustment: number; stock: number }[]
}

// ── Fetch functions ──

export async function getFeaturedProducts(): Promise<ProductData[]> {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/utils/supabase/server")
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, name, slug, short_description, base_price, compare_at_price, stock,
          product_images (url, alt_text, sort_order),
          product_categories (categories (name))
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(8)

      if (!error && data && data.length > 0) {
        return data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          short_description: p.short_description ?? "",
          base_price: Number(p.base_price),
          compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : null,
          stock: p.stock ?? 0,
          image: p.product_images?.[0]?.url ?? "",
          category: p.product_categories?.[0]?.categories?.name ?? "",
        }))
      }
    } catch {
      // Supabase unreachable — fall through
    }
  }
  return []
}

export async function getCategories() {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/utils/supabase/server")
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, description, image_url")
        .eq("is_active", true)
        .order("name")

      if (!error && data && data.length > 0) {
        return data
      }
    } catch {
      // fall through
    }
  }
  return []
}

export async function getAllProducts(options?: {
  category?: string
  sort?: string
  limit?: number
  offset?: number
}): Promise<{ products: ProductData[]; total: number }> {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/utils/supabase/server")
      const supabase = await createClient()

      let query = supabase
        .from("products")
        .select(`
          id, name, slug, short_description, base_price, compare_at_price, stock,
          product_images (url, alt_text, sort_order),
          product_categories (categories (name, slug))
        `, { count: "exact" })
        .eq("is_active", true)

      // Sort
      if (options?.sort === "price-asc") {
        query = query.order("base_price", { ascending: true })
      } else if (options?.sort === "price-desc") {
        query = query.order("base_price", { ascending: false })
      } else {
        query = query.order("created_at", { ascending: false })
      }

      // Pagination
      const limit = options?.limit ?? 12
      const offset = options?.offset ?? 0
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (!error && data) {
        const mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          short_description: p.short_description ?? "",
          base_price: Number(p.base_price),
          compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : null,
          stock: p.stock ?? 0,
          image: p.product_images?.[0]?.url ?? "",
          category: p.product_categories?.[0]?.categories?.name ?? "",
        }))

        // Filter by category client-side if needed (Supabase join filtering is complex)
        let filtered = mapped
        if (options?.category) {
          filtered = mapped.filter((p: ProductData) =>
            data.find((d: any) =>
              d.id === p.id &&
              d.product_categories?.some((pc: any) => pc.categories?.slug === options.category)
            )
          )
        }

        return { products: filtered, total: count ?? filtered.length }
      }
    } catch {
      // fall through
    }
  }

  return { products: [], total: 0 }
}

export async function getProductBySlug(slug: string): Promise<ProductData | null> {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/utils/supabase/server")
      const supabase = await createClient()

      const { data, error } = await supabase
        .from("products")
        .select(`
          id, name, slug, short_description, long_description, base_price, compare_at_price, stock, sku,
          product_images (id, url, alt_text, sort_order),
          product_variants (id, name, price_adjustment, stock, sku),
          product_categories (categories (name, slug))
        `)
        .eq("slug", slug)
        .eq("is_active", true)
        .single()

      if (!error && data) {
        const images = (data.product_images ?? [])
          .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((img: any) => img.url)

        return {
          id: data.id,
          name: data.name,
          slug: data.slug,
          short_description: data.short_description ?? "",
          long_description: data.long_description ?? "",
          base_price: Number(data.base_price),
          compare_at_price: data.compare_at_price ? Number(data.compare_at_price) : null,
          stock: data.stock ?? 0,
          image: images[0] ?? "",
          images,
          category: (data.product_categories?.[0]?.categories as any)?.name ?? "",
          variants: (data.product_variants ?? []).map((v: any) => ({
            id: v.id,
            name: v.name,
            price_adjustment: Number(v.price_adjustment),
            stock: v.stock ?? 0,
          })),
        }
      }
    } catch {
      // fall through
    }
  }

  return null
}
