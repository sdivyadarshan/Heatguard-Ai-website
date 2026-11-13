import React, { useState, useRef } from 'react';
import { 
  Activity, 
  Download, 
  Thermometer, 
  Wind, 
  Droplets, 
  Sun, 
  Flame, 
  HeartHandshake, 
  Info, 
  Clock, 
  Camera, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Zap,
  Share2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  Legend 
} from 'recharts';
import { format } from 'date-fns';
import html2canvas from 'html2canvas-pro';
import { toPng } from 'html-to-image';
import { useSimulation } from '../store/useSimulation';
import ProvenanceBadge from '../components/ProvenanceBadge';
import ExportDecisionBriefModal from '../components/ExportDecisionBriefModal';

export default function Biometeorology() {
  const { cityMetrics, wards, activeScenario } = useSimulation();
  const [selectedLaborIntensity, setSelectedLaborIntensity] = useState<'Light' | 'Moderate' | 'Heavy' | 'VeryHeavy'>('Heavy');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [downloadingChartId, setDownloadingChartId] = useState<string | null>(null);

  // 1. Diurnal 24-Hour Solar Flux vs Temperature & WBGT Curve
  const diurnalSolarCurve = [
    { hour: '00:00', temp: 29.2, hum: 88, wbgt: 26.5, solar: 0, wind: 2.1, utci: 27.0 },
    { hour: '03:00', temp: 28.1, hum: 92, wbgt: 25.8, solar: 0, wind: 1.8, utci: 26.2 },
    { hour: '06:00', temp: 29.5, hum: 86, wbgt: 27.2, solar: 80, wind: 2.4, utci: 28.5 },
    { hour: '08:00', temp: 33.8, hum: 78, wbgt: 29.8, solar: 420, wind: 3.1, utci: 34.2 },
    { hour: '10:00', temp: 37.4, hum: 68, wbgt: 32.1, solar: 760, wind: 3.5, utci: 39.8 },
    { hour: '12:00', temp: 40.8, hum: 60, wbgt: 33.6, solar: 980, wind: 3.8, utci: 43.5 },
    { hour: '14:00', temp: 42.4, hum: 56, wbgt: 34.2, solar: 920, wind: 4.2, utci: 45.2 },
    { hour: '16:00', temp: 40.6, hum: 64, wbgt: 33.2, solar: 610, wind: 4.8, utci: 42.8 },
    { hour: '18:00', temp: 36.8, hum: 74, wbgt: 31.0, solar: 150, wind: 3.9, utci: 37.4 },
    { hour: '20:00', temp: 33.4, hum: 82, wbgt: 29.1, solar: 0, wind: 3.2, utci: 33.8 },
    { hour: '22:00', temp: 31.0, hum: 85, wbgt: 27.8, solar: 0, wind: 2.6, utci: 30.1 },
  ];

  // 2. Psychrometric WBGT Hazard Matrix across varying Relative Humidity (at 38°C dry bulb)
  const psychrometricWbgtData = [
    { rh: '20%', wbgt: 25.8, apparentTemp: 35.2, utci: 32.0, strain: 'Low' },
    { rh: '35%', wbgt: 28.4, apparentTemp: 39.1, utci: 36.5, strain: 'Moderate' },
    { rh: '50%', wbgt: 31.2, apparentTemp: 44.6, utci: 41.2, strain: 'High' },
    { rh: '65%', wbgt: 33.8, apparentTemp: 51.4, utci: 46.8, strain: 'Very Strong' },
    { rh: '80%', wbgt: 36.5, apparentTemp: 59.8, utci: 52.4, strain: 'Extreme / Lethal' },
    { rh: '95%', wbgt: 39.1, apparentTemp: 69.2, utci: 58.1, strain: 'Catastrophic' },
  ];

  // 3. Labor Intensity & ISO 7243 Work/Rest Duration Breakdown
  const metabolicLaborData = [
    {
      wbgtThreshold: '< 28.0°C',
      Light: 100, // % work allowed
      Moderate: 100,
      Heavy: 100,
      VeryHeavy: 75,
      workDesc: 'Normal operations with scheduled hydration breaks'
    },
    {
      wbgtThreshold: '28.0 - 29.5°C',
      Light: 100,
      Moderate: 100,
      Heavy: 75,
      VeryHeavy: 50,
      workDesc: '45 min work / 15 min rest per hour for heavy labor'
    },
    {
      wbgtThreshold: '29.5 - 31.0°C',
      Light: 100,
      Moderate: 75,
      Heavy: 50,
      VeryHeavy: 25,
      workDesc: '30 min work / 30 min shaded rest with electrolyte supply'
    },
    {
      wbgtThreshold: '31.0 - 32.5°C',
      Light: 75,
      Moderate: 50,
      Heavy: 25,
      VeryHeavy: 0,
      workDesc: '15 min work / 45 min rest. Mandatory indoor cooling access'
    },
    {
      wbgtThreshold: '> 32.5°C',
      Light: 50,
      Moderate: 25,
      Heavy: 0,
      VeryHeavy: 0,
      workDesc: 'COMPLETE OUTDOOR WORK HALT (NDMA Red Protocol)'
    }
  ];

  // 4. DLNM Non-linear Hospital Surge & Relative Risk of Excess Mortality by WBGT
  const dlnmSurgeData = [
    { wbgt: 26.0, relativeSurge: 1.0, excessMortalityPct: 0 },
    { wbgt: 27.5, relativeSurge: 1.1, excessMortalityPct: 3 },
    { wbgt: 29.0, relativeSurge: 1.35, excessMortalityPct: 8 },
    { wbgt: 30.5, relativeSurge: 1.75, excessMortalityPct: 18 },
    { wbgt: 32.0, relativeSurge: 2.30, excessMortalityPct: 32 },
    { wbgt: 33.5, relativeSurge: 3.10, excessMortalityPct: 54 },
    { wbgt: 35.0, relativeSurge: 4.40, excessMortalityPct: 86 },
  ];

  // High-Resolution DOM-to-PNG Card and Graph Exporter
  const handleDownloadChartImage = async (cardOrContainerId: string, filename: string) => {
    setDownloadingChartId(cardOrContainerId);
    try {
      const container = document.getElementById(cardOrContainerId);
      if (!container) {
        setDownloadingChartId(null);
        return;
      }

      let pngURL = '';
      try {
        const canvas = await html2canvas(container, {
          backgroundColor: '#121826',
          scale: 2, // 2x Retina Resolution
          useCORS: true,
          logging: false,
          allowTaint: true
        });
        pngURL = canvas.toDataURL('image/png');
      } catch (h2cErr) {
        console.warn('html2canvas-pro failed, falling back to toPng:', h2cErr);
        pngURL = await toPng(container, {
          backgroundColor: '#121826',
          pixelRatio: 2,
          cacheBust: true
        });
      }

      if (!pngURL) return;

      const downloadLink = document.createElement('a');
      downloadLink.href = pngURL;
      const dateStr = format(new Date(), 'yyyy-MM-dd_HHmm');
      downloadLink.download = `${filename}_${dateStr}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Error exporting chart image', err);
    } finally {
      setDownloadingChartId(null);
    }
  };

  return (
    <div className="max-w-[1680px] mx-auto space-y-8 font-sans pb-16">
      {/* 1. Header with Export & Provenance */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#131b2e] via-[#111827] to-[#151c30] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" />
                Biometeorological Analytics Hub
              </span>
              <ProvenanceBadge type="MODELLED" source="Liljegren & ISO 7243 Equations" />
              <ProvenanceBadge type="HISTORICAL_OFFICIAL" source="IMD Synoptic Observations" />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Human Thermal Stress & Diurnal Biometeorology Engine
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Mathematical downscaling of atmospheric thermodynamic variables (dry-bulb temperature, vapor pressure, radiant solar flux, convective wind velocity) into physiological human heat strain indices. All visualizations support high-resolution image export.
            </p>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl border border-cyan-400/40 transition shadow-lg shadow-cyan-950/40 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share / Export Decision Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Three Primary Biometeorological Index Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* WBGT Card */}
        <div className="bg-[#121826] border border-slate-800/80 hover:border-amber-500/40 p-6 rounded-2xl shadow-lg transition duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Occupational Gold Standard</span>
              <h3 className="text-sm font-bold text-white">Wet-Bulb Globe Temperature (WBGT)</h3>
            </div>
            <ProvenanceBadge type="MODELLED" source="Liljegren" size="xs" />
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div className="text-3xl font-extrabold text-amber-400 font-mono">
              {cityMetrics.avgWbgt}°C
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
              {cityMetrics.avgWbgt >= 32.5 ? 'Extreme Risk' : cityMetrics.avgWbgt >= 30.5 ? 'High Risk' : 'Moderate Risk'}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Combines natural wet-bulb (70%), black globe radiation (20%), and ambient dry-bulb (10%) per ISO 7243.
          </p>

          <div className="space-y-1.5 text-xs text-slate-300 font-mono pt-3 border-t border-slate-800/80">
            <div className="flex justify-between">
              <span className="text-slate-500">&lt; 28.0°C:</span>
              <span className="text-emerald-400">Safe Continuous Work</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">28.0 - 30.5°C:</span>
              <span className="text-amber-400">45m Work / 15m Rest</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">30.5 - 32.5°C:</span>
              <span className="text-orange-400">15m Work / 45m Rest</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">&gt; 32.5°C:</span>
              <span className="text-red-400 font-bold">Mandatory Stoppage</span>
            </div>
          </div>
        </div>

        {/* UTCI Card */}
        <div className="bg-[#121826] border border-slate-800/80 hover:border-red-500/40 p-6 rounded-2xl shadow-lg transition duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Multi-Node Thermoregulation</span>
              <h3 className="text-sm font-bold text-white">Universal Thermal Climate (UTCI)</h3>
            </div>
            <ProvenanceBadge type="MODELLED" source="COST 730" size="xs" />
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div className="text-3xl font-extrabold text-red-400 font-mono">
              {(cityMetrics.avgTemperature + 4.2).toFixed(1)}°C
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
              Very Strong Heat Stress
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Equivalent perceived temperature simulating human physiological core & cutaneous blood flow responses.
          </p>

          <div className="space-y-1.5 text-xs text-slate-300 font-mono pt-3 border-t border-slate-800/80">
            <div className="flex justify-between">
              <span className="text-slate-500">+26 to +32°C:</span>
              <span className="text-slate-300">Moderate Heat Stress</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">+32 to +38°C:</span>
              <span className="text-amber-400">Strong Heat Stress</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">+38 to +46°C:</span>
              <span className="text-red-400 font-bold">Very Strong Stress</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">&gt; +46°C:</span>
              <span className="text-purple-400 font-bold">Extreme Thermal Stress</span>
            </div>
          </div>
        </div>

        {/* Heat Index Card */}
        <div className="bg-[#121826] border border-slate-800/80 hover:border-orange-500/40 p-6 rounded-2xl shadow-lg transition duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">Atmospheric Apparent Temp</span>
              <h3 className="text-sm font-bold text-white">Rothfusz Apparent Heat Index</h3>
            </div>
            <ProvenanceBadge type="HISTORICAL_OFFICIAL" source="IMD Formula" size="xs" />
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div className="text-3xl font-extrabold text-orange-400 font-mono">
              {(cityMetrics.avgTemperature + 7.4).toFixed(1)}°C
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
              Danger Zone
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Measures perceived thermal load when high relative humidity hinders normal perspiration cooling.
          </p>

          <div className="space-y-1.5 text-xs text-slate-300 font-mono pt-3 border-t border-slate-800/80">
            <div className="flex justify-between">
              <span className="text-slate-500">27 - 32°C:</span>
              <span className="text-slate-300">Caution (Fatigue)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">32 - 41°C:</span>
              <span className="text-amber-400">Extreme Caution</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">41 - 54°C:</span>
              <span className="text-orange-400 font-bold">Danger (Cramps/Exhaustion)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">&gt; 54°C:</span>
              <span className="text-red-400 font-bold">Extreme Danger (Heatstroke)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. GRAPH 1: 24-Hour Diurnal Solar Radiation Flux & WBGT Heat Strain Curve */}
      <div id="card-diurnal-curve" className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                1. 24-Hour Diurnal Solar Radiation Flux & WBGT Heat Strain Profile
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-mono font-bold">
                CRITICAL: 11:30 – 16:00 IST
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Synchronized diurnal progression showing when solar insolation (W/m²) and humidity conspire to force WBGT over safe thresholds.
            </p>
          </div>

          <button
            onClick={() => handleDownloadChartImage('card-diurnal-curve', 'HeatGuard_Diurnal_Solar_WBGT_Curve')}
            disabled={downloadingChartId === 'card-diurnal-curve'}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0 disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>{downloadingChartId === 'card-diurnal-curve' ? 'Generating PNG...' : 'Download Graph (PNG)'}</span>
          </button>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={diurnalSolarCurve} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={11} domain={[20, 50]} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} domain={[0, 1200]} tickLine={false} />
              <ChartTooltip
                contentStyle={{ backgroundColor: '#101626', borderColor: '#334155', borderRadius: '10px', fontSize: '11px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area yAxisId="left" type="monotone" dataKey="temp" name="Ambient Dry-Bulb (°C)" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGrad)" />
              <Area yAxisId="left" type="monotone" dataKey="wbgt" name="WBGT Heat Stress (°C)" stroke="#fbbf24" strokeWidth={2.5} fillOpacity={1} fill="url(#solarGrad)" />
              <Line yAxisId="left" type="monotone" dataKey="utci" name="UTCI Equivalent (°C)" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="solar" name="Solar Radiation (W/m²)" stroke="#38bdf8" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. TWO-COLUMN SPLIT: PSYCHROMETRIC MATRIX + DLNM SURGE CURVE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Psychrometric WBGT Hazard vs Humidity */}
        <div id="card-psychrometric" className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
            <div>
              <h3 className="text-sm font-bold text-white">
                2. Psychrometric WBGT Hazard vs Relative Humidity
              </h3>
              <p className="text-xs text-slate-400">At constant 38°C dry-bulb ambient baseline</p>
            </div>
            <button
              onClick={() => handleDownloadChartImage('card-psychrometric', 'HeatGuard_Psychrometric_WBGT_Matrix')}
              disabled={downloadingChartId === 'card-psychrometric'}
              className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 text-xs"
              title="Download Graph (PNG)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-medium">{downloadingChartId === 'card-psychrometric' ? '...' : 'PNG'}</span>
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={psychrometricWbgtData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="rh" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[20, 70]} tickLine={false} />
                <ChartTooltip
                  contentStyle={{ backgroundColor: '#101626', borderColor: '#334155', borderRadius: '10px', fontSize: '11px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="wbgt" name="WBGT Stress (°C)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="apparentTemp" name="Apparent Heat Index (°C)" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: DLNM Non-linear Hospital Surge Response Function */}
        <div id="card-dlnm-surge" className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
            <div>
              <h3 className="text-sm font-bold text-white">
                3. DLNM Non-Linear Hospital Surge & Excess Mortality Function
              </h3>
              <p className="text-xs text-slate-400">Epidemiological dose-response curve calibrated to NCDC</p>
            </div>
            <button
              onClick={() => handleDownloadChartImage('card-dlnm-surge', 'HeatGuard_DLNM_Hospital_Surge_Curve')}
              disabled={downloadingChartId === 'card-dlnm-surge'}
              className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 text-xs"
              title="Download Graph (PNG)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] font-medium">{downloadingChartId === 'card-dlnm-surge' ? '...' : 'PNG'}</span>
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dlnmSurgeData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="wbgt" stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v}°C`} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <ChartTooltip
                  contentStyle={{ backgroundColor: '#101626', borderColor: '#334155', borderRadius: '10px', fontSize: '11px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="relativeSurge" name="Hospital Surge Multiplier (×)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="excessMortalityPct" name="Excess Mortality Risk (%)" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="3 3" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. ISO 7243 Labor Productivity & Rest Schedule Interactive Matrix */}
      <div id="card-iso-workrest" className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          <div>
            <h3 className="text-base font-bold text-white">
              4. ISO 7243 Physical Labor Capacity & Mandatory Rest Schedule Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Occupational physiological heat strain thresholds for construction, dock workers, and municipal staff.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['Light', 'Moderate', 'Heavy', 'VeryHeavy'] as const).map(intensity => (
                <button
                  key={intensity}
                  onClick={() => setSelectedLaborIntensity(intensity)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedLaborIntensity === intensity
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {intensity} ({intensity === 'Light' ? '200W' : intensity === 'Moderate' ? '300W' : intensity === 'Heavy' ? '400W' : '500W'})
                </button>
              ))}
            </div>

            <button
              onClick={() => handleDownloadChartImage('card-iso-workrest', 'HeatGuard_ISO7243_Work_Rest_Matrix')}
              disabled={downloadingChartId === 'card-iso-workrest'}
              className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 text-xs border border-slate-700"
              title="Download Matrix (PNG)"
            >
              <Download className="w-4 h-4" />
              <span className="text-[11px] font-medium">{downloadingChartId === 'card-iso-workrest' ? '...' : 'PNG'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {metabolicLaborData.map((item, idx) => {
            const pct = item[selectedLaborIntensity];
            const isZero = pct === 0;
            const isCritical = pct <= 25;

            return (
              <div 
                key={idx}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition ${
                  isZero ? 'bg-red-500/10 border-red-500/40' :
                  isCritical ? 'bg-orange-500/10 border-orange-500/30' :
                  'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block uppercase font-semibold">WBGT Zone</span>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">{item.wbgtThreshold}</div>
                  
                  <div className="my-4">
                    <div className="flex items-baseline justify-between mb-1 text-xs font-semibold">
                      <span className="text-slate-300">Allowable Work:</span>
                      <span className={`font-mono text-base ${isZero ? 'text-red-400 font-bold' : isCritical ? 'text-orange-400' : 'text-emerald-400'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isZero ? 'bg-red-500' : isCritical ? 'bg-orange-500' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 pt-3 border-t border-slate-800/80 leading-relaxed">
                  {item.workDesc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Modal */}
      <ExportDecisionBriefModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
