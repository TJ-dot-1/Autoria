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

    // Upload buffer to Cloudinary using upload_stream
    const uploadStream = () => new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream({ folder: 'autoria/cars' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const result = await uploadStream();

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        filename: result.public_id, // return public_id so client can delete if needed
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        provider: 'cloudinary'
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