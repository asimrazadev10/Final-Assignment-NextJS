import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @returns {Promise<Object>} Upload result with secure_url
 */
export const uploadToCloudinary = async (file, folder = 'invoices') => {
  try {
    // If file is a buffer, convert to base64
    let uploadData;
    
    if (Buffer.isBuffer(file)) {
      // Convert buffer to base64
      const base64String = file.toString('base64');
      uploadData = `data:image/jpeg;base64,${base64String}`;
    } else if (typeof file === 'string') {
      // Assume it's already base64 or data URL
      uploadData = file;
    } else {
      throw new Error('Invalid file format');
    }

    const result = await cloudinary.uploader.upload(uploadData, {
      folder: folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

export default cloudinary;

