import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { createClient } from "@/lib/supabase/server"

// Helper function to normalize ingredient data based on the original controller's logic
function normalizeIngredient(item: any, experienceMap: Record<string, { brand_id: string }>) {
  const experience_id = item.experience_id || item.experienceId
  let brand_id = item.brand_id || item.brandId || null

  // 1. Resolve brand_id from the map if available
  if (experience_id && experienceMap[experience_id]) {
    brand_id = brand_id || experienceMap[experience_id].brand_id // Prefer map value if user's session brand_id is null
  }

  // 2. Normalize fields and handle type casting (especially boolean)
  let is_allergen = item.is_allergen
  if (is_allergen === undefined) is_allergen = item.isAllergen
  const normalizedIsAllergen = is_allergen === true || is_allergen === 'true' || is_allergen === 1

  return {
    experience_id: experience_id,
    brand_id: brand_id,     // Required for RLS/security
    inci_name: item.inci_name || item.inciName || item.name || null,
    common_name: item.common_name || item.commonName || null,
    category: item.category || null,
    // The original code used '"function"' for the DB, but Supabase should map to 'function'
    'function': item.function || item.func || item.functionName || null,
    concentration: item.concentration || null,
    is_allergen: normalizedIsAllergen,
  }
}

// Map accepted input keys to DB column names for PATCH (Update)
const keyMap: Record<string, string> = {
  inci_name: 'inci_name',
  inciName: 'inci_name',
  common_name: 'common_name',
  commonName: 'common_name',
  category: 'category',
  function: 'function', // Using 'function' for Supabase mapping
  func: 'function',
  concentration: 'concentration',
  is_allergen: 'is_allergen',
  isAllergen: 'is_allergen',
  brand_id: 'brand_id',
  brandId: 'brand_id',
}

// Add ingredient(s)
export async function POST(req: NextRequest, { params }: { params: { expId: string } }) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  const experience_id = params.expId
  const session_brand_id = user?.brand_id
  const body: any = await req.json()

  // 1. Initial validation
  if (!session_brand_id) {
    console.error("No brand_id found in session");
    return NextResponse.json({ success: false, message: "Authentication failure: No brand_id found" }, { status: 403 })
  }
  if (!experience_id) {
    console.error("No experience_id provided in URL");
    return NextResponse.json({ success: false, message: "experience_id parameter required in URL" }, { status: 400 })
  }

  // 2. Determine payload: single item, array, or object with `ingredients`
  let items: any[] = []
  if (Array.isArray(body)) items = body
  else if (body && body.ingredients && Array.isArray(body.ingredients)) items = body.ingredients
  else if (body) items = [body]

  if (items.length === 0) {
    console.error("No ingredient data provided in request body");
    return NextResponse.json({ success: false, message: "No ingredient data provided" }, { status: 400 })
  }

  // Ensure all items have the required experience_id from the URL
  items = items.map((it) => ({
    ...it,
    experience_id: experience_id,
  }))

  // 3. Resolve Brand IDs using the original logic
  const expIds = Array.from(new Set(items.map((it) => it.experience_id))).filter(Boolean) as string[]
  const expMap: Record<string, { brand_id: string }> = {}

  if (expIds.length > 0) {
    const { data: expRows, error: expError } = await supabase
      .from("experiences")
      .select("id, brand_id")
      .in("id", expIds)

    if (expError) {
      console.error("Error fetching experience data:", expError);
      return NextResponse.json({ success: false, message: "Database error resolving experience data" }, { status: 500 })
    }

    if (expRows) {
      for (const r of expRows) {
        if (r.id) {
          expMap[r.id] = { brand_id: r.brand_id }
        }
      }
    }
  }

  // 4. Normalize and validate all items before bulk insert
  const ingredientsToInsert = []
  for (const item of items) {
    const normalized = normalizeIngredient(item, expMap)

    // Ensure the brand_id is set (prioritize resolved ID, fallback to session ID)
    normalized.brand_id = normalized.brand_id || session_brand_id

    ingredientsToInsert.push(normalized)
  }


  // 5. Insert ingredients
  // NOTE: We only select the fields present in the 'ingredientsToInsert' array
  const { data, error } = await supabase.from("ingredients").insert(ingredientsToInsert).select()

  if (error) {
    console.error("Error inserting ingredients:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

// Get all ingredients for an experience
export async function GET(req: NextRequest, { params }: { params: { expId: string } }) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  const experience_id = params.expId
  const brand_id = user?.brand_id

  if (!experience_id) {
    return NextResponse.json({ success: false, message: "experience_id parameter required" }, { status: 400 })
  }
  if (!brand_id) {
    return NextResponse.json({ success: false, message: "No brand_id found" }, { status: 403 })
  }

  // The original SQL SELECT * FROM ingredients WHERE experience_id = $1 ORDER BY created_at ASC
  // is correctly translated here, with the added security of filtering by brand_id
  const { data, error } = await supabase
    .from("ingredients")
    .select("*")
    .eq("experience_id", experience_id)
    .eq("brand_id", brand_id)
    .order("created_at", { ascending: true })

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

// Update ingredient
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  const brand_id = user?.brand_id
  const body: any = await req.json()
  const { id } = body // Get ID from the body (as the original controller used req.params, but this is simpler for Supabase)
  const fields = body // Fields remain in body

  if (!id) {
    return NextResponse.json({ success: false, message: "Ingredient id required in the request body" }, { status: 400 })
  }
  if (!brand_id) {
    return NextResponse.json({ success: false, message: "No brand_id found" }, { status: 403 })
  }

  const updates: Record<string, any> = {}
  let hasUpdates = false

  for (const [k, v] of Object.entries(fields)) {
    const col = keyMap[k]
    if (!col || k === 'id') continue // Skip non-mapped or 'id' field

    let val = v
    // Re-implement the boolean casting for is_allergen
    if (k === 'is_allergen' || k === 'isAllergen') {
      val = v === true || v === 'true' || v === 1
    }

    updates[col] = val
    hasUpdates = true
  }

  if (!hasUpdates) {
    return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 })
  }

  // Perform the update
  const { data, error } = await supabase
    .from("ingredients")
    .update(updates)
    .eq("id", id)
    // IMPORTANT: Only allow updates for ingredients belonging to the user's brand
    .eq("brand_id", brand_id)
    .select()
    .single()

  if (error) {
    console.error("Error updating ingredient:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

// Delete ingredient
export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  const brand_id = user?.brand_id
  const body: any = await req.json()
  const { id } = body

  if (!id) {
    return NextResponse.json({ success: false, message: "Ingredient id required in the request body" }, { status: 400 })
  }
  if (!brand_id) {
    return NextResponse.json({ success: false, message: "No brand_id found" }, { status: 403 })
  }

  // The DELETE logic is secure and correct
  const { error } = await supabase.from("ingredients").delete().eq("id", id).eq("brand_id", brand_id)

  if (error) {
    console.error("Error deleting ingredient:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: "Deleted" })
}
