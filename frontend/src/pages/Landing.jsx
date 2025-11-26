import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const Landing = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-brand-black text-white">
      {/* 1. BACKGROUND VIDEO */}
      {/* Saya pakai video stok dari Pexels (Hitam Putih coding/typing) */}
      <video 
        autoPlay 
        loop 
        muted 
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover opacity-30 grayscale"
      >
        <source src="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. OVERLAY CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 animate-fade-in-up">
          FOCUS <span className="text-gray-500">MODE</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10 font-light tracking-wide">
          Stop dreaming. Start executing. <br/>
          Organize your tasks, clear your mind.
        </p>

        <Link 
          to="/dashboard" 
          className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all transform hover:scale-105"
        >
          ENTER WORKSPACE
          <FaArrowRight className="group-hover:translate-x-1 transition-transform"/>
        </Link>
      </div>
    </div>
  );
};

export default Landing;