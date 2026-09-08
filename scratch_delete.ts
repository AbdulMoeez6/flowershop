// @ts-nocheck
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name")
    .or("name.ilike.%Classic Red Roses Bundle%,name.ilike.%Mixed Color Roses%")

  if (error) {
    console.error(error)
    return
  }
  
  console.log("Found products:", data)

  if (data && data.length > 0) {
    // delete the first one found that matches "Mixed Color Roses"
    const toDelete = data.find(p => p.name.includes("Mixed Color Roses"))
    if (toDelete) {
      console.log(`Deleting ${toDelete.name} (id: ${toDelete.id})...`)
      const { error: delError } = await supabase.from("products").delete().eq("id", toDelete.id)
      if (delError) {
         console.error("Delete error:", delError)
      } else {
         console.log("Deleted successfully.")
      }
    } else {
      console.log("Mixed Color Roses not found, maybe you want to delete the other one?")
    }
  }
}

run()
