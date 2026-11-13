import React from 'react';
import { BookOpen, FileCheck, ShieldCheck, Activity, Layers, Database, Calculator, Scale } from 'lucide-react';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function Methodology() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c1322] border border-slate-800 p-4 rounded-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Scientific Methodology & Mathematical Formulations
            </h1>
            <ProvenanceBadge type="OFFICIAL" source="WMO / ISO 7243 / IMD Standards" />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Peer-reviewed biometeorological modeling pipelines, vulnerability weighting matrices, and empirical validation.
          </p>
        </div>
      </div>

      {/* Core Principle Banner */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-4 text-xs space-y-2">
        <h2 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          Core Paradigm: From Atmospheric Heat to Human Physiological Risk
        </h2>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          Standard meteorological forecasts report dry-bulb ambient temperature. However, human health impacts are governed by the body's thermodynamic equilibrium—determined by atmospheric humidity (evaporative limit), wind speed (convective flux), solar radiation (radiant load), and socio-demographic exposure (housing quality, age cohorts, outdoor physical labor).
        </p>
      </div>

      {/* Section 1: Biometeorological Formulations */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-5 space-y-4">
        <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              1. Biometeorological Physics Equations
            </h3>
          </div>
          <ProvenanceBadge type="MODELLED" source="Liljegren & Stull" size="xs" />
        </div>

        <div className="space-y-4 text-xs">
          {/* Wet-Bulb Temp */}
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200 text-[11px]">
              A. Wet-Bulb Temperature (Tw) — Stull (2011) Empirical Formulation:
            </div>
            <div className="p-2 bg-[#090e1a] rounded text-amber-300 text-[10px] overflow-x-auto">
              {"Tw = T · atan(0.151977 · (RH + 8.313659)^0.5) + atan(T + RH) - atan(RH - 1.676331) + 0.00391838 · (RH)^1.5 · atan(0.023101 · RH) - 4.686035"}
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Valid across relative humidities from 5% to 99% and temperatures from -20°C to 50°C, providing the thermodynamic limit for cutaneous evaporation.
            </p>
          </div>

          {/* WBGT */}
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200 text-[11px]">
              B. Wet-Bulb Globe Temperature (WBGT) — ISO 7243 Outdoor Weighting:
            </div>
            <div className="p-2 bg-[#090e1a] rounded text-amber-300 text-[10px]">
              {"WBGT_outdoor = 0.70 · T_nw + 0.20 · T_g + 0.10 · T_a"}
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Where T_nw is natural wet-bulb temperature, T_g is black globe radiation temperature, and T_a is ambient dry-bulb temperature. 
              Thresholds exceedance (&gt;32.5°C) mandates statutory labor work-rest cycles.
            </p>
          </div>

          {/* Heat Index */}
          <div className="p-3 bg-slate-900/80 rounded border border-slate-800 space-y-1.5">
            <div className="font-bold text-slate-200 text-[11px]">
              C. Apparent Heat Index (HI) — Rothfusz Multivariable Polynomial:
            </div>
            <div className="p-2 bg-[#090e1a] rounded text-amber-300 text-[10px] overflow-x-auto">
              {"HI = -42.379 + 2.04901523·T + 10.14333127·RH - 0.22475541·T·RH - 6.83783e-3·T^2 - 5.481717e-2·RH^2 + 1.22874e-3·T^2·RH + 8.5282e-4·T·RH^2 - 1.99e-6·T^2·RH^2"}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Demographic Vulnerability Index */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-5 space-y-4">
        <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              2. Socio-Demographic Vulnerability Index (Vi) Formulation
            </h3>
          </div>
          <ProvenanceBadge type="OFFICIAL" source="Census & PLFS Tables" size="xs" />
        </div>

        <div className="space-y-3 text-xs">
          <p className="text-slate-300 leading-relaxed text-[11px]">
            The spatial vulnerability score Vi in [0, 100] for ward i is calculated as a normalized multi-criteria composite:
          </p>

          <div className="p-3 bg-[#090e1a] rounded text-purple-300 text-[10px] space-y-1">
            <div>{"Vi = w1·LaborExposure_i + w2·ElderlyRatio_i + w3·SlumHousing_i + w4·Density_i - w5·CanopyCover_i"}</div>
            <div className="text-slate-500 pt-1 border-t border-slate-800">
              Where calibrated weights: w1 = 0.35 (Outdoor Labor), w2 = 0.25 (Geriatric Cohort), w3 = 0.20 (Tin Roof Informal Settlements), w4 = 0.10 (Urban Density), w5 = 0.10 (Green Tree Canopy Buffer).
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Composite Heat-Health Risk Score */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-5 space-y-4">
        <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              3. Composite HeatGuard Early Warning Risk Score (Ri)
            </h3>
          </div>
          <ProvenanceBadge type="MODELLED" source="HeatGuard Core" size="xs" />
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#090e1a] rounded text-emerald-300 text-[10px]">
            {"Ri = min(100, 0.55 · ThermalStressScore(WBGT_i) + 0.45 · Vi)"}
          </div>
          <p className="text-slate-400 text-[10px] leading-relaxed">
            When Ri &ge; 80, the system automatically issues an NDMA Tier 3 (Red) alert directing labor stoppage, water bowser deployments, and hospital ice-bath readiness.
          </p>
        </div>
      </div>
    </div>
  );
}
