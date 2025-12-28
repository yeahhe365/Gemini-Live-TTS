
import React from 'react';

interface OverlaysProps {
  isConnecting: boolean;
  isSpeaking: boolean;
  audioLevel: number;
  voice: string;
  stopTts: () => void;
}

export const Overlays: React.FC<OverlaysProps> = ({ 
  isConnecting, isSpeaking, audioLevel, voice, stopTts 
}) => {
  // 移除全屏阻塞遮罩，连接状态现在通过 TextEditor 和 Controls 体现
  return null;
};
