import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/streamverse';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static uploaded media files (posters, video chunks)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'StreamVerse REST & Streaming API',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/upload', uploadRoutes);

// Connect to MongoDB if available and start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('[StreamVerse DB] Connected to MongoDB');
  })
  .catch((err) => {
    console.warn('[StreamVerse DB] Running in fallback mode without local MongoDB:', err.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`[StreamVerse API] Server listening on http://localhost:${PORT}`);
    });
  });

