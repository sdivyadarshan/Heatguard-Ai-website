import React, { useState } from 'react';
import { useSimulation } from '../store/useSimulation';
import { 
  ShieldAlert, 
  Thermometer, 
  Droplets, 
  Activity, 
  Users, 
  AlertOctagon, 
  ChevronRight, 
  ArrowUpRight, 
  Clock, 
  Wind, 
  Sun, 
  Layers, 
  HeartHandshake, 
  Flame, 
  Info, 
  Building, 
  CheckCircle2, 
  Calendar,
  Hospital,
  TrendingUp,
  Radio,
  ArrowRight,
  Shield,
  Zap,
  Send,
  AlertTriangle,
  FileCheck2,
  BellRing,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Sparkles,
  X
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Navigation } from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../utils/geoUtils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip } from 'recharts';
import ProvenanceBadge from '../components/ProvenanceBadge';
import { OFFICIAL_5DAY_FORECAST } from '../data/officialDatasets';
import { WardState } from '../types';

export default function Dashboard() {
  const { cityMetrics, currentTime, stage, wards, activeScenario } = useSimulation();
  const [selectedWard, setSelectedWard] = useState<WardState | null>(wards[0] || null);
  const [incidentFilter, setIncidentFilter] = useState<'ALL' | 'CRITICAL' | 'DISPATCH'>('ALL');
  const navigate = useNavigate();

  // Intraday thermal curve sparkline for hero balance card
  const sparklineData = [
    { time: '06:00', temp: 28, wbgt: 26 },
    { time: '08:00', temp: 31, wbgt: 28 },
    { time: '10:00', temp: 35, wbgt: 31 },
    { time: '12:00', temp: 39, wbgt: 33 },
    { time: '14:00', temp: 42, wbgt: 35 },
    { time: '16:00', temp: 40, wbgt: 33 },
    { time: '18:00', temp: 36, wbgt: 30 },
    { time: '20:00', temp: 33, wbgt: 28 },
  ];

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'Extreme': return '#ef4444'; // Red
      case 'High': return '#f97316'; // Orange
      case 'Moderate': return '#eab308'; // Amber
      default: return '#10b981'; // Emerald
    }
  };

  const getRiskBadge = (category: string) => {
    switch (category) {
      case 'Extreme': return 'bg-red-500/15 border-red-500/30 text-red-400';
      case 'High': return 'bg-orange-500/15 border-orange-500/30 text-orange-400';
      case 'Moderate': return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
      default: return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
    }
  };

  const criticalWardsList = wards.filter(w => w.riskCategory === 'Extreme' || w.riskCategory === 'High');

  // Real-time Recent Activity Stream (Crypto Transaction style)
  const incidentFeed = [
    {
      id: 'TX-01',
      time: '13:15 IST',
      type: 'CRITICAL',
      title: 'WBGT Thermal Anomaly Breached',
      location: 'Royapuram (Zone 5)',
      description: 'WBGT peaked at 34.8°C with 82% humidity. Mandatory outdoor labor halt enforced.',
      actionLabel: 'Dispatch Alert',
      actionRoute: '/sources'
    },
    {
      id: 'TX-02',
      time: '13:02 IST',
      type: 'DISPATCH',
      title: 'WhatsApp Emergency Broadcast Delivered',
      location: 'North Chennai Cluster',
      description: 'Zero-click dispatch executed via Twilio live gateway to verified municipal emergency contacts.',
      actionLabel: 'View Log',
      actionRoute: '/sources'
    },
    {
      id: 'TX-03',
      time: '12:45 IST',
      type: 'CRITICAL',
      title: 'Hospital Emergency Surge Alert',
      location: 'Stanley Medical & RGGGH',
      description: 'Triage multiplier reached 2.8x baseline. 24 cooling hydration beds mobilized.',
      actionLabel: 'Review Triage',
      actionRoute: '/action-plan'
    },
    {
      id: 'TX-04',
      time: '12:10 IST',
      type: 'DISPATCH',
      title: 'Water Tanker & ORS Point Deployed',
      location: 'Tondiarpet Market Sector',
      description: 'GCC emergency mobile drinking water supply vehicle stationed at sector intersection.',
      actionLabel: 'Check Protocol',
      actionRoute: '/action-plan'
    }
  ];

  const filteredIncidents = incidentFeed.filter(inc => {
    if (incidentFilter === 'ALL') return true;
    return inc.type === incidentFilter;
  });

  return (
    <div className="max-w-[1680px] mx-auto space-y-8 font-sans pb-16">
      {/* 1. HERO PORTFOLIO / HEAT RISK VALUE CARD (Figma Crypto Dashboard Hero Style) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#131b2e] via-[#111827] to-[#151c30] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-l from-cyan-500/10 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left: Overall Threat Index (Like Total Balance in Crypto) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Live Intelligence Feed
              </span>
              <ProvenanceBadge 
                type={activeScenario.mode === 'HISTORICAL_REPLAY' ? 'HISTORICAL_OFFICIAL' : 'PROTOTYPE'} 
                source="IMD Synoptic & Census" 
              />
            </div>

            <div>
              <div className="text-xs uppercase font-medium tracking-wider text-slate-400 mb-1">
                Metropolitan Heat Health Risk Index
              </div>
              <div className="flex items-baseline gap-4 flex-wrap">
                <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {cityMetrics.avgRiskScore}
                  <span className="text-xl md:text-2xl text-slate-400 font-normal ml-1">/ 100</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/15 border border-red-500/30 text-red-400 rounded-full text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+3.8% in 24h</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Thermal conditions have breached uncompensable strain levels in North Chennai. Wet-bulb globe temperatures peak at <strong className="text-amber-400 font-mono">{cityMetrics.avgWbgt}°C</strong> across key industrial zones.
            </p>

            {/* Hero Fast Action Triggers */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <Link
                to="/sources"
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-xl border border-emerald-400/40 transition shadow-lg shadow-emerald-950/40 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Zero-Click WhatsApp Dispatch</span>
              </Link>
              <Link
                to="/action-plan"
                className="px-5 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span>Heat Action Plan Protocols</span>
              </Link>
            </div>
          </div>

          {/* Right: Intraday Thermal Curve Sparkline */}
          <div className="lg:col-span-6 bg-[#0e1424]/80 border border-slate-800/80 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-semibold text-white">Intraday WBGT & Ambient Thermal Curve</span>
                <p className="text-[11px] text-slate-400">Peak strain window: 12:00 – 16:00 IST</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2.5 h-1 bg-amber-400 rounded-full"></span> WBGT
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-1 bg-cyan-400 rounded-full"></span> Temp
                </span>
              </div>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWbgt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[20, 45]} tickLine={false} />
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: '#131b2e', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="wbgt" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWbgt)" />
                  <Area type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={1.5} fillOpacity={1} fill="url(#colorTemp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 CRYPTO-STYLE ASSET / METRIC CARDS (Bitcoin/Ethereum Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: WBGT Index */}
        <div className="bg-[#121826] border border-slate-800/80 hover:border-amber-500/40 p-6 rounded-2xl shadow-lg transition-all duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
              <Activity className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
              ISO 7243
            </span>
          </div>
          <div className="text-xs font-medium text-slate-400 mb-1">
            WBGT Heat Stress Index
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white font-mono">
              {cityMetrics.avgWbgt}°C
            </div>
            <span className="text-xs text-amber-400 font-semibold">
              +2.8°C today
            </span>
          </div>
          <div className="text-xs text-red-400 font-medium mt-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Uncompensable Heat Strain
          </div>
        </div>

        {/* Card 2: Hotspot Wards in Danger */}
        <div className="bg-[#121826] border border-slate-800/80 hover:border-red-500/40 p-6 rounded-2xl shadow-lg transition-all duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-105 transition">
              <Flame className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
              Red Alert
            </span>
          </div>
          <div className="text-xs font-medium text-slate-400 mb-1">
            Critical Hotspots
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white font-mono">
              {cityMetrics.extremeRiskWardsCount} <span className="text-base text-slate-500 font-normal">/ {wards.length} Wards</span>
            </div>
            <span className="text-xs text-red-400 font-semibold">
              +{cityMetrics.highRiskWardsCount} High
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-3 truncate">
            Top: <strong className="text-slate-200">{criticalWardsList.map(w => w.name).slice(0, 2).join(', ')}</strong>
          </div>
        </div>

        {/* Card 3: Vulnerable Citizens */}
        <div className="bg-[#121826] border border-slate-800/80 hover:border-purple-500/40 p-6 rounded-2xl shadow-lg transition-all duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
              <Users className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
              Census '21
            </span>
          </div>
          <div className="text-xs font-medium text-slate-400 mb-1">
            Exposed Citizens
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white font-mono">
              {(cityMetrics.totalExposedPopulation / 1000000).toFixed(2)}M
            </div>
            <span className="text-xs text-purple-400 font-semibold">
              Surveillance Active
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-3">
            <strong className="text-amber-400 font-mono">{cityMetrics.totalExposedWorkers.toLocaleString()}</strong> outdoor laborers
          </div>
        </div>

        {/* Card 4: Hospital Surge Multiplier */}
        <div className="bg-[#121826] border border-slate-800/80 hover:border-blue-500/40 p-6 rounded-2xl shadow-lg transition-all duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
              <Hospital className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              DLNM Model
            </span>
          </div>
          <div className="text-xs font-medium text-slate-400 mb-1">
            Hospital Surge Factor
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-white font-mono">
              {cityMetrics.avgHospitalSurgeFactor}×
            </div>
            <span className="text-xs text-blue-400 font-semibold">
              Surge Protocol
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-3">
            Excess mortality risk: <strong className="text-red-400">↑ {cityMetrics.avgMortalityRiskElevation}%</strong>
          </div>
        </div>
      </div>

      {/* 3. CORE SPLIT SECTION: INTERACTIVE THREAT RADAR MAP + LIVE RECENT ACTIVITY (Cols 8 : 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Interactive Geospatial Map Card */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col">
            {/* Map Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/60 mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  Metropolitan Risk Radar & Microclimate Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time geospatial hazard surveillance across Chennai's 15 administrative zones
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link 
                  to="/map" 
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <span>Full Screen Map</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Map Canvas */}
            <div className="relative h-[440px] rounded-2xl overflow-hidden bg-[#0d121f] border border-slate-800">
              <MapContainer 
                center={[13.06, 80.24]} 
                zoom={11} 
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {wards.map((ward) => {
                  const isSelected = selectedWard?.id === ward.id;
                  const riskColor = getRiskColor(ward.riskCategory);

                  return (
                    <CircleMarker
                      key={ward.id}
                      center={[ward.lat, ward.lng]}
                      radius={ward.riskCategory === 'Extreme' ? 24 : ward.riskCategory === 'High' ? 18 : 13}
                      pathOptions={{ 
                        fillColor: riskColor,
                        fillOpacity: isSelected ? 0.95 : 0.65,
                        color: isSelected ? '#ffffff' : riskColor,
                        weight: isSelected ? 3 : 1.5
                      }}
                      eventHandlers={{
                        click: () => setSelectedWard(ward),
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
                        <div className="text-xs p-1 font-sans">
                          <div className="font-bold text-white">{ward.name} ({ward.id})</div>
                          <div className="text-xs text-slate-300 mt-0.5">
                            Risk Level: <span className="font-bold uppercase" style={{ color: riskColor }}>{ward.riskCategory} ({ward.riskScore}/100)</span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Temp: {ward.temperature}°C | WBGT: {ward.wbgt}°C
                          </div>
                        </div>
                      </Tooltip>
                    </CircleMarker>
                  );
                })}
              </MapContainer>

              {/* In-Map Inspector Card Overlay */}
              {selectedWard && (
                <div className="absolute top-5 left-5 z-[400] bg-[#121826]/95 backdrop-blur-xl border border-slate-700/80 p-5 rounded-2xl max-w-sm shadow-2xl pointer-events-auto">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">{selectedWard.zone}</span>
                      <h4 className="text-sm font-bold text-white">{selectedWard.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getRiskBadge(selectedWard.riskCategory)}`}>
                        {selectedWard.riskCategory}
                      </span>
                      <button
                        onClick={() => setSelectedWard(null)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Close popup to view map fully"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 mb-3">
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase font-medium">Temperature / Humidity</span>
                      <span className="font-bold text-white">{selectedWard.temperature}°C / {selectedWard.humidity}%</span>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase font-medium">WBGT Thermal Stress</span>
                      <span className="font-bold text-amber-400">{selectedWard.wbgt}°C</span>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase font-medium">Outdoor Laborers</span>
                      <span className="font-bold text-slate-200">{selectedWard.outdoorWorkerPercentage}%</span>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase font-medium">Excess Mortality</span>
                      <span className="font-bold text-red-400">↑ {selectedWard.estimatedMortalityRiskElevation}%</span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                      Primary: <span className="text-amber-400 font-medium">{selectedWard.primaryVulnerabilityDrivers[0]}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={getGoogleMapsDirectionsUrl(selectedWard.name, selectedWard.lat, selectedWard.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-sm"
                        title="Open in Google Maps for Turn-by-Turn Navigation"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Give Direction</span>
                      </a>
                      <Link
                        to="/sources"
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Alert</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ward Quick Selector Chips */}
            <div className="pt-4 flex items-center gap-2 overflow-x-auto scrollbar-thin">
              <span className="text-xs font-semibold text-slate-400 uppercase shrink-0 mr-1">
                Hotspot Nodes:
              </span>
              {criticalWardsList.map(cw => (
                <button
                  key={cw.id}
                  onClick={() => setSelectedWard(cw)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-2 whitespace-nowrap ${
                    selectedWard?.id === cw.id 
                      ? 'bg-red-500/20 border border-red-500/50 text-white shadow-sm' 
                      : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{cw.name}</span>
                  <span className="text-red-400 font-mono font-bold">({cw.riskScore})</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5-Day Forward Outlook Card */}
          <div className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">5-Day Predictive Health Outlook</h3>
                  <p className="text-xs text-slate-400">IMD NWP Atmospheric Projection & Hospital Surge Forecast</p>
                </div>
              </div>
              <Link
                to="/outlook"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                Detailed Outlook <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {OFFICIAL_5DAY_FORECAST.map((day, idx) => {
                const isRed = day.riskCategory === 'Extreme';
                const isOrange = day.riskCategory === 'High';

                return (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                      isRed ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/60' :
                      isOrange ? 'bg-orange-500/5 border-orange-500/30 hover:border-orange-500/60' :
                      'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-semibold text-white">{day.day}</span>
                        <span>{day.date.split(' ').slice(0, 2).join(' ')}</span>
                      </div>

                      <div className="flex items-baseline justify-between my-2">
                        <div className="text-2xl font-extrabold text-white font-mono">
                          {day.maxTemp}°C
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRiskBadge(day.riskCategory)}`}>
                          {day.riskCategory}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                        <div className="flex justify-between">
                          <span>WBGT Peak:</span>
                          <span className="text-amber-400 font-bold font-mono">{day.wbgtMax}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Surge:</span>
                          <span className="text-cyan-400 font-bold font-mono">
                            {idx === 2 ? '2.4x' : idx === 1 ? '2.1x' : idx === 0 ? '1.8x' : '1.3x'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                      <span className="text-slate-500 block text-[10px] uppercase font-medium">Directive</span>
                      {day.recommendedTrigger}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Live Activity, Top Wards & Compliance */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Recent Activity Stream (Crypto Transaction History style) */}
          <div className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <BellRing className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Live Dispatches & Alerts</h3>
              </div>

              <div className="flex items-center gap-1 text-xs">
                {(['ALL', 'CRITICAL', 'DISPATCH'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setIncidentFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg transition text-xs ${
                      incidentFilter === tab ? 'bg-cyan-500/15 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* List of activity items */}
            <div className="space-y-3">
              {filteredIncidents.map((incident) => {
                const isCritical = incident.type === 'CRITICAL';
                const isDispatch = incident.type === 'DISPATCH';

                return (
                  <div
                    key={incident.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-white flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`}></span>
                        {incident.location}
                      </span>
                      <span className="text-slate-400 text-[11px]">{incident.time}</span>
                    </div>

                    <div className="font-semibold text-slate-200 text-xs mb-1">
                      {incident.title}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {incident.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isCritical ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {incident.type}
                      </span>

                      <button
                        onClick={() => navigate(incident.actionRoute)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                      >
                        {incident.actionLabel} <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <Link to="/warnings" className="text-xs text-slate-400 hover:text-slate-200 font-medium inline-flex items-center gap-1">
                View all alert history <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Top High-Risk Wards (Crypto Top Gainers / Tokens Style) */}
          <div className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold text-white">Top Thermal Threat Hotspots</h3>
              </div>
              <Link to="/vulnerability" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
                See All
              </Link>
            </div>

            <div className="space-y-3">
              {wards.slice(0, 4).map((w, idx) => (
                <div 
                  key={w.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-white text-xs">{w.name}</div>
                      <div className="text-[11px] text-slate-400">{w.zone} · {w.outdoorWorkerPercentage}% Labor</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-bold text-xs text-white">
                        {w.wbgt}°C <span className="text-[10px] text-slate-400">WBGT</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block mt-0.5 ${getRiskBadge(w.riskCategory)}`}>
                        {w.riskScore}/100
                      </span>
                    </div>

                    <a
                      href={getGoogleMapsDirectionsUrl(w.name, w.lat, w.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition"
                      title={`Open Google Maps directions to ${w.name}`}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Protocols Checklist */}
          <div className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">NDMA Protocol Status</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full">
                Stage III Active
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">Outdoor Labor Moratorium (12:00-15:30)</span>
                </div>
                <span className="text-emerald-400 font-semibold text-[11px]">Enforced</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">Mobile Water Tankers & ORS Sanctuaries</span>
                </div>
                <span className="text-emerald-400 font-semibold text-[11px]">48 Sites</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-200">Hospital Cooling Hydration Beds</span>
                </div>
                <span className="text-cyan-400 font-semibold text-[11px]">9 Hubs Ready</span>
              </div>
            </div>

            <Link
              to="/action-plan"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>Manage All Action Protocols</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
