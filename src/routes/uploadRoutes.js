const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, authorize } = require('../middlewares/auth');

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}
// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {

  // Security:
  // Sanitize filename before saving

  const safeName = file.originalname
    .replace(/[^a-zA-Z0-9.-]/g, '-');

  cb(null, `${Date.now()}-${safeName}`);
}
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {

  // Security:
  // Allow only specific image formats

  const allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.webp'
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (
    file.mimetype.startsWith('image/') &&
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only JPG, JPEG, PNG and WEBP images are allowed'
      )
    );
  }
}
});

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, authorize('Super Admin', 'Admin'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Return the path so frontend can save it
  // Using posix path separators to avoid issues
  const imagePath = `/uploads/${req.file.filename}`;
  res.json({ url: imagePath });
});

module.exports = router;
