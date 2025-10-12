import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/getCurrentUser"
import { createClient } from "@/lib/supabase/server"

// --- Helper function for Authorization Check ---
async function authorizeFeatureAccess(supabase: any, feature_id: string, brand_id: string | undefined): Promise<boolean> {
  if (!brand_id) return false

  const { data: featCheck } = await supabase
    .from('experience_features')
    .select('brand_id')
    .eq('id', feature_id)
    .single()
  
  // Check if feature exists and belongs to the user's brand
  return featCheck && featCheck.brand_id === brand_id
}

// --- PATCH /api/experiences/[id]/features/[id] (Update feature) ---
// Mapped from: static async updateFeature(req, res)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const user = await getCurrentUser()
  const feature_id = id
  const brand_id = user?.brand_id
  const body = await req.json() as any

  if (!feature_id) {
    return NextResponse.json({ success: false, message: 'Feature id is required in URL params' }, { status: 400 })
  }
  if (!brand_id) {
    return NextResponse.json({ success: false, message: 'brand_id is required' }, { status: 403 })
  }

  try {
    // Authorization Check: Does this brand own this feature?
    if (!(await authorizeFeatureAccess(supabase, feature_id, brand_id))) {
      return NextResponse.json({ success: false, message: 'Forbidden: You do not have access to this feature.' }, { status: 403 })
    }

    // Fields allowed for update
    const updates: Record<string, any> = {}
    if (body.feature_name !== undefined) updates.feature_name = body.feature_name
    if (body.is_enabled !== undefined) updates.is_enabled = !!body.is_enabled
    if (body.status !== undefined) updates.status = body.status
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 })
    }
    
    // Perform update
    const { data: updatedFeature, error: updateError } = await supabase
      .from('experience_features')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', feature_id)
      .eq('brand_id', brand_id) // Security check
      .select()
      .single()
      
    if (updateError) throw updateError

    return NextResponse.json({ success: true, data: updatedFeature })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// --- DELETE /api/experiences/[id]/features/[id] (Delete feature) ---
// Mapped from: static async deleteFeature(req, res)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const user = await getCurrentUser()
  const feature_id = id
  const brand_id = user?.brand_id

  if (!feature_id) {
    return NextResponse.json({ success: false, message: 'Feature id is required in URL params' }, { status: 400 })
  }
  if (!brand_id) {
    return NextResponse.json({ success: false, message: 'brand_id is required' }, { status: 403 })
  }

  try {
    // Authorization Check: Does this brand own this feature?
    if (!(await authorizeFeatureAccess(supabase, feature_id, brand_id))) {
      return NextResponse.json({ success: false, message: 'Forbidden: You do not have access to this feature.' }, { status: 403 })
    }

    // Perform deletion
    const { error: deleteError } = await supabase
      .from('experience_features')
      .delete()
      .eq('id', feature_id)
      .eq('brand_id', brand_id) // Security check

    if (deleteError) throw deleteError
    
    return NextResponse.json({ success: true, message: 'Deleted' })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// --- GET /api/experiences/[id]/features/[id] (Get a single feature by id) ---
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const user = await getCurrentUser()
  const feature_id = id
  const brand_id = user?.brand_id
  
  if (!feature_id) return NextResponse.json({ success: false, message: 'id is required' }, { status: 400 })

  try {
    const { data: feature, error } = await supabase
      .from("experience_features")
      .select("*")
      .eq("id", feature_id)
      .eq("brand_id", brand_id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ success: false, message: 'Feature not found' }, { status: 404 })
      }
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: feature })

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
