import React, { useState } from 'react';
import { useSimulation } from '../store/useSimulation';
import { 
  Search, 
  Users, 
  Building, 
  HeartHandshake, 
  Hospital, 
  TreePine, 
  ArrowUpDown, 
  ChevronRight, 
  AlertTriangle,
  Info,
  Layers,
  Filter
} from 'lucide-react';
import { WardState } from '../types';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function WardAnalysis() {
  const { wards } = useSimulation();
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [selectedWardDetail, setSelectedWardDetail] = useState<WardState | null>(null);

  const zones = Array.from(new Set(wards.map(w => w.zone)));

  const filteredWards = wards
    .filter(w => {
      const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || w.id.toLowerCase().includes(search.toLowerCase());
      const matchesZone = selectedZone === 'ALL' || w.zone === selectedZone;
      const matchesRisk = selectedRiskFilter === 'ALL' || w.riskCategory === selectedRiskFilter;
      return matchesSearch && matchesZone && matchesRisk;
    })
    .sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore);

  const totalPop = wards.reduce((acc, w) => acc + w.population, 0);
  const totalWorkers = wards.reduce((acc, w) => acc + Math.round(w.population * (w.outdoorWorkerPercentage / 100)), 0);
  const totalElderly = wards.reduce((acc, w) => acc + Math.round(w.population * (w.elderlyPercentage / 100)), 0);
  const highVulnWardsCount = wards.filter(w => w.vulnerabilityScore >= 75).length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c1322] border border-slate-800 p-4 rounded-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide">
              Socio-Demographic Vulnerability & Exposure Registry
            </h1>
            <ProvenanceBadge type="OFFICIAL" source="Census of India & NSSO PLFS" />
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            Granular analysis of human vulnerability factors including outdoor labor density, elderly cohorts, housing quality, and healthcare transit distances.
          </p>
        </div>
      </div>

      {/* Aggregate Exposure Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0c1322] border border-slate-800 p-3.5 rounded-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[9px] font-mono uppercase font-bold flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-400" /> Total Monitored Pop.
            </span>
            <ProvenanceBadge type="OFFICIAL" source="Census" size="xs" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-100">
            {(totalPop / 1000000).toFixed(2)}M
          </div>
          <div className="text-[9px] font-mono text-slate-500 mt-0.5">
            20 Greater Chennai Wards
          </div>
        </div>

        <div className="bg-[#0c1322] border border-slate-800 p-3.5 rounded-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[9px] font-mono uppercase font-bold flex items-center gap-1">
              <Building className="w-3 h-3 text-amber-400" /> Outdoor / Informal Labor
            </span>
            <ProvenanceBadge type="OFFICIAL" source="PLFS" size="xs" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-400">
            {(totalWorkers / 1000).toFixed(0)}k
          </div>
          <div className="text-[9px] font-mono text-slate-500 mt-0.5">
            Construction, docks & vending
          </div>
        </div>

        <div className="bg-[#0c1322] border border-slate-800 p-3.5 rounded-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[9px] font-mono uppercase font-bold flex items-center gap-1">
              <HeartHandshake className="w-3 h-3 text-purple-400" /> Elderly Cohort (&gt;60y)
            </span>
            <ProvenanceBadge type="OFFICIAL" source="Census" size="xs" />
          </div>
          <div className="text-2xl font-mono font-bold text-purple-400">
            {(totalElderly / 1000).toFixed(0)}k
          </div>
          <div className="text-[9px] font-mono text-slate-500 mt-0.5">
            Physiologically vulnerable
          </div>
        </div>

        <div className="bg-[#0c1322] border border-slate-800 p-3.5 rounded-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[9px] font-mono uppercase font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-400" /> Critical Hotspot Wards
            </span>
            <span className="text-[8px] font-mono text-red-400">VULN &gt; 75</span>
          </div>
          <div className="text-2xl font-mono font-bold text-red-400">
            {highVulnWardsCount} / 20
          </div>
          <div className="text-[9px] font-mono text-slate-500 mt-0.5">
            Require priority municipal aid
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#0c1322] border border-slate-800 p-3 rounded-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search ward name, ID, or vulnerability keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-sm text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            id="zone-filter-select"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-sm text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option key="zone-all" value="ALL">All Zones</option>
            {zones.map(z => <option key={`zone-${z}`} value={z}>{z}</option>)}
          </select>

          <select
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-sm text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="Extreme">Extreme Risk Only</option>
            <option value="High">High Risk Only</option>
            <option value="Moderate">Moderate Risk Only</option>
          </select>
        </div>
      </div>

      {/* Main Vulnerability Table */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#090e1a] border-b border-slate-800 text-[9px] uppercase tracking-wider text-slate-400">
                <th className="p-3">Ward / ID</th>
                <th className="p-3">Density (/km²)</th>
                <th className="p-3">Outdoor Labor %</th>
                <th className="p-3">Elderly %</th>
                <th className="p-3">Tin Roof / Informal</th>
                <th className="p-3">Healthcare Dist</th>
                <th className="p-3">Tree Canopy</th>
                <th className="p-3">Vuln Score</th>
                <th className="p-3">Primary Vulnerability Drivers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredWards.map(ward => (
                <tr 
                  key={ward.id} 
                  onClick={() => setSelectedWardDetail(ward)}
                  className="hover:bg-slate-900/70 transition cursor-pointer"
                >
                  <td className="p-3">
                    <div className="font-bold text-slate-100">{ward.name}</div>
                    <div className="text-[10px] text-slate-500">{ward.id} • {ward.zone}</div>
                  </td>
                  <td className="p-3 text-slate-300">
                    {ward.densityKm2.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className={`font-bold ${ward.outdoorWorkerPercentage >= 40 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {ward.outdoorWorkerPercentage}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-bold ${ward.elderlyPercentage >= 16 ? 'text-purple-400' : 'text-slate-300'}`}>
                      {ward.elderlyPercentage}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`font-bold ${ward.slumHousingPercentage >= 35 ? 'text-red-400' : 'text-slate-300'}`}>
                      {ward.slumHousingPercentage}%
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">
                    {ward.healthcareAccessKm} km
                  </td>
                  <td className="p-3 text-emerald-400">
                    {ward.treeCanopyPercentage}%
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{
                            width: `${ward.vulnerabilityScore}%`,
                            backgroundColor: ward.vulnerabilityScore >= 80 ? '#dc2626' : ward.vulnerabilityScore >= 65 ? '#ea580c' : '#d97706'
                          }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-100">{ward.vulnerabilityScore}</span>
                    </div>
                  </td>
                  <td className="p-3 text-[10px] text-slate-400 max-w-xs truncate">
                    {ward.primaryVulnerabilityDrivers.join('; ')}
                  </td>
                </tr>
              ))}
              {filteredWards.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No administrative wards match current search/filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Ward Inspection Modal/Drawer */}
      {selectedWardDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0c1322] border border-slate-800 rounded-sm max-w-xl w-full p-5 shadow-2xl space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">{selectedWardDetail.zone}</span>
                <h3 className="text-base font-bold text-slate-100">{selectedWardDetail.name} ({selectedWardDetail.id})</h3>
              </div>
              <button
                onClick={() => setSelectedWardDetail(null)}
                className="text-slate-400 hover:text-white px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Vulnerability Composite</span>
                <div className="text-xl font-bold text-red-400">{selectedWardDetail.vulnerabilityScore}/100</div>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Total Ward Population</span>
                <div className="text-xl font-bold text-slate-200">{selectedWardDetail.population.toLocaleString()}</div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">
                Why this Ward is Vulnerable (Causality Matrix):
              </span>
              <div className="space-y-2">
                {selectedWardDetail.primaryVulnerabilityDrivers.map((driver, i) => (
                  <div key={i} className="p-2.5 bg-red-950/30 border border-red-900/60 rounded text-xs text-red-200/90 flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedWardDetail(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
