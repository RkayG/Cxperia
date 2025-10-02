// app/api/public/experience/[slug]/purge/[placeholder]/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!user.brand_id) {
      return NextResponse.json({ success: false, message: 'No brand associated with user' }, { status: 400 });
    }

    // Invalidate the tutorials cache path
    revalidatePath(`/api/public/experience/${slug}/tutorials`);

  

    console.log(`Cache invalidated for tutorials: ${slug}`);

    return NextResponse.json({
      success: true,
      message: `Cache invalidated for tutorials: ${slug}`
    });
  } catch (error: any) {
    console.error('Error invalidating cache:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

 