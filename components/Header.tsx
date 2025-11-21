import React from 'react';
import { Video } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-md transform rotate-3">
            <Video size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Veo3 Prompts <span className="text-orange-500">Master</span></h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">JholtroMundo Edition</p>
          </div>
        </div>
        
        <div className="hidden md:flex flex-col items-end">
          <div className="text-xs font-bold bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 px-3 py-1.5 rounded-full border border-orange-200">
            @achadinhos_da_ellen
          </div>
        </div>
      </div>
    </header>
  );
};