"use server"

import { getCategories } from "@/lib/data"

export async function fetchOccasions() {
  // Fetch categories where is_occasion is true
  // Note: This relies on the new `isOccasion` filter added to getCategories
  return await getCategories({ isOccasion: true })
}
