import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { createPlatformFeedback, getAllPlatformFeedback } from '@/lib/db/platform-feedback';

// POST /api/platform-feedback - Create new platform feedback
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, subject, message, priority = 'medium' } = body;

    // Validate required fields
    if (!type || !subject || !message) {
      return NextResponse.json({ 
        error: 'Missing required fields: type, subject, and message are required' 
      }, { status: 400 });
    }

    // Validate type
    const validTypes = ['bug_report', 'feature_request', 'general_feedback', 'support'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid type. Must be one of: bug_report, feature_request, general_feedback, support' 
      }, { status: 400 });
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json({ 
        error: 'Invalid priority. Must be one of: low, medium, high, urgent' 
      }, { status: 400 });
    }

    // Create feedback
    const feedback = await createPlatformFeedback({
      user_id: user.id,
      brand_id: user.brand_id,
      type,
      subject: subject.trim(),
      message: message.trim(),
      priority,
      status: 'open',
      user_email: user.email,
      user_name: user.email?.split('@')[0] || 'User', // Use email prefix as name fallback
    });

    return NextResponse.json({ 
      success: true, 
      data: feedback,
      message: 'Feedback submitted successfully' 
    });

  } catch (error) {
    //console.error('Platform feedback creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create feedback' },
      { status: 500 }
    );
  }
}

// GET /api/platform-feedback - Get platform feedback (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you can implement your own admin check)
    const isAdmin = user.email?.includes('admin') || user.email?.includes('@cxperia.com');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const feedback = await getAllPlatformFeedback(limit, offset);

    return NextResponse.json({ 
      success: true, 
      data: feedback 
    });

  } catch (error) {
    //console.error('Platform feedback fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
