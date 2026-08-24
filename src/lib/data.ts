/**
 * Data access layer — fetches from Supabase.
 */

import { getWatermarkedUrl } from "@/lib/utils"

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
          image: getWatermarkedUrl(p.product_images?.[0]?.url),
          category: p.product_categories?.[0]?.categories?.name ?? "",
        }))
      }
    } catch {
      // Supabase unreachable — fall through
    }
  }
  return []
}

export async function getProductsByCategorySlug(slug: string, limit: number = 4): Promise<ProductData[]> {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/utils/supabase/server")
      const supabase = await createClient()
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, name, slug, short_description, base_price, compare_at_price, stock,
          product_images (url, alt_text, sort_order),
          product_categories!inner (
            categories!inner (name, slug)
          )
        `)
        .eq("is_active", true)
        .eq("product_categories.categories.slug", slug)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (!error && data && data.length > 0) {
        return data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          short_description: p.short_description ?? "",
          base_price: Number(p.base_price),
          compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : null,
          stock: p.stock ?? 0,
          image: getWatermarkedUrl(p.product_images?.[0]?.url),
          category: p.product_categories?.[0]?.categories?.name ?? "",
        }))
      }
    } catch {
      // Supabase unreachable — fall through
    }
  }
  return []
}

export async function getCategories(options?: { isOccasion?: boolean, isCollection?: boolean }) {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/utils/supabase/server")
      const supabase = await createClient()
      
      let query = supabase
        .from("categories")
        .select("id, name, slug, description, image_url")
        .eq("is_active", true)
        
      if (options?.isOccasion !== undefined) {
        query = query.eq("is_occasion", options.isOccasion)
      }
      
      if (options?.isCollection !== undefined) {
        query = query.eq("is_collection", options.isCollection)
      }
        
      const { data, error } = await query.order("sort_order", { ascending: true }).order("name")

      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
          ...c,
          image_url: getWatermarkedUrl(c.image_url)
        }))
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
  search?: string
  limit?: number
  offset?: number
}): Promise<{ products: ProductData[]; total: number }> {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/utils/supabase/server")
      const supabase = await createClient()

      const categorySelect = options?.category
        ? `product_categories!inner (categories!inner (name, slug))`
        : `product_categories (categories (name, slug))`

      let query = supabase
        .from("products")
        .select(`
          id, name, slug, short_description, base_price, compare_at_price, stock,
          product_images (url, alt_text, sort_order),
          ${categorySelect}
        `, { count: "exact" })
        .eq("is_active", true)

      if (options?.search) {
        query = query.ilike("name", `%${options.search}%`)
      }

      if (options?.category) {
        query = query.eq("product_categories.categories.slug", options.category)
      }

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
          image: getWatermarkedUrl(p.product_images?.[0]?.url),
          category: p.product_categories?.[0]?.categories?.name ?? "",
        }))

        return { products: mapped, total: count ?? mapped.length }
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
          .map((img: any) => getWatermarkedUrl(img.url))

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

export async function getLocalizedProducts(citySlug: string, categorySlug?: string): Promise<ProductData[]> {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/utils/supabase/server")
      const supabase = await createClient()

      // In Supabase, testing an array contains requires the array to be wrapped in {}
      // We will fetch where is_active is true, and it matches the category (if provided),
      // AND (available_nationwide is true OR available_cities @> '{citySlug}')
      
      let query = supabase
        .from("products")
        .select(`
          id, name, slug, short_description, base_price, compare_at_price, stock,
          available_nationwide, available_cities,
          product_images (url, alt_text, sort_order),
          product_categories (
            categories (name, slug)
          )
        `)
        .eq("is_active", true)
        .or(`available_nationwide.eq.true,available_cities.cs.{${citySlug}}`)
        
      // We do manual filtering for categories if one is provided
      // because inner joins in postgrest when the relation is optional is tricky dynamically.
      
      const { data, error } = await query.order("created_at", { ascending: false })

      if (!error && data && data.length > 0) {
        let mapped = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          short_description: p.short_description ?? "",
          base_price: Number(p.base_price),
          compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : null,
          stock: p.stock ?? 0,
          image: getWatermarkedUrl(p.product_images?.[0]?.url),
          category: p.product_categories?.[0]?.categories?.name ?? "",
        }))
        
        if (categorySlug) {
          mapped = mapped.filter((p: ProductData) =>
            data.find((d: any) =>
              d.id === p.id &&
              d.product_categories?.some((pc: any) => pc.categories?.slug === categorySlug)
            )
          )
        }
        
        return mapped
      } else if (error) {
        console.error("Supabase Error fetching localized products:", error);
      }
    } catch {
      // Supabase unreachable — fall through
    }
  }
  return []
}

export type SiteSettings = {
  whatsapp_number: string
  facebook_url: string
  instagram_url: string
  hide_prices: boolean
}

export async function getSettings(): Promise<SiteSettings> {
  const defaultSettings = {
    whatsapp_number: "923055244465",
    facebook_url: "#",
    instagram_url: "#",
    hide_prices: true,
  }

  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/utils/supabase/server")
      const supabase = await createClient()

      const { data, error } = await supabase.from("settings").select("key, value")
      
      if (!error && data) {
        const settings: any = {}
        data.forEach(item => {
          settings[item.key] = item.value
        })
        
        return {
          whatsapp_number: settings.whatsapp_number || defaultSettings.whatsapp_number,
          facebook_url: settings.facebook_url || defaultSettings.facebook_url,
          instagram_url: settings.instagram_url || defaultSettings.instagram_url,
          hide_prices: settings.hide_prices !== undefined ? String(settings.hide_prices) === "true" : defaultSettings.hide_prices,
        }
      }
    } catch {
      // Fall through to defaults
    }
  }

  return defaultSettings
}

export type CityPlace = {
  id: string
  city_slug: string
  name: string
  slug: string
  is_active: boolean
}

export async function getCityPlaces(citySlug: string): Promise<CityPlace[]> {
  if (isSupabaseConfigured()) {
    try {
      const { createClient } = await import("@/utils/supabase/server")
      const supabase = await createClient()

      const { data, error } = await supabase
        .from("city_places")
        .select("id, city_slug, name, slug, is_active")
        .eq("city_slug", citySlug)
        .eq("is_active", true)
        .order("name")
      
      if (!error && data) {
        return data as CityPlace[]
      }
    } catch {
      // Fall through to empty array
    }
  }
  return []
}
