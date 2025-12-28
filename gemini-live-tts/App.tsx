
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { SUPPORTED_LANGUAGES, Language } from './types';
import { Moon, Sun } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [voice, setVoice] = useState('Zephyr');
  const [text, setText] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-50 dark:bg-[#0f071a] transition-colors duration-500 overflow-x-hidden selection:bg-pink-500/30">
       <button 
         onClick={toggleTheme}
         className="absolute top-4 right-4 md:top-6 md:right-8 z-50 p-3 rounded-2xl bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-white/10 shadow-sm backdrop-blur-md transition-all border border-gray-200 dark:border-white/5 group"
         aria-label="切换主题"
       >
         {isDarkMode ? 
            <Moon className="text-indigo-300 group-hover:text-yellow-300 transition-colors" size={20} /> : 
            <Sun className="text-orange-500 group-hover:text-orange-600 transition-colors" size={20} />
         }
       </button>
       
       <main className="flex-grow flex flex-col w-full">
          <SetupScreen 
            initialLanguage={language} 
            initialVoice={voice}
            initialText={text}
          />
       </main>
    </div>
  );
}
