import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { useSimulation } from '../store/useSimulation';
import { 
  ShieldAlert, 
  Users, 
  Thermometer, 
  Wind, 
  Droplets, 
  Layers, 
  Hospital, 
  Flame, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Sliders,
  Send,
  MessageSquare,
  Radio,
  Check,
  X,
  MapPin,
  ArrowUpRight,
  Activity,
  HeartHandshake
} from 'lucide-react';
import { WardState } from '../types';
import ProvenanceBadge from '../components/ProvenanceBadge';
import { Link } from 'react-router-dom';

export default function HeatRiskMap() {
  const { wards, stage, cityMetrics } = useSimulation();
  const [selectedWard, setSelectedWard] = useState<WardState | null>(wards[0] || null);
  const [activeLayer, setActiveLayer] = useState<'combined' | 'thermal' | 'vulnerability'>('combined');
  const [showCoolingCenters, setShowCoolingCenters] = useState(true);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Emergency medical cooling assets
  const emergencyAssets = [
    { id: 'cc-1', name: 'Stanley Medical College & Cooling Shelter', type: 'hospital', lat: 13.1098, lng: 80.2855, ward: 'Royapuram' },
    { id: 'cc-2', name: 'Rajiv Gandhi Government General Hospital', type: 'hospital', lat: 13.0805, lng: 80.2780, ward: 'Central' },
    { id: 'cc-3', name: 'Tondiarpet Community Cooling Hub #4', type: 'shelter', lat: 13.1310, lng: 80.2910, ward: 'Tondiarpet' },
    { id: 'cc-4', name: 'Manali Industrial Hydration & First Aid Post', type: 'shelter', lat: 13.1720, lng: 80.2580, ward: 'Manali' },
    { id: 'cc-5', name: 'Ambattur Estate Worker Rest Facility', type: 'shelter', lat: 13.1180, lng: 80.1420, ward: 'Ambattur' },
    { id: 'cc-6', name: 'Perungudi OMR Migrant Labor Cooling Shed', type: 'shelter', lat: 12.9610, lng: 80.2410, ward: 'Perungudi' },
  ];

  const getMarkerColor = (ward: WardState) => {
    if (activeLayer === 'thermal') {
      if (ward.wbgt >= 32.5) return '#ef4444';
      if (ward.wbgt >= 30.5) return '#f97316';
      if (ward.wbgt >= 28.0) return '#eab308';
      return '#10b981';
    }
    if (activeLayer === 'vulnerability') {
      if (ward.vulnerabilityScore >= 80) return '#8b5cf6';
      if (ward.vulnerabilityScore >= 65) return '#a855f7';
      if (ward.vulnerabilityScore >= 50) return '#3b82f6';
      return '#06b6d4';
    }
    // Combined Risk
    switch (ward.riskCategory) {
      case 'Extreme': return '#ef4444';
      case 'High': return '#f97316';
      case 'Moderate': return '#eab308';
      default: return '#10b981';
    }
  };

  const getMarkerRadius = (ward: WardState) => {
    if (activeLayer === 'thermal') return ward.wbgt >= 32 ? 26 : 17;
    if (activeLayer === 'vulnerability') return ward.vulnerabilityScore >= 80 ? 24 : 16;
    return ward.riskCategory === 'Extreme' ? 26 : ward.riskCategory === 'High' ? 19 : 14;
  };

  const handleSendDispatch = () => {
    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchSuccess(false);
      setShowDispatchModal(false);
    }, 2000);
  };

  const getHealthImpact = (risk: number, wbgt: number) => {
    if (risk >= 80 || wbgt >= 32.5) return { label: 'EXTREME STRAIN', color: 'text-red-400' };
    if (risk >= 65 || wbgt >= 30.5) return { label: 'HIGH STRAIN', color: 'text-orange-400' };
    if (risk >= 45 || wbgt >= 28.0) return { label: 'MODERATE', color: 'text-amber-400' };
    return { label: 'LOW / SAFE', color: 'text-emerald-400' };
  };

  return (
    <div className="max-w-[1680px] mx-auto space-y-6 font-sans pb-16">
      {/* Top Header Card */}
      <div className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Metropolitan Heat Health Risk Radar
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Hyper-local GIS surveillance: Weather → Liljegren WBGT → Demographic Vulnerability → Response
              </p>
            </div>
          </div>
        </div>

        {/* Layer Toggle Controls (Crypto Tab Pill Style) */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-[#0e1424] border border-slate-800 p-1 rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveLayer('combined')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                activeLayer === 'combined' ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Combined Risk
            </button>
            <button
              onClick={() => setActiveLayer('thermal')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                activeLayer === 'thermal' ? 'bg-red-500/20 border border-red-500/40 text-red-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              WBGT Stress Only
            </button>
            <button
              onClick={() => setActiveLayer('vulnerability')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
                activeLayer === 'vulnerability' ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vulnerability Index
            </button>
          </div>

          <button
            onClick={() => setShowCoolingCenters(!showCoolingCenters)}
            className={`px-4 py-2.5 text-xs font-semibold border rounded-2xl transition flex items-center gap-2 ${
              showCoolingCenters 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hospital className="w-4 h-4" />
            <span>Shelters & Hospitals</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Map (7 cols) + Selected Ward Story Panel (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container Card (7 cols) */}
        <div className="lg:col-span-7 bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col min-h-[600px] relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Interactive Node Grid ({wards.length} Wards Active)
              </span>
            </div>
            <ProvenanceBadge type="MODELLED" source="Liljegren WBGT & Census" />
          </div>

          {/* Map canvas */}
          <div className="flex-1 rounded-2xl overflow-hidden bg-[#0d121f] border border-slate-800 relative min-h-[500px]">
            <MapContainer 
              center={[13.06, 80.24]} 
              zoom={11} 
              scrollWheelZoom={true} 
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {/* Ward Risk Nodes */}
              {wards.map((ward) => {
                const isSelected = selectedWard?.id === ward.id;
                const color = getMarkerColor(ward);
                const radius = getMarkerRadius(ward);

                return (
                  <CircleMarker
                    key={ward.id}
                    center={[ward.lat, ward.lng]}
                    radius={radius}
                    pathOptions={{ 
                      fillColor: color,
                      fillOpacity: isSelected ? 0.95 : 0.65,
                      color: isSelected ? '#ffffff' : color,
                      weight: isSelected ? 3 : 1.5
                    }}
                    eventHandlers={{
                      click: () => setSelectedWard(ward),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                      <div className="text-xs p-1 font-sans">
                        <div className="font-bold text-white">{ward.name}</div>
                        <div className="text-[11px] text-slate-300 mt-0.5">
                          {activeLayer === 'combined' && `Risk: ${ward.riskCategory} (${ward.riskScore}/100)`}
                          {activeLayer === 'thermal' && `WBGT: ${ward.wbgt}°C | Temp: ${ward.temperature}°C`}
                          {activeLayer === 'vulnerability' && `Vuln: ${ward.vulnerabilityScore}/100 | Laborers: ${ward.outdoorWorkerPercentage}%`}
                        </div>
                      </div>
                    </Tooltip>
                  </CircleMarker>
                );
              })}

              {/* Emergency Assets */}
              {showCoolingCenters && emergencyAssets.map((asset) => (
                <CircleMarker
                  key={asset.id}
                  center={[asset.lat, asset.lng]}
                  radius={8}
                  pathOptions={{
                    fillColor: asset.type === 'hospital' ? '#38bdf8' : '#34d399',
                    fillOpacity: 0.95,
                    color: '#ffffff',
                    weight: 2
                  }}
                >
                  <Tooltip direction="bottom" offset={[0, 8]} opacity={0.95}>
                    <div className="text-xs p-1 font-sans">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Hospital className="w-3.5 h-3.5 text-cyan-400" />
                        {asset.name}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase mt-0.5">
                        {asset.type === 'hospital' ? 'Designated Heatwave Hospital' : 'Public Cooling Sanctuary'}
                      </div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              ))}
            </MapContainer>

            {/* In-Map Legend Overlay */}
            <div className="absolute bottom-4 right-4 z-[400] bg-[#121826]/95 backdrop-blur-xl border border-slate-700/80 p-4 rounded-2xl text-xs shadow-2xl space-y-2">
              <div className="text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between gap-4">
                <span>{activeLayer === 'combined' ? 'Combined Risk' : activeLayer === 'thermal' ? 'WBGT Heat Stress' : 'Vulnerability Index'}</span>
                <span className="text-cyan-400 font-mono text-[9px]">NDMA Scale</span>
              </div>

              {activeLayer === 'combined' && (
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-md"></span> <span className="text-slate-200">Extreme Risk (&gt;80)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-500 rounded-md"></span> <span className="text-slate-200">High Risk (65-80)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500 rounded-md"></span> <span className="text-slate-200">Moderate Risk (45-65)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-md"></span> <span className="text-slate-200">Low Risk (&lt;45)</span></div>
                </div>
              )}

              {activeLayer === 'thermal' && (
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-md"></span> <span className="text-slate-200">WBGT &gt;32.5°C (Extreme)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-500 rounded-md"></span> <span className="text-slate-200">WBGT 30.5 - 32.5°C</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500 rounded-md"></span> <span className="text-slate-200">WBGT 28.0 - 30.5°C</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-md"></span> <span className="text-slate-200">WBGT &lt;28.0°C (Safe)</span></div>
                </div>
              )}

              {activeLayer === 'vulnerability' && (
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-purple-500 rounded-md"></span> <span className="text-slate-200">Critical Slum / Labor (&gt;80)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-md"></span> <span className="text-slate-200">Moderate Vulnerability (50-79)</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 bg-cyan-500 rounded-md"></span> <span className="text-slate-200">Lower Vulnerability (&lt;50)</span></div>
                </div>
              )}

              {showCoolingCenters && (
                <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> <span className="text-cyan-300">Govt. Hospital</span></div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> <span className="text-emerald-300">Cooling Hub / Hydration</span></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Ward Full Intelligence Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col space-y-5">
          {selectedWard ? (
            <>
              {/* Ward Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
                <div>
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                    {selectedWard.zone} · WARD {selectedWard.id}
                  </span>
                  <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                    {selectedWard.name}
                  </h2>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  selectedWard.riskCategory === 'Extreme' ? 'bg-red-500/15 border-red-500/30 text-red-400' :
                  selectedWard.riskCategory === 'High' ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' :
                  'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                }`}>
                  {selectedWard.riskCategory} Risk
                </span>
              </div>

              {/* 4 Clean Metric Tiles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-[#0e1424] border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Composite Risk Score</span>
                  <div className="text-2xl font-black text-red-400 font-mono mt-1">
                    {selectedWard.riskScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  </div>
                  <span className="text-xs font-semibold text-red-400 block mt-1">{selectedWard.riskCategory} Alert</span>
                </div>

                <div className="p-4 bg-[#0e1424] border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">WBGT Heat Stress</span>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                    {selectedWard.wbgt}°C
                  </div>
                  <span className="text-xs text-slate-400 block mt-1">Ambient: {selectedWard.temperature}°C</span>
                </div>

                <div className="p-4 bg-[#0e1424] border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Vulnerability Index</span>
                  <div className="text-2xl font-black text-purple-400 font-mono mt-1">
                    {selectedWard.vulnerabilityScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  </div>
                  <span className="text-xs text-purple-400 block mt-1">Census Calibrated</span>
                </div>

                <div className="p-4 bg-[#0e1424] border border-slate-800 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Hospital Surge</span>
                  <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                    {selectedWard.estimatedHospitalSurgeFactor}×
                  </div>
                  <span className="text-xs text-red-400 block mt-1">↑ {selectedWard.estimatedMortalityRiskElevation}% Mortality Risk</span>
                </div>
              </div>

              {/* Environmental & Demographic Stats */}
              <div className="space-y-3 bg-[#0e1424] p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block border-b border-slate-800 pb-2">
                  Atmospheric & Demographic Profile
                </span>
                <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Humidity</span>
                    <span className="font-semibold text-white">{selectedWard.humidity}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Solar Radiation</span>
                    <span className="font-semibold text-white">{selectedWard.solarRadiation} W/m²</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Population</span>
                    <span className="font-semibold text-white">{selectedWard.population.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Outdoor Labor</span>
                    <span className="font-semibold text-amber-400">{selectedWard.outdoorWorkerPercentage}% ({Math.round(selectedWard.population * (selectedWard.outdoorWorkerPercentage / 100)).toLocaleString()})</span>
                  </div>
                </div>
              </div>

              {/* Recommended Action Directives */}
              <div className="space-y-2.5 bg-red-500/5 p-4 rounded-2xl border border-red-500/20">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                  Mandatory Heat Action Directives
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>Enforce physical outdoor labor moratorium (12:00 – 16:00 IST)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>Deploy mobile misting and drinking water tankers to informal settlements</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2 mt-auto">
                <button
                  onClick={() => setShowDispatchModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-200" />
                  <span>Dispatch SMS / WhatsApp Alert Broadcast</span>
                </button>

                <Link
                  to="/action-plan"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl font-bold text-xs text-center transition block"
                >
                  Trigger Municipal Emergency Protocol
                </Link>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center p-8">
              <Info className="w-10 h-10 mb-3 opacity-40 text-cyan-400" />
              <p className="text-sm font-medium">Select any ward node on the map to inspect live environmental metrics and health directives.</p>
            </div>
          )}
        </div>
      </div>

      {/* Direct Ward SMS / WhatsApp Advisory Modal */}
      {showDispatchModal && selectedWard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#121826] border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  SMS / WhatsApp Broadcast Dispatch
                </h3>
              </div>
              <button 
                onClick={() => setShowDispatchModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#0e1424] rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Ward:</span>
                  <strong className="text-white">{selectedWard.name} ({selectedWard.id})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Audience:</span>
                  <strong className="text-amber-400">Outdoor Labor, Vendors & Anganwadi Workers</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Reach:</span>
                  <strong className="text-emerald-400 font-mono">{Math.round(selectedWard.population * 0.65).toLocaleString()} Subscriptions</strong>
                </div>
              </div>

              {/* Message Preview */}
              <div className="p-4 bg-emerald-950/30 border border-emerald-800/80 rounded-2xl space-y-2">
                <div className="font-bold text-emerald-300 flex items-center gap-2 text-xs">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  [HEATGUARD NDMA EMERGENCY BROADCAST · {selectedWard.id}]
                </div>
                <p className="text-slate-200 leading-relaxed text-xs">
                  🚨 <strong>CRITICAL HEATWAVE ALERT</strong> for <strong>{selectedWard.name}</strong>: WBGT thermal stress is <strong>{selectedWard.wbgt}°C</strong> (Extreme). Mandatory labor halt 12:00-16:00. Free cold water and ORS available at Ward PHC. Dial 108 for heatstroke emergencies.
                </p>
                <div className="pt-2 text-[11px] text-emerald-400/90 italic border-t border-emerald-900/60">
                  தமிழ்: {selectedWard.name} பகுதியில் கடும் வெப்ப அலை எச்சரிக்கை. பகல் 12 முதல் 4 வரை வெயிலில் வேலை செய்வதைத் தவிர்க்கவும்.
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDispatchModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendDispatch}
                disabled={dispatchSuccess}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-950/40"
              >
                {dispatchSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    BROADCAST TRANSMITTED!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    TRANSMIT VIA NDMA GATEWAY
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
