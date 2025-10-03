import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'avatar' or 'logo'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || !['avatar', 'logo'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be "avatar" or "logo"' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' 
      }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB' 
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, {
      folder: `profiles/${type}s`,
      public_id: `${user.id}_${type}_${Date.now()}`,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    if (!uploadResult.secure_url) {
      return NextResponse.json({ 
        error: 'Failed to upload image' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id 
      },
      message: `${type} uploaded successfully` 
    });
  } catch (error) {
    console.error('Error in POST /api/profile/upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
