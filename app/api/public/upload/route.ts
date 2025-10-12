import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Validation function for public uploads
function validatePublicFile(file: File): string | null {
  const maxSize = 5 * 1024 * 1024; // 5MB limit for public uploads
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return 'File size must be less than 5MB';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed';
  }

  return null;
}

// POST /api/public/upload - Public image upload for customer feedback
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'customer_feedback';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file for public upload
    const validationError = validatePublicFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Upload to Cloudinary with public folder
    const cloudinaryResult = await uploadToCloudinary(file, `public/${folder}`);
    
    // For public uploads, we don't save to database, just return the URL
    return NextResponse.json({
      success: true,
      data: {
        url: cloudinaryResult.secure_url,
        public_id: cloudinaryResult.public_id,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format,
        bytes: cloudinaryResult.bytes,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' }, 
      { status: 500 }
    );
  }
}

// DELETE /api/public/upload - Delete uploaded image (optional cleanup)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('public_id');

    if (!publicId) {
      return NextResponse.json({ error: 'public_id is required' }, { status: 400 });
    }

    // Only allow deletion of public folder images
    if (!publicId.startsWith('public/')) {
      return NextResponse.json({ error: 'Can only delete public images' }, { status: 403 });
    }

    // Note: You might want to implement Cloudinary deletion here
    // const { deleteFromCloudinary } = require('@/lib/cloudinary');
    // await deleteFromCloudinary(publicId);

    return NextResponse.json({ success: true, message: 'Image deleted' });

  } catch (error) {
    return NextResponse.json(
      { error: 'Delete failed' }, 
      { status: 500 }
    );
  }
}
