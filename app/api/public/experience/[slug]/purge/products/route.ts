import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    if (!user.brand_id) {
      return NextResponse.json({ success: false, message: 'No brand associated with user' }, { status: 400 });
    }

    // Invalidate the products cache path
    revalidatePath(`/api/public/experience/${slug}/products`);


    console.log(`Cache invalidated for products: ${slug}`);

    return NextResponse.json({
      success: true,
      message: `Cache invalidated for products: ${slug}`
    });
  } catch (error: any) {
    console.error('Error invalidating cache:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
