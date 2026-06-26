import { NextRequest, NextResponse } from 'next/server';
import { getAdminUserFromRequest } from '@/lib/jwt';
import { uploadFile } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    // Authenticate Admin
    const admin = getAdminUserFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
    const mimeType = file.type;
    
    // Check if the file is a video or image
    const resourceType = mimeType.startsWith('video/') ? 'video' : 'image';

    // Upload using dual-storage utility
    const fileUrl = await uploadFile(buffer, filename, resourceType);

    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error: any) {
    console.error('File upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
