import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  RefreshCw, 
  Zap, 
  Hospital, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useSimulation } from '../store/useSimulation';
import ProvenanceBadge from './ProvenanceBadge';

export default function WhatIfHeatIndexSimulator() {
  const { cityMetrics, wards } = useSimulation();

  // User-controllable sliders
  const [ambientTemp, setAmbientTemp] = useState<number>(36); // °C
  const [humidity, setHumidity] = useState<number>(65); // %
  const [windSpeed, setWindSpeed] = useState<number>(2.2); // m/s
  const [solarRadiation, setSolarRadiation] = useState<number>(750); // W/m²
  const [activityLevel, setActivityLevel] = useState<'LIGHT' | 'MODERATE' | 'HEAVY'>('HEAVY');

  // Quick Preset Scenarios
  const presets = [
    {
      name: 'Typical Chennai Summer',
      temp: 36,
      humidity: 65,
      wind: 2.5,
      solar: 750,
      description: 'Humid tropical coastal afternoon'
    },
    {
      name: 'Severe Heatwave Anomaly',
      temp: 42,
      humidity: 68,
      wind: 1.2,
      solar: 950,
      description: 'North-westerly land breeze with extreme thermal load'
    },
    {
      name: 'Dry Continental Blast',
      temp: 44,
      humidity: 28,
      wind: 3.5,
      solar: 900,
      description: 'Intense dry bulb with high radiative heating'
    },
    {
      name: 'Pre-Monsoon Sultry Surge',
      temp: 35,
      humidity: 88,
      wind: 0.8,
      solar: 600,
      description: 'High vapor pressure inhibiting human evaporative cooling'
    },
    {
      name: 'Urban Canopy Cool Island',
      temp: 30,
      humidity: 55,
      wind: 2.8,
      solar: 350,
      description: 'Dense shaded vegetative mitigation zone'
    }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setAmbientTemp(preset.temp);
    setHumidity(preset.humidity);
    setWindSpeed(preset.wind);
    setSolarRadiation(preset.solar);
  };

  // Real-time Physics Calculations
  const calculations = useMemo(() => {
    const T_c = ambientTemp;
    const RH = humidity;
    const T_f = (T_c * 9) / 5 + 32;

    // 1. NOAA Rothfusz Heat Index Formula (in Fahrenheit, converted to Celsius)
    let HI_f = 0.5 * (T_f + 61.0 + (T_f - 68.0) * 1.2 + RH * 0.094);

    if (HI_f >= 80) {
      HI_f =
        -42.379 +
        2.04901523 * T_f +
        10.14333127 * RH -
        0.22475541 * T_f * RH -
        0.00683783 * T_f * T_f -
        0.05481717 * RH * RH +
        0.00122874 * T_f * T_f * RH +
        0.00085282 * T_f * RH * RH -
        0.00000199 * T_f * T_f * RH * RH;

      // Adjustments
      if (RH < 13 && T_f >= 80 && T_f <= 112) {
        const adj = ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T_f - 95.0)) / 17);
        HI_f -= adj;
      } else if (RH > 85 && T_f >= 80 && T_f <= 87) {
        const adj = ((RH - 85) / 10) * ((87 - T_f) / 5);
        HI_f += adj;
      }
    }

    const HI_c = ((HI_f - 32) * 5) / 9;

    // 2. Wet-Bulb Temperature (Stull's equation)
    const Tw =
      T_c * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
      Math.atan(T_c + RH) -
      Math.atan(RH - 1.676331) +
      0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
      4.686035;

    // 3. Globe Temperature Approximation (Liljegren simplified model)
    const Tg = T_c + (solarRadiation / 1000) * (18 / (Math.sqrt(Math.max(windSpeed, 0.5)) + 0.5));

    // 4. Outdoor WBGT
    const wbgt = 0.7 * Tw + 0.2 * Tg + 0.1 * T_c;

    // 5. Danger Categorization
    let dangerCategory: 'SAFE' | 'CAUTION' | 'EXTREME_CAUTION' | 'DANGER' | 'EXTREME_DANGER' = 'SAFE';
    let dangerColor = 'text-emerald-400';
    let dangerBg = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300';
    let healthImpact = 'Minimal thermal strain. Normal bodily thermo-regulation active.';

    if (HI_c >= 54) {
      dangerCategory = 'EXTREME_DANGER';
      dangerColor = 'text-purple-400';
      dangerBg = 'bg-purple-500/25 border-purple-500/50 text-purple-300';
      healthImpact = 'Heat stroke / sunstroke imminent with continued exposure. High risk of fatal cardiovascular collapse.';
    } else if (HI_c >= 41) {
      dangerCategory = 'DANGER';
      dangerColor = 'text-red-400';
      dangerBg = 'bg-red-500/20 border-red-500/40 text-red-300';
      healthImpact = 'Heat cramps or heat exhaustion likely. Heat stroke possible with prolonged physical exertion.';
    } else if (HI_c >= 32) {
      dangerCategory = 'EXTREME_CAUTION';
      dangerColor = 'text-amber-400';
      dangerBg = 'bg-amber-500/20 border-amber-500/40 text-amber-300';
      healthImpact = 'Sunstroke, muscle cramps, and heat exhaustion possible with prolonged exposure and activity.';
    } else if (HI_c >= 27) {
      dangerCategory = 'CAUTION';
      dangerColor = 'text-yellow-400';
      dangerBg = 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300';
      healthImpact = 'Fatigue possible with prolonged exposure and physical activity.';
    }

    // 6. ISO 7243 Work / Rest Schedule
    let workRestRatio = '100% Continuous Work (Standard breaks)';
    let workRestColor = 'text-emerald-400';
    if (wbgt >= 33.0) {
      workRestRatio = 'TOTAL WORK HALT (100% Rest in Air-Conditioned / Shaded Sanctuary)';
      workRestColor = 'text-red-400 font-bold';
    } else if (wbgt >= 31.5) {
      workRestRatio = '15 min Work / 45 min Rest per hour + Mandatory Hydration (750ml/hr)';
      workRestColor = 'text-red-400';
    } else if (wbgt >= 30.0) {
      workRestRatio = '30 min Work / 30 min Rest per hour in shaded cooling hub';
      workRestColor = 'text-orange-400';
    } else if (wbgt >= 28.0) {
      workRestRatio = '45 min Work / 15 min Rest per hour with oral rehydration';
      workRestColor = 'text-amber-400';
    }

    // 7. Clinical & Hospital Surge Projections
    const surgeMultiplier = Math.max(1.0, Math.round((1.0 + Math.max(0, (HI_c - 30) * 0.058)) * 10) / 10);
    const excessMortalityPct = Math.max(0, Math.round(Math.pow(Math.max(0, HI_c - 32), 1.25) * 1.8));

    // 8. Ward Impact Estimation across Chennai
    const simulatedWardStats = wards.map(w => {
      // Apply delta from simulated base to ward
      const deltaT = T_c - cityMetrics.avgTemperature;
      const simWardT = Math.max(22, w.temperature + deltaT);
      const uhiDelta = (w.vulnerabilityScore > 70 ? 2.5 : w.vulnerabilityScore > 50 ? 1.0 : -0.5);
      const simWardHI = HI_c + uhiDelta;
      return {
        id: w.id,
        name: w.name,
        simulatedHI: Math.round(simWardHI * 10) / 10,
        isExtreme: simWardHI >= 41 || wbgt >= 32
      };
    });

    const extremeWardsCount = simulatedWardStats.filter(w => w.isExtreme).length;

    return {
      heatIndexC: Math.round(HI_c * 10) / 10,
      heatIndexF: Math.round(HI_f * 10) / 10,
      wetBulbTemp: Math.round(Tw * 10) / 10,
      globeTemp: Math.round(Tg * 10) / 10,
      wbgt: Math.round(wbgt * 10) / 10,
      dangerCategory,
      dangerColor,
      dangerBg,
      healthImpact,
      workRestRatio,
      workRestColor,
      surgeMultiplier,
      excessMortalityPct,
      extremeWardsCount
    };
  }, [ambientTemp, humidity, windSpeed, solarRadiation, wards, cityMetrics]);

  // Matrix Grid points for 2D Heat Index Visualizer
  const matrixTemps = [26, 30, 34, 38, 42, 46, 50];
  const matrixHumidities = [20, 40, 60, 80, 100];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#121b2d] via-[#101828] to-[#151d33] border border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive 'What-If' Thermal Laboratory
            </span>
            <ProvenanceBadge type="MODELLED" source="NOAA Rothfusz HI & Liljegren WBGT" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            Real-Time Heat Index & Microclimate Stress Simulator
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Adjust temperature, relative humidity, and atmospheric parameters to simulate human thermal strain, hospital surge, and ISO 7243 labor moratoriums instantly.
          </p>
        </div>

        {/* Live Delta Pill */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shrink-0 text-right">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Live City Baseline</span>
          <div className="font-mono text-sm text-slate-200">
            {cityMetrics.avgTemperature}°C / {cityMetrics.avgHumidity}% RH
          </div>
          <span className="text-[11px] text-cyan-400 font-semibold block">
            WBGT: {cityMetrics.avgWbgt}°C
          </span>
        </div>
      </div>

      {/* Preset Scenario Buttons */}
      <div className="bg-[#121826] border border-slate-800/80 rounded-2xl p-4 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Quick Scenario Presets:
          </span>
          <span className="text-[11px] text-slate-500">Click to instantly load meteorological profile</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="p-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition group space-y-1"
            >
              <strong className="text-xs font-bold text-white group-hover:text-cyan-300 block truncate">
                {p.name}
              </strong>
              <div className="text-[11px] font-mono text-amber-400">
                {p.temp}°C · {p.humidity}% RH
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Column: Sliders (Left) vs Real-Time Impact Dashboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Parameter Controls */}
        <div className="lg:col-span-5 bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Atmospheric Parameter Controls</span>
            </h3>
            <button
              onClick={() => {
                setAmbientTemp(36);
                setHumidity(65);
                setWindSpeed(2.2);
                setSolarRadiation(750);
              }}
              className="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition"
              title="Reset parameters"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Ambient Dry-Bulb Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-red-400" />
                <span>Ambient Air Temperature (Dry-Bulb)</span>
              </label>
              <div className="font-mono text-base font-extrabold text-white bg-slate-900 border border-slate-700 px-3 py-0.5 rounded-lg">
                {ambientTemp}°C <span className="text-slate-400 text-xs font-normal">/ {Math.round((ambientTemp * 9) / 5 + 32)}°F</span>
              </div>
            </div>
            <input
              type="range"
              min="20"
              max="52"
              step="0.5"
              value={ambientTemp}
              onChange={(e) => setAmbientTemp(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>20°C (Mild)</span>
              <span>35°C (Threshold)</span>
              <span>45°C (Extreme)</span>
              <span>52°C (Lethal)</span>
            </div>
          </div>

          {/* Slider 2: Relative Humidity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>Relative Humidity (RH)</span>
              </label>
              <div className="font-mono text-base font-extrabold text-cyan-400 bg-slate-900 border border-slate-700 px-3 py-0.5 rounded-lg">
                {humidity}%
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={humidity}
              onChange={(e) => setHumidity(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10% (Arid)</span>
              <span>50% (Comfortable)</span>
              <span>75% (Coastal Chennai)</span>
              <span>100% (Saturated)</span>
            </div>
          </div>

          {/* Slider 3: Wind Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-400" />
                <span>Surface Wind Speed (2m)</span>
              </label>
              <div className="font-mono text-sm font-bold text-teal-300 bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-lg">
                {windSpeed} m/s
              </div>
            </div>
            <input
              type="range"
              min="0.2"
              max="10.0"
              step="0.1"
              value={windSpeed}
              onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.2 m/s (Stagnant)</span>
              <span>2.5 m/s (Sea Breeze)</span>
              <span>10 m/s (Gale)</span>
            </div>
          </div>

          {/* Slider 4: Solar Radiant Flux */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Global Solar Radiation (Radiant Flux)</span>
              </label>
              <div className="font-mono text-sm font-bold text-amber-400 bg-slate-900 border border-slate-700 px-2.5 py-0.5 rounded-lg">
                {solarRadiation} W/m²
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1100"
              step="25"
              value={solarRadiation}
              onChange={(e) => setSolarRadiation(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Night/Shade)</span>
              <span>500 (Overcast)</span>
              <span>800 (Direct Sun)</span>
              <span>1100 (Solar Peak)</span>
            </div>
          </div>

          {/* Physical Workload Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300 block">
              Occupational Metabolic Rate (ISO 7243):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['LIGHT', 'MODERATE', 'HEAVY'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setActivityLevel(lvl)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition text-center ${
                    activityLevel === lvl
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl === 'LIGHT' ? 'Light (Office)' : lvl === 'MODERATE' ? 'Moderate (Trade)' : 'Heavy (Labor)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Real-time Output & Biometeorology Physics */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Hero Card: Real-Time Heat Index & Danger Gauge */}
          <div className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Simulated Human "Feels-Like" Temperature
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className={`text-4xl md:text-5xl font-black font-mono tracking-tight ${calculations.dangerColor}`}>
                    {calculations.heatIndexC}°C
                  </span>
                  <span className="text-xl md:text-2xl text-slate-400 font-mono">
                    ({calculations.heatIndexF}°F)
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Air Temp: <strong className="text-white font-mono">{ambientTemp}°C</strong> + Humidity Adjustment ({humidity}% RH)
                </div>
              </div>

              {/* Danger Category Badge */}
              <div className="shrink-0">
                <span className={`px-4 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wide border flex items-center gap-2 shadow-lg ${calculations.dangerBg}`}>
                  <Flame className="w-4 h-4 shrink-0" />
                  <span>{calculations.dangerCategory.replace('_', ' ')}</span>
                </span>
              </div>
            </div>

            {/* Visual Heat Index Severity Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>NOAA Heat Hazard Severity Scale</span>
                <span className={calculations.dangerColor}>
                  {calculations.dangerCategory.replace('_', ' ')} ({calculations.heatIndexC}°C)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-emerald-500 via-amber-500 via-orange-500 via-red-500 to-purple-600 shadow-md"
                  style={{ width: `${Math.min(100, Math.max(5, ((calculations.heatIndexC - 20) / 45) * 100))}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Safe (&lt;27°C)</span>
                <span>Caution (27-32)</span>
                <span>Ext Caution (32-41)</span>
                <span>Danger (41-54)</span>
                <span>Extreme (&gt;54°C)</span>
              </div>
            </div>

            {/* Real-time Multi-Model Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Liljegren WBGT</span>
                <strong className="text-amber-400 text-lg font-mono block mt-0.5">{calculations.wbgt}°C</strong>
                <span className="text-slate-400 text-[10px]">Solar-adjusted</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Wet-Bulb (Tw)</span>
                <strong className="text-cyan-400 text-lg font-mono block mt-0.5">{calculations.wetBulbTemp}°C</strong>
                <span className="text-slate-400 text-[10px]">Stull formula</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Hospital Surge</span>
                <strong className="text-red-400 text-lg font-mono block mt-0.5">{calculations.surgeMultiplier}×</strong>
                <span className="text-slate-400 text-[10px]">Emergency admissions</span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Excess Mortality</span>
                <strong className="text-purple-400 text-lg font-mono block mt-0.5">+{calculations.excessMortalityPct}%</strong>
                <span className="text-slate-400 text-[10px]">Relative risk</span>
              </div>
            </div>

            {/* Directives and Clinical Guidance */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">Physiological Health Impact:</strong>
                  <p className="text-slate-300 text-xs leading-relaxed mt-0.5">
                    {calculations.healthImpact}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-slate-800 pt-2.5">
                <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold">ISO 7243 Occupational Work / Rest Directive:</strong>
                  <p className={`text-xs mt-0.5 font-medium ${calculations.workRestColor}`}>
                    {calculations.workRestRatio}
                  </p>
                </div>
              </div>
            </div>

            {/* City-Wide Ward Impact Simulation Callout */}
            <div className="p-4 bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-red-400 uppercase font-bold block">
                  Metropolitan Chennai Impact Projection
                </span>
                <div className="text-sm font-bold text-white mt-0.5">
                  <strong className="text-red-400 font-mono text-base">{calculations.extremeWardsCount} of 200</strong> Wards Breach Critical Heatwave Stage
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Under this simulated atmospheric state, mandatory water distribution and emergency EMS shifts would be triggered.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive 2D Heat Index Matrix Grid (Temperature vs. Humidity Surface) */}
          <div className="bg-[#121826] border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>2D Psychrometric Risk Matrix (T vs RH)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  The highlighted cell marks your current simulation coordinates ({ambientTemp}°C, {humidity}% RH)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                    <th className="p-2 text-left">Air Temp ↓ / RH →</th>
                    {matrixHumidities.map(rh => (
                      <th key={rh} className="p-2 font-bold text-cyan-300">{rh}%</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrixTemps.map(t => (
                    <tr key={t} className="border-b border-slate-800/50">
                      <td className="p-2 text-left font-bold text-amber-300">{t}°C</td>
                      {matrixHumidities.map(rh => {
                        // Quick HI for grid cell
                        const Tf = (t * 9) / 5 + 32;
                        let HIf = 0.5 * (Tf + 61.0 + (Tf - 68.0) * 1.2 + rh * 0.094);
                        if (HIf >= 80) {
                          HIf = -42.379 + 2.049 * Tf + 10.143 * rh - 0.224 * Tf * rh - 0.0068 * Tf * Tf - 0.054 * rh * rh + 0.0012 * Tf * Tf * rh + 0.00085 * Tf * rh * rh - 0.00000199 * Tf * Tf * rh * rh;
                        }
                        const HIc = Math.round(((HIf - 32) * 5) / 9);

                        const isCurrentActive = 
                          Math.abs(t - ambientTemp) <= 2 && Math.abs(rh - humidity) <= 10;

                        const cellBg = 
                          HIc >= 54 ? 'bg-purple-950/70 text-purple-300' :
                          HIc >= 41 ? 'bg-red-950/70 text-red-300' :
                          HIc >= 32 ? 'bg-amber-950/70 text-amber-300' :
                          HIc >= 27 ? 'bg-yellow-950/70 text-yellow-300' : 'bg-slate-900/70 text-slate-300';

                        return (
                          <td 
                            key={rh} 
                            className={`p-2 transition-all ${cellBg} ${
                              isCurrentActive ? 'ring-2 ring-cyan-400 font-extrabold scale-105 rounded-lg shadow-lg z-10' : ''
                            }`}
                          >
                            {HIc}°C
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Color key: <span className="text-yellow-400">Caution</span> · <span className="text-amber-400">Ext Caution</span> · <span className="text-red-400">Danger</span> · <span className="text-purple-400">Extreme Danger</span></span>
              <span className="font-mono text-cyan-400">Current Position: {calculations.heatIndexC}°C</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
