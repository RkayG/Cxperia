import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { createClient } from "@/lib/supabase/server"
import { sanitizePublicData } from "@/utils/sanitizePublicData"

// --- Helper for Update Normalization ---
/**
 * Normalizes and prepares fields for UPDATE based on the request body.
 */
function prepareUpdateFields(body: any) {
    const updates: Record<string, any> = {}

    // Fields that need direct mapping or type conversion
    const fieldMappers: Array<{ key: keyof typeof body, dbKey: string, type?: 'array' | 'json' | 'bool' }> = [
        { key: 'title', dbKey: 'title' },
        { key: 'video_url', dbKey: 'video_url' },
        { key: 'videoUrl', dbKey: 'video_url' },
        { key: 'description', dbKey: 'description' },
        { key: 'thumbnail_url', dbKey: 'thumbnail_url' },
        { key: 'thumbnailUrl', dbKey: 'thumbnail_url' },
        { key: 'featured_image', dbKey: 'featured_image' },
        { key: 'featuredImage', dbKey: 'featured_image' },
        { key: 'featured_video_url', dbKey: 'featured_video_url' },
        { key: 'skin_types', dbKey: 'skin_types', type: 'array' },
        { key: 'skinTypes', dbKey: 'skin_types', type: 'array' },
        { key: 'occasions', dbKey: 'occasions', type: 'array' },
        { key: 'occasion', dbKey: 'occasions', type: 'array' },
        { key: 'tags', dbKey: 'tags', type: 'array' },
        { key: 'category', dbKey: 'category' },
        { key: 'difficulty', dbKey: 'difficulty' },
        { key: 'total_duration', dbKey: 'total_duration' },
        { key: 'totalDuration', dbKey: 'total_duration' },
        { key: 'is_published', dbKey: 'is_published', type: 'bool' },
        { key: 'steps', dbKey: 'steps', type: 'json' },
    ]

    let hasUpdates = false

    for (const { key, dbKey, type } of fieldMappers) {
        if (body[key] !== undefined) {
            let value = body[key]
            if (type === 'json' && typeof value !== 'string' && value !== null) {
                value = JSON.stringify(value)
            } else if (type === 'array' && !Array.isArray(value) && value !== null) {
                // Ignore if array is expected but not provided
                continue
            } else if (type === 'bool') {
                value = !!value // Ensure boolean type
            }
            updates[dbKey] = value
            hasUpdates = true
        }
    }

    return { updates, hasUpdates }
}

// --- GET /api/tutorials/[id] (Get a single tutorial by id) ---
// Mapped from: static async getTutorialById(req, res)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params // The tutorial ID

  if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 })

  try {
    const { data, error } = await supabase
      .from("tutorials")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ success: false, message: 'Tutorial not found' }, { status: 404 })
      }
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    if (!data) return NextResponse.json({ success: false, message: 'Tutorial not found' }, { status: 404 })

    // Sanitize tutorial to remove sensitive data
    const sanitizedTutorial = sanitizePublicData(data);

    return NextResponse.json({ success: true, data: sanitizedTutorial })

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// --- PATCH /api/tutorials/[id] (Update tutorial) ---
// Mapped from: static async updateTutorial(req, res)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  const brand_id = user?.brand_id
  const { id } = await params
  const body = await req.json()

  if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 })
  if (!brand_id) return NextResponse.json({ success: false, message: 'brand_id is required' }, { status: 403 })

  try {
    const { updates, hasUpdates } = prepareUpdateFields(body)

    if (!hasUpdates) return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 })

    const { data: tutorial, error } = await supabase
      .from("tutorials")
      .update(updates)
      .eq("id", id)
      // Security: ensure the user is updating a tutorial belonging to their brand
      .eq("brand_id", brand_id) 
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    if (!tutorial) {
      // This happens if the ID exists but does not belong to the user's brand
      return NextResponse.json({ success: false, message: 'Tutorial not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: tutorial })

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// --- DELETE /api/tutorials/[id] (Delete tutorial) ---
// Mapped from: static async deleteTutorial(req, res)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  const brand_id = user?.brand_id
  const { id } = await  params


  if (!id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 })
  if (!brand_id) return NextResponse.json({ success: false, message: 'brand_id is required' }, { status: 403 })

  try {
    // 1. Fetch to ensure brand ownership before deletion (optional, RLS should handle this, but good practice)
    const { data: lookup, error: lookupError } = await supabase
      .from("tutorials")
      .select("brand_id")
      .eq("id", id)
      .single()


    if (lookupError || !lookup || lookup.brand_id !== brand_id) {
        return NextResponse.json({ success: false, message: 'Tutorial not found or unauthorized' }, { status: 404 })
    }

    // 2. Perform deletion (Supabase will automatically handle cascade delete for experience_tutorials if configured)
    const { error: deleteError } = await supabase
      .from("tutorials")
      .delete()
      .eq("id", id)
      .eq("brand_id", brand_id) // Security check


    if (deleteError) {
      return NextResponse.json({ success: false, message: deleteError.message }, { status: 500 })
    }

    
    // Note: Cache invalidation is removed here as per migration strategy.
    
    return NextResponse.json({ success: true, message: 'Deleted' })

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
