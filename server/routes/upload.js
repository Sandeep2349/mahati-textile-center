import express from 'express';
import multer from 'multer';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Memory storage keeps file buffer in RAM without writing to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter,
});

/**
 * @route   GET /api/upload/status
 * @desc    Check if Cloudinary is configured
 * @access  Public / Admin
 */
router.get('/status', (req, res) => {
  const configured = isCloudinaryConfigured();
  res.json({
    success: true,
    configured,
    cloudName: configured ? process.env.CLOUDINARY_CLOUD_NAME : null,
    message: configured
      ? 'Cloudinary is configured and ready'
      : 'Cloudinary credentials missing in server/.env (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)',
  });
});

/**
 * @route   POST /api/upload
 * @desc    Upload an image directly to Cloudinary
 * @access  Private/Admin
 */
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided in request',
      });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        success: false,
        configured: false,
        message:
          'Cloudinary is not configured yet. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your server/.env file.',
      });
    }

    // Upload to Cloudinary using upload_stream
    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'mahati_textiles/products',
            resource_type: 'image',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' }, // Cloudinary auto-optimization & WebP conversion
            ],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadStream();

    return res.status(200).json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully',
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image to Cloudinary',
    });
  }
});

export default router;
