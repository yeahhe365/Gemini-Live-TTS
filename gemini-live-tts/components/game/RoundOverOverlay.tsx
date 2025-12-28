
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../Button';
import { RoundResult } from '../../types';

interface RoundOverOverlayProps {
  result: RoundResult | null;
  onFinalize: () => void;
}

export const RoundOverOverlay: React.FC<RoundOverOverlayProps> = ({ result, onFinalize }) => {
  return (
    <div className="absolute inset-x-0 bottom-32 z-30 flex justify-center animate-in fade-in slide-in-from-bottom-5 duration-300">
       <div className="bg-white/95 dark:bg-black/80 backdrop-blur-xl border border-pink-500/30 text-gray-900 dark:text-white px-8 py-6 rounded-2xl shadow-2xl max-w-sm text-center mx-4">
          <h3 className="text-2xl font-bold mb-2 text-pink-500 dark:text-pink-400">
            {result?.reason === 'GUESS_CORRECT' ? '本轮胜利！' : '本轮结束'}
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">Gemini 正在针对结果做出反应...</p>
          <Button onClick={onFinalize} className="w-full flex items-center justify-center gap-2">
            查看计分板 <ArrowRight size={18}/>
          </Button>
       </div>
    </div>
  );
};
