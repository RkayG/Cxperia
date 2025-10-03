import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get brand data
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('*')
      .eq('id', user.brand_id)
      .single();

    if (brandError) {
      console.error('Error fetching brand:', brandError);
      return NextResponse.json({ error: 'Failed to fetch brand data' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    console.error('Error in GET /api/profile/brand:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      brand_slug,
      website_url,
      contact_info,
      country,
      city,
      zip_code,
      business_address,
      contact_email,
      contact_name,
      contact_phone,
      custom_domain,
      monthly_volume,
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ 
        error: 'Brand name is required' 
      }, { status: 400 });
    }

    // Update brand data
    const { data: updatedBrand, error: updateError } = await supabase
      .from('brands')
      .update({
        name: name.trim(),
        brand_slug: brand_slug?.trim() || null,
        website_url: website_url?.trim() || null,
        contact_info: contact_info?.trim() || null,
        country: country?.trim() || null,
        city: city?.trim() || null,
        zip_code: zip_code?.trim() || null,
        business_address: business_address?.trim() || null,
        contact_email: contact_email?.trim() || null,
        contact_name: contact_name?.trim() || null,
        contact_phone: contact_phone?.trim() || null,
        custom_domain: custom_domain?.trim() || null,
        monthly_volume: monthly_volume?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.brand_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating brand:', updateError);
      return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedBrand,
      message: 'Brand profile updated successfully' 
    });
  } catch (error) {
    console.error('Error in PUT /api/profile/brand:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
