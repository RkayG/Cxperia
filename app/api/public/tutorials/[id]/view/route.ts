import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST /api/public/tutorials/[id]/view - Increment view count for a tutorial
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) { 
  try {
    const { id: tutorialId } = await params;

    if (!tutorialId) {
      return NextResponse.json({ error: 'Tutorial ID is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // First, get the current tutorial to check if it exists and is published
    const { data: existingTutorial, error: fetchError } = await supabase
      .from('tutorials')
      .select('id, views, title, is_published')
      .eq('id', tutorialId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tutorial not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch tutorial' }, { status: 500 });
    }

    if (!existingTutorial.is_published) {
      return NextResponse.json({ 
        error: 'Tutorial is not published',
        details: 'Views can only be counted for published tutorials'
      }, { status: 403 });
    }

    // Increment the view count for the tutorial
    const { data: tutorial, error } = await supabase
      .from('tutorials')
      .update({ 
        views: (existingTutorial.views || 0) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', tutorialId)
      .eq('is_published', true) // Only count views for published tutorials
      .select('id, views, title')
      .single();

    if (error) {
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to increment view count' },
      { status: 500 }
    );
  }
}

// GET /api/public/tutorials/[id]/view - Get current view count (optional)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tutorialId } = await params;

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
        tutorial
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get view count' },
      { status: 500 }
    );
  }
}
  