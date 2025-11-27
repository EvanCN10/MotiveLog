import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowRight, FaUserSecret } from 'react-icons/fa'; // Tambah Icon Guest

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal!');
    }
  };

  // --- FITUR BARU: GUEST MODE ---
  const handleGuestLogin = () => {
    // Kita buat Token & User Palsu untuk sesi ini
    localStorage.setItem('token', 'GUEST_TOKEN'); 
    localStorage.setItem('user', JSON.stringify({ username: 'Guest Captain', id: 'guest' }));
    navigate('/dashboard');
  };

  return (
    <div className="flex h-screen w-full bg-brand-black text-white font-sans">
      {/* KIRI: Visual */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale"></div>
        <div className="relative z-10 p-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-wider drop-shadow-lg">MOTIVE LOG.</h1>
          <p className="text-gray-200 text-xl font-light tracking-wide">Organize your chaos. Fuel your mind.</p>
        </div>
      </div>

      {/* KANAN: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-brand-black border-l border-white/10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-gray-400">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded relative text-sm">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-5">
              <div>
                <label className="sr-only">Email address</label>
                <input type="email" required className="appearance-none relative block w-full px-4 py-4 border border-gray-700 bg-[#0F0F0F] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-neon-orange transition-all" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="sr-only">Password</label>
                <input type="password" required className="appearance-none relative block w-full px-4 py-4 border border-gray-700 bg-[#0F0F0F] text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-neon-orange transition-all" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div className="space-y-3">
              <button type="submit" className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-lg text-black bg-white hover:bg-gray-200 hover:scale-[1.02] transition-all">
                Sign in <FaArrowRight className="ml-2 mt-0.5" />
              </button>
              
              {/* TOMBOL GUEST (NEW) */}
              <button type="button" onClick={handleGuestLogin} className="group relative w-full flex justify-center py-4 px-4 border border-gray-700 text-sm font-bold rounded-lg text-gray-400 hover:text-white hover:border-white hover:bg-white/5 transition-all">
                <FaUserSecret className="mr-2 mt-0.5" /> Continue as Guest
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Don't have an account? <Link to="/register" className="font-medium text-white hover:underline">Create one now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;