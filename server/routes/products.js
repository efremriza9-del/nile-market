const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const upload = multer({ storage: multer.memoryStorage() });

const handleUpload = (fieldName, maxCount) => [
  upload.array(fieldName, maxCount),
  async (req, res, next) => {
    if (!req.files?.length) return next();
    try {
      const urls = await Promise.all(req.files.map(async (file) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        await supabase.storage
          .from('product-images')
          .upload(fileName, file.buffer, { contentType: file.mimetype });
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        return data.publicUrl;
      }));
      req.files = req.files.map((f, i) => ({ ...f, path: urls[i] }));
      next();
    } catch (err) {
      res.status(500).json({ message: 'Upload failed', error: err.message });
    }
  }
];

module.exports = { array: (field, max) => handleUpload(field, max) };