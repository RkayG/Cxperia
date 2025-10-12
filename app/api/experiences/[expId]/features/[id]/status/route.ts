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
  
  return featCheck && featCheck.brand_id === brand_id
}

// --- PATCH /api/features/[id]/status (Set feature status) ---
// Mapped from: static async setFeatureStatus(req, res)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()
  const user = await getCurrentUser()
  const feature_id = id
  const brand_id = user?.brand_id
  const { status } = await req.json() as any  

  if (!feature_id) {
    return NextResponse.json({ success: false, message: 'Feature id is required in URL params' }, { status: 400 })
  }
  if (!brand_id) {
    return NextResponse.json({ success: false, message: 'brand_id is required' }, { status: 403 })
  }
  if (!['draft', 'published'].includes(status)) {
    return NextResponse.json({ success: false, message: 'Invalid status. Must be "draft" or "published".' }, { status: 400 })
  }

  try {
    // Authorization Check
    if (!(await authorizeFeatureAccess(supabase, feature_id, brand_id))) {
      return NextResponse.json({ success: false, message: 'Forbidden: You do not have access to this feature.' }, { status: 403 })
    }

    // Perform status update
    const { data: updatedFeature, error: updateError } = await supabase
      .from('experience_features')
      .update({ status: status, updated_at: new Date().toISOString() })
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
