// app/api/create-admin/route.ts

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY env variable');
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'team@cxperia.com',
      password: 'Password@123',
      email_confirm: true,
      user_metadata: {
        first_name: 'Team',
        last_name: 'Cxperia',
        role: 'super_admin'
      }
    });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created! Try logging in now.',
      user: user.user 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}