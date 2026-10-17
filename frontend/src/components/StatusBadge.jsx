import React from 'react';
import { Activity, Clock, Compass, AlertCircle, CheckCircle2 } from 'lucide-react';

export const STATUS_CONFIG = {
  ongoing: {
    label: 'Current / Ongoing',
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    dot: 'bg-emerald-400',
    barBg: 'bg-emerald-500',
    icon: Activity,
    glow: 'shadow-emerald-500/20',
  },
  upcoming: {
    label: 'Upcoming Project',
    bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    dot: 'bg-cyan-400',
    barBg: 'bg-cyan-500',
    icon: Clock,
    glow: 'shadow-cyan-500/20',
  },
  future: {
    label: 'Future Project',
    bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    dot: 'bg-purple-400',
    barBg: 'bg-purple-500',
    icon: Compass,
    glow: 'shadow-purple-500/20',
  },
  pending: {
    label: 'Pending / Paused',
    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    dot: 'bg-amber-400',
    barBg: 'bg-amber-500',
    icon: AlertCircle,
    glow: 'shadow-amber-500/20',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    dot: 'bg-blue-400',
    barBg: 'bg-blue-500',
    icon: CheckCircle2,
    glow: 'shadow-blue-500/20',
  },
};

const StatusBadge = ({ status, size = 'sm' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ongoing;
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs gap-1.5',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
  }[size] || 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-sm backdrop-blur-sm ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
