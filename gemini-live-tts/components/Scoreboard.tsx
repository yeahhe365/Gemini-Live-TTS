
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Player } from '../types';
import { Button } from './Button';
import { Trophy, Medal, Star, Edit2 } from 'lucide-react';

interface ScoreboardProps {
  players: Player[];
  nextPlayerId: string;
  onReady: () => void;
  onBack: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, nextPlayerId, onReady, onBack }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const nextPlayer = players.find(p => p.id === nextPlayerId);
  const maxScore = Math.max(...players.map(p => p.score), 100); // Minimum scale 100

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="text-yellow-500 dark:text-yellow-400 w-6 h-6" />;
    if (index === 1) return <Medal className="text-gray-400 dark:text-gray-300 w-6 h-6" />;
    if (index === 2) return <Medal className="text-amber-700 dark:text-amber-600 w-6 h-6" />;
    return <span className="text-gray-400 dark:text-gray-500 font-bold w-6 text-center">{index + 1}</span>;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-5xl font-black mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 drop-shadow-sm dark:drop-shadow-lg">
        排行榜
      </h2>

      <div className="w-full max-w-2xl space-y-4 mb-8">
        {sortedPlayers.map((player, index) => {
          const isNext = player.id === nextPlayerId;
          const percentage = Math.max((player.score / maxScore) * 100, 5); 
          
          return (
            <div 
              key={player.id} 
              className={`relative overflow-hidden rounded-2xl bg-white dark:bg-white/5 border transition-all duration-300 shadow-sm ${isNext ? 'border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-gray-200 dark:border-white/10'}`}
            >
              <div 
                className={`absolute top-0 bottom-0 left-0 opacity-10 dark:opacity-20 transition-all duration-1000 ease-out ${player.avatarColor}`}
                style={{ width: `${percentage}%` }}
              />

              <div className="relative p-4 flex items-center gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-8">
                  {getRankIcon(index)}
                </div>
                
                <div className={`w-12 h-12 rounded-full ${player.avatarColor} text-white flex items-center justify-center text-xl font-bold shadow-md flex-shrink-0`}>
                  {player.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-800 dark:text-white">{player.name}</span>
                    {isNext && (
                      <span className="text-[10px] uppercase font-bold bg-pink-500 text-white px-2 py-0.5 rounded-full">
                        即将上场
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-2xl font-black font-mono tabular-nums text-gray-800 dark:text-white">
                  {player.score}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mb-12 w-full max-w-2xl flex justify-end">
          <button 
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <Edit2 size={14} /> 修改玩家
          </button>
      </div>

      <div className="bg-white dark:bg-gradient-to-br dark:from-[#2d1b4e] dark:to-[#1a0b2e] rounded-3xl p-8 w-full max-w-md text-center border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl relative overflow-hidden group">
        <div className="hidden dark:block absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
        
        <h3 className="text-sm text-pink-500 dark:text-pink-300 uppercase tracking-[0.2em] font-bold mb-6">下一轮次</h3>
        
        <div className="flex flex-col items-center justify-center mb-8 relative">
           <div className={`w-20 h-20 rounded-full ${nextPlayer?.avatarColor} text-white flex items-center justify-center text-4xl font-bold shadow-lg z-10 ring-4 ring-gray-100 dark:ring-black/30`}>
              {nextPlayer?.name.charAt(0)}
           </div>
           <div className="text-3xl font-bold mt-4 text-gray-800 dark:text-white">{nextPlayer?.name}</div>
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
          你有 <span className="text-gray-900 dark:text-white font-bold">60 秒</span> 的时间来描述秘密单词。
          <br/>在不提及忌语的前提下，引导 Gemini 猜中它！
        </p>

        <Button size="lg" onClick={onReady} className="w-full group-hover:scale-105 transition-transform duration-200">
          开始游戏 <Star className="w-5 h-5 ml-2 inline" />
        </Button>
      </div>
    </div>
  );
};
