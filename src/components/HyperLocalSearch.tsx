import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Building, 
  Users, 
  Flame, 
  Activity, 
  Hospital, 
  Share2, 
  X, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { HYPER_LOCAL_AREAS, LocalArea, computeHyperLocalBiometeorology } from '../data/hyperLocalAreas';
import { useSimulation } from '../store/useSimulation';
import ExportDecisionBriefModal from './ExportDecisionBriefModal';
import { getGoogleMapsDirectionsUrl } from '../utils/geoUtils';
import { ExternalLink } from 'lucide-react';

interface HyperLocalSearchProps {
  onSelectArea?: (area: LocalArea) => void;
  selectedAreaId?: string;
}

export default function HyperLocalSearch({ onSelectArea, selectedAreaId }: HyperLocalSearchProps) {
  const { cityMetrics } = useSimulation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedArea, setSelectedArea] = useState<LocalArea>(
    HYPER_LOCAL_AREAS.find(a => a.id === selectedAreaId) || HYPER_LOCAL_AREAS[0]
  );
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const categories = ['ALL', 'Industrial', 'Dense Residential', 'Suburban', 'Commercial & Transit', 'Coastal', 'Port & Logistics'];

  const filteredAreas = useMemo(() => {
    return HYPER_LOCAL_AREAS.filter(area => {
      const matchesSearch = 
        area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.subdivision.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.pincode.includes(searchQuery);
      
      const matchesCategory = activeCategory === 'ALL' || area.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const microclimate = useMemo(() => {
    return computeHyperLocalBiometeorology(
      selectedArea,
      cityMetrics.avgTemperature,
      cityMetrics.avgHumidity,
      cityMetrics.avgWindSpeed,
      cityMetrics.avgSolarRadiation
    );
  }, [selectedArea, cityMetrics]);

  const handleAreaClick = (area: LocalArea) => {
    setSelectedArea(area);
    if (onSelectArea) {
      onSelectArea(area);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search local neighborhoods (e.g., Avadi, Pattabiram, Poonamallee, Ambattur, Ennore, Tambaram)..."
          className="w-full pl-12 pr-10 py-3.5 bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none transition shadow-inner font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Neighborhood Cards (Left) & Active Inspector Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Neighborhood List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3 max-h-[560px] overflow-y-auto pr-1 scrollbar-thin">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span>Found {filteredAreas.length} Local Surveillance Areas:</span>
            <span className="text-slate-500 text-[11px]">Click to inspect local microclimate</span>
          </div>

          {filteredAreas.map(area => {
            const isSelected = selectedArea.id === area.id;
            const areaClimate = computeHyperLocalBiometeorology(
              area,
              cityMetrics.avgTemperature,
              cityMetrics.avgHumidity,
              cityMetrics.avgWindSpeed,
              cityMetrics.avgSolarRadiation
            );

            const isRed = areaClimate.alertLevel === 'RED';
            const isOrange = areaClimate.alertLevel === 'ORANGE';

            return (
              <div
                key={area.id}
                onClick={() => handleAreaClick(area)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/60 shadow-lg'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <strong className="text-sm font-bold text-white">{area.name}</strong>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {area.pincode}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 pl-6">
                    {area.subdivision} · {area.category}
                  </div>
                  <div className="text-[11px] text-slate-400 pl-6 flex items-center gap-3 pt-0.5">
                    <span>Pop: <strong>{area.population.toLocaleString()}</strong></span>
                    <span>Labor: <strong className="text-amber-400">{area.outdoorWorkerPct}%</strong></span>
                    <span>Canopy: <strong className="text-emerald-400">{area.canopyPct}%</strong></span>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <div className="font-mono font-extrabold text-sm text-white">
                    {areaClimate.wbgt}°C <span className="text-[10px] text-slate-400">WBGT</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block ${
                    isRed ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                    isOrange ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                    'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}>
                    {areaClimate.alertLevel} ({areaClimate.compositeRiskScore}/100)
                  </span>

                  <a
                    href={getGoogleMapsDirectionsUrl(area.name, area.lat, area.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 hover:underline pt-0.5"
                    title={`Get Google Maps directions to ${area.name}`}
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Give Direction</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Area Microclimate Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                {selectedArea.zone}
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                {selectedArea.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pincode: {selectedArea.pincode} · {selectedArea.subdivision}
              </p>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              microclimate.alertLevel === 'RED' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
              microclimate.alertLevel === 'ORANGE' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
              'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}>
              {microclimate.alertLevel} ALERT ({microclimate.compositeRiskScore}/100)
            </span>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Local Temperature</span>
              <strong className="text-white text-base font-mono">{microclimate.temp}°C</strong>
              <span className="text-slate-400 text-[11px] block">RH: {microclimate.humidity}%</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Liljegren WBGT</span>
              <strong className="text-amber-400 text-base font-mono">{microclimate.wbgt}°C</strong>
              <span className="text-slate-400 text-[11px] block">UTCI: {microclimate.utci}°C</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Outdoor Labor Force</span>
              <strong className="text-white text-sm font-mono">{microclimate.affectedOutdoorWorkers.toLocaleString()}</strong>
              <span className="text-amber-400 text-[11px] block">{selectedArea.outdoorWorkerPct}% of pop</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Hospital Surge Multiplier</span>
              <strong className="text-cyan-400 text-sm font-mono">{microclimate.hospitalSurgeFactor}×</strong>
              <span className="text-red-400 text-[11px] block">Mortality: +{microclimate.mortalityRiskElevation}%</span>
            </div>
          </div>

          {/* ISO 7243 Work Advisory */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ISO 7243 Work / Rest Directive:</span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              {microclimate.isoWorkRest}
            </p>
          </div>

          {/* Vulnerability Drivers */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Microclimate Stress Factors:
            </span>
            <ul className="space-y-1 text-slate-300">
              {selectedArea.keyVulnerabilityFactors.map((factor, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Hospital */}
          <div className="text-xs text-slate-300 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Nearest Healthcare Hub</span>
              <strong className="text-white">{selectedArea.nearestHospital}</strong> ({selectedArea.nearestHospitalKm} km)
            </div>
            <a
              href={getGoogleMapsDirectionsUrl(selectedArea.nearestHospital)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-300 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
              title="Navigate to hospital"
            >
              <Hospital className="w-3.5 h-3.5" />
              <span>Route</span>
            </a>
          </div>

          {/* Action Trigger */}
          <div className="pt-2 space-y-2">
            <a
              href={getGoogleMapsDirectionsUrl(selectedArea.name, selectedArea.lat, selectedArea.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-950/40"
              title="Open in Google Maps"
            >
              <Navigation className="w-4 h-4" />
              <span>Give Direction to {selectedArea.name}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Export Decision-Ready Brief for {selectedArea.name}</span>
            </button>
          </div>
        </div>
      </div>

      <ExportDecisionBriefModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
