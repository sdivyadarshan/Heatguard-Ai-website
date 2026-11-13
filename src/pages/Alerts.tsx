import React, { useState } from 'react';
import { useSimulation } from '../store/useSimulation';
import { useCitizenStore } from '../store/useCitizenStore';
import { 
  BellRing, 
  AlertOctagon, 
  AlertTriangle, 
  ShieldAlert, 
  Building, 
  HeartHandshake, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Users, 
  ExternalLink,
  Flame,
  Check,
  Send,
  MessageSquare,
  Smartphone,
  Radio,
  Share2,
  FileCode,
  Copy,
  Layers,
  ArrowRight
} from 'lucide-react';
import ProvenanceBadge from '../components/ProvenanceBadge';
import WhatsAppAlertDispatcher from '../components/WhatsAppAlertDispatcher';
import { format } from 'date-fns';

interface AlertItem {
  id: string;
  level: 'RED' | 'ORANGE' | 'YELLOW';
  title: string;
  wardName: string;
  affectedPopulation: number;
  outdoorWorkers: number;
  wbgt: number;
  timestamp: string;
  department: 'Labor & Employment' | 'Public Health' | 'Disaster Management' | 'Municipal Corporation' | 'Transport';
  immediateAction: string;
  status: 'PENDING' | 'ACKNOWLEDGED' | 'DEPLOYED';
}

export default function Alerts() {
  const { cityMetrics, currentTime, wards } = useSimulation();
  const { contacts } = useCitizenStore();

  const [selectedTargetWard, setSelectedTargetWard] = useState<string>('Royapuram');

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'ALT-2024-0891',
      level: 'RED',
      title: 'Severe Uncompensable Thermal Stress Hazard',
      wardName: 'Royapuram (Ward 049)',
      affectedPopulation: 142000,
      outdoorWorkers: 68160,
      wbgt: 33.4,
      timestamp: '11:30 IST Today',
      department: 'Labor & Employment',
      immediateAction: 'Enforce statutory labor stoppage for outdoor port & construction workers. Inspect shipyard yards.',
      status: 'PENDING',
    },
    {
      id: 'ALT-2024-0892',
      level: 'RED',
      title: 'Informal Settlement Heat Trap & Tin Roof Critical',
      wardName: 'Tondiarpet (Ward 038)',
      affectedPopulation: 178000,
      outdoorWorkers: 74760,
      wbgt: 33.1,
      timestamp: '11:45 IST Today',
      department: 'Disaster Management',
      immediateAction: 'Deploy GCC Emergency Water Bowsers & activate Community Air-Cooled Sanctuaries.',
      status: 'PENDING',
    },
    {
      id: 'ALT-2024-0893',
      level: 'ORANGE',
      title: 'Geriatric Cohort Dehydration & Heat Exhaustion Wave',
      wardName: 'Mylapore (Ward 122)',
      affectedPopulation: 156000,
      outdoorWorkers: 28080,
      wbgt: 31.8,
      timestamp: '12:00 IST Today',
      department: 'Public Health',
      immediateAction: 'Mobilize UPHC medical officers and ASHA workers for door-to-door ORS electrolyte delivery to senior citizens.',
      status: 'ACKNOWLEDGED',
    },
    {
      id: 'ALT-2024-0894',
      level: 'ORANGE',
      title: 'Industrial Heat Island Microclimate Surge',
      wardName: 'Manali (Ward 015)',
      affectedPopulation: 92000,
      outdoorWorkers: 47840,
      wbgt: 32.2,
      timestamp: '12:15 IST Today',
      department: 'Municipal Corporation',
      immediateAction: 'Mandate shaded hydration halts along MRL refinery transport corridors.',
      status: 'PENDING',
    },
    {
      id: 'ALT-2024-0895',
      level: 'YELLOW',
      title: 'Public Transit Terminal Extreme Exposure Alert',
      wardName: 'Central / George Town (Ward 058)',
      affectedPopulation: 110000,
      outdoorWorkers: 49500,
      wbgt: 31.2,
      timestamp: '12:30 IST Today',
      department: 'Transport',
      immediateAction: 'Erect tensile green sunshades and misting fans at Chennai Central bus terminus.',
      status: 'DEPLOYED',
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'RED' | 'ORANGE' | 'YELLOW'>('ALL');

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a));
  };

  const handleDeploy = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'DEPLOYED' } : a));
  };

  const filteredAlerts = alerts.filter(a => activeFilter === 'ALL' || a.level === activeFilter);
  const redCount = alerts.filter(a => a.level === 'RED').length;
  const orangeCount = alerts.filter(a => a.level === 'ORANGE').length;
  const yellowCount = alerts.filter(a => a.level === 'YELLOW').length;

  return (
    <div className="max-w-[1680px] mx-auto space-y-8 font-sans pb-16">
      {/* Header Card */}
      <div className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Early Warning & Public Advisory Dispatch Hub
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated impact-based health warnings, direct WhatsApp & SMS queues, and CAP protocol feeds
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ProvenanceBadge type="MODELLED" source="NDMA & IMD Real-Time" />
          <div className="px-4 py-2 bg-[#0e1424] border border-slate-800 rounded-2xl text-xs font-mono text-slate-300">
            {format(currentTime, 'PP · HH:mm')} IST
          </div>
        </div>
      </div>

      {/* AUTOMATED MULTILINGUAL SMS & WHATSAPP BROADCAST SYSTEM */}
      <WhatsAppAlertDispatcher initialWard={selectedTargetWard} />

      {/* TRIAGE STATUS FILTER STRIP (Crypto Cards Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`p-6 rounded-3xl border text-left transition-all duration-200 ${
            activeFilter === 'ALL' 
              ? 'bg-[#151c30] border-cyan-500/50 shadow-lg shadow-cyan-950/20' 
              : 'bg-[#121826] border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <span className="text-xs text-slate-400 uppercase font-semibold block">Total Active Directives</span>
          <div className="text-3xl font-extrabold text-white font-mono mt-2">{alerts.length}</div>
          <span className="text-xs text-slate-500 mt-1 block">Across All Wards</span>
        </button>

        <button
          onClick={() => setActiveFilter('RED')}
          className={`p-6 rounded-3xl border text-left transition-all duration-200 ${
            activeFilter === 'RED' 
              ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-950/20' 
              : 'bg-[#121826] border-slate-800/80 hover:border-red-500/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-400 uppercase font-semibold">Stage III (Red Protocol)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          </div>
          <div className="text-3xl font-extrabold text-red-400 font-mono mt-2">{redCount} Critical</div>
          <span className="text-xs text-red-400/80 mt-1 block">Immediate Life Safety Risk</span>
        </button>

        <button
          onClick={() => setActiveFilter('ORANGE')}
          className={`p-6 rounded-3xl border text-left transition-all duration-200 ${
            activeFilter === 'ORANGE' 
              ? 'bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-950/20' 
              : 'bg-[#121826] border-slate-800/80 hover:border-orange-500/30'
          }`}
        >
          <span className="text-xs text-orange-400 uppercase font-semibold">Stage II (Orange Protocol)</span>
          <div className="text-3xl font-extrabold text-orange-400 font-mono mt-2">{orangeCount} Severe</div>
          <span className="text-xs text-orange-400/80 mt-1 block">Pre-Emptive Measures</span>
        </button>

        <button
          onClick={() => setActiveFilter('YELLOW')}
          className={`p-6 rounded-3xl border text-left transition-all duration-200 ${
            activeFilter === 'YELLOW' 
              ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-950/20' 
              : 'bg-[#121826] border-slate-800/80 hover:border-amber-500/30'
          }`}
        >
          <span className="text-xs text-amber-400 uppercase font-semibold">Stage I (Yellow Protocol)</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-2">{yellowCount} Advisory</div>
          <span className="text-xs text-amber-400/80 mt-1 block">General Public Awareness</span>
        </button>
      </div>

      {/* DISPATCH QUEUE ITEMS */}
      <div className="space-y-4">
        {filteredAlerts.map((item) => {
          const isRed = item.level === 'RED';
          const isOrange = item.level === 'ORANGE';

          return (
            <div 
              key={item.id}
              className={`p-6 rounded-3xl border transition-all duration-200 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                isRed 
                  ? 'bg-[#14121e] border-red-500/30 hover:border-red-500/50' 
                  : isOrange
                  ? 'bg-[#16141a] border-orange-500/30 hover:border-orange-500/50'
                  : 'bg-[#121826] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border ${
                    isRed ? 'bg-red-500/15 text-red-400 border-red-500/30' :
                    isOrange ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    {item.level} DIRECTIVE
                  </span>
                  <span className="text-xs text-slate-400 font-mono font-bold">{item.id}</span>
                  <span className="text-xs text-slate-500">· {item.timestamp}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 flex-wrap">
                    <span>Target: <strong className="text-slate-200">{item.wardName}</strong></span>
                    <span>WBGT: <strong className="text-amber-400 font-mono">{item.wbgt}°C</strong></span>
                    <span>Exposed Labor: <strong className="text-red-400 font-mono">{item.outdoorWorkers.toLocaleString()}</strong></span>
                  </div>
                </div>

                <div className="p-4 bg-[#0e1424] rounded-2xl border border-slate-800 text-xs">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider block mb-1">
                    Action Directive ({item.department})
                  </span>
                  <p className="text-slate-200 leading-relaxed">{item.immediateAction}</p>
                </div>
              </div>

              {/* Status & Deploy Buttons */}
              <div className="flex flex-row lg:flex-col items-end justify-between gap-3 shrink-0">
                <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase border ${
                  item.status === 'DEPLOYED' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                  item.status === 'ACKNOWLEDGED' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' :
                  'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse'
                }`}>
                  {item.status}
                </span>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      setSelectedTargetWard(item.wardName.split(' ')[0]);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-950/30"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Target WhatsApp</span>
                  </button>

                  {item.status === 'PENDING' && (
                    <button
                      onClick={() => handleAcknowledge(item.id)}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
                    >
                      Acknowledge
                    </button>
                  )}
                  {item.status !== 'DEPLOYED' && (
                    <button
                      onClick={() => handleDeploy(item.id)}
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-red-950/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Deploy</span>
                    </button>
                  )}
                  {item.status === 'DEPLOYED' && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4" /> Units Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
