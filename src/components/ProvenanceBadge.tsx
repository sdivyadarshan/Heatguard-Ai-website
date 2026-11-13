import React from 'react';
import { DataProvenanceType } from '../types';
import { ShieldCheck, Cpu, Database, HelpCircle } from 'lucide-react';

interface ProvenanceBadgeProps {
  type: DataProvenanceType;
  source?: string;
  className?: string;
  size?: 'sm' | 'xs';
}

export default function ProvenanceBadge({ type, source, className = '', size = 'xs' }: ProvenanceBadgeProps) {
  let label = '';
  let badgeStyle = '';
  let icon = null;

  switch (type) {
    case 'HISTORICAL_OFFICIAL':
      label = source ? `HISTORICAL OFFICIAL · ${source}` : 'HISTORICAL OFFICIAL DATA';
      badgeStyle = 'bg-sky-950/70 text-sky-300 border-sky-800/80 hover:border-sky-600';
      icon = <Database className="w-2.5 h-2.5 shrink-0 text-sky-400" />;
      break;
    case 'OFFICIAL':
      label = source ? `OFFICIAL DATA · ${source}` : 'OFFICIAL GOVT DATA';
      badgeStyle = 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80 hover:border-emerald-600';
      icon = <ShieldCheck className="w-2.5 h-2.5 shrink-0 text-emerald-400" />;
      break;
    case 'MODELLED':
      label = source ? `MODELLED · ${source}` : 'MODELLED · HeatGuard Risk Engine';
      badgeStyle = 'bg-indigo-950/70 text-indigo-300 border-indigo-800/80 hover:border-indigo-600';
      icon = <Cpu className="w-2.5 h-2.5 shrink-0 text-indigo-400" />;
      break;
    case 'ESTIMATED':
      label = source ? `ESTIMATED/MODELLED · ${source}` : 'ESTIMATED / MODELLED';
      badgeStyle = 'bg-purple-950/70 text-purple-300 border-purple-800/80 hover:border-purple-600';
      icon = <Cpu className="w-2.5 h-2.5 shrink-0 text-purple-400" />;
      break;
    case 'PROTOTYPE':
    default:
      label = source ? `PROTOTYPE DATA · ${source}` : 'PROTOTYPE DATA';
      badgeStyle = 'bg-amber-950/70 text-amber-300 border-amber-800/80 hover:border-amber-600';
      icon = <HelpCircle className="w-2.5 h-2.5 shrink-0 text-amber-400" />;
      break;
  }

  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[9px] px-1.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded-sm border transition-colors ${badgeStyle} ${sizeClass} ${className}`}
      title={`Data Provenance: ${label}`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </span>
  );
}
