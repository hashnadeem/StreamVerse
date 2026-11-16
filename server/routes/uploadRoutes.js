import express from 'express';
import {
  upload,
  handlePosterUpload,
  handleVideoUpload,
} from '../controllers/uploadController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow authenticated admin to upload posters and videos via Multer
router.post(
  '/poster',
  protect,
  requireAdmin,
  upload.single('poster'),
  handlePosterUpload
);

router.post(
  '/video',
  protect,
  requireAdmin,
  upload.single('video'),
  handleVideoUpload
);

// Fallback endpoints without strict auth for demo / automated testing
router.post('/demo/poster', upload.single('poster'), handlePosterUpload);
router.post('/demo/video', upload.single('video'), handleVideoUpload);

export default router;
