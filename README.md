# Fleur & Co. - Premium Florist E-Commerce Platform

This repository contains the full-stack Next.js application for **Fleur & Co.**, a luxury florist operating in Islamabad and Rawalpindi.

## Architecture

This project is built using modern, edge-ready web technologies:
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + custom design tokens
- **Components**: React Server Components + Lucide Icons + Framer Motion
- **State Management**: Zustand (Client-side Cart)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Playwright End-to-End Testing

## Local Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <repo-url>
   cd flowershop
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Migration:**
   Ensure your Supabase project is running and execute the initial schema migration located at:
   `supabase/migrations/00000000000000_initial_schema.sql`

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to view the application.

## End-to-End Testing

We use Playwright for automated E2E testing to ensure core flows (Checkout, Auth routing) remain stable.
To run the tests locally:
```bash
npx playwright test
```

## Vercel Deployment Pre-Flight Checklist

Before deploying this application to Vercel, ensure the following steps are completed:

- [ ] **Supabase Setup**: Production Supabase project is active with the initial schema applied via the SQL Editor or Supabase CLI.
- [ ] **Environment Variables**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are added to the Vercel project environment variables.
- [ ] **Build Check**: Run `npm run build` locally to ensure there are no TypeScript or ESLint errors blocking the build pipeline.
- [ ] **Authentication**: Google OAuth provider is correctly configured in Supabase (if used), and the Vercel production domain is added to the allowed redirect URIs in Supabase Auth settings.
- [ ] **Custom Domain**: Ensure the custom domain (e.g., `flowershopislamabad.com`) is correctly mapped in Vercel.

## Core Features Implemented

- **Design System**: Strict luxury design tokens, glassmorphism, responsive UI.
- **Storefront**: Dynamic product catalog, detail pages, robust cart state, and checkout validation.
- **Authentication**: Secure JWT sessions with Supabase Auth and protected routes via Middleware.
- **Admin Dashboard**: Secure backend for managing products, categories, orders, and viewing analytics.
- **SEO & Performance**: Next.js App Router metadata, JSON-LD Schema injection, strict security headers, and dynamic sitemaps.
