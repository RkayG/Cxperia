import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { getOrSetExperienceUrl } from '@/lib/db/experiences';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ expId: string }> }
) {
  const { expId } = await params;
  console.log('Received GET request for experience URL with ID:', expId);
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const experienceUrl = await getOrSetExperienceUrl(expId);
    return NextResponse.json({ success: true, experience_url: experienceUrl });

  } catch (error) {
    console.error('Get experience URL error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get experience URL' },
      { status: 500 }
    );
  }
}