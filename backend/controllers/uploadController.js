import path from 'path';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import fs from 'fs';

// Configure Cloudinary from env
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// @desc    Upload image
// @route   POST /api/upload/image
// @access  Private (Admin)
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload buffer to Cloudinary using upload_stream with WebP conversion
    const uploadStream = () => new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { 
          folder: 'autoria/cars',
          format: 'webp', // Force format to WebP for high performance
          transformation: [
            { width: 1920, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'webp' }
          ]
        }, 
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    let result = null;
    const hasCloudinary = Boolean(
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET
    );

    if (hasCloudinary) {
      try {
        result = await uploadStream();
      } catch (cloudErr) {
        console.warn('Cloudinary upload warning, using local fallback:', cloudErr.message);
      }
    }

    if (result) {
      return res.status(200).json({
        success: true,
        data: {
          url: result.secure_url,
          filename: result.public_id,
          originalName: req.file.originalname,
          size: result.bytes || req.file.size,
          mimetype: 'image/webp',
          format: 'webp',
          provider: 'cloudinary'
        }
      });
    }

    // Local file fallback if Cloudinary is unavailable
    const uploadsDir = path.join(process.cwd(), 'uploads', 'cars');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueId = `car-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueId}.webp`;
    const localFilePath = path.join(uploadsDir, filename);

    fs.writeFileSync(localFilePath, req.file.buffer);

    res.status(200).json({
      success: true,
      data: {
        url: `/uploads/cars/${filename}`,
        filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: 'image/webp',
        format: 'webp',
        provider: 'local'
      }
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading image'
    });
  }
};

// @desc    Delete image
// @route   DELETE /api/upload/image/:filename
// @access  Private (Admin)
export const deleteImage = async (req, res, next) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ success: false, message: 'Filename/public_id required' });
    }

    // If a local file exists with that name, delete it (backwards compatibility)
    const filePath = path.join('uploads', 'cars', filename);
    if (fs.existsSync(filePath)) {
      // Security check - prevent path traversal
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return res.status(400).json({ success: false, message: 'Invalid filename' });
      }
      fs.unlinkSync(filePath);
      return res.status(200).json({ success: true, message: 'Local image deleted successfully' });
    }

    // Otherwise assume filename is a Cloudinary public_id and attempt to destroy
    const result = await cloudinary.v2.uploader.destroy(filename);
    if (result.result === 'not found') {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.status(200).json({ success: true, message: 'Cloudinary image deleted', result });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting image' });
  }
};