
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { TtsLiveSession } from '../../services/geminiService';
import { Header } from './Header';
import { TextEditor } from './TextEditor';
import { Settings } from './Settings';
import { Controls } from './Controls';
import { Overlays } from './Overlays';

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
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  const sessionRef = useRef<TtsLiveSession | null>(null);
  const isMounted = useRef(true);
  const abortFlag = useRef(false);

  const canStart = text.trim().length > 0;

  const startTts = async () => {
    if (!canStart) return;
    
    // 清理之前的下载链接
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    abortFlag.current = false;
    setIsConnecting(true);

    if (sessionRef.current) {
      setIsConnecting(false);
      setIsSpeaking(true);
      sessionRef.current.speak(text);
      return;
    }

    const session = new TtsLiveSession({
      onAudioData: (buffer) => {
        if (abortFlag.current) return;
        const data = buffer.getChannelData(0);
        let sum = 0;
        const step = 25;
        for(let i=0; i<data.length; i+=step) sum += Math.abs(data[i]);
        setAudioLevel(Math.min(100, (sum / (data.length/step)) * 1200));
        setIsSpeaking(true);
      },
      onComplete: (blob) => {
        if (!isMounted.current || abortFlag.current) return;
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
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
      
      if (abortFlag.current) {
        session.disconnect();
        return;
      }

      setIsConnecting(false);
      session.speak(text);
      sessionRef.current = session;
    } catch (e) {
      if (isMounted.current) {
        setIsConnecting(false);
      }
    }
  };

  const stopTts = () => {
    // 设置中断标志
    abortFlag.current = true;
    setIsConnecting(false);
    setIsSpeaking(false);
    setAudioLevel(0);
    
    if (sessionRef.current) {
      // 在停止音频源之前，提取已经生成的音频 Blob
      const blob = sessionRef.current.getWavBlob();
      if (blob && blob.size > 0) {
        // 如果有已生成的内容，即使用户中途停止，也提供下载
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
      }
      sessionRef.current.stopAllAudio();
    }
  };

  const handleReplay = () => {
    // 重播时清空状态
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    
    abortFlag.current = false;
    if (sessionRef.current) {
        sessionRef.current.stopAllAudio();
        sessionRef.current.speak(text);
    } else {
        startTts();
    }
  };

  useEffect(() => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }
    // 更改配置也要清理下载链接
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  }, [language, voice]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      sessionRef.current?.disconnect();
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

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
            downloadUrl={downloadUrl}
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
