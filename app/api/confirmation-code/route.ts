import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json() as { email: string; code: string };

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and confirmation code are required' },
        { status: 400 }
      );
    }

    // Verify the confirmation code
    const { data: confirmation, error: verifyError } = await supabase
      .from('email_confirmations')
      .select('*')
      .eq('email', email)
      .eq('confirmation_code', code)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (verifyError || !confirmation) {
      return NextResponse.json(
        { error: 'Invalid or expired confirmation code' },
        { status: 400 }
      );
    }

    // Mark email as confirmed
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      confirmation.user_id,
      { email_confirm: true }
    );

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to confirm email' },
        { status: 500 }
      );
    }

    // Delete the confirmation code
    await supabase
      .from('email_confirmations')
      .delete()
      .eq('id', confirmation.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}