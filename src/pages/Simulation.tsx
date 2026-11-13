import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Server, 
  FileCheck, 
  ExternalLink, 
  Radio, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  Building,
  Activity,
  Satellite,
  HelpCircle,
  ArrowRight,
  Calculator,
  Search,
  BookOpen,
  Users,
  Smartphone,
  Sparkles,
  Sliders
} from 'lucide-react';
import { DATA_SOURCE_REGISTRY } from '../data/officialDatasets';
import ProvenanceBadge from '../components/ProvenanceBadge';
import CitizenDirectoryManager from '../components/CitizenDirectoryManager';
import WhatsAppAlertDispatcher from '../components/WhatsAppAlertDispatcher';
import WhatIfHeatIndexSimulator from '../components/WhatIfHeatIndexSimulator';

export default function DataSources() {
  const [activeTab, setActiveTab] = useState<'whatif' | 'citizens' | 'whatsapp' | 'datasets'>('whatif');
  const [selectedAuditMetric, setSelectedAuditMetric] = useState<'wbgt' | 'vulnerability' | 'mortality' | 'hospital' | 'uhi'>('wbgt');


  const provenanceAudits = {
    wbgt: {
      title: 'Wet-Bulb Globe Temperature (WBGT)',
      currentValue: '33.1°C (Extreme Thermal Hazard)',
      status: 'MODELLED / DERIVED',
      statusType: 'MODELLED' as const,
      inputData: [
        { parameter: 'Dry-Bulb Ambient Temp (T)', source: 'IMD AWS Station (Meenambakkam / Nungambakkam)', type: 'OFFICIAL' as const, cadence: '15-min Telemetry' },
        { parameter: 'Relative Humidity (RH)', source: 'IMD Automated Weather Station Feed', type: 'OFFICIAL' as const, cadence: '15-min Telemetry' },
        { parameter: 'Wind Speed at 2m (u)', source: 'IMD Anemometer Network', type: 'OFFICIAL' as const, cadence: '15-min Telemetry' },
        { parameter: 'Global Solar Radiation (S)', source: 'IMD Pyranometer / INSAT-3DR Radiance', type: 'OFFICIAL' as const, cadence: 'Hourly Satellite Synoptic' }
      ],
      calculationFormula: 'Liljegren et al. (2008) Comprehensive Physics Solver & ISO 7243 Standard: WBGT = 0.7 Tw + 0.2 Tg + 0.1 Td (Outdoor with direct solar radiant flux).',
      scientificCitation: 'Liljegren, J. C., et al. (2008). Modeling the Wet Bulb Globe Temperature Using Standard Meteorological Measurements. Journal of Occupational and Environmental Hygiene, 5(10), 645-655.',
      governanceNotes: 'Validated against calibrated QuestTemp 34 thermal stress dataloggers. Surpasses raw air temperature by accounting for evaporative cooling failure and radiant solar load.'
    },
    vulnerability: {
      title: 'Socio-Demographic Vulnerability Index',
      currentValue: '84 / 100 (Tondiarpet / High Vulnerability)',
      status: 'OFFICIAL CENSUS & SURVEY AGGREGATED',
      statusType: 'OFFICIAL' as const,
      inputData: [
        { parameter: 'Ward Population & Density', source: 'Office of the Registrar General & Census Commissioner', type: 'OFFICIAL' as const, cadence: 'Decennial Census & GIS Ward Boundaries' },
        { parameter: 'Outdoor / Informal Labor Proportion', source: 'Periodic Labour Force Survey (PLFS) & MoSPI', type: 'OFFICIAL' as const, cadence: 'Annual Urban Sample' },
        { parameter: 'Informal / Tin-Roof Housing Share', source: 'Tamil Nadu Slum Clearance Board / GCC Survey', type: 'OFFICIAL' as const, cadence: 'Municipal Registry' },
        { parameter: 'Tree Canopy & Vegetative Buffer', source: 'Sentinel-2 NDVI 10m MultiSpectral Analysis', type: 'MODELLED' as const, cadence: 'Monthly Cloud-Free Composite' }
      ],
      calculationFormula: 'Composite vulnerability vector V = 0.35(OutdoorLabor%) + 0.25(SlumHousing%) + 0.20(Elderly%) + 0.20(1 - NDVI Canopy)',
      scientificCitation: 'Government of India NDMA National Heat Wave Action Guidelines (2019) & IPCC AR6 WGII Chapter on Urban Vulnerability.',
      governanceNotes: 'Normalized across all 200 Greater Chennai Corporation wards to prevent subjective resource allocation.'
    },
    mortality: {
      title: 'Heat-Attributable Excess Mortality Risk',
      currentValue: '↑ 23% Relative Risk Elevation (Modelled)',
      status: 'MODELLED - EPIDEMIOLOGICAL ESTIMATION',
      statusType: 'MODELLED' as const,
      inputData: [
        { parameter: 'Baseline All-Cause Mortality Rates', source: 'Civil Registration System (CRS) Vital Statistics', type: 'HISTORICAL_OFFICIAL' as const, cadence: 'Annual Municipal Baseline' },
        { parameter: 'Cumulative Thermal Exposure (WBGT & EHF)', source: 'HeatGuard Biometeorology Engine', type: 'MODELLED' as const, cadence: 'Hourly Continuous Integration' },
        { parameter: 'Demographic Age-Distribution Matrix', source: 'Census Cohort Stratification', type: 'OFFICIAL' as const, cadence: 'Official Demographic Tables' }
      ],
      calculationFormula: 'Distributed Lag Non-linear Model (DLNM) exposure-response curve calibrated for tropical urban populations: RR = exp(β * [WBGT - WBGT_threshold]₊ + Σ Lag_k).',
      scientificCitation: 'Gasparrini, A. et al. (2015). Mortality risk attributable to high and low ambient temperature: a multicountry observational study. The Lancet, 386(9991), 369-375.',
      governanceNotes: 'Strictly labeled as "Estimated Health Impact Risk — Modelled" to ensure scientific defensibility and avoid misrepresenting statistical models as official death toll records.'
    },
    hospital: {
      title: 'Emergency Department Hospital Surge Multiplier',
      currentValue: '1.8× Normal Baseline Admissions',
      status: 'MODELLED / CLINICAL SURVEILLANCE',
      statusType: 'MODELLED' as const,
      inputData: [
        { parameter: '108 Emergency Ambulance Heat Dispatches', source: 'GVK EMRI 108 Emergency Service Tamil Nadu', type: 'OFFICIAL' as const, cadence: 'Live Shift Dispatch Logs' },
        { parameter: 'Tertiary Hospital Bed Occupancy', source: 'Directorate of Medical Education (DME) Tamil Nadu', type: 'OFFICIAL' as const, cadence: 'Daily Hospital Returns' },
        { parameter: 'Thermal Heat Risk Score', source: 'HeatGuard Multi-Risk Index', type: 'MODELLED' as const, cadence: 'Real-time Ward Calculation' }
      ],
      calculationFormula: 'Surge Factor S = 1.0 + max(0, (RiskScore - 50) * 0.035), with a 24-hour distributed lag for acute dehydration and CVD decompensation.',
      scientificCitation: 'WHO-WMO Heatwaves and Health: Guidance on Warning-System Development (WMO-No. 1142).',
      governanceNotes: 'Guides pre-allocation of cold saline IV reserves, extra emergency triage shifts, and ice-bath resuscitation protocols.'
    },
    uhi: {
      title: 'Urban Heat Island (UHI) Thermal Microclimate Delta',
      currentValue: '+3.8°C North Chennai Industrial Surplus',
      status: 'REMOTE SENSING & SURFACE TEMPERATURE',
      statusType: 'MODELLED' as const,
      inputData: [
        { parameter: 'Landsat-9 TIRS Thermal Band 10', source: 'USGS / NASA Earth Explorer', type: 'OFFICIAL' as const, cadence: '16-Day Revisit' },
        { parameter: 'Surface Emissivity from ASTER GED', source: 'NASA Land Processes DAAC', type: 'OFFICIAL' as const, cadence: 'Static Baseline Calibration' },
        { parameter: 'In-Situ AWS Ground Temperature', source: 'IMD Synoptic Surface Network', type: 'OFFICIAL' as const, cadence: 'Hourly Calibration Ground-Truth' }
      ],
      calculationFormula: 'Split-window Radiative Transfer Equation: LST = γ[ε⁻¹(ψ₁Lsensor + ψ₂) + ψ₃] + δ, downscaled to 30m resolution.',
      scientificCitation: 'Sobrino, J. A., et al. (2004). Land surface temperature retrieval from Landsat-5 TM. Remote Sensing of Environment, 90(4), 434-440.',
      governanceNotes: 'Explains spatial variance between coastal coastal breezes (e.g. Adyar) vs. dense built-up concrete corridors (e.g. Royapuram).'
    }
  };

  const currentAudit = provenanceAudits[selectedAuditMetric];

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c1322] border border-slate-800 p-4 rounded-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              DATA SOURCES & CITIZEN REGISTRY GATEWAY
            </h1>
            <ProvenanceBadge type="OFFICIAL" source="Government of India & WMO Scientific Standards" />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Manage citizen phone numbers by location, extract contacts from CSV, trigger WhatsApp thermal warnings, and inspect telemetry provenance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-sm font-bold flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            WHATSAPP API READY
          </span>
        </div>
      </div>

      {/* PRIMARY NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('whatif')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'whatif'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4 text-cyan-300" />
          <span>'What-If' Heat Index Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('citizens')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'citizens'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-300" />
          <span>Citizen Phone Directory & CSV Extractor</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-300" />
          <span>WhatsApp Alert Dispatcher</span>
        </button>

        <button
          onClick={() => setActiveTab('datasets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
            activeTab === 'datasets'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4 text-blue-300" />
          <span>Official Datasets & Model Audits</span>
        </button>
      </div>

      {/* TAB 0: WHAT-IF HEAT INDEX & THERMAL SIMULATOR */}
      {activeTab === 'whatif' && (
        <div className="space-y-6">
          <WhatIfHeatIndexSimulator />
        </div>
      )}

      {/* TAB 1: CITIZEN DIRECTORY & CSV EXTRACTOR */}
      {activeTab === 'citizens' && (
        <div className="space-y-6">
          <CitizenDirectoryManager />
          <WhatsAppAlertDispatcher />
        </div>
      )}

      {/* TAB 2: WHATSAPP DISPATCHER FOCUS */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-6">
          <WhatsAppAlertDispatcher />
          <CitizenDirectoryManager />
        </div>
      )}

      {/* TAB 3: OFFICIAL SCIENTIFIC DATASETS & PROVENANCE */}
      {activeTab === 'datasets' && (
        <div className="space-y-6">
          {/* INTERACTIVE "WHERE DID THIS NUMBER COME FROM?" PROVENANCE EXPLORER */}
          <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-4 shadow-md space-y-4">
            <div className="border-b border-slate-800 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Interactive Traceability Explorer</span>
                <h2 className="text-xs font-bold text-slate-100 uppercase flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-400" />
                  Where Did This Metric Come From?
                </h2>
              </div>
              <span className="text-[10px] text-slate-500">Select any HeatGuard metric to view its complete origin & mathematics</span>
            </div>

            {/* Metric Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => setSelectedAuditMetric('wbgt')}
            className={`p-2.5 rounded-xs border text-left transition ${
              selectedAuditMetric === 'wbgt'
                ? 'bg-blue-950 border-blue-500 text-blue-200 ring-1 ring-blue-500'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-[9px] text-slate-500 block uppercase">Thermal Stress</span>
            <span className="text-xs font-bold text-slate-200">WBGT 33.1°C</span>
          </button>

          <button
            onClick={() => setSelectedAuditMetric('vulnerability')}
            className={`p-2.5 rounded-xs border text-left transition ${
              selectedAuditMetric === 'vulnerability'
                ? 'bg-blue-950 border-blue-500 text-blue-200 ring-1 ring-blue-500'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-[9px] text-slate-500 block uppercase">Demographics</span>
            <span className="text-xs font-bold text-slate-200">Vulnerability 84/100</span>
          </button>

          <button
            onClick={() => setSelectedAuditMetric('mortality')}
            className={`p-2.5 rounded-xs border text-left transition ${
              selectedAuditMetric === 'mortality'
                ? 'bg-blue-950 border-blue-500 text-blue-200 ring-1 ring-blue-500'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-[9px] text-slate-500 block uppercase">Mortality Risk</span>
            <span className="text-xs font-bold text-slate-200">↑ 23% Excess</span>
          </button>

          <button
            onClick={() => setSelectedAuditMetric('hospital')}
            className={`p-2.5 rounded-xs border text-left transition ${
              selectedAuditMetric === 'hospital'
                ? 'bg-blue-950 border-blue-500 text-blue-200 ring-1 ring-blue-500'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-[9px] text-slate-500 block uppercase">Hospital Surge</span>
            <span className="text-xs font-bold text-slate-200">1.8× Baseline</span>
          </button>

          <button
            onClick={() => setSelectedAuditMetric('uhi')}
            className={`p-2.5 rounded-xs border text-left transition ${
              selectedAuditMetric === 'uhi'
                ? 'bg-blue-950 border-blue-500 text-blue-200 ring-1 ring-blue-500'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <span className="text-[9px] text-slate-500 block uppercase">Urban Heat Island</span>
            <span className="text-xs font-bold text-slate-200">+3.8°C Microclimate</span>
          </button>
        </div>

        {/* Selected Audit Deep Breakdown Card */}
        <div className="bg-[#090e1a] border border-slate-800 p-4 rounded-sm space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[9px] text-slate-500 uppercase font-bold">Metric Provenance Card</span>
              <h3 className="text-sm font-bold text-slate-100">{currentAudit.title}</h3>
              <span className="text-xs text-amber-400 font-bold mt-0.5 block">{currentAudit.currentValue}</span>
            </div>
            <ProvenanceBadge type={currentAudit.statusType} source={currentAudit.status} />
          </div>

          {/* Input Data Feeds */}
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">
              1. Direct Input Data Feeds & Observational Telemetry:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentAudit.inputData.map((inp, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-200 block text-[11px]">{inp.parameter}</span>
                    <span className="text-[10px] text-slate-400">{inp.source}</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Cadence: {inp.cadence}</span>
                  </div>
                  <ProvenanceBadge type={inp.type} source={inp.type} size="xs" />
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical & Calculation Methodology */}
          <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              2. Mathematical Formulation & Biophysical Calculation Engine:
            </span>
            <p className="text-blue-300 font-mono text-[11px] leading-relaxed">
              {currentAudit.calculationFormula}
            </p>
          </div>

          {/* Academic & Official Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-slate-400" /> Scientific Basis & Citation:
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">
                {currentAudit.scientificCitation}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Administrative Governance Note:
              </span>
              <p className="text-[10px] text-slate-300 leading-relaxed">
                {currentAudit.governanceNotes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CLASSIFICATION FRAMEWORK */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-4 shadow-md space-y-3">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Data Classification & Governance Framework
          </h2>
          <p className="text-[10px] text-slate-400">
            HeatGuard strictly demarcates observed reality from physical calculations and synthetic demonstration streams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-sky-950/30 border border-sky-800/60 rounded">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sky-300 text-[11px]">OFFICIAL / HISTORICAL</span>
              <span className="px-1.5 py-0.2 bg-sky-900 text-sky-200 rounded text-[9px]">TIER 1</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Direct telemetry from IMD AWS stations, Census 2011/2021 tables, and National Disaster Management Authority bulletins.
            </p>
          </div>

          <div className="p-3 bg-purple-950/30 border border-purple-800/60 rounded">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-purple-300 text-[11px]">MODELLED / DERIVED</span>
              <span className="px-1.5 py-0.2 bg-purple-900 text-purple-200 rounded text-[9px]">TIER 2</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Biometeorological physics calculations (ISO 7243 WBGT, Liljegren equations, DLNM Health curves) combining atmospheric parameters.
            </p>
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-emerald-300 text-[11px]">REMOTE SENSING</span>
              <span className="px-1.5 py-0.2 bg-emerald-900 text-emerald-200 rounded text-[9px]">TIER 2</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Landsat 8/9 & Sentinel-2 TIRS radiometric thermal infrared downscaling for Urban Heat Island (UHI) surface emissivity.
            </p>
          </div>

          <div className="p-3 bg-amber-950/30 border border-amber-800/60 rounded">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-amber-300 text-[11px]">PROTOTYPE / SYNTHETIC</span>
              <span className="px-1.5 py-0.2 bg-amber-900 text-amber-200 rounded text-[9px]">TIER 3</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Simulated scenarios for disaster drill table-top exercises. Clearly labeled so no official decision relies on synthetic mocks.
            </p>
          </div>
        </div>
      </div>

      {/* CATALOG OF ALL REGISTERED DATA FEEDS */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Registered Data Streams & Observation Catalogs ({DATA_SOURCE_REGISTRY.length} Official Feeds)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DATA_SOURCE_REGISTRY.map((ds) => (
            <div 
              key={ds.id}
              className="bg-[#0c1322] border border-slate-800 rounded-sm p-4 space-y-3 shadow-md hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 text-xs">{ds.dataset}</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3 text-slate-500" />
                    {ds.organization}
                  </span>
                </div>
                <ProvenanceBadge type={ds.status} source={ds.source} />
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex justify-between py-0.5 border-b border-slate-800/40">
                  <span className="text-slate-500">Coverage Level:</span>
                  <span className="text-slate-300 font-bold">{ds.geographicLevel}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-800/40">
                  <span className="text-slate-500">Time Interval:</span>
                  <span className="text-slate-300">{ds.timePeriod}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-800/40">
                  <span className="text-slate-500">API Gateway Status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {ds.apiReadiness}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[9px] text-slate-500 block uppercase font-bold mb-1">
                  Variables Ingested:
                </span>
                <div className="flex flex-wrap gap-1">
                  {ds.variables.map((v, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-slate-900 text-slate-300 text-[9px] rounded-xs border border-slate-800">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500">
                <span>Ref: {ds.sourceReference}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
</div>
);
}
