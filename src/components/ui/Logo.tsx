import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
}

const sizeConfig = {
  sm: { icon: 28, font: 'text-sm', sub: 'text-[9px]', gap: 'gap-2' },
  md: { icon: 36, font: 'text-base', sub: 'text-[10px]', gap: 'gap-2.5' },
  lg: { icon: 48, font: 'text-xl', sub: 'text-xs', gap: 'gap-3' },
};

export function Logo({ size = 'md', dark = false }: LogoProps) {
  const cfg = sizeConfig[size];

  return (
    <div className={`flex items-center ${cfg.gap}`}>
      {/* Circular icon */}
      <div
        style={{ width: cfg.icon, height: cfg.icon }}
        className="rounded-full bg-[#1A2F2F] flex items-center justify-center flex-shrink-0 shadow-sm"
      >
        {/* Compass / navigation SVG */}
        <svg
          width={cfg.icon * 0.55}
          height={cfg.icon * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle */}
          <circle cx="12" cy="12" r="10" stroke="#E8541A" strokeWidth="1.5" />
          {/* Compass needle – north (orange) */}
          <polygon points="12,3 14,12 12,10 10,12" fill="#E8541A" />
          {/* Compass needle – south (white faded) */}
          <polygon points="12,21 14,12 12,14 10,12" fill="rgba(255,255,255,0.4)" />
          {/* Center dot */}
          <circle cx="12" cy="12" r="1.5" fill="#E8541A" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span
          className={`font-bold ${cfg.font} ${dark ? 'text-white' : 'text-[#1A2F2F]'}`}
          style={{ letterSpacing: '-0.01em' }}
        >
          TechPilot
        </span>
        <span
          className={`${cfg.sub} ${dark ? 'text-white/50' : 'text-[#1A2F2F]/50'} font-normal`}
        >
          by Rocky
        </span>
      </div>
    </div>
  );
}

export default Logo;
