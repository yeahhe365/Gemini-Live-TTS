
import React, { useRef, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
}

interface TranscriptProps {
  messages: Message[];
  isRoundOver: boolean;
}

export const Transcript: React.FC<TranscriptProps> = ({ messages, isRoundOver }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 bg-white/60 dark:bg-black/40 rounded-2xl p-4 backdrop-blur-md border border-gray-200 dark:border-white/10 mb-24 relative flex flex-col">
      <div className="absolute top-0 right-0 p-2 z-10">
         <div className="flex items-center gap-2 text-xs font-mono text-green-600 dark:text-green-400">
           <span className="relative flex h-3 w-3">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
             <span className={`relative inline-flex rounded-full h-3 w-3 ${isRoundOver ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
           </span>
           {isRoundOver ? '正在倾听' : '实时连接'}
         </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 p-2">
        {messages.length === 0 && (
           <div className="text-center text-gray-400 dark:text-gray-500 italic mt-10">等待语音...</div>
        )}
        {messages.map((t, i) => (
          <div key={i} className={`flex ${t.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
              t.isUser 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white dark:bg-pink-600 text-gray-800 dark:text-white border border-gray-200 dark:border-none rounded-bl-none'
            }`}>
              <span className="opacity-70 text-xs block mb-1">{t.isUser ? '你' : 'Gemini'}</span>
              {t.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};
