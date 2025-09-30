import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"

const ALLOWED_FEATURES = [
  'tutorialsRoutines',
  'ingredientList',
  'skinRecommendations',
  'loyaltyPoints',
  'chatbot',
  'feedbackForm',
  'customerService',
  'productUsage'
]

// --- Helper function for Authorization Check ---
async function authorizeExperienceAccess(supabase: any, experience_id: string, brand_id: string | undefined): Promise<boolean> {
  if (!brand_id) return false
  
  const { data: expCheck } = await supabase
    .from('experiences')
    .select('brand_id')
    .eq('id', experience_id)
    .single()
  
  // Check if experience exists and belongs to the user's brand
  return expCheck && expCheck.brand_id === brand_id
}

// --- GET /api/experiences/[id]/features (Get all enabled features for an experience) ---
// Mapped from: static async getFeaturesByExperience(req, res)
export async function GET(req: NextRequest, { params }: { params: { expId: string } }) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  const experience_id = params.expId
  const brand_id = user?.brand_id

  if (!experience_id) {
    return NextResponse.json({ success: false, message: 'experience_id is required in URL params' }, { status: 400 })
  }
  
  try {
    // Authorization Check: Does this brand own this experience?
    if (!(await authorizeExperienceAccess(supabase, experience_id, brand_id))) {
      return NextResponse.json({ success: false, message: 'Forbidden: You do not have access to this experience.' }, { status: 403 })
    }

    // Fetch enabled features
    const { data: features, error } = await supabase
      .from('experience_features')
      .select('*')
      .eq('experience_id', experience_id)
      .eq('is_enabled', true)
      .eq('brand_id', brand_id) // Extra RLS/Security check

    if (error) {
      console.error("Error fetching experience features:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data: features })

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// --- POST /api/experiences/[id]/features (Add or Update feature) ---
// Mapped from: static async addFeature(req, res) - Implements upsert logic
export async function POST(req: NextRequest, { params }: { params: { expId: string } }) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  const experience_id = params.expId
  const brand_id = user?.brand_id
  const { feature_name, is_enabled } = await req.json()

  if (!experience_id) {
    return NextResponse.json({ success: false, message: 'experience_id is required in URL params' }, { status: 400 })
  }
  if (!brand_id) {
    return NextResponse.json({ success: false, message: 'brand_id is required' }, { status: 400 })
  }

  try {
    // Authorization Check: Does this brand own this experience?
    if (!(await authorizeExperienceAccess(supabase, experience_id, brand_id))) {
      return NextResponse.json({ success: false, message: 'Forbidden: You do not have access to this experience.' }, { status: 403 })
    }

    if (!ALLOWED_FEATURES.includes(feature_name)) {
      return NextResponse.json({ success: false, message: 'Invalid feature_name. Not in allowed features.' }, { status: 400 })
    }

    // Check if feature already exists (custom upsert logic from original controller)
    const { data: existing, error: selectError } = await supabase
      .from('experience_features')
      .select('*')
      .match({ experience_id, feature_name, brand_id })
      .maybeSingle()

    if (selectError) throw selectError
    
    if (existing) {
      // Feature exists, update is_enabled only
      const { data: updatedFeature, error: updateError } = await supabase
        .from('experience_features')
        .update({ is_enabled: !!is_enabled, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      return NextResponse.json({ success: true, data: updatedFeature, message: 'Feature updated (no duplicate created)' })
    } else {
      // Feature does not exist, create new
      const { data: newFeature, error: insertError } = await supabase
        .from('experience_features')
        .insert({ 
          experience_id, 
          feature_name, 
          is_enabled: !!is_enabled, 
          status: 'draft', 
          brand_id 
        })
        .select()
        .single()
      
      if (insertError) throw insertError
      
      return NextResponse.json({ success: true, data: newFeature, message: 'Feature created' })
    }

  } catch (error: any) {
    console.error("Error processing feature:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
