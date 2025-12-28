
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { RoundResult, Player } from '../types';
import { Button } from './Button';
import { Trophy, Ban, AlertTriangle, CheckCircle } from 'lucide-react';

interface RoundResultScreenProps {
  result: RoundResult;
  player: Player;
  onNext: () => void;
}

export const RoundResultScreen: React.FC<RoundResultScreenProps> = ({ result, player, onNext }) => {
  const getIcon = () => {
    switch (result.reason) {
      case 'GUESS_CORRECT': return <CheckCircle className="w-20 h-20 text-green-500 dark:text-green-400 mb-4" />;
      case 'TABOO_VIOLATION': return <Ban className="w-20 h-20 text-red-500 mb-4" />;
      case 'TIME_UP': return <AlertTriangle className="w-20 h-20 text-orange-500 dark:text-orange-400 mb-4" />;
      default: return <Ban className="w-20 h-20 text-gray-400 mb-4" />;
    }
  };

  const getTitle = () => {
    switch (result.reason) {
      case 'GUESS_CORRECT': return "Gemini 猜到了！";
      case 'TABOO_VIOLATION': return "触碰了忌语！";
      case 'TIME_UP': return "时间到！";
      case 'SKIPPED': return "已跳过";
      default: return "本轮结束";
    }
  };

  const getDescription = () => {
    switch (result.reason) {
      case 'GUESS_CORRECT': return `描述得很棒！你获得了 ${result.pointsEarned} 分。`;
      case 'TABOO_VIOLATION': return `糟糕！你说了禁忌词： "${result.violationWord?.toUpperCase()}"。`;
      case 'TIME_UP': return "时间在 Gemini 猜到之前就用完了。";
      default: return "下次好运。";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fadeIn text-gray-900 dark:text-white">
      <div className="bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 w-full max-w-lg border border-gray-200 dark:border-white/20 shadow-2xl">
        <div className="flex justify-center animate-bounce-short">
          {getIcon()}
        </div>
        
        <h2 className="text-4xl font-black mb-4">{getTitle()}</h2>
        <p className="text-xl text-gray-600 dark:text-gray-200 mb-8">{getDescription()}</p>
        
        <div className="bg-gray-100 dark:bg-black/30 rounded-xl p-6 mb-8 border border-gray-200 dark:border-none">
           <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">目标词</div>
           <div className="text-3xl font-bold text-gray-900 dark:text-white">{result.word}</div>
        </div>

        {result.pointsEarned > 0 && (
           <div className="flex items-center justify-center gap-2 text-yellow-500 dark:text-yellow-400 text-2xl font-bold mb-8">
             <Trophy /> +{result.pointsEarned} 分
           </div>
        )}

        <Button size="lg" onClick={onNext} className="w-full">
          下一轮
        </Button>
      </div>
    </div>
  );
};
