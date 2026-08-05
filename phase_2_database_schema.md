# Phase 2: Information Architecture & Database Schema

We are now establishing the core foundation of the application. The architecture is designed to support the premium florist e-commerce platform MVP while remaining flexible for future multi-city, multi-vendor, and multi-language features.

## 1. Information Architecture
The site will follow this structure:
- **Public Storefront:**
  - **Home:** Dynamic sections (Hero, Featured, Categories, Testimonials)
  - **Shop:** Browse all products with filters
  - **Categories:** Dynamic routing `/[category-slug]` (e.g., `/flower-bouquets`, `/cakes`)
  - **Product Detail:** `/[category-slug]/[product-slug]`
  - **Checkout Flow:** `/cart` -> `/checkout` -> `/order-confirmation`
  - **Content Pages:** `/about`, `/contact`, `/policies/[slug]`
- **Customer Portal:**
  - `/account/orders`, `/account/wishlist`, `/account/addresses`
- **Admin Dashboard:**
  - `/admin/products`, `/admin/orders`, `/admin/categories`, `/admin/settings` (Requires `admin` role)

## 2. Database Entity-Relationship Diagram (ERD)

The database will be hosted on Supabase (PostgreSQL). We rely on Supabase Auth for authentication, and we use a `profiles` table to store extended user data (roles, phone numbers).

```mermaid
erDiagram
    PROFILES {
        uuid id PK "References auth.users"
        string full_name
        string phone
        string role "admin or customer"
        timestamp created_at
    }

    CATEGORIES {
        uuid id PK
        uuid parent_id FK "Self-referencing for nested categories"
        string name
        string slug
        string description
        string image_url
        boolean is_active
    }

    PRODUCTS {
        uuid id PK
        string name
        string slug
        text short_description
        text long_description
        decimal base_price
        decimal compare_at_price
        string sku
        boolean is_active
        integer stock
        timestamp created_at
    }

    PRODUCT_CATEGORIES {
        uuid product_id FK
        uuid category_id FK
    }

    PRODUCT_IMAGES {
        uuid id PK
        uuid product_id FK
        string url "Cloudinary URL"
        string alt_text
        int sort_order
    }

    PRODUCT_VARIANTS {
        uuid id PK
        uuid product_id FK
        string name "e.g., Large, Red, Premium Packaging"
        decimal price_adjustment
        integer stock
        string sku
    }

    ORDERS {
        uuid id PK
        uuid user_id FK "Nullable for guest checkout"
        string guest_email
        string guest_phone
        decimal total_amount
        string order_status "pending, processing, completed, cancelled"
        string payment_method "stripe, jazzcash, easypaisa, cod"
        string payment_status "unpaid, paid, refunded"
        jsonb shipping_address
        date delivery_date
        string delivery_time_slot
        text gift_message
        timestamp created_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        uuid variant_id FK "Nullable"
        integer quantity
        decimal unit_price
        decimal total_price
    }

    CONTENT_PAGES {
        uuid id PK
        string slug
        string title
        text content "Rich text / HTML"
        boolean is_published
        timestamp created_at
    }

    PROFILES ||--o{ ORDERS : places
    CATEGORIES ||--o{ CATEGORIES : "parent of"
    PRODUCTS ||--o{ PRODUCT_CATEGORIES : belongs_to
    CATEGORIES ||--o{ PRODUCT_CATEGORIES : contains
    PRODUCTS ||--o{ PRODUCT_IMAGES : has
    PRODUCTS ||--o{ PRODUCT_VARIANTS : has
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : ordered_in
```

## 3. Key Design Decisions & Future-Proofing
- **UUIDs over Auto-Increment IDs:** Used for all primary keys to ensure global uniqueness (crucial for future multi-tenant/vendor scaling).
- **Nested Categories:** The `parent_id` on the `categories` table allows for unlimited nesting (e.g., `Occasions -> Mother's Day`).
- **Flexible Checkout:** The `orders` table supports `guest_email` and `guest_phone`, meaning users do NOT need an account to checkout.
- **Delivery Time Tracking:** `delivery_date` and `delivery_time_slot` are explicitly tracked in the `orders` table, as flower delivery is time-sensitive.
- **Row Level Security (RLS):** 
  - `admin` role has full read/write.
  - `customer` role can only read active products, and read/update their own profile and orders.
  - `anon` (unauthenticated) can only read active products and create guest orders via secure edge functions.

## 4. Deliverables Generated
I have written the corresponding SQL migration script which creates these tables, sets up timestamps, triggers, and basic Row Level Security (RLS) policies.

> [!IMPORTANT]
> **User Review Required:**
> Please review the ERD and Information Architecture above. Once you approve this schema design, I will create the actual `.sql` migration files in the workspace and proceed to **Phase 3: Design System** (Tailwind CSS, component preview).
