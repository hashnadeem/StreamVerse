import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.resolve(__dirname, '../uploads');
const postersDir = path.join(uploadDir, 'posters');
const videosDir = path.join(uploadDir, 'videos');

// Ensure upload directories exist
[uploadDir, postersDir, videosDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'poster') {
      cb(null, postersDir);
    } else if (file.fieldname === 'video') {
      cb(null, videosDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (_req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.fieldname === 'poster') {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (validImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image file type. Please upload JPEG, PNG, WEBP, or GIF.'));
    }
  } else if (file.fieldname === 'video') {
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (validVideoTypes.includes(file.mimetype) || file.originalname.endsWith('.mp4')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid video file type. Please upload MP4 or WEBM.'));
    }
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
});

export const handlePosterUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No poster image file provided.' });
  }
  const relativeUrl = `/uploads/posters/${req.file.filename}`;
  res.status(201).json({
    message: 'Poster uploaded successfully via Multer',
    url: relativeUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
};

export const handleVideoUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No video file provided.' });
  }
  const relativeUrl = `/uploads/videos/${req.file.filename}`;
  res.status(201).json({
    message: 'Video uploaded successfully via Multer',
    url: relativeUrl,
    streamEndpoint: `/api/catalog/stream?videoPath=uploads/videos/${req.file.filename}`,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
};
