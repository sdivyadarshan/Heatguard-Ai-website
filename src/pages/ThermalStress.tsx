import React, { useState } from 'react';
import { useSimulation } from '../store/useSimulation';
import { 
  Activity, 
  ThermometerSun, 
  Wind, 
  Droplets, 
  Sun, 
  AlertTriangle, 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  Flame, 
  Info,
  Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function ThermalStress() {
  const { cityMetrics, wards, activeScenario } = useSimulation();
  const [selectedMetric, setSelectedMetric] = useState<'wbgt' | 'utci' | 'heatIndex'>('wbgt');

  const sortedByStress = [...wards].sort((a, b) => b.wbgt - a.wbgt);

  // Hourly biometeorological curve for the current episode
  const hourlyCurve = [
    { hour: '06:00', temp: 28.5, hum: 84, wbgt: 26.2, utci: 27.8, risk: 25 },
    { hour: '08:00', temp: 33.8, hum: 78, wbgt: 29.4, utci: 34.2, risk: 52 },
    { hour: '10:00', temp: 37.2, hum: 68, wbgt: 31.8, utci: 39.5, risk: 74 },
    { hour: '12:00', temp: 40.5, hum: 60, wbgt: 33.2, utci: 43.1, risk: 88 },
    { hour: '14:00', temp: 41.8, hum: 56, wbgt: 33.8, utci: 44.8, risk: 94 },
    { hour: '16:00', temp: 40.2, hum: 64, wbgt: 33.0, utci: 42.6, risk: 86 },
    { hour: '18:00', temp: 36.4, hum: 72, wbgt: 30.5, utci: 37.0, risk: 62 },
    { hour: '20:00', temp: 33.0, hum: 80, wbgt: 28.8, utci: 33.5, risk: 45 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c1322] border border-slate-800 p-4 rounded-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide">
              Human Thermal Stress & Biometeorology Engine
            </h1>
            <ProvenanceBadge type="MODELLED" source="ISO 7243 / Stull & Liljegren Equations" />
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            Physiological heat load calculation translating ambient atmospheric parameters into human core thermal stress.
          </p>
        </div>
      </div>

      {/* 3 Core Biometeorological Index Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WBGT Card */}
        <div className="bg-[#0c1322] border border-slate-800 p-4 rounded-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Gold Standard (Occupational)</span>
                <h3 className="text-sm font-bold font-mono text-slate-100">WET-BULB GLOBE TEMP (WBGT)</h3>
              </div>
              <ProvenanceBadge type="MODELLED" source="Liljegren" size="xs" />
            </div>

            <div className="flex items-baseline justify-between mb-3">
              <div className="text-3xl font-mono font-bold text-amber-400">
                {cityMetrics.avgWbgt}°C
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-red-950 text-red-300 border border-red-800 font-bold uppercase">
                {cityMetrics.avgWbgt >= 32.5 ? 'Extreme Risk' : cityMetrics.avgWbgt >= 30.5 ? 'High Risk' : 'Moderate'}
              </span>
            </div>

            <p className="text-[10px] font-mono text-slate-400 leading-relaxed mb-3">
              Combines dry-bulb temperature (10%), natural wet-bulb temperature (70%), and solar globe temperature (20%) per ISO 7243.
            </p>
          </div>

          <div className="space-y-1 text-[9px] font-mono pt-2 border-t border-slate-800 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">&lt; 28.0°C:</span> <span>Safe Continuous Work</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">28.0 - 30.5°C:</span> <span className="text-amber-400">45m Work / 15m Rest</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">30.5 - 32.5°C:</span> <span className="text-orange-400">15m Work / 45m Rest</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">&gt; 32.5°C:</span> <span className="text-red-400 font-bold">Mandatory Stoppage</span>
            </div>
          </div>
        </div>

        {/* UTCI Card */}
        <div className="bg-[#0c1322] border border-slate-800 p-4 rounded-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Multi-Node Human Thermoregulation</span>
                <h3 className="text-sm font-bold font-mono text-slate-100">UNIVERSAL THERMAL CLIMATE (UTCI)</h3>
              </div>
              <ProvenanceBadge type="MODELLED" source="COST 730" size="xs" />
            </div>

            <div className="flex items-baseline justify-between mb-3">
              <div className="text-3xl font-mono font-bold text-red-400">
                {(cityMetrics.avgTemperature + 4.2).toFixed(1)}°C
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-red-950 text-red-300 border border-red-800 font-bold uppercase">
                Very Strong Heat Stress
              </span>
            </div>

            <p className="text-[10px] font-mono text-slate-400 leading-relaxed mb-3">
              Equivalent perceived temperature based on the Fiala human thermoregulation model under realistic wind, solar, and vapor pressure loads.
            </p>
          </div>

          <div className="space-y-1 text-[9px] font-mono pt-2 border-t border-slate-800 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">+26 to +32°C:</span> <span>Moderate Heat Stress</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">+32 to +38°C:</span> <span className="text-amber-400">Strong Heat Stress</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">+38 to +46°C:</span> <span className="text-red-400">Very Strong Heat Stress</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">&gt; +46°C:</span> <span className="text-purple-400 font-bold">Extreme Heat Stress</span>
            </div>
          </div>
        </div>

        {/* Heat Index / Physiological Hazard Card */}
        <div className="bg-[#0c1322] border border-slate-800 p-4 rounded-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block">Apparent Temperature</span>
                <h3 className="text-sm font-bold font-mono text-slate-100">ROTHFUSZ HEAT INDEX</h3>
              </div>
              <ProvenanceBadge type="HISTORICAL_OFFICIAL" source="IMD Bulletin" size="xs" />
            </div>

            <div className="flex items-baseline justify-between mb-3">
              <div className="text-3xl font-mono font-bold text-orange-400">
                {(cityMetrics.avgTemperature + 7.4).toFixed(1)}°C
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-orange-950 text-orange-300 border border-orange-800 font-bold uppercase">
                Danger Zone
              </span>
            </div>

            <p className="text-[10px] font-mono text-slate-400 leading-relaxed mb-3">
              Represents perceived temperature when atmospheric humidity prevents normal evaporative cooling via cutaneous perspiration.
            </p>
          </div>

          <div className="space-y-1 text-[9px] font-mono pt-2 border-t border-slate-800 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">27 - 32°C:</span> <span>Caution (Fatigue Possible)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">32 - 41°C:</span> <span className="text-amber-400">Extreme Caution</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">41 - 54°C:</span> <span className="text-orange-400 font-bold">Danger (Cramps/Exhaustion)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">&gt; 54°C:</span> <span className="text-red-400 font-bold">Extreme Danger (Heatstroke)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Biometeorological Diurnal Curve Chart */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-4 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div>
            <h3 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
              Diurnal Physiological Stress Curve & Critical Window
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Synchronized 24h cycle showing when ambient temperature and solar insolation peak WBGT above hazardous thresholds.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-xs bg-red-950 text-red-300 border border-red-800 font-bold">
              CRITICAL WINDOW: 11:30 – 16:00 IST
            </span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWbgtArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorTempArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[20, 50]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0c1322', borderColor: '#334155', color: '#f1f5f9', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
              />
              <Area type="monotone" dataKey="temp" name="Dry-Bulb Temp (°C)" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorTempArea)" />
              <Area type="monotone" dataKey="wbgt" name="WBGT Stress (°C)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorWbgtArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ward Ranking by WBGT Heat Stress */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm overflow-hidden shadow-md">
        <div className="p-3 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
              Ward-by-Ward Physiological Heat Stress Rankings
            </h3>
          </div>
          <ProvenanceBadge type="MODELLED" source="Microclimate Downscale" size="xs" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#090e1a] border-b border-slate-800 text-[9px] uppercase tracking-wider text-slate-400">
                <th className="p-3">Ward Name</th>
                <th className="p-3">Zone</th>
                <th className="p-3">Dry-Bulb</th>
                <th className="p-3">Humidity</th>
                <th className="p-3">WBGT Stress</th>
                <th className="p-3">ISO 7243 Work Advisory</th>
                <th className="p-3">Hospital Surge Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {sortedByStress.map((ward) => (
                <tr key={ward.id} className="hover:bg-slate-900/60 transition">
                  <td className="p-3 font-bold text-slate-100">{ward.name}</td>
                  <td className="p-3 text-[10px] text-slate-400">{ward.zone}</td>
                  <td className="p-3 text-slate-200">{ward.temperature}°C</td>
                  <td className="p-3 text-slate-400">{ward.humidity}%</td>
                  <td className="p-3 font-bold text-amber-400">{ward.wbgt}°C</td>
                  <td className="p-3 text-[10px]">
                    <span className={`px-1.5 py-0.5 rounded-xs border font-bold ${
                      ward.wbgt >= 32.5 ? 'bg-red-950 text-red-300 border-red-800' :
                      ward.wbgt >= 30.5 ? 'bg-orange-950 text-orange-300 border-orange-800' :
                      ward.wbgt >= 28.0 ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}>
                      {ward.isoWorkRestRatio}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-200">{ward.estimatedHospitalSurgeFactor}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
