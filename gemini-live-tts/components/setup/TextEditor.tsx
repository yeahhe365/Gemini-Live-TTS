
import React from 'react';
import { Feather, Trash2, BookOpen, Cpu, Quote, Loader2 } from 'lucide-react';

interface TextEditorProps {
  text: string;
  setText: (t: string) => void;
  isSpeaking: boolean;
  isConnecting: boolean;
  audioLevel: number;
}

export const SAMPLE_TEXTS = [
  { 
    title: "文学经典", 
    icon: <BookOpen size={14} />, 
    content: "在一个晴朗的早晨，阳光穿过茂密的树叶，洒下点点金光。森林里充满了清新的空气和泥土的芬芳，一切都显得那么宁静而美好。" 
  },
  { 
    title: "科技新闻", 
    icon: <Cpu size={14} />, 
    content: "Google Gemini 2.5 现已推出原生音频支持，能够生成极具情感表达力的语音。这一突破性的技术将改变人机交互的方式，让AI听起来更像人类。" 
  },
  { 
    title: "唯美诗句", 
    icon: <Quote size={14} />, 
    content: "众里寻他千百度。蓦然回首，那人却在，灯火阑珊处。月落乌啼霜满天，江枫渔火对愁眠。" 
  }
];

export const TextEditor: React.FC<TextEditorProps> = ({ text, setText, isSpeaking, isConnecting, audioLevel }) => {
  return (
    <div className="lg:col-span-7 flex flex-col gap-4">
      <div className={`relative group flex-1 bg-white dark:bg-white/5 backdrop-blur-2xl rounded-[2rem] p-1 border transition-all duration-500 shadow-xl flex flex-col focus-within:ring-2 ring-pink-500/30 ${isConnecting ? 'border-pink-500/50' : 'border-gray-200 dark:border-white/10'}`}>
        
        {/* 连接中的流光效果 */}
        {isConnecting && (
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" style={{ backgroundSize: '200% 100%' }} />
          </div>
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 rounded-t-[2rem] z-10">
           <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-widest">
             {isConnecting ? (
               <Loader2 size={14} className="text-pink-500 animate-spin" />
             ) : (
               <Feather size={14} className="text-pink-500" />
             )}
             <span>{isConnecting ? '正在初始化语音引擎...' : '待合成文本'}</span>
           </div>
           <div className="flex items-center gap-4">
             <div className="text-[10px] font-mono text-gray-400">
               {text.length} 字符
             </div>
             <button 
              onClick={() => setText('')}
              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
              title="清空"
             >
               <Trash2 size={14} />
             </button>
           </div>
        </div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSpeaking || isConnecting}
          placeholder="在这里输入、粘贴或选择下方的示例内容..."
          className={`w-full min-h-[350px] lg:min-h-[480px] p-6 text-lg bg-transparent border-none focus:ring-0 resize-none placeholder-gray-300 dark:placeholder-gray-600 font-medium text-gray-800 dark:text-white leading-relaxed transition-all z-10 ${isSpeaking ? 'opacity-80' : ''}`}
        />

        {/* 说话时的音量反馈 */}
        {isSpeaking && (
          <div className="absolute bottom-6 right-6 flex items-end gap-1 h-8 px-4 py-2 bg-pink-500/10 rounded-full border border-pink-500/20 backdrop-blur-md">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i}
                className="w-1 bg-pink-500 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(15, (audioLevel * (0.5 + Math.random() * 0.5)))}%` }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 px-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider w-full mb-1 ml-1">快速预设</span>
        {SAMPLE_TEXTS.map((sample, idx) => (
          <button
            key={idx}
            disabled={isSpeaking || isConnecting}
            onClick={() => setText(sample.content)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:border-pink-200 dark:hover:border-pink-500/30 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {sample.icon}
            {sample.title}
          </button>
        ))}
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
