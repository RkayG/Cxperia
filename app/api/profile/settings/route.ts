import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user settings (stored in profiles table or separate settings table)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('settings')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching settings:', profileError);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    // Default settings if none exist
    const defaultSettings = {
      notifications: {
        email_notifications: true,
        push_notifications: true,
        marketing_emails: false,
        security_alerts: true,
      },
      privacy: {
        profile_visibility: 'private',
        data_sharing: false,
        analytics_tracking: true,
      },
      preferences: {
        language: 'en',
        timezone: 'UTC',
        date_format: 'MM/DD/YYYY',
        theme: 'system',
      },
    };

    const settings = profile?.settings || defaultSettings;

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error in GET /api/profile/settings:', error);
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
    const { notifications, privacy, preferences } = body;

    // Validate settings structure
    if (!notifications || !privacy || !preferences) {
      return NextResponse.json({ 
        error: 'Invalid settings structure' 
      }, { status: 400 });
    }

    // Update settings in profiles table
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        settings: {
          notifications,
          privacy,
          preferences,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating settings:', updateError);
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedProfile.settings,
      message: 'Settings updated successfully' 
    });
  } catch (error) {
    console.error('Error in PUT /api/profile/settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
