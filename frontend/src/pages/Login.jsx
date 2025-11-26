import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa'; // Pastikan sudah install react-icons

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Tembak ke Backend
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      });
      
      // Simpan Tiket (Token) di Saku (LocalStorage)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Pindah ke Dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal!');
    }
  };

  return (
    <div className="flex h-screen w-full bg-brand-black text-brand-white font-sans">
      {/* BAGIAN KIRI: Visual/Video Area */}
      <div className="hidden lg:flex w-1/2 bg-brand-gray items-center justify-center relative overflow-hidden">
        {/* Placeholder Image (Hitam Putih Estetik) */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale"></div>
        <div className="relative z-10 p-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-wider drop-shadow-lg">MOTIVE LOG.</h1>
          <p className="text-gray-200 text-xl font-light tracking-wide">Organize your chaos. Fuel your mind.</p>
        </div>
      </div>

      {/* BAGIAN KANAN: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-brand-black border-l border-brand-gray/20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-brand-white tracking-tight">Welcome Back</h2>
            <p className="mt-2 text-gray-400">Please enter your details to sign in.</p>
          </div>

          {/* Alert Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded relative text-sm" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-5">
              <div>
                <label className="sr-only">Email address</label>
                <input
                  type="email"
                  required
                  className="appearance-none relative block w-full px-4 py-4 border border-brand-gray bg-brand-dark text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-white focus:border-transparent transition-all"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="sr-only">Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none relative block w-full px-4 py-4 border border-brand-gray bg-brand-dark text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-white focus:border-transparent transition-all"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-lg text-brand-black bg-brand-white hover:bg-white hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-white transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:text-gray-900"
              >
                Sign in
                <FaArrowRight className="ml-2 mt-0.5 group-hover:translate-x-1 transition-transform 
                " />
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-brand-white hover:underline hover:text-white transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;