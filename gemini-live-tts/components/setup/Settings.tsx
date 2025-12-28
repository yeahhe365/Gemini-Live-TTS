
import React from 'react';
import { Globe, UserCheck } from 'lucide-react';
import { SUPPORTED_LANGUAGES, Language, AVAILABLE_VOICES } from '../../types';

interface SettingsProps {
  language: Language;
  setLanguage: (l: Language) => void;
  voice: string;
  setVoice: (v: string) => void;
  isSpeaking: boolean;
  isConnecting: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ 
  language, setLanguage, voice, setVoice, isSpeaking, isConnecting 
}) => {
  return (
    <div className="bg-white/80 dark:bg-black/30 backdrop-blur-2xl rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-8 shadow-xl space-y-8">
      {/* Language */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
            <Globe size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">目标语言</h3>
            <p className="text-[10px] text-gray-400 font-medium">Gemini 将以此语言进行朗读</p>
          </div>
        </div>
        <div className="relative group">
          <select 
            value={language.code}
            disabled={isSpeaking || isConnecting}
            onChange={(e) => {
              const selected = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value);
              if (selected) setLanguage(selected);
            }}
            className="w-full appearance-none bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-pink-500 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-all disabled:opacity-50"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-pink-500 transition-colors">
            <svg width="12" height="8" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>

      {/* Voice Selection */}
      <div className="space-y-4">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                <UserCheck size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white">音色选择</h3>
                <p className="text-[10px] text-gray-400 font-medium">高保真 HD 系列模型</p>
              </div>
           </div>
        </div>
        
        <div className="h-[200px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_VOICES.map(v => (
              <button
                key={v}
                disabled={isSpeaking || isConnecting}
                onClick={() => setVoice(v)}
                className={`group relative py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                  voice === v 
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 z-10' 
                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-200'
                } disabled:opacity-50`}
              >
                {voice === v && (
                  <span className="absolute top-1 right-2 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                )}
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
