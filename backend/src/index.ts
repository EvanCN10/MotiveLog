import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});