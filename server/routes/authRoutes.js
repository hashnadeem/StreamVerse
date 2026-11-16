import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
  updateUserRole,
  addProfile,
  deleteProfile,
  toggleWatchlist,
  saveWatchProgress,
  updateSubscription,
} from '../controllers/authController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);

// Admin user management
router.get('/users', protect, requireAdmin, getAllUsers);
router.patch('/users/:id/role', protect, requireAdmin, updateUserRole);

// Viewing profiles management
router.post('/profiles', protect, addProfile);
router.delete('/profiles/:profileId', protect, deleteProfile);

// Per-profile Watchlist & playback progress saved in MongoDB
router.post('/watchlist', protect, toggleWatchlist);
router.post('/progress', protect, saveWatchProgress);

// Subscription tier upgrade/downgrade
router.patch('/subscription', protect, updateSubscription);

export default router;
