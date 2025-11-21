import React, { useState, useEffect } from 'react';
import { GeneratedPrompt } from '../types';
import { Copy, Check, Edit3, FileText } from 'lucide-react';

interface PromptCardProps {
  prompt: GeneratedPrompt;
  index: number;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, index }) => {
  const [copied, setCopied] = useState(false);
  const [fullText, setFullText] = useState(prompt.fullPrompt);

  useEffect(() => {
    setFullText(prompt.fullPrompt);
  }, [prompt]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="group bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 border border-slate-100 overflow-hidden">
      {/* Card Header */}
      <div className="bg-white px-8 py-5 border-b border-slate-50 flex justify-between items-center relative">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-slate-900/20">
            {index + 1}
          </div>
          <div>
            <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Variação</span>
            <span className="text-base font-bold text-slate-800 tracking-tight">
              {prompt.title}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wide mb-1">
            {prompt.strategy}
          </span>
        </div>
      </div>

      <div className="p-8 pt-6">
        <div className="space-y-3">
          <div className="flex items-end justify-between mb-2">
             <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 select-none">
               <FileText size={14} /> Roteiro Unificado (PT-BR + Visual)
             </label>
             <div className="flex gap-2">
                <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  Veo3/Sora Ready
                </span>
             </div>
          </div>
          
          <div className="relative group/textarea">
            {/* 5. Monospace Font for clearer Code/Script reading */}
            <textarea
              value={fullText}
              onChange={(e) => setFullText(e.target.value)}
              spellCheck={false}
              className="w-full bg-slate-50 text-slate-700 p-6 rounded-2xl text-[13px] leading-relaxed min-h-[450px] font-mono resize-y focus:ring-2 focus:ring-orange-500/20 outline-none border border-slate-200 focus:border-orange-400 transition-all shadow-inner selection:bg-orange-200 selection:text-orange-900"
            />
            
            {/* Copy Button Overlay - refined */}
            <div className="absolute top-4 right-4 z-10">
                <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-lg transform active:scale-95 border ${
                    copied 
                    ? 'bg-emerald-500 border-emerald-600 text-white translate-y-0' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-orange-200 hover:text-orange-600 hover:shadow-orange-500/10'
                }`}
                >
                {copied ? (
                    <>
                    <Check size={14} strokeWidth={3} /> <span className="uppercase tracking-wider">Copiado!</span>
                    </>
                ) : (
                    <>
                    <Copy size={14} /> <span className="uppercase tracking-wider">Copiar Prompt</span>
                    </>
                )}
                </button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 px-1">
            <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
               <Edit3 size={12} /> Você pode editar o texto acima antes de copiar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};