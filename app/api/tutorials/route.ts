import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"

// --- Helper for input normalization and mapping ---
interface TutorialBody {
  experience_id?: string
  title: string
  video_url?: string
  videoUrl?: string
  description?: string
  thumbnail_url?: string
  thumbnailUrl?: string
  featured_image?: string
  featuredImage?: string
  featured_video_url?: string
  skin_types?: string[]
  skinTypes?: string[]
  occasions?: string[]
  occasion?: string[]
  tags?: string[]
  category?: string
  difficulty?: string
  total_duration?: string
  totalDuration?: string
  is_published?: boolean
  steps?: any // Can be object or string, needs JSON.stringify
}

/**
 * Normalizes and maps request body fields to snake_case database columns.
 */
function normalizeTutorialFields(body: TutorialBody, brand_id: string) {
  let steps = body.steps
  if (steps && typeof steps !== 'string') {
    steps = JSON.stringify(steps)
  }

  const skin_types = Array.isArray(body.skin_types || body.skinTypes) ? (body.skin_types || body.skinTypes) : null
  const occasions = Array.isArray(body.occasions || body.occasion) ? (body.occasions || body.occasion) : null
  const tags = Array.isArray(body.tags) ? body.tags : null

  return {
    experience_id: body.experience_id || null,
    brand_id: brand_id,
    title: body.title,
    video_url: body.video_url || body.videoUrl || '',
    description: body.description,
    thumbnail_url: body.thumbnail_url || body.thumbnailUrl || '',
    featured_image: body.featured_image || body.featuredImage || '',
    featured_video_url: body.featured_video_url || body.video_url || body.videoUrl || '',
    skin_types: skin_types,
    occasions: occasions,
    tags: tags,
    category: body.category || 'Uncategorized',
    difficulty: body.difficulty,
    total_duration: body.total_duration || body.totalDuration || '',
    is_published: body.is_published === undefined ? true : body.is_published, // Default to true if undefined
    steps: steps,
  }
}

// --- POST /api/tutorials (Add tutorial) ---
// Mapped from: static async addTutorial(req, res)
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  const brand_id = user?.brand_id
  const body: TutorialBody = await req.json()

  if (!brand_id) {
    return NextResponse.json({ success: false, message: 'brand_id is required (from user context)' }, { status: 400 })
  }
  if (!body.title) {
    return NextResponse.json({ success: false, message: 'Title is required' }, { status: 400 })
  }

  try {
    const dataToInsert = normalizeTutorialFields(body, brand_id)

    const { data: tutorial, error } = await supabase
      .from("tutorials")
      .insert([dataToInsert])
      .select()
      .single()

    if (error) {
      console.error("Error inserting tutorial:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: tutorial })

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// --- GET /api/tutorials (Get all tutorials / Get recent tutorials) ---
// Mapped from: static async getTutorials(req, res) & static async getRecentTutorials(req, res)
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  const searchParams = req.nextUrl.searchParams
  const allowAll = searchParams.get('all') === 'true'
  const isRecent = searchParams.get('recent') === 'true'
  
  // Use brand_id from query if present, otherwise use session brand_id
  const queryBrandId = searchParams.get('brand_id') || user?.brand_id

  let query = supabase.from("tutorials").select("*")

  try {
    // 1. Check for Super Admin access (get all)
    if (allowAll && user?.role === 'super_admin') {
      // Allow all tutorials
    }
    // 2. Check for Recent Tutorials logic (last 30 days)
    else if (isRecent) {
      if (!queryBrandId) return NextResponse.json({ success: false, message: 'brand_id is required for recent tutorials' }, { status: 400 })
      
      // Calculate 30 days ago date (Supabase filter replacement for PostgreSQL INTERVAL)
      const date30DaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      
      query = query
        .eq("brand_id", queryBrandId)
        .gte("created_at", date30DaysAgo) // created_at >= (CURRENT_TIMESTAMP - INTERVAL '30 days')
    }
    // 3. Default: Get all tutorials for the current brand
    else {
      if (!queryBrandId) return NextResponse.json({ success: false, message: 'brand_id is required' }, { status: 400 })
      query = query.eq("brand_id", queryBrandId)
    }

    query = query.order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error("Error fetching tutorials:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}


/**
 * -- SINGLE TUTORIAL OPERATIONS --
 */

