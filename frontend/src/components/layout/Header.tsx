import React from 'react';
import { Activity } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-border bg-midnight/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[720px] mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity size={20} strokeWidth={2} className="text-signal" />
          <span className="text-[15px] font-semibold text-text-bright tracking-[-0.01em]">
            CardioPredict
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-[12px] font-medium text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-clearance" />
          Model ready
        </div>
      </div>
    </header>
  );
};
