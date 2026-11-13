import React, { useState } from 'react';
import { useSimulation } from '../store/useSimulation';
import { 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  Building2, 
  HeartHandshake, 
  Truck, 
  Droplets, 
  Clock, 
  Flame, 
  Hospital, 
  FileText, 
  CheckCircle2, 
  AlertOctagon,
  Users,
  Send,
  Sparkles
} from 'lucide-react';
import ProvenanceBadge from '../components/ProvenanceBadge';

interface HAPInterventionItem {
  id: string;
  tier: 'RED' | 'ORANGE' | 'YELLOW';
  department: string;
  action: string;
  description: string;
  targetGroup: string;
  expectedImpact: string;
  leadAgency: string;
  status: 'PENDING' | 'COMPLETED';
}

const DEFAULT_HAP_MATRIX: HAPInterventionItem[] = [
  // RED TIER (STAGE III - WBGT >= 32.5°C or Ambient >= 45°C)
  {
    id: 'hap-red-01',
    tier: 'RED',
    department: 'Labor & Industry',
    action: 'Mandatory Suspension of Heavy Outdoor Work (11:00 AM – 04:00 PM)',
    description: 'Enforce NDMA Section 12 advisory for construction sites, brick kilns, stone quarries, and road repair workers across all Extreme & High risk wards.',
    targetGroup: 'Outdoor Construction & Harbor Labor (68,160+ workers)',
    expectedImpact: 'Prevents ~78% of exertion-induced acute heat strokes',
    leadAgency: 'Dept. of Labour & Employment / Municipal Flying Squads',
    status: 'PENDING'
  },
  {
    id: 'hap-red-02',
    tier: 'RED',
    department: 'Healthcare & Hospitals',
    action: 'Activation of Dedicated Heat-Stroke Treatment Units (HSTUs) & Ice-Bath Reserves',
    description: 'Mandate zero-turnaway policy for heat exhaustion patients in Govt. Stanley, Rajiv Gandhi GH, and Royapettah GH. Pre-position 5,000+ units of IV Normal Saline.',
    targetGroup: 'Elderly, Infants, & Emergency Heat Stroke Admissions',
    expectedImpact: 'Reduces emergency triage mortality by >65%',
    leadAgency: 'Directorate of Medical Services (DMS / MoHFW)',
    status: 'COMPLETED'
  },
  {
    id: 'hap-red-03',
    tier: 'RED',
    department: 'Municipal & Water',
    action: 'Emergency Deployment of 150 Mobile Drinking Water Tankers & Electrolyte Dispensers',
    description: 'Station designated water delivery points at high-density informal settlements (Tondiarpet, Royapuram, Manali, Perungudi) with continuous refilling.',
    targetGroup: 'Informal Settlements & Slum Dwellers (180,000+ residents)',
    expectedImpact: 'Eliminates severe dehydration clusters in unpiped zones',
    leadAgency: 'Chennai Metro Water Supply & Sewerage Board (CMWSSB)',
    status: 'COMPLETED'
  },
  {
    id: 'hap-red-04',
    tier: 'RED',
    department: 'Disaster Management & Public Safety',
    action: '24/7 Cooling Shelters Activation in Community Halls & Metro Stations',
    description: 'Designate 42 municipal facilities as air-cooled walk-in sanctuaries from 10:00 AM to 06:00 PM with free drinking water, bedding, and paramedical first-aid.',
    targetGroup: 'Homeless, Street Vendors, and Senior Citizens',
    expectedImpact: 'Safe refuge for 25,000+ vulnerable individuals daily',
    leadAgency: 'Greater Chennai Corporation (GCC) Disaster Management Cell',
    status: 'PENDING'
  },

  // ORANGE TIER (STAGE II - Ambient 43.0°C - 44.9°C)
  {
    id: 'hap-orange-01',
    tier: 'ORANGE',
    department: 'Labor & Industry',
    action: 'Shift Work Schedules & Mandatory 15-Min Hydration Breaks Every Hour',
    description: 'Require employers to adjust outdoor shifts to early morning (06:00 AM – 10:30 AM) and late evening (04:30 PM – 07:30 PM) with mandatory electrolyte distribution.',
    targetGroup: 'Gig Delivery Partners & Transport Drivers (42,500+ workers)',
    expectedImpact: '45% reduction in occupational heat exhaustion reports',
    leadAgency: 'Transport Dept. & Gig Platform Operators Association',
    status: 'COMPLETED'
  },
  {
    id: 'hap-orange-02',
    tier: 'ORANGE',
    department: 'Healthcare & Hospitals',
    action: 'Proactive Welfare Outreach to Senior Citizens via ASHA / ANM Volunteers',
    description: 'Door-to-door welfare verification for isolated senior citizens in wards with >18% elderly demographic (Adyar, Mylapore, Anna Nagar).',
    targetGroup: 'Chronic Cohorts & Senior Citizens Living Alone',
    expectedImpact: 'Early detection of heat-triggered cardiovascular distress',
    leadAgency: 'National Urban Health Mission (NUHM) & Social Welfare Dept.',
    status: 'PENDING'
  },
  {
    id: 'hap-orange-03',
    tier: 'ORANGE',
    department: 'Disaster Management & Public Safety',
    action: 'Multilingual Early Warning WhatsApp & Cell-Broadcast SMS Dispatch',
    description: 'Transmit geo-targeted emergency advisories in Tamil and English with WBGT danger thresholds to all mobile phone users in Orange and Red wards.',
    targetGroup: 'All Residents in High-Risk Urban Microclimates',
    expectedImpact: '100% population awareness of peak hazardous hours',
    leadAgency: 'State Disaster Management Authority (TNSDMA) & Telcos',
    status: 'COMPLETED'
  },

  // YELLOW TIER (STAGE I - Ambient 40.0°C - 42.9°C)
  {
    id: 'hap-yellow-01',
    tier: 'YELLOW',
    department: 'Municipal & Water',
    action: 'Hydration Kiosks (Thaneer Panthal) at Bus Terminals & Market Squares',
    description: 'Set up temporary municipal drinking water kiosks with buttermilk and ORS sachets across all high-footfall intersections and transit hubs.',
    targetGroup: 'Pedestrians, Commuters, and Market Vendors',
    expectedImpact: 'Guaranteed public hydration access within 400m in urban hubs',
    leadAgency: 'GCC Revenue & Public Health Departments',
    status: 'COMPLETED'
  },
  {
    id: 'hap-yellow-02',
    tier: 'YELLOW',
    department: 'Disaster Management & Public Safety',
    action: 'Public Advisory Broadcasts & School Outdoor Sports Rescheduling',
    description: 'Direct all government and private educational institutions to suspend outdoor sports after 10:00 AM and ensure adequate classroom air circulation.',
    targetGroup: 'School Children, Anganwadi Centres, and Teachers',
    expectedImpact: 'Zero school-level heat syncope incidents',
    leadAgency: 'School Education Department & GCC Health Wing',
    status: 'PENDING'
  }
];

export default function ActionCentre() {
  const { cityMetrics } = useSimulation();
  const [activeTier, setActiveTier] = useState<'RED' | 'ORANGE' | 'YELLOW'>('RED');
  const [interventions, setInterventions] = useState<HAPInterventionItem[]>(DEFAULT_HAP_MATRIX);
  const [selectedDept, setSelectedDept] = useState('ALL');

  const toggleCheck = (id: string) => {
    setInterventions(prev => prev.map(item => item.id === id ? { ...item, status: item.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : item));
  };

  const departments = Array.from(new Set(interventions.map(i => i.department).filter(Boolean)));

  const filteredInterventions = interventions.filter(item => {
    const matchesTier = item.tier === activeTier;
    const matchesDept = selectedDept === 'ALL' || item.department === selectedDept;
    return matchesTier && matchesDept;
  });

  const completedCount = interventions.filter(i => i.status === 'COMPLETED').length;
  const totalCount = interventions.length;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c1322] border border-slate-800 p-4 rounded-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide">
              Municipal Heat Action Plan (HAP) Execution Matrix
            </h1>
            <ProvenanceBadge type="OFFICIAL" source="NDMA / AMC Heat Action Plan Standard" />
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            Standard Operating Procedures (SOPs) and inter-departmental triggers for urban disaster management authorities.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1 bg-red-950 text-red-300 border border-red-800 rounded font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            ACTIVE HAP TIER: RED (STAGE III)
          </div>
        </div>
      </div>

      {/* NDMA 3-Tier Alert Framework Selection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
        <button
          onClick={() => setActiveTier('YELLOW')}
          className={`p-3.5 rounded-sm border text-left transition ${
            activeTier === 'YELLOW'
              ? 'bg-amber-950/80 border-amber-500 shadow-md ring-1 ring-amber-500'
              : 'bg-[#0c1322] border-slate-800 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400 uppercase font-bold">STAGE I · YELLOW ALERT</span>
            <span className="text-[9px] text-slate-500">40.0°C - 42.9°C</span>
          </div>
          <div className="text-sm font-bold text-slate-100 mt-1">Heat Alert & Public Notification</div>
          <p className="text-[10px] text-slate-400 mt-1 leading-tight">
            Sensitization, advisories to schools, hydration awareness via SMS & WhatsApp.
          </p>
        </button>

        <button
          onClick={() => setActiveTier('ORANGE')}
          className={`p-3.5 rounded-sm border text-left transition ${
            activeTier === 'ORANGE'
              ? 'bg-orange-950/80 border-orange-500 shadow-md ring-1 ring-orange-500'
              : 'bg-[#0c1322] border-slate-800 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-orange-400 uppercase font-bold">STAGE II · ORANGE ALERT</span>
            <span className="text-[9px] text-slate-500">43.0°C - 44.9°C</span>
          </div>
          <div className="text-sm font-bold text-slate-100 mt-1">Severe Heat Warning Protocol</div>
          <p className="text-[10px] text-slate-400 mt-1 leading-tight">
            Targeted outreach to informal settlements, hospital ice-bath readiness, water bowser tankers.
          </p>
        </button>

        <button
          onClick={() => setActiveTier('RED')}
          className={`p-3.5 rounded-sm border text-left transition ${
            activeTier === 'RED'
              ? 'bg-red-950/80 border-red-500 shadow-md ring-1 ring-red-500'
              : 'bg-[#0c1322] border-slate-800 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-red-400 uppercase font-bold">STAGE III · RED ALERT</span>
            <span className="text-[9px] text-red-400 font-bold">≥ 45.0°C or WBGT ≥ 32.5°C</span>
          </div>
          <div className="text-sm font-bold text-slate-100 mt-1">Extreme Heat Emergency Action</div>
          <p className="text-[10px] text-slate-400 mt-1 leading-tight">
            Mandatory stoppage of outdoor heavy labor, cooling shelters 24/7, emergency power prioritization.
          </p>
        </button>
      </div>

      {/* Operational Readiness Dashboard & Progress */}
      <div className="bg-[#0c1322] border border-slate-800 rounded-sm p-4 shadow-md space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[9px] text-slate-500 uppercase block font-bold">Inter-Agency Checklist</span>
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              {activeTier} PROTOCOL INTERVENTIONS ({filteredInterventions.length} Directives)
            </h3>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Department:</span>
            <select
              id="department-filter-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-300 focus:outline-none"
            >
              <option key="dept-all" value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={`dept-${d}`} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Readiness Checklist Items */}
        <div className="space-y-2.5">
          {filteredInterventions.map((item) => {
            const isDone = item.status === 'COMPLETED';

            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-sm border flex items-start gap-3 transition cursor-pointer ${
                  isDone 
                    ? 'bg-emerald-950/20 border-emerald-900/60 opacity-90' 
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 hover:text-white shrink-0"
                >
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-200">{item.action}</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-blue-300 rounded">
                        {item.department}
                      </span>
                    </div>

                    <span className="text-[9px] text-slate-500">
                      ID: {item.id}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-[9px] text-slate-500 pt-1">
                    <span>Target: <strong className="text-slate-300">{item.targetGroup}</strong></span>
                    <span>•</span>
                    <span>Impact: <strong className="text-amber-400">{item.expectedImpact}</strong></span>
                    <span>•</span>
                    <span>Lead: <strong className="text-slate-400">{item.leadAgency}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Aggregate Readiness Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              City Readiness Execution: <strong>{completedCount} of {totalCount} Actions Deployed</strong>
            </span>
          </div>

          <div className="w-full sm:w-48 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

