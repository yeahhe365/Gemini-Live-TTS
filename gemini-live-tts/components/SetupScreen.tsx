
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { TtsLiveSession } from '../services/geminiService';
import { Header } from './setup/Header';
import { TextEditor } from './setup/TextEditor';
import { Settings } from './setup/Settings';
import { Controls } from './setup/Controls';
import { Overlays } from './setup/Overlays';

interface SetupScreenProps {
  initialLanguage: Language;
  initialVoice: string;
  initialText: string;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ 
  initialLanguage, 
  initialVoice,
  initialText 
}) => {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [voice, setVoice] = useState(initialVoice);
  const [text, setText] = useState(initialText);

  // TTS States
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const sessionRef = useRef<TtsLiveSession | null>(null);

  const canStart = text.trim().length > 0;

  const startTts = async () => {
    if (!canStart) return;
    
    // If already connected to the same config, just speak
    if (sessionRef.current && !isSpeaking) {
      sessionRef.current.speak(text);
      return;
    }

    setIsConnecting(true);
    
    // Disconnect old session if exists
    if (sessionRef.current) {
      await sessionRef.current.disconnect();
    }

    const session = new TtsLiveSession({
      onAudioData: (buffer) => {
        const data = buffer.getChannelData(0);
        let sum = 0;
        const step = 25;
        for(let i=0; i<data.length; i+=step) sum += Math.abs(data[i]);
        setAudioLevel(Math.min(100, (sum / (data.length/step)) * 1200));
        setIsSpeaking(true);
      },
      onClose: () => {
        setIsSpeaking(false);
        setAudioLevel(0);
      },
      onError: (e) => {
        console.error(e);
        setIsConnecting(false);
        setIsSpeaking(false);
      }
    });

    try {
      await session.connect(language, voice);
      setIsConnecting(false);
      session.speak(text);
      sessionRef.current = session;
    } catch (e) {
      setIsConnecting(false);
    }
  };

  const stopTts = () => {
    sessionRef.current?.stopAllAudio();
    setIsSpeaking(false);
    setAudioLevel(0);
  };

  const handleReplay = () => {
    if (isSpeaking) {
      stopTts();
      setTimeout(() => sessionRef.current?.speak(text), 100);
    } else {
      startTts();
    }
  };

  useEffect(() => {
    return () => {
      sessionRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-full w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-24">
        <TextEditor 
          text={text} 
          setText={setText} 
          isSpeaking={isSpeaking} 
          isConnecting={isConnecting} 
          audioLevel={audioLevel} 
        />

        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8">
          <Settings 
            language={language} 
            setLanguage={setLanguage} 
            voice={voice} 
            setVoice={setVoice} 
            isSpeaking={isSpeaking} 
            isConnecting={isConnecting} 
          />

          <Controls 
            isSpeaking={isSpeaking} 
            isConnecting={isConnecting} 
            canStart={canStart} 
            startTts={startTts} 
            stopTts={stopTts} 
            handleReplay={handleReplay} 
          />
        </div>
      </div>

      <Overlays 
        isConnecting={isConnecting} 
        isSpeaking={isSpeaking} 
        audioLevel={audioLevel} 
        voice={voice} 
        stopTts={stopTts} 
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
};
