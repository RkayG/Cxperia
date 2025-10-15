import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, password, brandName } = await request.json();

    // Validate required fields
    if (!email || !password || !brandName) {
      return NextResponse.json(
        { error: 'Email, password, and brand name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Validate brand name
    if (brandName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Brand name must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Create user account using service role
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // Create brand using service role (bypasses RLS)
    const { data: brandData, error: brandError } = await supabaseAdmin
      .from('brands')
      .insert({
        name: brandName.trim(),
        slug: brandName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        brand_color: '#6366f1', // Default purple color
        logo_url: null,
      })
      .select('id')
      .single();

    if (brandError) {
      console.error('Brand creation error:', brandError);
      // Clean up the user if brand creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: 'Failed to create brand' },
        { status: 500 }
      );
    }

    // Create user profile using service role (bypasses RLS)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email,
        brand_id: brandData.id,
        role: 'brand_admin',
        first_name: brandName.trim(),
        last_name: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Clean up user and brand if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      await supabaseAdmin.from('brands').delete().eq('id', brandData.id);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // Generate session for immediate login
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (sessionError) {
      console.error('Session generation error:', sessionError);
      return NextResponse.json(
        { error: 'Account created but failed to generate login session' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        userId,
        brandId: brandData.id,
        email,
        brandName: brandName.trim(),
        loginUrl: sessionData.properties?.action_link,
      },
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
