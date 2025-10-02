import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/public/tutorials/[id]/view - Increment view count for a tutorial
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: tutorialId } = params;

    if (!tutorialId) {
      return NextResponse.json({ error: 'Tutorial ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Increment the view count for the tutorial
    const { data: tutorial, error } = await supabase
      .from('tutorials')
      .update({ 
        views: supabase.raw('views + 1'),
        updated_at: new Date().toISOString()
      })
      .eq('id', tutorialId)
      .eq('is_published', true) // Only count views for published tutorials
      .select('id, views, title')
      .single();

    if (error) {
      console.error('Error incrementing view count:', error);
      
      // Check if tutorial exists but is not published
      const { data: existingTutorial } = await supabase
        .from('tutorials')
        .select('id, is_published')
        .eq('id', tutorialId)
        .single();

      if (existingTutorial && !existingTutorial.is_published) {
        return NextResponse.json({ 
          error: 'Tutorial is not published',
          details: 'Views can only be counted for published tutorials'
        }, { status: 403 });
      }

      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 });
      }

      return NextResponse.json({ 
        error: 'Failed to increment view count',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        tutorial_id: tutorial.id,
        views: tutorial.views,
        title: tutorial.title
      },
      message: 'View count incremented successfully'
    });

  } catch (error) {
    console.error('View count increment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to increment view count' },
      { status: 500 }
    );
  }
}

// GET /api/public/tutorials/[id]/view - Get current view count (optional)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: tutorialId } = params;

    if (!tutorialId) {
      return NextResponse.json({ error: 'Tutorial ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current view count
    const { data: tutorial, error } = await supabase
      .from('tutorials')
      .select('id, views, title')
      .eq('id', tutorialId)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to get view count' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        tutorial_id: tutorial.id,
        views: tutorial.views,
        title: tutorial.title
      }
    });

  } catch (error) {
    console.error('Get view count error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get view count' },
      { status: 500 }
    );
  }
}
