import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 bg-seacat-dark flex flex-col items-center justify-center text-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3, duration: 1, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <div className="relative text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-sans font-bold tracking-[0.5em] text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          MOTIVELOG
        </motion.h1>
        <p className="text-neon-orange text-[10px] tracking-[0.8em] mt-4 uppercase">"Train your body, and train your mind."</p>
      </div>
      <motion.div className="absolute bottom-20 w-64 h-[1px] bg-gray-800 overflow-hidden">
        <motion.div 
          className="h-full bg-neon-orange"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};
export default LoadingScreen;