import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      //console.error('Error fetching profile:', profileError);
      return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }

    // Combine with auth user data
    const userData = {
      ...profile,
      email: user.email,
    };

    return NextResponse.json({ success: true, data: userData });
  } catch (error) {
    //console.error('Error in GET /api/profile/user:', error);
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
      first_name,
      last_name,
      avatar_url,
    } = body;

    // Validate required fields
    if (!first_name || !last_name) {
      return NextResponse.json({ 
        error: 'First name and last name are required' 
      }, { status: 400 });
    }

    // Update profile data
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        avatar_url: avatar_url?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      //console.error('Error updating profile:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedProfile,
      message: 'User profile updated successfully' 
    });
  } catch (error) {
    //console.error('Error in PUT /api/profile/user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
