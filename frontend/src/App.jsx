import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";

// 1. KOMPONEN SATPAM (PROTECTED ROUTE)
// Tugas: Mengecek token setiap kali halaman ini mau diakses
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Kalau tidak ada token, tendang ke Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Kalau ada token, silakan masuk
  return children;
};

// 2. KOMPONEN PUBLIC (SUPAYA TIDAK BISA LOGIN LAGI KALAU SUDAH LOGIN)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Kalau sudah punya token tapi maksa buka Login, lempar ke Dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect Root (/) langsung ke Dashboard (nanti dicek satpam) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Halaman Public (Login & Register) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Halaman Rahasia (Dashboard) - Dijaga Satpam ProtectedRoute */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Halaman Landing (Opsional: Kalau mau dipisah, tapi tadi kan sudah digabung ke Dashboard) */}
        {/* <Route path="/landing" element={<ProtectedRoute><Landing /></ProtectedRoute>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
