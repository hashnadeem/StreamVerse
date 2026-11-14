import express from 'express';
import {
  getAllTitles,
  createCatalogTitle,
  addTitleReview,
} from '../controllers/catalogController.js';
import { streamVideoChunk } from '../controllers/streamController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllTitles);
router.post('/', protect, requireAdmin, createCatalogTitle);
router.post('/:id/reviews', protect, addTitleReview);
router.get('/stream', streamVideoChunk);

export default router;

