import { uploadToCloudinary } from '../utils/cloudinary.js';
import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image files and PDFs are allowed'), false);
    }
  },
});

export const uploadMiddleware = upload.single('image');

export const uploadInvoiceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'invoices');

    return res.json({
      status: 200,
      message: 'Image uploaded successfully',
      data: {
        fileUrl: result.url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};

