import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="text-center mb-10 space-y-3">
      <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white">
        Gemini <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400">Live TTS</span>
      </h1>
    </div>
  );
};