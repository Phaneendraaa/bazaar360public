import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

/**
 * Uploads a file buffer either to Cloudinary or writes it locally to the public directory.
 * Returns the URL (absolute URL for Cloudinary, or root-relative URL for local fallback).
 */
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<string> {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'bazaar360',
          resource_type: resourceType,
          public_id: path.parse(filename).name,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Cloudinary upload returned no result'));
          }
        }
      );
      uploadStream.end(buffer);
    });
  } else {
    // Local fallback: Save to public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });
    
    // Unique filename to prevent overwriting
    const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadsDir, uniqueFilename);
    
    await fs.writeFile(filePath, buffer);
    return `/uploads/${uniqueFilename}`;
  }
}
