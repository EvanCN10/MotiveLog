import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/authMiddleware';
// Import fungsi updateTask yang baru dibuat
import { getTasks, createTask, deleteTask, updateTask } from '../controllers/taskController';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

router.get('/', authenticateToken, getTasks);
router.post('/', authenticateToken, upload.single('image'), createTask);
router.delete('/:id', authenticateToken, deleteTask);

// INI JALUR UPDATE (PUT) YANG BARU
router.put('/:id', authenticateToken, updateTask);

export default router;