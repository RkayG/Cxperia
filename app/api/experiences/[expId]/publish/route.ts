import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { setPublishStatus } from '@/lib/db/experiences';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { is_published } = body;

    if (typeof is_published !== 'boolean') {
      return NextResponse.json({ error: 'is_published boolean is required' }, { status: 400 });
    }

    const experience = await setPublishStatus(params.id, is_published);
    return NextResponse.json({ success: true, data: experience });

  } catch (error) {
    console.error('Publish experience error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update publish status' },
      { status: 500 }
    );
  }
}