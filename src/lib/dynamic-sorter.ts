/**
 * Dynamic categorization and sorting utility for products.
 *
 * Specifically handles the Cakes category to ensure that without explicit sorting filters:
 * 1. Cakes always appear first
 * 2. Sundaes appear second
 * 3. Cup Cakes / Cups / Muffins appear third
 * 4. Donuts / Doughnuts appear fourth
 * 5. Cookies, Tarts, and other bakery treats appear afterwards
 *
 * Supports dynamic configuration via custom order keywords (e.g. from site settings).
 */

export const DEFAULT_BAKERY_ORDER = ["cake", "sundae", "cup cake", "donut"]

export function isCakesCategory(slugOrName?: string | null): boolean {
  if (!slugOrName) return false
  const lower = slugOrName.toLowerCase().trim()
  return (
    lower === "cakes" ||
    lower === "cake" ||
    lower.includes("cake") ||
    lower === "bakery"
  )
}

export type BakerySubtype = "Cakes" | "Sundaes" | "Cup Cakes" | "Donuts" | "Cookies & Treats" | "Other"

/**
 * Classifies a product name into a bakery sub-type.
 */
export function getBakerySubtype(productName: string): BakerySubtype {
  const n = (productName || "").toLowerCase().trim()

  // 1. Sundaes
  if (/\bsundaes?\b/i.test(n)) {
    return "Sundaes"
  }

  // 2. Cupcakes, Muffins, Cups (must test before 'cake' so 'cupcake' doesn't match 'cake')
  if (/\bcup\s*cakes?\b|\bcupcakes?\b|\bmuffins?\b|\bcup\b/i.test(n)) {
    return "Cup Cakes"
  }

  // 3. Donuts & Doughnuts
  if (/\bdonuts?\b|\bdoughnuts?\b/i.test(n)) {
    return "Donuts"
  }

  // 4. Cookies, Tarts, Brownies, Toffee
  if (/\bcookies?\b|\btarts?\b|\bpies?\b|\bbrownies?\b|\btoffee\b/i.test(n)) {
    return "Cookies & Treats"
  }

  // 5. Cakes (explicit cake keywords or default in cakes category)
  return "Cakes"
}

/**
 * Calculates priority index for a product. Lower number = shows earlier.
 * Default hierarchy:
 * 0: Cakes
 * 1: Sundaes
 * 2: Cup Cakes / Cups
 * 3: Donuts
 * 4: Cookies & Treats
 * 5: Others
 */
export function getBakeryProductPriority(
  productName: string,
  customOrder: string[] = DEFAULT_BAKERY_ORDER
): number {
  const subtype = getBakerySubtype(productName)

  // Find index in dynamic order list
  const index = customOrder.findIndex((item) => {
    const clean = item.trim().toLowerCase()
    if (clean === "cake" || clean === "cakes") return subtype === "Cakes"
    if (clean === "sundae" || clean === "sundaes") return subtype === "Sundaes"
    if (
      clean === "cup cake" ||
      clean === "cup cakes" ||
      clean === "cupcake" ||
      clean === "cupcakes" ||
      clean === "muffin"
    ) {
      return subtype === "Cup Cakes"
    }
    if (clean === "donut" || clean === "donuts" || clean === "doughnut" || clean === "doughnuts") {
      return subtype === "Donuts"
    }
    if (clean === "cookie" || clean === "cookies" || clean === "tart" || clean === "treats") {
      return subtype === "Cookies & Treats"
    }
    return false
  })

  if (index !== -1) {
    return index
  }

  // Fallback priorities for items not explicitly listed in customOrder
  if (subtype === "Cakes") return 0
  if (subtype === "Sundaes") return 1
  if (subtype === "Cup Cakes") return 2
  if (subtype === "Donuts") return 3
  if (subtype === "Cookies & Treats") return 4
  return 5
}

/**
 * Sorts products dynamically:
 * - By bakery priority tier (Cakes -> Sundaes -> Cup Cakes -> Donuts -> Etc.)
 * - Within the same tier, preserves created_at descending (or original relative order)
 */
export function sortBakeryProducts<T extends { name: string; created_at?: string }>(
  products: T[],
  customOrder?: string[]
): T[] {
  const orderList = customOrder && customOrder.length > 0 ? customOrder : DEFAULT_BAKERY_ORDER

  return [...products].sort((a, b) => {
    const priorityA = getBakeryProductPriority(a.name, orderList)
    const priorityB = getBakeryProductPriority(b.name, orderList)

    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }

    // Secondary sort: created_at descending if available
    if (a.created_at && b.created_at) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }

    return 0
  })
}

export interface ProductCategorySortInfo {
  name: string
  created_at?: string
  product_categories?: Array<{
    categories?: {
      id?: string
      name?: string
      slug?: string
      sort_order?: number
    } | null
  }>
}

/**
 * Sorts products across the store according to category sort_order:
 * 1. Products in category with sort_order 0 (e.g. Flower Bouquet)
 * 2. Products in category with sort_order 1 (e.g. Single Stem Flowers)
 * 3. Products in category with sort_order 2 (e.g. Combo Deals)
 * 4. Products in category with sort_order 3 (e.g. Flower Jewelry Sets and Gajra), etc.
 * - Within the Cakes category, applies the dynamic bakery tiers (Cakes -> Sundaes -> Cupcakes -> Donuts)
 * - Within the same category/tier, sorts newest additions first (created_at desc)
 */
export function sortProductsByCategoryHierarchy<T extends ProductCategorySortInfo>(products: T[]): T[] {
  return [...products].sort((a, b) => {
    const aCats = a.product_categories?.map((pc) => pc.categories).filter(Boolean) || []
    const bCats = b.product_categories?.map((pc) => pc.categories).filter(Boolean) || []

    const aMinSortOrder = aCats.length > 0 ? Math.min(...aCats.map((c) => c?.sort_order ?? 999)) : 999
    const bMinSortOrder = bCats.length > 0 ? Math.min(...bCats.map((c) => c?.sort_order ?? 999)) : 999

    if (aMinSortOrder !== bMinSortOrder) {
      return aMinSortOrder - bMinSortOrder
    }

    // If both products belong to the Cakes category, apply the bakery priority tiers
    const aIsCakes = aCats.some((c) => isCakesCategory(c?.slug))
    const bIsCakes = bCats.some((c) => isCakesCategory(c?.slug))

    if (aIsCakes && bIsCakes) {
      const pA = getBakeryProductPriority(a.name)
      const pB = getBakeryProductPriority(b.name)
      if (pA !== pB) {
        return pA - pB
      }
    }

    // Secondary sort: newest first
    if (a.created_at && b.created_at) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }

    return 0
  })
}

