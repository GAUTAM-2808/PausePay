import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const SpendPauseLogo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8 rounded-xl', symbol: 'text-base', font: 'text-base' },
    md: { box: 'w-10 h-10 rounded-2xl', symbol: 'text-xl', font: 'text-lg' },
    lg: { box: 'w-14 h-14 rounded-3xl', symbol: 'text-2xl', font: 'text-2xl' },
  };

  const current = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${current.box} relative flex items-center justify-center bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 shadow-lg shadow-teal-900/30 border border-teal-400/30 shrink-0 group`}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-teal-400/20 rounded-[inherit] blur-xs group-hover:bg-teal-300/30 transition-all" />
        
        {/* Logo Glyph: Rupee + Pause bars */}
        <div className="relative flex items-center justify-center font-black tracking-tight text-white select-none">
          <span className={`${current.symbol} font-extrabold text-white drop-shadow-sm mr-0.5`}>₹</span>
          <div className="flex items-center gap-0.5 ml-0.5">
            <span className="w-1 h-3.5 bg-amber-400 rounded-full shadow-xs" />
            <span className="w-1 h-3.5 bg-amber-400 rounded-full shadow-xs" />
          </div>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className={`font-extrabold tracking-tight text-white font-heading ${current.font}`}>
              Spend<span className="text-teal-400">Pause</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              IN
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium -mt-0.5">
            Before you spend, pause.
          </span>
        </div>
      )}
    </div>
  );
};
