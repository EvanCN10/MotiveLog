import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserPlus } from 'react-icons/fa';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/register', {
        username,
        email,
        password
      });
      // Kalau sukses, suruh login
      navigate('/login');
      alert("Registrasi berhasil! Silakan login.");
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal!');
    }
  };

  return (
    <div className="flex h-screen w-full bg-brand-black">
      {/* KIRI: Visual (Video/Image) */}
      <div className="hidden lg:flex w-1/2 bg-brand-gray items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale"></div>
        <div className="relative z-10 p-10 text-center">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-wider">JOIN THE FLOW.</h1>
          <p className="text-gray-300 text-lg">Start your journey to organized chaos.</p>
        </div>
      </div>

      {/* KANAN: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-brand-black">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="mt-2 text-gray-400">Join us today.</p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-4 border border-brand-gray bg-brand-dark text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition-all"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-4 border border-brand-gray bg-brand-dark text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-4 border border-brand-gray bg-brand-dark text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-white hover:bg-gray-200 transition-all transform hover:scale-[1.01]"
            >
              Sign Up
              <FaUserPlus className="ml-2 mt-0.5" />
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-white hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;