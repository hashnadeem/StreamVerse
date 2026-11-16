import express from 'express';
import {
  getAllTitles,
  getTitleById,
  createCatalogTitle,
  updateCatalogTitle,
  deleteCatalogTitle,
  addEpisode,
  deleteEpisode,
  getCatalogStats,
  addTitleReview,
} from '../controllers/catalogController.js';
import { streamVideoChunk } from '../controllers/streamController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllTitles);
router.get('/stream', streamVideoChunk);
router.get('/stats/overview', getCatalogStats);
router.get('/:id', getTitleById);

// Protected routes (Admin CRUD)
router.post('/', protect, requireAdmin, createCatalogTitle);
router.put('/:id', protect, requireAdmin, updateCatalogTitle);
router.delete('/:id', protect, requireAdmin, deleteCatalogTitle);

// Series episode management
router.post('/:id/episodes', protect, requireAdmin, addEpisode);
router.delete('/:id/episodes/:epId', protect, requireAdmin, deleteEpisode);

// Community reviews
router.post('/:id/reviews', protect, addTitleReview);

export default router;
