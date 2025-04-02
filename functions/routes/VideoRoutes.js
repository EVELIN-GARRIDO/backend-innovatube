import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { searchVideos, saveFavoriteVideo } from '../controllers/VideoController.js';

const router = express.Router();

router.get('/search', searchVideos, authenticate);
router.post('/favprite-video', saveFavoriteVideo, authenticate);

export default router;