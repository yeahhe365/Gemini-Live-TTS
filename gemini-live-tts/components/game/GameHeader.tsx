
import React from 'react';
import { Clock } from 'lucide-react';
import { Player } from '../../types';

interface GameHeaderProps {
  player: Player;
  timeLeft: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ player, timeLeft }) => {
  return (
    <div className="flex-none flex justify-between items-center mb-4 bg-white/80 dark:bg-black/20 p-4 rounded-2xl backdrop-blur-md shadow-sm dark:shadow-none z-10">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${player.avatarColor} text-white flex items-center justify-center font-bold shadow-md`}>
          {player.name.charAt(0)}
        </div>
        <span className="font-bold hidden sm:block text-gray-800 dark:text-white">{player.name} 正在描述</span>
      </div>
      <div className={`flex items-center gap-2 text-2xl font-black font-mono ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-800 dark:text-white'}`}>
        <Clock size={28} />
        {timeLeft}秒
      </div>
    </div>
  );
};
