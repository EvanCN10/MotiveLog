import { Request, Response } from 'express';

export const generateTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    // --- LOGIKA AI SIMULASI (MOCK AI) ---
    // Nanti Kapten bisa ganti ini dengan OpenAI API yang asli
    
    let suggestedTasks = [];

    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("belajar") || lowerPrompt.includes("study")) {
      suggestedTasks = [
        { title: "Cari referensi materi", description: "Kumpulkan 3 sumber terpercaya (YouTube/Docs)." },
        { title: "Buat ringkasan bab 1", description: "Tulis poin-poin penting di Notion." },
        { title: "Praktek coding sederhana", description: "Coba implementasikan apa yang dipelajari." }
      ];
    } else if (lowerPrompt.includes("gym") || lowerPrompt.includes("workout")) {
      suggestedTasks = [
        { title: "Pemanasan 10 menit", description: "Stretching dinamis agar tidak cedera." },
        { title: "Angkat beban set 1", description: "Fokus pada form, bukan berat." },
        { title: "Pendinginan & Protein", description: "Minum whey atau makan ayam." }
      ];
    } else {
      // Jawaban Default
      suggestedTasks = [
        { title: `Riset tentang ${prompt}`, description: "Cari tahu dasar-dasarnya dulu." },
        { title: `Buat rencana untuk ${prompt}`, description: "Bikin timeline pengerjaan." },
        { title: `Eksekusi tahap awal ${prompt}`, description: "Mulai dari hal termudah." }
      ];
    }

    // Simulasi mikir agak lama biar keren (1.5 detik)
    setTimeout(() => {
      res.json({ 
        message: "AI Analysis Complete", 
        tasks: suggestedTasks 
      });
    }, 1500);

  } catch (error) {
    res.status(500).json({ message: "AI System Failure" });
  }
};