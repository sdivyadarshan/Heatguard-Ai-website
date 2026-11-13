import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  MapPin, 
  ShieldAlert, 
  Send, 
  Zap, 
  Radio, 
  ThermometerSun, 
  FileText, 
  Users, 
  Database,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { useSimulation } from '../store/useSimulation';
import { useCitizenStore } from '../store/useCitizenStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { wards } = useSimulation();
  const { contacts } = useCitizenStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggled from parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredWards = wards.filter(w => 
    w.name.toLowerCase().includes(query.toLowerCase()) || 
    w.zone.toLowerCase().includes(query.toLowerCase())
  );

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.phone.includes(query) ||
    c.wardName.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectWard = (wardName: string) => {
    navigate(`/vulnerability?ward=${encodeURIComponent(wardName)}`);
    onClose();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0d1527] border border-cyan-500/40 rounded-xl shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100 font-sans">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-[#090e1c]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Wards, Threat Vectors, Verified Contacts, Action Plans... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 font-mono text-xs">
          {/* Quick Actions */}
          <div>
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3 h-3" /> Quick Command Directives
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <button
                onClick={() => handleNavigate('/sources')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/50 text-left transition group"
              >
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                  <div>
                    <div className="font-bold text-slate-200 group-hover:text-cyan-300">WhatsApp Zero-Click Broadcast</div>
                    <div className="text-[10px] text-slate-500">Twilio Automated Pipeline</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
              </button>

              <button
                onClick={() => handleNavigate('/action-plan')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/50 text-left transition group"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-400 group-hover:scale-110 transition" />
                  <div>
                    <div className="font-bold text-slate-200 group-hover:text-cyan-300">NDMA Heat Action Plan</div>
                    <div className="text-[10px] text-slate-500">Stage III Red Protocol Dispatch</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
              </button>

              <button
                onClick={() => handleNavigate('/simulation')}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/50 text-left transition group sm:col-span-2"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                  <div>
                    <div className="font-bold text-slate-200 group-hover:text-cyan-300">'What-If' Heat Index & WBGT Simulator</div>
                    <div className="text-[10px] text-slate-500">Real-time Ambient Temp & Humidity Slider Laboratory</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Wards & Hotspot Vectors */}
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-cyan-400" /> Monitored Wards ({filteredWards.length})
            </div>
            <div className="space-y-1">
              {filteredWards.slice(0, 6).map((ward) => (
                <button
                  key={ward.id}
                  onClick={() => handleSelectWard(ward.name)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/60 text-left transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${
                      ward.riskCategory === 'Extreme' ? 'bg-red-500 shadow-[0_0_6px_#ef4444]' :
                      ward.riskCategory === 'High' ? 'bg-orange-500' :
                      ward.riskCategory === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></span>
                    <span className="font-bold text-slate-200">{ward.name}</span>
                    <span className="text-[10px] text-slate-500">({ward.zone})</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-slate-400">WBGT: <strong className="text-amber-400">{ward.wbgt}°C</strong></span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      ward.riskCategory === 'Extreme' ? 'bg-red-950 text-red-300 border border-red-800' :
                      ward.riskCategory === 'High' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {ward.riskCategory}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Verified Contacts */}
          {filteredContacts.length > 0 && (
            <div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Twilio Verified Nodes ({filteredContacts.length})
              </div>
              <div className="space-y-1">
                {filteredContacts.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleNavigate('/sources')}
                    className="cursor-pointer flex items-center justify-between p-2 rounded-lg bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/40 text-left transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200 font-bold">{c.name}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">{c.phone}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{c.wardName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-2.5 bg-[#090e1c] border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Navigate with <kbd className="px-1 bg-slate-800 rounded text-slate-400">↑</kbd> <kbd className="px-1 bg-slate-800 rounded text-slate-400">↓</kbd> · Select with <kbd className="px-1 bg-slate-800 rounded text-slate-400">↵</kbd></span>
          <span className="text-cyan-400">CyFocus · HeatGuard SOC Command</span>
        </div>
      </div>
    </div>
  );
}
