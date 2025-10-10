// app/auth/callback/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') || '/dashboard';

  if (token_hash && type === 'signup') {
    const { error } = await supabase.auth.verifyOtp({
      type: 'signup',
      token_hash,
    });

    if (!error) {
      // Email confirmed successfully
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Redirect to login page if there's an error
  return NextResponse.redirect(new URL('/auth/login', request.url));
}