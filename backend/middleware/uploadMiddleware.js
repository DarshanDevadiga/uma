const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Configure storage engine dynamically by subfolder
 * @param {string} subfolder - The subdirectory within uploads
 */
const storage = (subfolder) => multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsBase = process.env.UPLOADS_DIR
      ? (path.isAbsolute(process.env.UPLOADS_DIR) ? process.env.UPLOADS_DIR : path.join(__dirname, '..', process.env.UPLOADS_DIR))
      : path.join(__dirname, '..', 'uploads');
    const uploadPath = path.join(uploadsBase, subfolder);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

/**
 * File filter to ensure safety
 */
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Allowed types: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX'), false);
  }
};

/**
 * Returns a configured multer middleware instance
 * @param {string} subfolder - Directory name inside uploads/
 */
const upload = (subfolder) => multer({
  storage: storage(subfolder),
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB file size limit
  }
});

module.exports = upload;
