
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState, useRef } from 'react';
import { GameCard, Player, RoundResult, Language } from '../types';
import { GameLiveSession } from '../services/geminiService';

// Sub-components
import { GameHeader } from './game/GameHeader';
import { WordCard } from './game/WordCard';
import { Transcript } from './game/Transcript';
import { GameControls } from './game/GameControls';
import { RoundOverOverlay } from './game/RoundOverOverlay';
import { Connecting, ConnectionError, PermissionDenied } from './game/StatusOverlays';

interface GameScreenProps {
  player: Player;
  card: GameCard;
  onRoundEnd: (result: RoundResult) => void;
  language: Language;
}

type GameStatus = 'CONNECTING' | 'PLAYING' | 'ROUND_OVER' | 'ENDING' | 'ERROR' | 'PERMISSION_DENIED';

export const GameScreen: React.FC<GameScreenProps> = ({ player, card, onRoundEnd, language }) => {
  // --- States ---
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState<GameStatus>('CONNECTING');
  const [transcript, setTranscript] = useState<{text: string, isUser: boolean}[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [clearedTaboos, setClearedTaboos] = useState<string[]>([]);
  
  // --- Refs ---
  const timeLeftRef = useRef(timeLeft);
  const statusRef = useRef(status);
  const clearedTaboosRef = useRef(clearedTaboos);
  const sessionRef = useRef<GameLiveSession | null>(null);
  const timerRef = useRef<number | null>(null);
  const roundResultRef = useRef<RoundResult | null>(null);

  // Sync refs with state
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { clearedTaboosRef.current = clearedTaboos; }, [clearedTaboos]);

  // --- Game Core Logic ---
  const checkTabooViolation = (text: string) => {
    const normalizedText = text.toLowerCase();
    if (normalizedText.includes(card.targetWord.toLowerCase())) return card.targetWord;
    for (const taboo of card.tabooWords) {
      if (clearedTaboosRef.current.includes(taboo)) continue;
      if (normalizedText.includes(taboo.toLowerCase())) return taboo;
    }
    return null;
  };

  const checkWinCondition = (text: string) => {
    return text.toLowerCase().includes(card.targetWord.toLowerCase());
  };

  const triggerRoundEndPhase = (result: RoundResult) => {
    if (statusRef.current !== 'PLAYING') return;
    
    setStatus('ROUND_OVER');
    stopTimer();
    roundResultRef.current = result;

    let prompt = "";
    if (result.reason === 'GUESS_CORRECT') {
      prompt = `[SYSTEM] 你猜到了单词 "${result.word}"。祝贺玩家！`;
    } else if (result.reason === 'TABOO_VIOLATION') {
      prompt = `[SYSTEM] 玩家犯规了，说了禁忌词 "${result.violationWord}"。幽默地嘲笑一下。`;
    } else if (result.reason === 'TIME_UP') {
      prompt = `[SYSTEM] 时间到！你没猜中。公布答案是 "${result.word}" 并表示遗憾。`;
    } else if (result.reason === 'SKIPPED') {
      prompt = `[SYSTEM] 玩家放弃了。简单评价一下。`;
    }

    sessionRef.current?.sendText(prompt);
  };

  const finalizeRound = () => {
    if (statusRef.current === 'ENDING') return;
    setStatus('ENDING');
    sessionRef.current?.disconnect();
    if (roundResultRef.current) {
        onRoundEnd(roundResultRef.current);
    }
  };

  // --- Session Management ---
  useEffect(() => {
    let mounted = true;
    const startSession = async () => {
      const session = new GameLiveSession({
        onAudioData: (buffer) => {
           if (!mounted) return;
           const data = buffer.getChannelData(0);
           let sum = 0;
           for(let i=0; i<data.length; i+=10) sum += Math.abs(data[i]);
           setAudioLevel(Math.min(100, (sum / (data.length/10)) * 500));
        },
        onTranscription: (text, isUser) => {
           if (!mounted || statusRef.current === 'ENDING') return;

           setTranscript(prev => {
             const last = prev[prev.length - 1];
             if (last && last.isUser === isUser) return [...prev.slice(0, -1), { ...last, text: last.text + text }];
             return [...prev, { text, isUser }];
           });

           if (statusRef.current === 'PLAYING') {
              if (isUser) {
                const violation = checkTabooViolation(text);
                if (violation) triggerRoundEndPhase({ success: false, reason: 'TABOO_VIOLATION', pointsEarned: 0, word: card.targetWord, violationWord: violation });
              } else {
                let newCleared: string[] = [];
                for (const taboo of card.tabooWords) {
                   if (text.toLowerCase().includes(taboo.toLowerCase()) && !clearedTaboosRef.current.includes(taboo)) newCleared.push(taboo);
                }
                if (newCleared.length > 0) setClearedTaboos(prev => [...prev, ...newCleared]);
                if (checkWinCondition(text)) triggerRoundEndPhase({ success: true, reason: 'GUESS_CORRECT', pointsEarned: timeLeftRef.current, word: card.targetWord });
              }
           }
        },
        onClose: () => {},
        onError: (e) => {
          if (!mounted) return;
          if (e.message.toLowerCase().includes('denied')) setStatus('PERMISSION_DENIED');
          else if (statusRef.current !== 'ENDING' && statusRef.current !== 'ROUND_OVER') setStatus('ERROR');
        },
      });

      sessionRef.current = session;
      try {
        await session.connect(card.targetWord, language);
        if (mounted) {
          setStatus('PLAYING');
          startTimer();
        }
      } catch (e: any) {
        if (mounted) setStatus(e.message.toLowerCase().includes('denied') ? 'PERMISSION_DENIED' : 'ERROR');
      }
    };

    startSession();
    return () => {
      mounted = false;
      stopTimer();
      sessionRef.current?.disconnect();
    };
  }, [card]);

  const startTimer = () => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          triggerRoundEndPhase({ success: false, reason: 'TIME_UP', pointsEarned: 0, word: card.targetWord });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  // --- Render Conditional Views ---
  if (status === 'PERMISSION_DENIED') return <PermissionDenied />;
  if (status === 'ERROR') return <ConnectionError onBack={() => onRoundEnd({ success: false, reason: 'ERROR', pointsEarned: 0, word: card.targetWord })} />;
  if (status === 'CONNECTING') return <Connecting />;

  return (
    <div className="flex flex-col h-[100dvh] max-w-2xl mx-auto p-4 relative overflow-hidden bg-gray-50 dark:bg-[#1a0b2e] transition-colors">
      <GameHeader player={player} timeLeft={timeLeft} />
      
      <WordCard card={card} clearedTaboos={clearedTaboos} />

      <Transcript messages={transcript} isRoundOver={status === 'ROUND_OVER'} />

      {status === 'ROUND_OVER' && (
        <RoundOverOverlay result={roundResultRef.current} onFinalize={finalizeRound} />
      )}

      <GameControls 
        status={status} 
        audioLevel={audioLevel} 
        onSkip={() => triggerRoundEndPhase({ success: false, reason: 'SKIPPED', pointsEarned: 0, word: card.targetWord })} 
      />
    </div>
  );
};
