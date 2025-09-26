// app/api/admin/brands/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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

    // 1. Create brand record
    const { data: brand, error: brandError } = await supabaseAdmin
      .from('brands')
      .insert({
        name: data.name,
        brand_slug: generateSlug(data.name),
        plan_tier: data.plan_tier,
        status: 'pending_setup',
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

    // 2. Create user account for the brand contact, or fetch if exists
    let userId = null;
    let userCreated = false;
    let userData = null;
    let userError = null;
    try {
      const result = await supabaseAdmin.auth.admin.createUser({
        email: data.contact_email,
        password: generateTemporaryPassword(),
        email_confirm: true,
        user_metadata: {
          first_name: data.first_name,
          last_name: data.last_name,
          role: 'brand_admin',
          brand_id: brand.id
        }
      });
      userData = result.data;
      userError = result.error;
      if (userData && userData.user) {
        userId = userData.user.id;
        userCreated = true;
      }
    } catch (err: any) {
      userError = err;
    }

    // If user already exists, abort to prevent accidental overwrite
    if (userError && userError.code === 'email_exists') {
      return NextResponse.json({ error: 'A user with this email address has already been registered.' }, { status: 409 });
    } else if (userError) {
      throw userError;
    }

    // 3. Create profile record only if user was just created
    if (userId && userCreated) {
      await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          brand_id: brand.id,
          role: 'brand_admin',
          first_name: data.first_name,
          last_name: data.last_name,
          status: 'active'
        });
    }

    // 4. Send CUSTOM invitation email via API route
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/send-brand-invitation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: data.contact_email,
        brandName: data.name,
        contactName: `${data.first_name} ${data.last_name}`,
        brandId: brand.id,
        loginEmail: data.contact_email,
        salesRep: data.sales_rep || 'Cxperia Team'
      })
    });

    return NextResponse.json({ 
      success: true, 
      brandId: brand.id,
      message: 'Brand onboarded successfully. Invitation email sent.' 
    });

  } catch (error: any) {
    console.error('Brand onboarding error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateTemporaryPassword(): string {
  return `Welcome${Math.random().toString(36).slice(2, 8)}!`;
}