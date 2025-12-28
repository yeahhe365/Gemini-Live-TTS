
import React from 'react';
import { Play, RotateCcw, Square, Download } from 'lucide-react';
import { Button } from '../Button';

interface ControlsProps {
  isSpeaking: boolean;
  isConnecting: boolean;
  canStart: boolean;
  startTts: () => void;
  stopTts: () => void;
  handleReplay: () => void;
  downloadUrl: string | null;
}

export const Controls: React.FC<ControlsProps> = ({ 
  isSpeaking, isConnecting, canStart, startTts, stopTts, handleReplay, downloadUrl 
}) => {
  if (!isSpeaking && !isConnecting) {
    return (
      <div className="flex flex-col gap-4">
        <Button 
          size="lg" 
          className="w-full h-16 text-lg font-black tracking-widest shadow-2xl shadow-pink-500/20 hover:shadow-pink-500/40 transform transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3" 
          disabled={!canStart}
          onClick={startTts}
        >
          立即生成高清语音 <Play fill="currentColor" size={18} />
        </Button>
        
        {downloadUrl && (
          <a 
            href={downloadUrl} 
            download="gemini-tts-audio.wav"
            className="w-full"
          >
            <Button 
              variant="secondary"
              className="w-full h-14 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400"
            >
              <Download size={18} /> 下载合成音频
            </Button>
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
         <Button 
          variant="ghost"
          className="flex-1 h-16 flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10"
          onClick={handleReplay}
          disabled={isConnecting}
         >
           <RotateCcw size={18} /> 重新播放
         </Button>
         <Button 
          variant="danger"
          className="w-20 h-16 flex items-center justify-center p-0"
          onClick={stopTts}
         >
           <Square fill="currentColor" size={24} className="animate-pulse" />
         </Button>
      </div>

      {downloadUrl && !isConnecting && (
        <a 
          href={downloadUrl} 
          download="gemini-tts-audio.wav"
          className="w-full animate-in fade-in slide-in-from-top-2"
        >
          <Button 
            variant="secondary"
            className="w-full h-14 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400"
          >
            <Download size={18} /> 下载合成音频
          </Button>
        </a>
      )}
    </div>
  );
};
