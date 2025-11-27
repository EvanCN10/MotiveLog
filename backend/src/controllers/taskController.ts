import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. AMBIL SEMUA TUGAS
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const tasks = await prisma.task.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) { res.status(500).json({ message: "Gagal ambil data" }); }
};

// 2. BUAT TUGAS BARU
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    // Ambil deadline & reminderDays dari body
    const { title, description, deadline, reminderDays } = req.body; 
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title) { res.status(400).json({ message: "Judul wajib diisi" }); return; }

    const newTask = await prisma.task.create({
      data: { 
        title, 
        description: description || "", 
        imageUrl, 
        authorId: userId,
        // Konversi string tanggal ke DateTime object jika ada
        deadline: deadline ? new Date(deadline) : null,
        reminderDays: reminderDays ? parseInt(reminderDays) : 1
      }
    });
    res.status(201).json(newTask);
  } catch (error) { res.status(500).json({ message: "Gagal buat tugas" }); }
};

// 3. HAPUS TUGAS
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Terhapus" });
  } catch (error) { res.status(500).json({ message: "Gagal hapus" }); }
};

// 4. UPDATE STATUS TUGAS (Selesai / Penting) -> INI YANG BARU
// GANTI BAGIAN updateTask DENGAN INI:
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isCompleted, isImportant, title, description, deadline, reminderDays } = req.body; 

    const dataToUpdate: any = {};
    if (isCompleted !== undefined) dataToUpdate.isCompleted = isCompleted;
    if (isImportant !== undefined) dataToUpdate.isImportant = isImportant;
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    
    // Update Deadline & Reminder
    if (deadline !== undefined) dataToUpdate.deadline = deadline ? new Date(deadline) : null;
    if (reminderDays !== undefined) dataToUpdate.reminderDays = parseInt(reminderDays);

    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: dataToUpdate
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Gagal update status tugas" });
  }
};