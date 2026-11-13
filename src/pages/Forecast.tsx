import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
import { 
  Calendar, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  Hospital, 
  Flame, 
  Info, 
  Clock, 
  ArrowRight, 
  TrendingUp,
  Activity,
  HeartPulse
} from 'lucide-react';
import ProvenanceBadge from '../components/ProvenanceBadge';
import { Link } from 'react-router-dom';

export default function Forecast() {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const forecastData = [
    {
      day: 'Day 1 (Today)',
      date: '15 May 2024',
      maxTemp: 41.8,
      minTemp: 29.4,
      humidity: 58,
      wbgtMax: 33.1,
      heatRiskScore: 84,
      riskCategory: 'High',
      hospitalRisk: '1.8x',
      hospitalRiskNum: 1.8,
      mortalityRisk: '↑ 23%',
      mortalityRiskNum: 23,
      healthImpact: 'HIGH',
      vulnerableExposure: '1.42M',
      vulnerableExposureNum: 1420,
      classification: 'Heatwave Alert',
      directive: 'Activate shaded hydration points across transit hubs; issue construction labor work-rest mandate (30 min/hr).'
    },
    {
      day: 'Day 2 (D+1)',
      date: '16 May 2024',
      maxTemp: 42.4,
      minTemp: 30.1,
      humidity: 61,
      wbgtMax: 33.6,
      heatRiskScore: 89,
      riskCategory: 'High',
      hospitalRisk: '2.1x',
      hospitalRiskNum: 2.1,
      mortalityRisk: '↑ 28%',
      mortalityRiskNum: 28,
      healthImpact: 'VERY HIGH',
      vulnerableExposure: '1.68M',
      vulnerableExposureNum: 1680,
      classification: 'Heatwave',
      directive: 'Pre-alert emergency medical centers; deploy mobile water bowsers to North Chennai informal settlements.'
    },
    {
      day: 'Day 3 (D+2)',
      date: '17 May 2024',
      maxTemp: 43.1,
      minTemp: 31.0,
      humidity: 64,
      wbgtMax: 34.4,
      heatRiskScore: 94,
      riskCategory: 'Extreme',
      hospitalRisk: '2.4x',
      hospitalRiskNum: 2.4,
      mortalityRisk: '↑ 34%',
      mortalityRiskNum: 34,
      healthImpact: 'EXTREME',
      vulnerableExposure: '2.15M',
      vulnerableExposureNum: 2150,
      classification: 'Severe Heatwave',
      directive: 'CRITICAL PEAK SPIKE: Total cessation of outdoor manual labor (11:30-16:00); activate tertiary ice-bath immersion protocols; broadcast emergency SMS warnings.'
    },
    {
      day: 'Day 4 (D+3)',
      date: '18 May 2024',
      maxTemp: 40.5,
      minTemp: 28.8,
      humidity: 52,
      wbgtMax: 31.8,
      heatRiskScore: 74,
      riskCategory: 'High',
      hospitalRisk: '1.5x',
      hospitalRiskNum: 1.5,
      mortalityRisk: '↑ 15%',
      mortalityRiskNum: 15,
      healthImpact: 'HIGH',
      vulnerableExposure: '1.18M',
      vulnerableExposureNum: 1180,
      classification: 'Heatwave Alert',
      directive: 'Sustained hospital dehydration triage; replenish ORS depots; evaluate vulnerable elderly cohort wellness.'
    },
    {
      day: 'Day 5 (D+4)',
      date: '19 May 2024',
      maxTemp: 38.2,
      minTemp: 27.5,
      humidity: 48,
      wbgtMax: 29.5,
      heatRiskScore: 54,
      riskCategory: 'Moderate',
      hospitalRisk: '1.1x',
      hospitalRiskNum: 1.1,
      mortalityRisk: '↑ 7%',
      mortalityRiskNum: 7,
      healthImpact: 'MODERATE',
      vulnerableExposure: '0.62M',
      vulnerableExposureNum: 620,
      classification: 'Normal Advisory',
      directive: 'Normal work operations permitted with standard hydration guidelines; compile municipal intervention report.'
    }
  ];

  const selectedDay = forecastData[selectedDayIdx];

  return (
    <div className="max-w-6xl mx-auto space-y-5 font-mono pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c1322] border border-slate-800 p-4 rounded-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              5-DAY HEALTH IMPACT OUTLOOK
            </h1>
            <ProvenanceBadge type="HISTORICAL_OFFICIAL" source="IMD Numerical Weather Prediction" />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Predicting heat-induced mortality and hospitalization spikes 3 to 5 days in advance for pre-emptive municipal and healthcare mobilization.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-red-950 text-red-300 border border-red-800 rounded-sm font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            CRITICAL SPIKE PROJECTED D+2 (17 MAY)
          </span>
        </div>
      </div>

      {/* 5-DAY DETAILED CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {forecastData.map((day, idx) => {
          const isSelected = selectedDayIdx === idx;
          const isPeak = idx === 2;

          return (
            <button
              key={idx}
              onClick={() => setSelectedDayIdx(idx)}
              className={`p-3 rounded-sm border text-left flex flex-col justify-between transition relative ${
                isSelected
                  ? 'bg-slate-900 border-blue-500 shadow-md ring-1 ring-blue-500'
                  : isPeak
                  ? 'bg-red-950/40 border-red-900/80 hover:bg-red-900/40'
                  : 'bg-[#0c1322] border-slate-800 hover:bg-slate-900'
              }`}
            >
              {isPeak && (
                <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-red-600 text-white font-bold text-[8px] rounded uppercase tracking-wider">
                  Peak Surge
                </span>
              )}

              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-bold text-slate-200">{day.day.split(' ')[0]} {day.day.split(' ')[1]}</span>
                  <span className="text-[9px] text-slate-500">{day.date.split(' ').slice(0, 2).join(' ')}</span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <div className="text-xl font-bold text-white">
                    {day.maxTemp}°C
                  </div>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-xs border uppercase ${
                    day.healthImpact === 'EXTREME' ? 'bg-red-900 text-red-200 border-red-700' :
                    day.healthImpact === 'VERY HIGH' ? 'bg-orange-900 text-orange-200 border-orange-700' :
                    day.healthImpact === 'HIGH' ? 'bg-amber-900 text-amber-200 border-amber-700' :
                    'bg-emerald-900 text-emerald-200 border-emerald-700'
                  }`}>
                    {day.healthImpact}
                  </span>
                </div>
              </div>

              {/* SIH Specified Metric Lines */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1 text-[9px]">
                <div className="flex justify-between text-slate-400">
                  <span>WBGT Stress:</span>
                  <span className="font-bold text-amber-400">{day.wbgtMax}°C</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Heat Risk:</span>
                  <span className="font-bold text-red-400">{day.heatRiskScore}/100</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Hospital Risk:</span>
                  <span className="font-bold text-blue-400">{day.hospitalRisk}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Mortality Risk:</span>
                  <span className="font-bold text-red-400">{day.mortalityRisk}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Deep Dive + Pre-Cooling Directive */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-4 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-bold block">
              Projection Deep Dive
            </span>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              {selectedDay.day} ({selectedDay.date}) · {selectedDay.classification.toUpperCase()}
            </h3>
          </div>
          <ProvenanceBadge type="MODELLED" source="Liljegren Biometeorology & DLNM Model" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block">Max WBGT Load</span>
            <div className="text-xl font-bold text-amber-400 mt-1">{selectedDay.wbgtMax}°C</div>
            <span className="text-[9px] text-red-400 mt-0.5 block">Heavy physical labor hazard</span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block">Exposed Population</span>
            <div className="text-xl font-bold text-slate-200 mt-1">{selectedDay.vulnerableExposure}</div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">Informal & outdoor workers</span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block">Hospital Surge Risk</span>
            <div className="text-xl font-bold text-blue-400 mt-1">{selectedDay.hospitalRisk} Baseline</div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">Emergency heat-stroke units</span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block">Mortality Risk Elevation</span>
            <div className="text-xl font-bold text-red-400 mt-1">{selectedDay.mortalityRisk}</div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">Epidemiological excess</span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded border border-slate-800">
            <span className="text-[9px] text-slate-500 uppercase block">Health Impact Level</span>
            <div className="text-xl font-bold text-red-400 mt-1">{selectedDay.healthImpact}</div>
            <span className="text-[9px] text-slate-400 mt-0.5 block">NDMA Tier Triggered</span>
          </div>
        </div>

        {/* Action Directive Box */}
        <div className="p-3.5 bg-red-950/40 border border-red-900/70 rounded-sm text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-red-300 font-bold uppercase tracking-wider block text-[11px]">
              Municipal & Health Directive for {selectedDay.day}:
            </span>
            <p className="text-red-200/90 text-[11px] leading-relaxed">
              {selectedDay.directive}
            </p>
          </div>
        </div>
      </div>

      {/* 5-Day Trend Graphs (Hospital Surge & Mortality Elevation vs Ambient Temp) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Hospital className="w-3.5 h-3.5 text-blue-400" /> Hospital Surge & Mortality Elevation (%)
            </h3>
            <span className="text-[9px] text-slate-500">DLNM Calibrated</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMortality" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 40]} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c1322', borderColor: '#334155', color: '#f1f5f9', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="mortalityRiskNum" name="Excess Mortality Risk (%)" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorMortality)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-amber-400" /> Vulnerable Population Exposure (Thousands)
            </h3>
            <span className="text-[9px] text-slate-500">Census Overlaid</span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0c1322', borderColor: '#334155', color: '#f1f5f9', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Bar dataKey="vulnerableExposureNum" name="Exposed Population ('000s)" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Early Warning Anomaly Box */}
      <div className="p-4 bg-orange-950/40 border border-orange-900/80 rounded-sm flex items-start gap-3 text-xs">
        <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-orange-300 uppercase tracking-wider mb-1">
            Day 3 (17 May) Severe Heat Anomaly Alert:
          </h4>
          <p className="text-orange-200/90 leading-relaxed text-[11px]">
            Atmospheric forecast models indicate a severe convective inversion trapping 43.1°C air over North Chennai with 64% coastal humidity. 
            The biometeorological engine calculates an unprecedented WBGT of 34.4°C (surpassing human uncompensable heat limits). 
            Authorities are advised to enforce pre-cooling protocols and alert 108 emergency services 48 hours in advance.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <Link
              to="/action-plan"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xs transition"
            >
              Generate 48-Hour Pre-Cooling Action Plan <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/health-risk"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xs transition"
            >
              View Health & Mortality Risk Model
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
