"use server"

import { getCategories } from "@/lib/data"

export async function fetchOccasions() {
  return await getCategories({ isOccasion: true })
}

export async function fetchCollections() {
  return await getCategories({ isCollection: true })
}
