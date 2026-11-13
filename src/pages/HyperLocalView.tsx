import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, Tooltip } from 'react-leaflet';
import { 
  MapPin, 
  Search, 
  Layers, 
  Hospital, 
  Activity, 
  Thermometer, 
  Wind, 
  Droplets, 
  Sun, 
  Users, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Building2, 
  Sparkles,
  ExternalLink,
  Navigation
} from 'lucide-react';
import { HYPER_LOCAL_AREAS, LocalArea, computeHyperLocalBiometeorology } from '../data/hyperLocalAreas';
import { useSimulation } from '../store/useSimulation';
import { useThemeStore } from '../store/useThemeStore';
import ProvenanceBadge from '../components/ProvenanceBadge';
import ExportDecisionBriefModal from '../components/ExportDecisionBriefModal';
import HyperLocalSearch from '../components/HyperLocalSearch';
import { getGoogleMapsDirectionsUrl } from '../utils/geoUtils';

export default function HyperLocalView() {
  const { cityMetrics } = useSimulation();
  const { theme } = useThemeStore();
  const [selectedArea, setSelectedArea] = useState<LocalArea>(HYPER_LOCAL_AREAS[0]); // Default to Avadi
  const [mapTileStyle, setMapTileStyle] = useState<'carto' | 'satellite' | 'osm'>('carto');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'MAP_FIRST' | 'LIST_FIRST'>('MAP_FIRST');

  const microclimate = computeHyperLocalBiometeorology(
    selectedArea,
    cityMetrics.avgTemperature,
    cityMetrics.avgHumidity,
    cityMetrics.avgWindSpeed,
    cityMetrics.avgSolarRadiation
  );

  const getTileUrl = () => {
    if (mapTileStyle === 'satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
    if (mapTileStyle === 'osm') {
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
    // Carto
    return theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  };

  return (
    <div className="max-w-[1680px] mx-auto space-y-6 font-sans pb-16">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#131b2e] via-[#111827] to-[#151c30] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                Granular Neighborhood GIS Surveillance
              </span>
              <ProvenanceBadge type="MODELLED" source="Microclimate Downscale & High-Res DEM" />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Hyper-Local Surveillance: Avadi, Pattabiram, Poonamallee & Suburbs
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Explore localized thermal stress, tin-roof radiation, vegetative canopy buffering, and industrial exposure across 20+ specialized suburban clusters, industrial estates, and informal settlements.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-950/40"
            >
              <Share2 className="w-4 h-4" />
              <span>Share / Export Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map & Inspector Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Map with Neighborhood Markers (8 cols) */}
        <div className="lg:col-span-8 bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Geospatial Pin Drop & Satellite Overlay
              </h3>
            </div>

            {/* Map Tile Style Switcher */}
            <div className="flex bg-[#0e1424] border border-slate-800 p-1 rounded-2xl">
              <button
                onClick={() => setMapTileStyle('carto')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  mapTileStyle === 'carto' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {theme === 'light' ? 'Carto Light' : 'Carto Dark'}
              </button>
              <button
                onClick={() => setMapTileStyle('satellite')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  mapTileStyle === 'satellite' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Satellite (ESRI / Google)
              </button>
              <button
                onClick={() => setMapTileStyle('osm')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  mapTileStyle === 'osm' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                OpenStreetMap
              </button>
            </div>
          </div>

          {/* Map canvas */}
          <div className="h-[480px] rounded-2xl overflow-hidden bg-[#0d121f] border border-slate-800 relative">
            <MapContainer
              center={[selectedArea.lat, selectedArea.lng]}
              zoom={12}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; Map Providers'
                url={getTileUrl()}
              />

              {HYPER_LOCAL_AREAS.map((area) => {
                const isSelected = selectedArea.id === area.id;
                const climate = computeHyperLocalBiometeorology(
                  area,
                  cityMetrics.avgTemperature,
                  cityMetrics.avgHumidity,
                  cityMetrics.avgWindSpeed,
                  cityMetrics.avgSolarRadiation
                );

                const markerColor = 
                  climate.alertLevel === 'RED' ? '#ef4444' :
                  climate.alertLevel === 'ORANGE' ? '#f97316' : '#eab308';

                return (
                  <CircleMarker
                    key={area.id}
                    center={[area.lat, area.lng]}
                    radius={isSelected ? 22 : 14}
                    pathOptions={{
                      fillColor: markerColor,
                      fillOpacity: isSelected ? 0.95 : 0.7,
                      color: isSelected ? '#ffffff' : markerColor,
                      weight: isSelected ? 3 : 1.5
                    }}
                    eventHandlers={{
                      click: () => setSelectedArea(area)
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                      <div className="p-1 text-xs font-sans">
                        <strong className="text-white block">{area.name} ({area.pincode})</strong>
                        <span className="text-[11px] text-slate-300">
                          WBGT: {climate.wbgt}°C · Risk: {climate.compositeRiskScore}/100
                        </span>
                      </div>
                    </Tooltip>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Quick Map Legend */}
            <div className="absolute bottom-4 left-4 z-[400] bg-[#121826]/95 backdrop-blur-xl border border-slate-700/80 p-3 rounded-2xl text-xs space-y-1.5 shadow-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Microclimate Hazard</span>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> <span className="text-slate-200">Red Alert (&gt;32.5°C WBGT)</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> <span className="text-slate-200">Orange Alert (30.5-32.5°C)</span></div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> <span className="text-slate-200">Yellow Alert (28-30.5°C)</span></div>
            </div>
          </div>

          {/* Quick Suburb Shortcut Pills */}
          <div className="pt-2 flex items-center gap-2 overflow-x-auto scrollbar-thin">
            <span className="text-xs font-bold text-slate-400 uppercase shrink-0">
              Quick Jump:
            </span>
            {HYPER_LOCAL_AREAS.slice(0, 8).map(area => (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                  selectedArea.id === area.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Area Full Intelligence Dossier (4 cols) */}
        <div className="lg:col-span-4 bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col space-y-5">
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                {selectedArea.zone}
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {selectedArea.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                PIN: {selectedArea.pincode} · {selectedArea.subdivision}
              </p>
            </div>

            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
              microclimate.alertLevel === 'RED' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
              microclimate.alertLevel === 'ORANGE' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
              'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}>
              {microclimate.alertLevel} ALERT
            </span>
          </div>

          {/* Microclimate Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Downscaled WBGT</span>
              <strong className="text-amber-400 text-xl font-mono block mt-1">{microclimate.wbgt}°C</strong>
              <span className="text-slate-400 text-[11px]">Dry-Bulb: {microclimate.temp}°C</span>
            </div>

            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Risk Score</span>
              <strong className="text-red-400 text-xl font-mono block mt-1">{microclimate.compositeRiskScore} <span className="text-xs text-slate-500 font-normal">/ 100</span></strong>
              <span className="text-red-400 text-[11px]">Surge: {microclimate.hospitalSurgeFactor}×</span>
            </div>

            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Outdoor Workforce</span>
              <strong className="text-white text-base font-mono block mt-1">{microclimate.affectedOutdoorWorkers.toLocaleString()}</strong>
              <span className="text-amber-400 text-[11px]">{selectedArea.outdoorWorkerPct}% of pop</span>
            </div>

            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-semibold block">Senior Citizens (&gt;60y)</span>
              <strong className="text-purple-400 text-base font-mono block mt-1">{microclimate.affectedElderly.toLocaleString()}</strong>
              <span className="text-slate-400 text-[11px]">{selectedArea.elderlyPct}% of pop</span>
            </div>
          </div>

          {/* Environmental Physics Vulnerability Profile */}
          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block border-b border-slate-800 pb-1">
              Urban Canopy & Built-Up Surface Indices
            </span>
            <div className="flex justify-between">
              <span className="text-slate-400">Tree Canopy Cover:</span>
              <strong className="text-emerald-400 font-mono">{selectedArea.canopyPct}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tin-Sheet Roof Percentage:</span>
              <strong className="text-amber-400 font-mono">{selectedArea.tinRoofPct}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Built-Up Impervious Ratio:</span>
              <strong className="text-slate-200 font-mono">{selectedArea.builtUpPct}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Population Density:</span>
              <strong className="text-slate-200 font-mono">{selectedArea.densityKm2.toLocaleString()} / km²</strong>
            </div>
          </div>

          {/* ISO 7243 Work Advisory */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>ISO 7243 Labor Moratorium Directive</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-xs">
              {microclimate.isoWorkRest}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 mt-auto space-y-2">
            <a
              href={getGoogleMapsDirectionsUrl(selectedArea.name, selectedArea.lat, selectedArea.lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-950/40 flex items-center justify-center gap-2 transition"
              title="Open turn-by-turn navigation in Google Maps"
            >
              <Navigation className="w-4 h-4" />
              <span>Give Direction (Google Maps)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Export Decision Brief for {selectedArea.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Neighborhood Directory & Search */}
      <div className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-800/60 pb-4">
          <h3 className="text-lg font-bold text-white">
            All Local Suburbs & Industrial Clusters Directory
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Search or filter by administrative classification and inspect microclimate indices in real time.
          </p>
        </div>

        <HyperLocalSearch
          onSelectArea={(area) => setSelectedArea(area)}
          selectedAreaId={selectedArea.id}
        />
      </div>

      {/* Export Modal */}
      <ExportDecisionBriefModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
