import React from 'react';
import { ProjectStage } from '../../types';

type BadgeVariant = ProjectStage | 'in-progress' | 'idea';

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
  children?: React.ReactNode;
}

interface BadgeConfig {
  dot: string;
  bg: string;
  text: string;
  label: string;
}

const badgeConfig: Record<string, BadgeConfig> = {
  idea: {
    dot: 'bg-purple-400',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    label: 'Idea',
  },
  planning: {
    dot: 'bg-blue-400',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    label: 'Planning',
  },
  'in-progress': {
    dot: 'bg-orange-400',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    label: 'In Progress',
  },
  design: {
    dot: 'bg-pink-400',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
    label: 'Design',
  },
  development: {
    dot: 'bg-teal-500',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    label: 'Development',
  },
  testing: {
    dot: 'bg-yellow-400',
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    label: 'Testing',
  },
  deployment: {
    dot: 'bg-green-400',
    bg: 'bg-green-50',
    text: 'text-green-700',
    label: 'Deployment',
  },
};

export function Badge({ variant, className = '', children }: BadgeProps) {
  const cfg = badgeConfig[variant] ?? badgeConfig.idea;

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        cfg.bg,
        cfg.text,
        className,
      ].join(' ')}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {children ?? cfg.label}
    </span>
  );
}

export default Badge;
