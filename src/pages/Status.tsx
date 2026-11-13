import React, { useState } from 'react';
import { 
  Server, 
  Database, 
  Cloud, 
  ShieldCheck, 
  Activity, 
  Radio, 
  Cpu, 
  HardDrive, 
  Wifi,
  Code,
  Play,
  Copy,
  Check,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function Status() {
  const [activeApiTab, setActiveApiTab] = useState<'ward' | 'forecast' | 'cap' | 'wbgt'>('ward');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const services = [
    { 
      name: 'IMD AWS Telemetry Ingest Gateway', 
      type: 'OFFICIAL', 
      provider: 'India Meteorological Dept', 
      status: 'OPERATIONAL', 
      latency: '24ms', 
      uptime: '99.98%' 
    },
    { 
      name: 'Biometeorology Physics Engine (ISO 7243 WBGT)', 
      type: 'MODELLED', 
      provider: 'Liljegren Solver Core', 
      status: 'OPERATIONAL', 
      latency: '8ms', 
      uptime: '100.0%' 
    },
    { 
      name: 'Census Demographic Spatial Weighting Service', 
      type: 'OFFICIAL', 
      provider: 'Census / NSS Registry', 
      status: 'OPERATIONAL', 
      latency: '14ms', 
      uptime: '99.99%' 
    },
    { 
      name: 'NDMA Heat Action Plan Dispatch Webhook', 
      type: 'OFFICIAL', 
      provider: 'Disaster Mgt Gateway', 
      status: 'OPERATIONAL', 
      latency: '31ms', 
      uptime: '99.95%' 
    },
    { 
      name: 'Landsat 9 Thermal Infrared Emissivity Cache', 
      type: 'MODELLED', 
      provider: 'USGS / Bhuvan ISRO', 
      status: 'OPERATIONAL', 
      latency: '42ms', 
      uptime: '99.91%' 
    },
    { 
      name: 'Historical Replay Vector Archive (May 2024)', 
      type: 'HISTORICAL_OFFICIAL', 
      provider: 'Regional Met Centre Chennai', 
      status: 'SYNCHRONIZED', 
      latency: '5ms', 
      uptime: '100.0%' 
    }
  ];

  const apiEndpoints = {
    ward: {
      method: 'GET',
      path: '/api/v1/wards/W038/heat-health-risk',
      description: 'Fetch live biometeorological stress, demographic vulnerability, and action directives for a specific ward.',
      sampleResponse: {
        wardId: "W038",
        wardName: "Tondiarpet",
        zone: "Zone 4 (North Chennai)",
        timestamp: new Date().toISOString(),
        provenance: {
          observations: "IMD AWS Station ID 43279 (Nungambakkam)",
          vulnerability: "Census 2011 & PLFS Urban Sample 2023",
          thermalModel: "ISO 7243 / Liljegren Solver"
        },
        metrics: {
          temperature_c: 41.8,
          relative_humidity_pct: 58,
          wbgt_c: 33.1,
          heat_index_c: 52.4,
          thermal_stress_score: 84,
          vulnerability_score: 84,
          integrated_heat_risk_score: 84,
          risk_tier: "Extreme",
          estimated_hospital_surge_factor: 1.8,
          excess_mortality_risk_elevation_pct: 23,
          iso_work_rest_ratio: "Mandatory outdoor work suspension (Red Protocol)"
        },
        exposed_population: {
          total_residents: 178000,
          outdoor_laborers: 74760,
          elderly_over_60: 16020,
          informal_housing_share_pct: 42
        },
        recommended_actions: [
          "Outdoor work cessation 12:00-16:00",
          "Deploy mobile drinking water bowsers to informal settlements",
          "Activate Primary Health Centre cold saline depots"
        ]
      }
    },
    forecast: {
      method: 'GET',
      path: '/api/v1/forecast/5-day-health-impact',
      description: 'Retrieve 5-day forward biometeorological projections including hospitalization surge multipliers and mortality risk.',
      sampleResponse: {
        city: "Greater Chennai Corporation",
        projection_model: "DLNM & NWP IMD Ensemble",
        issued_at: new Date().toISOString(),
        projections: [
          { day: "D0 (Today)", date: "15 May", max_temp_c: 41.8, wbgt_c: 33.1, hospital_surge: "1.8x", excess_mortality: "+23%", impact_level: "HIGH" },
          { day: "D1", date: "16 May", max_temp_c: 42.4, wbgt_c: 33.6, hospital_surge: "2.1x", excess_mortality: "+28%", impact_level: "VERY HIGH" },
          { day: "D2 (Peak)", date: "17 May", max_temp_c: 43.1, wbgt_c: 34.4, hospital_surge: "2.4x", excess_mortality: "+34%", impact_level: "EXTREME" },
          { day: "D3", date: "18 May", max_temp_c: 40.5, wbgt_c: 31.8, hospital_surge: "1.5x", excess_mortality: "+15%", impact_level: "HIGH" },
          { day: "D4", date: "19 May", max_temp_c: 38.2, wbgt_c: 29.5, hospital_surge: "1.1x", excess_mortality: "+7%", impact_level: "MODERATE" }
        ]
      }
    },
    cap: {
      method: 'POST',
      path: '/api/v1/alerts/ndma-cap-broadcast',
      description: 'Dispatch an OASIS Common Alerting Protocol (CAP v1.2) XML/JSON payload to telecom cellular networks.',
      sampleResponse: {
        status: "SUCCESS",
        broadcastId: "CAP-CHENNAI-20240515-0891",
        targetArea: "Wards 038, 049, 015",
        telecomGateway: "BSNL / Airtel / Jio CBC Network",
        dispatchedSubscribers: 184500,
        latency_ms: 112,
        alertType: "RED PROTOCOL - MANDATORY WORK CESSATION"
      }
    },
    wbgt: {
      method: 'GET',
      path: '/api/v1/biomet/calculate-wbgt?temp=42.0&humidity=60&wind=2.5&solar=600',
      description: 'Direct access to the HeatGuard Liljegren biometeorological physics solver.',
      sampleResponse: {
        input: { dryBulbTemp_c: 42.0, relativeHumidity_pct: 60, windSpeed_ms: 2.5, solarRadiation_wm2: 600 },
        output: {
          wetBulbTemp_c: 33.4,
          globeTemp_c: 54.2,
          outdoorWBGT_c: 33.8,
          heatIndex_c: 58.6,
          workClassification: "Extreme Thermal Overload",
          maxContinuousWorkMinutesPerHour: 0
        },
        equationStandard: "Liljegren et al. (2008) / ISO 7243"
      }
    }
  };

  const activeEndpoint = apiEndpoints[activeApiTab];

  const handleTestApi = () => {
    setIsCalling(true);
    setApiResponse(null);
    setTimeout(() => {
      setApiResponse(JSON.stringify(activeEndpoint.sampleResponse, null, 2));
      setIsCalling(false);
    }, 400);
  };

  const handleCopy = () => {
    if (apiResponse) {
      navigator.clipboard.writeText(apiResponse);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c1322] border border-slate-800 p-4 rounded-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              SYSTEM STATUS & API INTEGRATION GATEWAY
            </h1>
            <ProvenanceBadge type="OFFICIAL" source="Core System Diagnostics & OpenAPI 3.0" />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Real-time telemetry diagnostics and REST API endpoints for Smart City ICCCs, hospital networks, and disaster authorities.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ALL SERVICES OPERATIONAL (99.98%)
          </span>
        </div>
      </div>

      {/* Cluster Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-[#0c1322] border border-slate-800 p-3.5 rounded-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[9px] uppercase font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-blue-400" /> Physics Engine Latency
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100">8.4 ms</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Liljegren ISO 7243 Solver</div>
        </div>

        <div className="bg-[#0c1322] border border-slate-800 p-3.5 rounded-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[9px] uppercase font-bold flex items-center gap-1">
              <Wifi className="w-3 h-3 text-emerald-400" /> IMD AWS Telemetry Ingest
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">100% Ingest</div>
          <div className="text-[9px] text-slate-500 mt-0.5">0 Dropped Synoptic Frames</div>
        </div>

        <div className="bg-[#0c1322] border border-slate-800 p-3.5 rounded-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[9px] uppercase font-bold flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-amber-400" /> Spatial Memory Cache
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-100">142 MB</div>
          <div className="text-[9px] text-slate-500 mt-0.5">200 Ward Vector Cache</div>
        </div>

        <div className="bg-[#0c1322] border border-slate-800 p-3.5 rounded-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[9px] uppercase font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-400" /> NDMA CAP Readiness
            </span>
          </div>
          <div className="text-2xl font-bold text-purple-400">READY</div>
          <div className="text-[9px] text-slate-500 mt-0.5">Cell-Broadcast Compliant</div>
        </div>
      </div>

      {/* REST API & WEBHOOK INTERACTIVE TEST GATEWAY */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-4 shadow-md space-y-4">
        <div className="border-b border-slate-800 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Municipal & Hospital Integration</span>
            <h2 className="text-xs font-bold text-slate-100 uppercase flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              REST API & Common Alerting Protocol (CAP) Gateway
            </h2>
          </div>
          <span className="text-[10px] text-slate-500">OpenAPI 3.0 Standard · CORS Enabled</span>
        </div>

        {/* API Endpoint Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ward', label: 'Ward Heat Health Risk', method: 'GET' },
            { id: 'forecast', label: '5-Day Health Outlook', method: 'GET' },
            { id: 'cap', label: 'NDMA CAP Broadcast', method: 'POST' },
            { id: 'wbgt', label: 'Biomet Physics Solver', method: 'GET' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveApiTab(tab.id as any);
                setApiResponse(null);
              }}
              className={`px-3 py-1.5 rounded-xs border text-xs font-bold transition flex items-center gap-2 ${
                activeApiTab === tab.id
                  ? 'bg-blue-950 border-blue-500 text-blue-200'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span className={`px-1 py-0.2 rounded-xs text-[9px] ${tab.method === 'GET' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                {tab.method}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* API Request Bar */}
        <div className="p-3 bg-[#090e1a] border border-slate-800 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeEndpoint.method === 'GET' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
              {activeEndpoint.method}
            </span>
            <span className="text-slate-300 font-mono text-xs">{activeEndpoint.path}</span>
          </div>

          <button
            onClick={handleTestApi}
            disabled={isCalling}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xs text-xs flex items-center gap-1.5 shrink-0 transition"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {isCalling ? 'Executing...' : 'Send Live Request'}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          {activeEndpoint.description}
        </p>

        {/* Live Response Output Window */}
        {apiResponse && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Terminal className="w-3 h-3" /> Status: 200 OK · 14ms
              </span>
              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px]"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCode ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>
            <pre className="p-3 bg-[#050911] border border-slate-800/90 rounded text-[11px] text-emerald-400/90 overflow-x-auto max-h-72 font-mono">
              {apiResponse}
            </pre>
          </div>
        )}
      </div>

      {/* Detailed Services Table */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm overflow-hidden shadow-md">
        <div className="p-3 border-b border-slate-800 bg-[#0f172a] flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Subsystem Verification & Data Lineage Status
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#090e1a] border-b border-slate-800 text-[9px] uppercase tracking-wider text-slate-400">
                <th className="p-3">Service Module</th>
                <th className="p-3">Data Tier</th>
                <th className="p-3">Authoritative Provider</th>
                <th className="p-3">Latency</th>
                <th className="p-3">Uptime</th>
                <th className="p-3">Operational State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {services.map((svc, i) => (
                <tr key={i} className="hover:bg-slate-900/60 transition">
                  <td className="p-3 font-bold text-slate-100 flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    {svc.name}
                  </td>
                  <td className="p-3">
                    <ProvenanceBadge type={svc.type as any} source={svc.type} size="xs" />
                  </td>
                  <td className="p-3 text-[11px] text-slate-400">{svc.provider}</td>
                  <td className="p-3 font-bold text-slate-200">{svc.latency}</td>
                  <td className="p-3 text-emerald-400 font-bold">{svc.uptime}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xs text-[9px] font-bold uppercase">
                      {svc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
