import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { searchVideos } from '../controllers/VideoController.js';

const router = express.Router();

router.get('/search', searchVideos);

export default router;