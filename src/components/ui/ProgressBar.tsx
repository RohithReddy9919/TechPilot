import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ completed, total, className = '', showLabel = true }: ProgressBarProps) {
  const safeTotal = total > 0 ? total : 1;
  const pct = Math.min(100, Math.round((completed / safeTotal) * 100));

  // Color based on progress
  const fillColor =
    pct >= 100
      ? 'bg-green-500'
      : pct >= 60
      ? 'bg-[#E8541A]'
      : 'bg-[#1A2F2F]';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[#1A2F2F]/50 font-medium">
            {completed}/{total} milestones
          </span>
          <span className="text-xs font-semibold text-[#1A2F2F]/70">{pct}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-[#1A2F2F]/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${fillColor}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
