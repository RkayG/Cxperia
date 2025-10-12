import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { getRecentExperiences } from '@/lib/db/experiences';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!user.brand_id) {
      return NextResponse.json({ error: 'No brand associated with user' }, { status: 400 });
    }

    const experiences = await getRecentExperiences(user.brand_id);
    return NextResponse.json({ success: true, data: experiences });

  } catch (error) {
    //console.error('Get recent experiences error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch recent experiences' },
      { status: 500 }
    );
  }
}