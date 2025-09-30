import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { setThemeAndColor } from '@/lib/db/experiences';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { expId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { theme, primary_color } = body;

    if (!theme && !primary_color) {
      return NextResponse.json({ error: 'theme or primary_color is required' }, { status: 400 });
    }

    const experience = await setThemeAndColor(params.expId, theme, primary_color);
    return NextResponse.json({ success: true, data: experience });

  } catch (error) {
    console.error('Set theme error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update theme' },
      { status: 500 }
    );
  }
}