import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { deleteFromCloudinary, uploadToCloudinary } from '@/lib/cloudinary';
import { createUploadRecord, deleteUploadRecord } from '@/lib/db/uploads';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'experience_uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!user.brand_id) {
      return NextResponse.json({ error: 'No brand ID provided' }, { status: 400 });
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(file, folder);
    
    // Save to database
    const uploadRecord = await createUploadRecord({
      brand_id: user.brand_id,
      user_id: user.id,
      url: cloudinaryResult.secure_url,
      public_id: cloudinaryResult.public_id,
      file_type: cloudinaryResult.resource_type,
      original_name: file.name,
      bytes: cloudinaryResult.bytes,
    });

    return NextResponse.json({
      success: true,
      data: {
        cloudinary: cloudinaryResult,
        upload_record: uploadRecord,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Upload failed' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing upload ID' }, { status: 400 });
    }

    await deleteUploadRecord(id, user);

    return NextResponse.json({ success: true, data: { deleted: id } });

  } catch (error) {
    return NextResponse.json(
      { error: 'Delete failed' }, 
      { status: 500 }
    );
  }
}

function validateFile(file: File): string | null {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
  const maxImageSize = 10 * 1024 * 1024; // 10MB
  const maxVideoSize = 100 * 1024 * 1024; // 100MB

  const isVideo = file.type.startsWith('video/');
  
  if (isVideo && file.size > maxVideoSize) {
    return 'Video too large';
  }
  
  if (!isVideo && !allowedImageTypes.includes(file.type)) {
    return 'Invalid file type';
  }
  
  if (!isVideo && file.size > maxImageSize) {
    return 'Image too large';
  }

  return null;
}