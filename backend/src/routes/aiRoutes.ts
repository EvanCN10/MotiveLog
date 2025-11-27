import express from 'express';
import { generateTasks } from '../controllers/aiController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// POST /ai/generate
router.post('/generate', authenticateToken, generateTasks);

export default router;