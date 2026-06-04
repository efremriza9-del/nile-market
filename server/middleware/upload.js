const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'nile-market',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

module.exports = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'dzyhrxpek',
  api_key: '937139298318891',
  api_secret: 'ie1MfQ1Zm4Xyum16Cne81z_MtYU'
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'nile-market',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

module.exports = multer({ storage });