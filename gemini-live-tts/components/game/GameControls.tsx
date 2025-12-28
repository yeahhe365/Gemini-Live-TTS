
import React from 'react';
import { Mic, ArrowRight } from 'lucide-react';
import { Button } from '../Button';

interface GameControlsProps {
  status: string;
  audioLevel: number;
  onSkip: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ status, audioLevel, onSkip }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-gray-100 via-gray-100/90 to-transparent dark:from-[#1a0b2e] dark:via-[#1a0b2e]/90 z-50">
      <div className="max-w-2xl mx-auto flex gap-4">
         {status !== 'ROUND_OVER' && (
           <Button 
             variant="danger" 
             className="w-full shadow-lg"
             onClick={onSkip}
           >
             跳过此词
           </Button>
         )}
         
         <div className="flex-1 bg-white dark:bg-white/10 rounded-full flex items-center justify-center gap-2 overflow-hidden relative shadow-lg border border-gray-200 dark:border-none h-12 md:h-auto">
            <div 
              className="absolute inset-0 bg-green-500/10 dark:bg-green-500/20 transition-transform duration-75 origin-left"
              style={{ transform: `scaleX(${audioLevel / 100})` }}
            />
            <Mic className="w-5 h-5 text-gray-500 dark:text-gray-300 relative z-10" />
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300 relative z-10 whitespace-nowrap">麦克风工作中</span>
         </div>
      </div>
    </div>
  );
};
