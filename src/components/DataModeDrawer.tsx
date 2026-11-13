import React from 'react';
import { useSimulation } from '../store/useSimulation';
import { HISTORICAL_SCENARIOS } from '../data/officialDatasets';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  X, 
  Radio, 
  History, 
  FlaskConical, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { format } from 'date-fns';
import ProvenanceBadge from './ProvenanceBadge';

export default function DataModeDrawer() {
  const {
    isDrawerOpen,
    setDrawerOpen,
    isPlaying,
    togglePlay,
    speed,
    setSpeed,
    reset,
    currentTime,
    stage,
    setStage,
    scenarioId,
    setScenario,
    activeScenario,
    cityMetrics
  } = useSimulation();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={() => setDrawerOpen(false)} />

      {/* Drawer Content */}
      <div className="w-full max-w-lg bg-[#0b1120] border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            <div>
              <h2 className="text-xs font-bold tracking-wider uppercase text-slate-100 font-mono">
                Operating Data Mode
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">Global Biometeorology & Replay Controller</p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Operating Mode Selector */}
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block mb-2">
              Select Operating Environment
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setScenario('chennai-may-2024')}
                className={`p-2.5 rounded border text-left flex flex-col justify-between transition ${
                  activeScenario.mode === 'HISTORICAL_REPLAY'
                    ? 'bg-blue-950/50 border-blue-600 text-blue-100'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <History className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[8px] font-mono px-1 py-0.2 bg-blue-900/60 text-blue-300 rounded">OFFICIAL</span>
                </div>
                <div className="text-[11px] font-bold leading-tight">Historical Replay</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Archived IMD Episodes</div>
              </button>

              <button
                onClick={() => setScenario('prototype-synthetic')}
                className={`p-2.5 rounded border text-left flex flex-col justify-between transition ${
                  activeScenario.mode === 'DEMONSTRATION'
                    ? 'bg-amber-950/50 border-amber-600 text-amber-100'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[8px] font-mono px-1 py-0.2 bg-amber-900/60 text-amber-300 rounded">PROTOTYPE</span>
                </div>
                <div className="text-[11px] font-bold leading-tight">Demonstration</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Synthetic Stress Tests</div>
              </button>

              <div className="p-2.5 rounded border border-slate-800/80 bg-slate-950/40 text-slate-600 text-left flex flex-col justify-between opacity-75 cursor-not-allowed">
                <div className="flex items-center justify-between w-full mb-1">
                  <Radio className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-[8px] font-mono px-1 py-0.2 bg-slate-800 text-slate-500 rounded">COMING SOON</span>
                </div>
                <div className="text-[11px] font-bold leading-tight text-slate-500">Live IMD Feeds</div>
                <div className="text-[9px] text-slate-600 mt-0.5">Direct API Webhook</div>
              </div>
            </div>
          </div>

          {/* Scenario Selection */}
          <div>
            <label className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block mb-2">
              Active Episode & Provenance
            </label>
            <div className="space-y-2">
              {HISTORICAL_SCENARIOS.map((sc) => {
                const isSelected = sc.id === scenarioId;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setScenario(sc.id)}
                    className={`w-full text-left p-3 rounded border transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 border-blue-500/80 shadow-xs'
                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                        {sc.name}
                      </div>
                      <ProvenanceBadge 
                        type={sc.mode === 'HISTORICAL_REPLAY' ? 'HISTORICAL_OFFICIAL' : 'PROTOTYPE'} 
                        source={sc.mode === 'HISTORICAL_REPLAY' ? 'IMD Record' : 'Synthetic'} 
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{sc.description}</p>
                    <div className="flex items-center gap-3 text-[9px] font-mono text-slate-500 mt-0.5">
                      <span>{sc.timeRange}</span>
                      <span>•</span>
                      <span>{sc.baseDataset}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Playback Controls Box */}
          <div className="bg-[#0f172a] rounded border border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Simulation Clock</span>
                <span className="text-base font-mono font-bold text-slate-100 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  {format(currentTime, 'PP · HH:mm:ss')} IST
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">City Alert State</span>
                <span className={`text-xs font-mono font-bold uppercase ${
                  cityMetrics.imdCityStatus === 'Severe Heatwave' ? 'text-red-400' :
                  cityMetrics.imdCityStatus === 'Heatwave' ? 'text-orange-400' :
                  cityMetrics.imdCityStatus === 'Heatwave Alert' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {cityMetrics.imdCityStatus}
                </span>
              </div>
            </div>

            {/* Play, Pause, Reset, Speed Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold font-mono tracking-wider transition ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? 'PAUSE' : 'PLAY REPLAY'}
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold font-mono tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Reset to 08:00 IST Baseline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  RESET
                </button>
              </div>

              {/* Speed buttons */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded">
                <FastForward className="w-3 h-3 text-slate-500 ml-1" />
                <span className="text-[9px] font-mono text-slate-400 mr-1">SPD:</span>
                {[1, 2, 5, 10].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                      speed === s
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Stages Scrubber */}
            <div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-2">
                <span>TIMELINE STAGE ({stage + 1} OF {activeScenario.stages.length})</span>
                <span className="text-blue-400">{activeScenario.stages[stage]?.timeLabel}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {activeScenario.stages.map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStage(idx)}
                    className={`p-2 rounded border text-left transition ${
                      stage === idx
                        ? 'bg-blue-950/60 border-blue-500 text-white'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="text-[9px] font-mono font-bold text-slate-300">STG {idx + 1}</div>
                    <div className="text-[10px] font-mono font-bold text-amber-300 mt-0.5">{st.temp}°C</div>
                    <div className="text-[8px] text-slate-500 truncate mt-0.5">{st.imdStatus}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Biometeorological Snapshot in Replay */}
          <div className="bg-slate-950/60 rounded border border-slate-800/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Aggregated Command Telemetry
              </span>
              <ProvenanceBadge type="MODELLED" source="Liljegren WBGT / ISO 7243" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[9px] text-slate-500 uppercase">Avg Ambient</div>
                <div className="text-sm font-bold text-slate-100">{cityMetrics.avgTemperature}°C</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[9px] text-slate-500 uppercase">Avg WBGT</div>
                <div className="text-sm font-bold text-amber-400">{cityMetrics.avgWbgt}°C</div>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <div className="text-[9px] text-slate-500 uppercase">Critical Wards</div>
                <div className="text-sm font-bold text-red-400">{cityMetrics.extremeRiskWardsCount + cityMetrics.highRiskWardsCount} / 20</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-950/30 border border-blue-900/40 rounded text-[10px] text-blue-300 leading-relaxed">
            <strong>Architecture Readiness:</strong> This controller replays validated IMD weather station observations synchronized with Census-derived demographic weights. The engine exposes standard REST/WebSocket adapters to seamlessly ingest real-time AWS (Automatic Weather Station) data streams.
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0f172a] border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={() => setDrawerOpen(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded border border-slate-700 transition"
          >
            Close Controller
          </button>
        </div>
      </div>
    </div>
  );
}
