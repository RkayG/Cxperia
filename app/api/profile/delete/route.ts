import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { password, confirmation } = body;

    // Validate required fields
    if (!password || !confirmation) {
      return NextResponse.json({ 
        error: 'Password and confirmation are required' 
      }, { status: 400 });
    }

    // Verify confirmation text
    if (confirmation !== 'DELETE') {
      return NextResponse.json({ 
        error: 'Invalid confirmation text' 
      }, { status: 400 });
    }

    // Verify password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: password,
    });

    if (signInError) {
      return NextResponse.json({ 
        error: 'Invalid password' 
      }, { status: 401 });
    }

    const userId = user.id;

    // Start a transaction to delete all user data
    try {
      // 1. Delete all experiences and related data
      const { error: experiencesError } = await supabase
        .from('experiences')
        .delete()
        .eq('brand_id', userId);

      if (experiencesError) {
        console.error('Error deleting experiences:', experiencesError);
        throw new Error('Failed to delete experiences');
      }

      // 2. Delete all products
      const { error: productsError } = await supabase
        .from('products')
        .delete()
        .eq('brand_id', userId);

      if (productsError) {
        console.error('Error deleting products:', productsError);
        throw new Error('Failed to delete products');
      }

      // 3. Delete all tutorials and content
      const { error: tutorialsError } = await supabase
        .from('tutorials')
        .delete()
        .eq('brand_id', userId);

      if (tutorialsError) {
        console.error('Error deleting tutorials:', tutorialsError);
        throw new Error('Failed to delete tutorials');
      }

      // 4. Delete all scan events
      const { error: scanEventsError } = await supabase
        .from('scan_events')
        .delete()
        .eq('brand_id', userId);

      if (scanEventsError) {
        console.error('Error deleting scan events:', scanEventsError);
        throw new Error('Failed to delete scan events');
      }

      // 5. Delete all feedback
      const { error: feedbackError } = await supabase
        .from('platform_feedback')
        .delete()
        .eq('brand_id', userId);

      if (feedbackError) {
        console.error('Error deleting feedback:', feedbackError);
        throw new Error('Failed to delete feedback');
      }

      // 6. Delete user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw new Error('Failed to delete profile');
      }

      // 7. Finally, delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        console.error('Error deleting auth user:', authError);
        throw new Error('Failed to delete user account');
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Account deleted successfully' 
      });

    } catch (transactionError) {
      console.error('Transaction error during account deletion:', transactionError);
      return NextResponse.json({ 
        error: 'Failed to delete account. Please try again or contact support.',
        details: process.env.NODE_ENV === 'development' ? transactionError.message : undefined
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in DELETE /api/profile/delete:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
