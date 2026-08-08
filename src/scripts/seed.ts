/**
 * Seed script for Fleur & Co.
 *
 * Run with:
 *   npx tsx src/scripts/seed.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * (service role key bypasses RLS for admin inserts)
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing env vars. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// ── Categories ──
const categories = [
  {
    name: "Flower Bouquets",
    slug: "bouquets",
    description: "Handcrafted bouquets made with the freshest seasonal blooms",
    image_url: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=600&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Roses",
    slug: "roses",
    description: "Premium long-stem roses in stunning arrangements",
    image_url: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?q=80&w=600&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Gift Hampers",
    slug: "gift-hampers",
    description: "Curated gift sets combining flowers with chocolates and treats",
    image_url: "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?q=80&w=600&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Plants",
    slug: "plants",
    description: "Indoor plants and succulents in beautiful ceramic pots",
    image_url: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=600&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Wedding",
    slug: "wedding",
    description: "Bridal bouquets and wedding ceremony arrangements",
    image_url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Occasions",
    slug: "occasions",
    description: "Flowers for birthdays, anniversaries, and special moments",
    image_url: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop",
    is_active: true,
  },
]

// ── Products (16 items) ──
const products: any[] = [
  {
    name: "Crimson Elegance",
    slug: "crimson-elegance",
    short_description: "A breathtaking arrangement of deep red roses and complementary foliage.",
    long_description: "Hand-tied by our expert florists, this stunning bouquet features 24 premium long-stem red roses surrounded by eucalyptus and ruscus foliage. Wrapped in our signature cream tissue with a satin ribbon finish. Perfect for expressing profound love and admiration.",
    base_price: 8500,
    compare_at_price: 10000,
    sku: "FLC-001",
    is_active: true,
    stock: 25,
    categories: ["bouquets", "roses"],
    images: [
      "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Standard (12 Roses)", price_adjustment: 0, stock: 25, sku: "FLC-001-S" },
      { name: "Premium (24 Roses)", price_adjustment: 3000, stock: 15, sku: "FLC-001-P" },
      { name: "Luxury (50 Roses)", price_adjustment: 8000, stock: 8, sku: "FLC-001-L" },
    ],
  },
  {
    name: "White Whisper",
    slug: "white-whisper",
    short_description: "An ethereal arrangement of white lilies and baby's breath.",
    long_description: "This elegant arrangement features pristine white Oriental lilies, delicate baby's breath, and silver dollar eucalyptus. A symbol of purity and grace, perfect for sympathy or formal occasions.",
    base_price: 6500,
    compare_at_price: null,
    sku: "FLC-002",
    is_active: true,
    stock: 18,
    categories: ["bouquets", "occasions"],
    images: [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Standard", price_adjustment: 0, stock: 18, sku: "FLC-002-S" },
      { name: "Premium", price_adjustment: 2500, stock: 10, sku: "FLC-002-P" },
    ],
  },
  {
    name: "Pastel Dream",
    slug: "pastel-dream",
    short_description: "A soft mix of pink, lavender, and peach blooms.",
    long_description: "A dreamy pastel arrangement featuring roses, ranunculus, and spray carnations in blush pink, lavender, and soft peach tones. Accented with seeded eucalyptus and wrapped in soft pink tissue.",
    base_price: 7200,
    compare_at_price: null,
    sku: "FLC-003",
    is_active: true,
    stock: 20,
    categories: ["bouquets"],
    images: [
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Standard", price_adjustment: 0, stock: 20, sku: "FLC-003-S" },
      { name: "Premium", price_adjustment: 2000, stock: 12, sku: "FLC-003-P" },
    ],
  },
  {
    name: "Golden Hour",
    slug: "golden-hour",
    short_description: "Vibrant sunflowers and warm-toned seasonal blooms.",
    long_description: "Capture the warmth of golden hour with this radiant arrangement. Features bold sunflowers, orange roses, golden chrysanthemums, and hypericum berries. A cheerful choice for birthdays and celebrations.",
    base_price: 5500,
    compare_at_price: 6000,
    sku: "FLC-004",
    is_active: true,
    stock: 30,
    categories: ["bouquets", "occasions"],
    images: [
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Standard", price_adjustment: 0, stock: 30, sku: "FLC-004-S" },
      { name: "Premium", price_adjustment: 2500, stock: 15, sku: "FLC-004-P" },
    ],
  },
  {
    name: "Midnight Romance",
    slug: "midnight-romance",
    short_description: "Deep burgundy roses with dark foliage for a dramatic look.",
    long_description: "An intensely romantic arrangement featuring deep burgundy roses, dark purple lisianthus, and dramatic black privet berries. Wrapped in matte black paper with a velvet ribbon — perfect for Valentine's Day or an anniversary.",
    base_price: 12000,
    compare_at_price: null,
    sku: "FLC-005",
    is_active: true,
    stock: 12,
    categories: ["roses", "occasions"],
    images: [
      "https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Standard", price_adjustment: 0, stock: 12, sku: "FLC-005-S" },
      { name: "Grand (36 Roses)", price_adjustment: 6000, stock: 6, sku: "FLC-005-G" },
    ],
  },
  {
    name: "Sunny Morning",
    slug: "sunny-morning",
    short_description: "Bright yellow and white daisies to brighten any room.",
    long_description: "Start the day with sunshine! This cheerful arrangement combines bright yellow gerbera daisies, white chrysanthemums, and lemon leaf foliage. Presented in a rustic kraft paper wrap.",
    base_price: 4500,
    compare_at_price: null,
    sku: "FLC-006",
    is_active: true,
    stock: 35,
    categories: ["bouquets"],
    images: [
      "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Standard", price_adjustment: 0, stock: 35, sku: "FLC-006-S" },
    ],
  },
  {
    name: "Rose Garden Collection",
    slug: "rose-garden-collection",
    short_description: "Mixed garden roses in a luxurious hat box.",
    long_description: "A curated selection of garden roses — David Austin, spray roses, and classic hybrid tea roses — arranged in our signature round hat box. Available in blush pink, ivory, and mixed pastel. Includes care instructions.",
    base_price: 9500,
    compare_at_price: 11000,
    sku: "FLC-007",
    is_active: true,
    stock: 10,
    categories: ["roses", "gift-hampers"],
    images: [
      "https://images.unsplash.com/photo-1455659817273-f96807779a8a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518882515068-8b54289e3bca?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Blush Pink", price_adjustment: 0, stock: 10, sku: "FLC-007-BP" },
      { name: "Ivory White", price_adjustment: 0, stock: 8, sku: "FLC-007-IW" },
      { name: "Mixed Pastel", price_adjustment: 500, stock: 6, sku: "FLC-007-MP" },
    ],
  },
  {
    name: "Tropical Paradise",
    slug: "tropical-paradise",
    short_description: "Exotic birds of paradise and protea with tropical foliage.",
    long_description: "Transport yourself to the tropics with this exotic arrangement. Features birds of paradise, king protea, anthuriums, and lush tropical foliage. A bold statement piece that lasts up to 2 weeks.",
    base_price: 11000,
    compare_at_price: null,
    sku: "FLC-008",
    is_active: true,
    stock: 8,
    categories: ["bouquets"],
    images: [
      "https://images.unsplash.com/photo-1478217655296-4e9c5d039e84?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Standard", price_adjustment: 0, stock: 8, sku: "FLC-008-S" },
      { name: "Grand", price_adjustment: 4000, stock: 4, sku: "FLC-008-G" },
    ],
  },
  {
    name: "Enchanted Garden",
    slug: "enchanted-garden",
    short_description: "A whimsical mix of seasonal wildflowers and herbs.",
    long_description: "This free-spirited arrangement captures the beauty of an English cottage garden. A cheerful mix of seasonal wildflowers, aromatic herbs, and trailing greenery. Each bouquet is unique — assembled from the freshest blooms available daily.",
    base_price: 5800,
    compare_at_price: null,
    sku: "FLC-009",
    is_active: true,
    stock: 22,
    categories: ["bouquets", "occasions"],
    images: [
      "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Standard", price_adjustment: 0, stock: 22, sku: "FLC-009-S" },
      { name: "Premium", price_adjustment: 2500, stock: 12, sku: "FLC-009-P" },
    ],
  },
  {
    name: "Bridal Bliss",
    slug: "bridal-bliss",
    short_description: "Classic white bridal bouquet with peonies and garden roses.",
    long_description: "The quintessential bridal bouquet. Lush white peonies, garden roses, ranunculus, and stephanotis, accented with silver brunia and finished with a flowing ivory silk ribbon. Includes a complimentary boutonnière.",
    base_price: 15000,
    compare_at_price: null,
    sku: "FLC-010",
    is_active: true,
    stock: 5,
    categories: ["wedding"],
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Bridal Bouquet", price_adjustment: 0, stock: 5, sku: "FLC-010-BB" },
      { name: "Bridal + 3 Bridesmaid", price_adjustment: 12000, stock: 3, sku: "FLC-010-BM" },
    ],
  },
  {
    name: "Succulent Trio",
    slug: "succulent-trio",
    short_description: "Three beautiful succulents in minimalist ceramic pots.",
    long_description: "Low-maintenance luxury. Three hand-selected succulents — including an Echeveria, Haworthia, and Jade — presented in sleek matte white ceramic pots. Perfect for desks, shelves, or as a thoughtful housewarming gift.",
    base_price: 3500,
    compare_at_price: 4000,
    sku: "FLC-011",
    is_active: true,
    stock: 40,
    categories: ["plants"],
    images: [
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "White Pots", price_adjustment: 0, stock: 40, sku: "FLC-011-W" },
      { name: "Terracotta Pots", price_adjustment: 500, stock: 20, sku: "FLC-011-T" },
    ],
  },
  {
    name: "Luxury Chocolate & Rose Hamper",
    slug: "luxury-chocolate-rose-hamper",
    short_description: "Red roses paired with premium Belgian chocolates.",
    long_description: "The ultimate gift of indulgence. A dozen premium red roses arranged with fragrant eucalyptus, accompanied by a box of hand-selected Belgian chocolates, a scented candle, and a personalized greeting card. All presented in our signature gift box.",
    base_price: 14000,
    compare_at_price: 16500,
    sku: "FLC-012",
    is_active: true,
    stock: 15,
    categories: ["gift-hampers", "roses"],
    images: [
      "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518882515068-8b54289e3bca?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Standard", price_adjustment: 0, stock: 15, sku: "FLC-012-S" },
      { name: "Deluxe (24 Roses)", price_adjustment: 5000, stock: 8, sku: "FLC-012-D" },
    ],
  },
  {
    name: "Lavender Serenity",
    slug: "lavender-serenity",
    short_description: "Calming purple and lilac blooms for a peaceful moment.",
    long_description: "A soothing arrangement of lavender roses, purple lisianthus, lilac stock, and aromatic dried lavender. Creates a calming atmosphere — ideal for get-well wishes, sympathy, or simply to brighten someone's day.",
    base_price: 6800,
    compare_at_price: null,
    sku: "FLC-013",
    is_active: true,
    stock: 18,
    categories: ["bouquets", "occasions"],
    images: [
      "https://images.unsplash.com/photo-1468327768560-75b778cbb551?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Standard", price_adjustment: 0, stock: 18, sku: "FLC-013-S" },
      { name: "Premium", price_adjustment: 2000, stock: 10, sku: "FLC-013-P" },
    ],
  },
  {
    name: "Monstera Deliciosa",
    slug: "monstera-deliciosa",
    short_description: "A stunning Swiss Cheese Plant in a woven basket planter.",
    long_description: "The iconic Monstera Deliciosa — Instagram's favourite houseplant — presented in a handwoven seagrass basket. This mature specimen features multiple fenestrated leaves. Includes detailed care instructions and a moisture meter.",
    base_price: 7500,
    compare_at_price: null,
    sku: "FLC-014",
    is_active: true,
    stock: 12,
    categories: ["plants"],
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "Medium (2-3 ft)", price_adjustment: 0, stock: 12, sku: "FLC-014-M" },
      { name: "Large (3-4 ft)", price_adjustment: 3000, stock: 6, sku: "FLC-014-L" },
    ],
  },
  {
    name: "Pink Peony Bouquet",
    slug: "pink-peony-bouquet",
    short_description: "Luxurious pink peonies — seasonal favourite, limited availability.",
    long_description: "Pure peony bliss. This luxurious arrangement features 12 premium pink peonies at their peak bloom, accented with pittosporum and wrapped in our signature blush tissue. Peonies are seasonal (April–June) and subject to availability.",
    base_price: 13000,
    compare_at_price: null,
    sku: "FLC-015",
    is_active: true,
    stock: 6,
    categories: ["bouquets"],
    images: [
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "12 Peonies", price_adjustment: 0, stock: 6, sku: "FLC-015-12" },
      { name: "24 Peonies", price_adjustment: 10000, stock: 3, sku: "FLC-015-24" },
    ],
  },
  {
    name: "Classic Red Rose Box",
    slug: "classic-red-rose-box",
    short_description: "24 red roses elegantly arranged in a velvet-lined box.",
    long_description: "Timeless romance in a box. 24 premium Ecuador red roses, carefully arranged in a velvet-lined presentation box. The roses are treated to last 7-10 days longer than traditional bouquets. A luxurious gift that arrives ready to display.",
    base_price: 16000,
    compare_at_price: 18500,
    sku: "FLC-016",
    is_active: true,
    stock: 10,
    categories: ["roses", "gift-hampers"],
    images: [
      "https://images.unsplash.com/photo-1518882515068-8b54289e3bca?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?q=80&w=800&auto=format&fit=crop",
    ],
    variants: [
      { name: "24 Roses", price_adjustment: 0, stock: 10, sku: "FLC-016-24" },
      { name: "50 Roses", price_adjustment: 9000, stock: 4, sku: "FLC-016-50" },
      { name: "100 Roses", price_adjustment: 22000, stock: 2, sku: "FLC-016-100" },
    ],
  },
]

async function seed() {
  console.log("🌸 Starting Fleur & Co. seed...")

  // ── 1. Upsert Categories ──
  console.log("📂 Seeding categories...")
  const { data: categoryRows, error: catError } = await supabase
    .from("categories")
    .upsert(categories, { onConflict: "slug" })
    .select("id, slug")

  if (catError) {
    console.error("❌ Category seed failed:", catError.message)
    process.exit(1)
  }
  console.log(`  ✅ ${categoryRows.length} categories seeded`)

  const categoryMap = new Map(categoryRows.map((c) => [c.slug, c.id]))

  // ── 2. Seed Products ──
  console.log("🌷 Seeding products...")
  for (const product of products) {
    const { categories: catSlugs, images, variants, ...productData } = product

    // Upsert product
    const { data: productRow, error: prodError } = await supabase
      .from("products")
      .upsert(productData, { onConflict: "slug" })
      .select("id")
      .single()

    if (prodError) {
      console.error(`  ❌ Failed to seed "${product.name}":`, prodError.message)
      continue
    }

    const productId = productRow.id

    // Link categories
    const catLinks = catSlugs
      .map((slug: string) => ({ product_id: productId, category_id: categoryMap.get(slug)! }))
      .filter((l: any) => l.category_id)

    if (catLinks.length > 0) {
      // Delete existing links first, then insert
      await supabase.from("product_categories").delete().eq("product_id", productId)
      await supabase.from("product_categories").insert(catLinks)
    }

    // Images
    await supabase.from("product_images").delete().eq("product_id", productId)
    const imageRows = images.map((url: string, idx: number) => ({
      product_id: productId,
      url,
      alt_text: `${product.name} - Image ${idx + 1}`,
      sort_order: idx,
    }))
    await supabase.from("product_images").insert(imageRows)

    // Variants
    await supabase.from("product_variants").delete().eq("product_id", productId)
    const variantRows = variants.map((v: any) => ({
      product_id: productId,
      ...v,
    }))
    await supabase.from("product_variants").insert(variantRows)

    console.log(`  ✅ ${product.name}`)
  }

  console.log("\n🎉 Seed complete! 16 products across 6 categories.")
}

seed().catch(console.error)
