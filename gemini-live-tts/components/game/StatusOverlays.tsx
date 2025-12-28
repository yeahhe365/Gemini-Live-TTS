
import React from 'react';
import { MicOff, AlertTriangle } from 'lucide-react';
import { Button } from '../Button';

export const PermissionDenied: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center text-gray-900 dark:text-white">
    <MicOff className="w-16 h-16 text-red-500 mb-4" />
    <h2 className="text-xl font-bold mb-2">麦克风访问被拒绝</h2>
    <p className="text-gray-500 dark:text-gray-400 mb-6">请在浏览器设置中允许麦克风访问以开始游戏。</p>
    <Button onClick={() => window.location.reload()}>重试</Button>
  </div>
);

export const ConnectionError: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center text-gray-900 dark:text-white">
    <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
    <h2 className="text-xl font-bold mb-2">连接错误</h2>
    <p className="text-gray-500 dark:text-gray-400 mb-6">无法连接到 Gemini Live 服务。</p>
    <Button onClick={onBack}>返回菜单</Button>
  </div>
);

export const Connecting: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-gray-900 dark:text-white">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mb-4"></div>
    <h2 className="text-xl font-bold animate-pulse">正在连接 Gemini...</h2>
  </div>
);
