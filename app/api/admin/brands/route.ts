// app/api/admin/brands/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as {
      name: string;
      contact_email: string;
      first_name: string;
      last_name: string;
      contact_phone: string;
      plan_tier: string;
      monthly_volume: string;
      contract_value: string;
      sales_rep?: string;
      notes?: string;
    };

    // 1. Check for existing brand with same email or name BEFORE creating anything
    const { data: existingBrands, error: checkError } = await supabaseAdmin
      .from('brands')
      .select('id, name, contact_email')
      .or(`contact_email.eq.${data.contact_email},name.eq.${data.name}`);

    if (checkError) throw checkError;

    if (existingBrands && existingBrands.length > 0) {
      const existingBrand = existingBrands[0];
      if (existingBrand.contact_email === data.contact_email) {
        return NextResponse.json({ 
          error: 'A brand with this contact email already exists.' 
        }, { status: 409 });
      } else if (existingBrand.name === data.name) {
        return NextResponse.json({ 
          error: 'A brand with this brand name already exists.' 
        }, { status: 409 });
      }
    }

    // 2. Check for existing user with same email BEFORE creating anything
    // Try to create user first - if it fails with email exists error, we know it's a duplicate
    
    // We'll skip the user check for now and let the createUser call handle it
    // This is more reliable than trying to query for existing users

    // 3. Create brand record (only after all checks pass)
    const { data: brand, error: brandError } = await supabaseAdmin
      .from('brands')
      .insert({
        name: data.name,
        brand_slug: generateSlug(data.name),
        plan_tier: data.plan_tier,
        status: 'pending_activation', // New status
        contact_email: data.contact_email,
        contact_name: `${data.first_name} ${data.last_name}`,
        contact_phone: data.contact_phone,
        monthly_volume: data.monthly_volume,
        contract_value: data.contract_value,
        sales_notes: data.notes
      })
      .select()
      .single();

    if (brandError) throw brandError;

    // 4. Create user WITHOUT password - they'll set it during activation
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: data.contact_email,
      // NO PASSWORD HERE - let user set it during activation
      email_confirm: false, // Don't confirm yet - wait for activation
      user_metadata: {
        first_name: data.first_name,
        last_name: data.last_name,
        role: 'brand_admin',
        brand_id: brand.id
      }
    });

    if (userError) {
      // If user creation fails, clean up the brand record to avoid orphaned data
      await supabaseAdmin
        .from('brands')
        .delete()
        .eq('id', brand.id);
      
      throw userError;
    }

    // 5. Create profile record
    if (userData.user) {
      await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userData.user.id,
          brand_id: brand.id,
          role: 'brand_admin',
          first_name: data.first_name,
          last_name: data.last_name,
          status: 'pending_activation' // Matches brand status
        });
    }

    // 6. Generate activation link (NOT temporary password)

    // Supabase requires a password for signup link, but user will set it on first login. Use a random strong temp password.
    const tempPassword = `Welcome${Math.random().toString(36).slice(2, 8)}!${Math.floor(Math.random()*100)}`;
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: data.contact_email,
      password: tempPassword,
      options: {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          role: 'brand_admin',
          brand_id: brand.id
        },
        redirectTo: `${process.env.NEXT_PLATFORM_URL}/dashboard`
      }
    });

    if (inviteError) throw inviteError;

    // 7. Send activation email via the send-brand-invitation API endpoint
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://app.cxperia.fr'}/api/admin/send-brand-invitation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: data.contact_email,
        brandName: data.name,
        contactName: `${data.first_name} ${data.last_name}`,
        activationLink: inviteData?.properties?.action_link,
        salesRep: data.sales_rep || 'Cxperia Team'
      })
    });

    return NextResponse.json({ 
      success: true, 
      brandId: brand.id,
      message: 'Brand created. Activation email sent.' 
    });

  } catch (error: any) {
    
    
    
    // Handle specific Supabase Auth errors
    if (error.name === 'AuthApiError') {
      if (error.message?.includes('email address has already been registered') || 
          error.message?.includes('User already registered')) {
        return NextResponse.json({ 
          error: 'A user with this email address already exists. Please use a different email.' 
        }, { status: 409 });
      } else if (error.message?.includes('Invalid email')) {
        return NextResponse.json({ 
          error: 'Please enter a valid email address.' 
        }, { status: 400 });
      }
    }
    
    // Handle database constraint errors
    if (error.code === '23505') {
      if (error.message?.includes('brands_email_unique')) {
        return NextResponse.json({ 
          error: 'A brand with this contact email already exists.' 
        }, { status: 409 });
      } else if (error.message?.includes('brands_brand_slug_key')) {
        return NextResponse.json({ 
          error: 'A brand with this brand name already exists.' 
        }, { status: 409 });
      }
    }
    
    // Generic error response
    return NextResponse.json({ 
      error: error.message || 'Failed to create brand. Please try again.' 
    }, { status: 500 });
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
