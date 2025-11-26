# 🚀 MotiveLog - Task Management Application

> **A modern, professional task management application with luxury dark theme and smooth animations.**
> Designed to boost productivity with an intuitive user interface and seamless user experience.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.3-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.13-38B2AC?logo=tailwindcss)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Key Features Explained](#key-features-explained)
- [Design System](#design-system)
- [API Integration](#api-integration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

---

## 📖 Overview

**MotiveLog** adalah aplikasi manajemen tugas (task management) yang dirancang untuk membantu pengguna mengorganisir, melacak, dan menyelesaikan tugas harian dengan cara yang menyenangkan dan efisien.

Aplikasi ini menggabungkan:

- ✨ **Desain Modern** - Tema gelap mewah dengan aksen neon yang menarik
- 🎯 **Fungsionalitas Lengkap** - Manajemen tugas yang komprehensif
- 📱 **Responsif** - Bekerja sempurna di mobile, tablet, dan desktop
- ⚡ **Performa Cepat** - Build dengan Vite untuk loading yang cepat
- 🔐 **Aman** - Autentikasi JWT dan manajemen sesi

---

## ✨ Features

### 🔐 **Authentication & User Management**

- ✅ **Registrasi Pengguna** - Buat akun baru dengan email dan password
- ✅ **Login Aman** - Autentikasi menggunakan JWT tokens
- ✅ **Persistent Session** - Login tetap tersimpan dengan localStorage
- ✅ **Logout** - Keluar dengan aman dan menghapus session
- ✅ **User Profile** - Tampilkan informasi pengguna di dashboard

### 📝 **Task Management**

- ✅ **Buat Task Baru** - Tambahkan tugas dengan deskripsi singkat
- ✅ **Attach Evidence** - Upload gambar/bukti pendukung untuk setiap task
- ✅ **Mark as Complete** - Tandai tugas sebagai selesai dengan checkbox
- ✅ **Delete Task** - Hapus tugas yang tidak diperlukan
- ✅ **Real-time Updates** - Perubahan langsung tercermin di UI
- ✅ **Task Statistics** - Lihat jumlah total, selesai, dan pending tasks

### 🎨 **User Interface**

- ✅ **Luxury Dark Theme** - Tema gelap profesional dengan warna seacat
- ✅ **Glassmorphism Effects** - Background blur dan efek kaca
- ✅ **Smooth Animations** - Transisi halus menggunakan Framer Motion
- ✅ **Loading States** - Indikator loading saat proses berlangsung
- ✅ **Error Handling** - Pesan error yang jelas dan informatif
- ✅ **Responsive Design** - Optimal di semua ukuran layar

### 📱 **Responsive Pages**

- ✅ **Landing Page** - Halaman selamat datang dengan feature showcase
- ✅ **Login Page** - Form login dengan validasi
- ✅ **Register Page** - Form registrasi dengan error checking
- ✅ **Dashboard** - Halaman utama dengan task management
- ✅ **Loading Screen** - Animasi loading yang sophisticated

---

## 🛠️ Tech Stack

### **Frontend**

| Technology        | Version | Purpose                     |
| ----------------- | ------- | --------------------------- |
| **React**         | 19.2.0  | UI Framework                |
| **Vite**          | 7.2.3   | Build Tool & Dev Server     |
| **Tailwind CSS**  | 4.0.13  | Styling & Responsive Design |
| **Framer Motion** | 12.0.0  | Animations & Transitions    |
| **React Router**  | 7.9.0   | Client-side Routing         |
| **Axios**         | 1.13.7  | HTTP Client                 |
| **React Icons**   | 5.5.0   | Icon Library                |

### **Backend** (Related)

| Technology     | Purpose         |
| -------------- | --------------- |
| **Express**    | REST API Server |
| **TypeScript** | Type Safety     |
| **JWT**        | Authentication  |
| **Prisma**     | Database ORM    |
| **Multer**     | File Upload     |

---

## 📦 Installation

### **Prerequisites**

- Node.js 16+
- npm atau yarn
- Backend server running (http://localhost:5000)

### **Step 1: Install Dependencies**

```bash
npm install
```

### **Step 2: Configure Environment**

Pastikan backend sudah berjalan di `http://localhost:5000`

### **Step 3: Start Development Server**

```bash
npm run dev
```

Server akan berjalan di: **http://localhost:5173**

---

## 🎮 Usage

### **1. Pertama Kali Menggunakan**

1. Buka http://localhost:5173
2. Klik "START NOW" atau pergi ke halaman login
3. Klik "Don't have an account? Register" untuk membuat akun baru

### **2. Register/Membuat Akun**

- Masukkan **username**, **email**, dan **password**
- Password minimal 6 karakter
- Klik tombol "Register"
- Akan otomatis redirect ke login

### **3. Login**

- Masukkan **email** dan **password**
- Klik "Sign In"
- Jika berhasil, akan masuk ke Dashboard

### **4. Dashboard - Mengelola Tasks**

#### **Membuat Task Baru**

1. Scroll ke bawah pada halaman Dashboard
2. Di "Floating Form" (box di bawah), masukkan deskripsi task
3. Opsional: Klik icon gambar untuk upload bukti
4. Klik tombol "ADD" untuk membuat task

#### **Menandai Task Selesai**

1. Lihat list tasks di section "Your Missions"
2. Klik checkbox di sebelah kiri task
3. Task akan berubah warna dan menampilkan strikethrough

#### **Menghapus Task**

1. Hover mouse di atas task
2. Icon delete (tempat sampah) akan muncul
3. Klik untuk menghapus task

#### **Melihat Statistik**

- **Total Tasks** - Jumlah semua task yang dibuat
- **Completed** - Task yang sudah selesai
- **Pending** - Task yang masih dikerjakan

### **5. Logout**

- Klik tombol "EXIT" di floating form (desktop)
- Atau klik logout button di top-right (mobile)
- Akan redirect ke login page

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx      # Halaman utama/welcome
│   │   ├── Login.jsx        # Halaman login
│   │   ├── register.jsx     # Halaman registrasi
│   │   ├── Dashboard.jsx    # Halaman dashboard utama
│   │   └── LoadingScreen.jsx # Animasi loading
│   ├── components/
│   │   └── LoadingScreen.jsx # Component loading reusable
│   ├── context/             # State management
│   ├── assets/              # Images & static files
│   ├── App.jsx              # Main app component
│   ├── App.css              # App styles
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   └── vite.config.js       # Vite configuration
├── public/                  # Public static files
├── package.json             # Dependencies & scripts
├── vite.config.js           # Vite config
├── tailwind.config.js       # Tailwind CSS config
├── eslint.config.js         # ESLint rules
├── index.html               # HTML entry point
└── README.md                # This file
```

---

## 🔍 Key Features Explained

### **1. Authentication Flow**

```
User -> Register -> Email Verified -> Login -> Dashboard
                                      ↓
                              JWT Token Generated
                              Stored in localStorage
                              Bearer token di API calls
```

**Cara Kerja:**

- Saat login berhasil, server mengirimkan JWT token
- Token disimpan di `localStorage` browser
- Setiap request ke API menyertakan token di header
- Jika token tidak valid, user di-redirect ke login

### **2. Task Management Flow**

```
Create Task -> Attach Image -> Store in Database
                                   ↓
Display in Dashboard -> Mark Complete -> Update Status
                                          ↓
                                    Or Delete Task
```

**Fitur Khusus:**

- Task bisa di-upload dengan gambar bukti
- Gambar disimpan di server `/uploads` directory
- Checkbox untuk mark complete tanpa delete
- Delete button untuk menghapus task permanent

### **3. Responsive Design**

Aplikasi menggunakan **mobile-first approach**:

- **Mobile (320px)** - Optimized untuk smartphone
- **Tablet (768px)** - Layout yang pas untuk tablet
- **Desktop (1024px+)** - Full layout untuk monitor besar

Tailwind CSS breakpoints:

- `sm:` - Small screens
- `md:` - Medium screens
- `lg:` - Large screens

Contoh responsive class:

```jsx
className = "text-2xl sm:text-3xl md:text-4xl lg:text-5xl";
// Mobile: 24px, Tablet: 30px, Desktop: 36px-40px
```

### **4. Loading States**

- **Page Loading** - LoadingScreen component dengan animasi rings
- **Button Loading** - Spinner pada submit button saat proses
- **Form Loading** - Input disabled saat pengiriman data
- **Task Loading** - Skeleton atau placeholder saat fetch

### **5. Error Handling**

- **Form Validation** - Email harus valid, password minimal 6 char
- **API Errors** - Error message ditampilkan ke user
- **Network Errors** - Handled dengan try-catch
- **Authentication Errors** - Redirect ke login jika token invalid

---

## 🎨 Design System

### **Color Palette**

```
Primary Dark:     #0f1419 (seacat-dark)
Secondary Dark:   #1a2332 (seacat-blue)
Accent Orange:    #FF6B00 (neon-orange)
Accent Cyan:      #00F0FF (neon-cyan)
Text Light:       #ffffff
Text Muted:       #9ca3af
```

### **Typography**

- **Font Family:** Outfit (Google Fonts)
- **Headings:** Bold weight, uppercase, wide letter-spacing
- **Body Text:** Light weight, readable line-height
- **Sizing:** Responsive dengan breakpoints

### **Visual Effects**

- **Glassmorphism:** Semi-transparent backgrounds dengan blur
- **Gradients:** Multi-stop linear gradients untuk accents
- **Shadows:** Neon-colored shadows untuk depth
- **Borders:** Subtle white/transparent borders

### **Animations**

- **Fade:** Entrance dan exit animations
- **Scale:** Hover effects pada buttons
- **Slide:** Page transitions
- **Bounce:** Loading indicators
- Framework: Framer Motion untuk smooth transitions

---

## 🔌 API Integration

### **Base URL**

```
http://localhost:5000
```

### **Authentication Endpoints**

#### **Register**

```
POST /auth/register
Content-Type: application/json

Request:
{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response (201):
{
  "message": "Registrasi berhasil!",
  "userId": "string"
}
```

#### **Login**

```
POST /auth/login
Content-Type: application/json

Request:
{
  "email": "string",
  "password": "string"
}

Response (200):
{
  "message": "Login berhasil!",
  "token": "jwt_token_string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### **Task Endpoints**

#### **Get All Tasks**

```
GET /tasks
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "string",
    "title": "string",
    "isCompleted": boolean,
    "imageUrl": "string|null"
  }
]
```

#### **Create Task**

```
POST /tasks
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- title: string (required)
- image: file (optional)

Response (201):
{
  "id": "string",
  "title": "string",
  "isCompleted": false,
  "imageUrl": "string|null"
}
```

#### **Delete Task**

```
DELETE /tasks/{taskId}
Authorization: Bearer {token}

Response (200):
{
  "message": "Task deleted successfully"
}
```

---

## 💻 Development

### **Start Development Server**

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173` dengan **Hot Module Replacement (HMR)**

### **HMR (Hot Module Replacement)**

- Perubahan code otomatis di-reflect di browser
- State tetap terjaga
- Tidak perlu refresh manual

### **Debug Mode**

- Buka **DevTools** (F12 atau Ctrl+Shift+I)
- Lihat **Console** untuk error messages
- Gunakan **React DevTools** extension untuk inspect components

### **Common Development Commands**

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Check for errors
npm run lint

# Format code
npm run format
```

---

## 🏗️ Building for Production

### **Build Optimized Version**

```bash
npm run build
```

Proses build:

1. Compile React & TypeScript
2. Optimize CSS dengan PurgeCSS
3. Minify JavaScript
4. Generate source maps
5. Output ke folder `dist/`

### **Preview Production Build**

```bash
npm run preview
```

### **Deploy to Production**

1. Build project: `npm run build`
2. Upload folder `dist/` ke hosting platform:
   - **Vercel** - Connect GitHub repository
   - **Netlify** - Drag & drop `dist/` folder
   - **GitHub Pages** - Push ke branch `gh-pages`
   - **Traditional Server** - Copy files via FTP/SSH

---

## 🐛 Troubleshooting

### **Problem: "Cannot find module" Error**

**Solution:**

```bash
# Clear cache dan reinstall
rm -r node_modules
npm install
npm run dev
```

### **Problem: Port 5173 Already in Use**

**Solution:**

```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

### **Problem: Backend Connection Error**

**Solution:**

- Pastikan backend running di `http://localhost:5000`
- Cek di browser: http://localhost:5000
- Jika error, jalankan backend: `cd backend && npm run dev`

### **Problem: Login Gagal**

**Solution:**

- Pastikan credentials benar (email & password)
- Cek di DevTools Console untuk error message
- Pastikan backend sudah register user terlebih dahulu
- Coba clear cache: `Ctrl+Shift+Delete`

### **Problem: Images Not Loading**

**Solution:**

- Pastikan backend folder `/uploads` sudah ada
- Check browser DevTools Network tab untuk 404 errors
- Verifikasi image upload berhasil di backend

### **Problem: Styling Issues**

**Solution:**

- Clear cache: `Ctrl+Shift+Delete`
- Restart dev server: `Ctrl+C` then `npm run dev`
- Check untuk typo di class names
- Verify Tailwind CSS build: `npm run build`

---

## 🚀 Performance Tips

- ✅ **Lazy Loading** - Pages load on-demand
- ✅ **Code Splitting** - Vite automatic code splitting
- ✅ **Optimized Images** - Compressed & responsive
- ✅ **Cached API Calls** - Reduce redundant requests
- ✅ **GPU Animations** - Smooth 60 FPS animations
- ✅ **Tree Shaking** - Remove unused code

---

## 📚 Additional Resources

### **Documentation**

- [React Documentation](https://react.dev)
- [Vite Guide](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

### **Learning**

- MDN Web Docs
- CSS Tricks
- Dev.to
- Hashnode

---

## 📝 License

This project is open source and available under the MIT License.

---

## ✨ Author

Created with ❤️ for better task management and productivity.

**Status:** ✅ Production Ready

**Last Updated:** November 2024

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Happy coding! 🚀**
