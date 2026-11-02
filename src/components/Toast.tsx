import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in pointer-events-none">
      <div className="bg-[#302B27] text-[#FFFFFF] border border-[#C6A77D]/40 shadow-2xl rounded-lg px-4 py-3 flex items-center gap-3 text-xs tracking-wide">
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#C6A77D]" />}
        {toast.type === 'alert' && <AlertCircle className="w-4 h-4 text-amber-400" />}
        {toast.type === 'info' && <Sparkles className="w-4 h-4 text-[#C6A77D]" />}
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
