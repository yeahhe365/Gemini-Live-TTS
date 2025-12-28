
import React from 'react';
import { Check, Octagon } from 'lucide-react';
import { GameCard } from '../../types';

interface WordCardProps {
  card: GameCard;
  clearedTaboos: string[];
}

export const WordCard: React.FC<WordCardProps> = ({ card, clearedTaboos }) => {
  return (
    <div className="flex-none flex flex-col items-center justify-center mb-4 z-10">
      <div className="bg-white text-gray-900 rounded-3xl p-6 shadow-xl dark:shadow-[0_0_50px_rgba(236,72,153,0.3)] w-full max-w-md border border-gray-100 dark:border-none">
        <div className="bg-pink-100 text-pink-600 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full w-fit mb-2 mx-auto">
          目标词
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-center mb-6 tracking-tight text-gray-800 break-words">
          {card.targetWord}
        </h1>
        
        <div className="bg-gray-100 rounded-xl p-4 border-2 border-dashed border-gray-300">
           <div className="text-center text-gray-400 font-bold uppercase text-xs mb-3 tracking-widest">
             忌语 (禁说词)
           </div>
           <ul className="space-y-2">
             {card.tabooWords.map((word, idx) => {
               const isCleared = clearedTaboos.includes(word);
               return (
                 <li key={idx} className={`text-lg md:text-xl font-bold text-center flex items-center justify-center gap-2 transition-all duration-300 ${isCleared ? 'text-green-600 line-through opacity-70' : 'text-red-500'}`}>
                   {isCleared ? <Check className="w-5 h-5" /> : <Octagon className="w-4 h-4 fill-red-100" />} 
                   {word}
                 </li>
               );
             })}
           </ul>
        </div>
      </div>
    </div>
  );
};
