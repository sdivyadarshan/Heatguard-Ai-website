import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  ThermometerSun, 
  LineChart, 
  Users, 
  BellRing, 
  ShieldAlert, 
  Database,
  Server,
  BookOpen,
  Menu,
  X,
  Radio,
  Clock,
  Play,
  Pause,
  RotateCcw,
  SlidersHorizontal,
  Search,
  Zap,
  Shield,
  Send,
  Sparkles,
  Activity,
  Layers,
  Sun,
  Moon,
  Share2,
  MapPin,
  FileText,
  Sliders
} from 'lucide-react';
import { useSimulation } from '../store/useSimulation';
import { useThemeStore } from '../store/useThemeStore';
import DataModeDrawer from './DataModeDrawer';
import ProvenanceBadge from './ProvenanceBadge';
import CommandPalette from './CommandPalette';
import ExportDecisionBriefModal from './ExportDecisionBriefModal';
import { format } from 'date-fns';

export default function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const { 
    activeScenario, 
    currentTime, 
    isPlaying, 
    tick, 
    cityMetrics, 
    toggleDrawer, 
    stage 
  } = useSimulation();

  const { theme, toggleTheme } = useThemeStore();
  const [liveSystemTime, setLiveSystemTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSystemTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayTime = activeScenario?.mode === 'HISTORICAL_REPLAY' ? currentTime : liveSystemTime;
  const isHistorical = activeScenario?.mode === 'HISTORICAL_REPLAY';

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        tick();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, tick]);

  // Synchronize html class with theme
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Global Keyboard shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, category: 'CORE' },
    { name: 'Threat Radar Map', path: '/map', icon: Map, category: 'CORE' },
    { name: 'Hyper-Local Search', path: '/hyperlocal', icon: MapPin, category: 'CORE' },
    { name: 'Biometeorological Graphs', path: '/biometeorology', alias: '/stress', icon: Activity, category: 'ANALYTICS' },
    { name: 'What-If Simulation', path: '/simulation', alias: '/data-sources', icon: Sliders, category: 'ANALYTICS' },
    { name: '5-Day Surge Outlook', path: '/outlook', alias: '/forecast', icon: LineChart, category: 'ANALYTICS' },
    { name: 'Vulnerability Matrix', path: '/vulnerability', alias: '/wards', icon: Users, category: 'ANALYTICS' },
    
    { name: 'Warnings & Alerts', path: '/warnings', alias: '/alerts', icon: BellRing, badge: cityMetrics.extremeRiskWardsCount + cityMetrics.highRiskWardsCount, category: 'DISPATCH' },
    { name: 'Heat Action Protocols', path: '/action-plan', alias: '/action-centre', icon: ShieldAlert, category: 'DISPATCH' },
    { name: 'Citizen Directory & Twilio', path: '/data-sources', alias: '/sources', icon: Database, category: 'DISPATCH' },
    
    { name: 'Sensor Telemetry', path: '/status', icon: Server, category: 'SYSTEM' },
    { name: 'Methodology & Science', path: '/methodology', icon: BookOpen, category: 'SYSTEM' },
  ];

  const primaryBottomNav = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Map', path: '/map', icon: Map },
    { name: 'Local Search', path: '/hyperlocal', icon: MapPin },
    { name: 'Graphs', path: '/biometeorology', icon: Activity },
    { name: 'Alerts', path: '/warnings', icon: BellRing, badge: cityMetrics.extremeRiskWardsCount },
  ];

  const isNavActive = (item: typeof navItems[0]) => {
    if (location.pathname === item.path) return true;
    if (item.alias && location.pathname === item.alias) return true;
    return false;
  };

  return (
    <div className={`flex h-screen ${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0f19] text-slate-100'} font-sans overflow-hidden antialiased selection:bg-cyan-500 selection:text-black crypto-bg-gradient`}>
      {/* Desktop Crypto Sidebar */}
      <aside className={`hidden lg:flex w-72 ${theme === 'light' ? 'bg-white/95 border-slate-200' : 'bg-[#101626]/95 border-slate-800/80'} backdrop-blur-xl border-r flex-col shrink-0 z-20 transition-colors`}>
        {/* Brand Header */}
        <div className={`p-6 border-b ${theme === 'light' ? 'border-slate-200' : 'border-slate-800/60'} flex items-center justify-between`}>
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-base font-bold tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  Heat<span className="text-cyan-500">Guard</span>
                </h1>
                <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-500 rounded-full font-mono">
                  SIH26083
                </span>
              </div>
              <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Chennai Heat-Health Intel
              </p>
            </div>
          </div>
        </div>

        {/* Quick Search Shortcut Button */}
        <div className="px-5 pt-4 pb-2">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 ${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-600' : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800/80 text-slate-400'} border rounded-xl hover:text-slate-900 transition text-xs group`}
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-cyan-500 group-hover:scale-105 transition" />
              <span className="text-xs">Search Avadi, Pattabiram, wards...</span>
            </div>
            <kbd className={`px-2 py-0.5 ${theme === 'light' ? 'bg-white text-slate-600 border-slate-300' : 'bg-slate-800 text-slate-400 border-slate-700'} rounded-md text-[10px] border font-mono`}>
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-6 scrollbar-thin">
          {/* Main Navigation */}
          <div>
            <div className={`text-[11px] font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} px-3 mb-2`}>
              Surveillance & Analytics
            </div>
            <ul className="space-y-1">
              {navItems.filter(i => i.category === 'CORE' || i.category === 'ANALYTICS').map((item) => {
                const active = isNavActive(item);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-xs font-semibold'
                          : theme === 'light' 
                            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' 
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 ${active ? 'text-cyan-500' : theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Incident & Dispatch */}
          <div>
            <div className={`text-[11px] font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} px-3 mb-2`}>
              Response & Dispatches
            </div>
            <ul className="space-y-1">
              {navItems.filter(i => i.category === 'DISPATCH').map((item) => {
                const active = isNavActive(item);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-xs font-semibold'
                          : theme === 'light' 
                            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' 
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 ${active ? 'text-cyan-500' : theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-red-500/20 text-red-500 border border-red-500/30 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* System */}
          <div>
            <div className={`text-[11px] font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} px-3 mb-2`}>
              System & Telemetry
            </div>
            <ul className="space-y-1">
              {navItems.filter(i => i.category === 'SYSTEM').map((item) => {
                const active = isNavActive(item);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-xs font-semibold'
                          : theme === 'light' 
                            ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' 
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 ${active ? 'text-cyan-500' : theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Sidebar Footer / Balance Card Style */}
        <div className={`p-4 m-4 ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#141b2d] border-slate-800/80'} border rounded-2xl space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Active Surveillance</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-500">100%</span>
          </div>

          <div>
            <div className={`flex justify-between text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mb-1`}>
              <span>City Risk Level</span>
              <span className="font-bold text-amber-500">{cityMetrics.avgRiskScore}/100</span>
            </div>
            <div className={`w-full ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-800'} rounded-full h-1.5 overflow-hidden`}>
              <div 
                className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${cityMetrics.avgRiskScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className={`relative w-80 ${theme === 'light' ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#101626] border-slate-800 text-white'} border-r h-full flex flex-col p-5 shadow-2xl z-10 animate-in slide-in-from-left duration-200`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">HeatGuard AI</div>
                  <div className="text-xs opacity-70">Chennai Intel</div>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {navItems.map((item) => {
                const active = isNavActive(item);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium ${
                      active ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-xs font-semibold px-2 py-0.5 bg-red-500/20 text-red-500 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setExportModalOpen(true);
                }}
                className="w-full py-2.5 px-3.5 bg-cyan-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share / Export Brief (PDF)
              </button>

              <button
                onClick={toggleTheme}
                className="w-full py-2 px-3.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className={`h-16 ${theme === 'light' ? 'bg-white/85 border-slate-200' : 'bg-[#101626]/80 border-slate-800/60'} backdrop-blur-xl border-b flex items-center justify-between px-6 lg:px-8 shrink-0 z-10 transition-colors`}>
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl"
              title="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global DATA MODE Action Button */}
            <button
              onClick={toggleDrawer}
              className={`group flex items-center gap-3 px-3.5 py-2 rounded-xl ${theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800'} border transition text-left`}
              title="Click to Configure Simulation & Historical Replay"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50"></div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${theme === 'light' ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-300 group-hover:text-white'}`}>
                  {activeScenario.mode === 'HISTORICAL_REPLAY' ? 'Historical Replay Mode' : 'Live Demonstration Feed'}
                </span>
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500" />
              </div>
            </button>

            {/* Alert Status Pill */}
            {(stage >= 2 || cityMetrics.extremeRiskWardsCount > 0) && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Stage III Red Alert ({cityMetrics.extremeRiskWardsCount} Extreme Wards)</span>
              </div>
            )}
          </div>

          {/* Right Header Metadata & Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Share / Export Decision Brief Button */}
            <button
              onClick={() => setExportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-cyan-950/30"
              title="Export Decision-Ready Heat-Health Brief (PDF/WhatsApp/JSON)"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share / Export (PDF)</span>
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border ${theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'} transition`}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-indigo-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Command Palette Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className={`hidden md:flex items-center gap-2 px-3 py-2 ${theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-900/80 border-slate-800 text-slate-400'} border rounded-xl text-xs transition`}
            >
              <Search className="w-3.5 h-3.5 text-cyan-500" />
              <span>⌘K</span>
            </button>

            {/* Live Accurate Clock & Date */}
            <div className={`flex items-center gap-2.5 ${theme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900/80 border-slate-800 text-slate-200'} border px-3.5 py-2 rounded-xl text-xs font-mono font-bold shadow-sm`}>
              <span className={`w-2 h-2 rounded-full ${isHistorical ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} title={isHistorical ? 'Historical Replay Mode' : 'Live Real-Time Telemetry'} />
              <span className="hidden sm:inline text-slate-400 font-medium">
                {format(displayTime, 'dd MMM yyyy')} ·
              </span>
              <span className="text-white font-semibold">
                {format(displayTime, isHistorical ? 'HH:mm' : 'HH:mm:ss')}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold uppercase">
                {isHistorical ? 'REPLAY' : 'IST'}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Router View */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-8 ${theme === 'light' ? 'bg-slate-50' : 'bg-[#0b0f19]'} pb-24 lg:pb-8 transition-colors`}>
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className={`lg:hidden fixed bottom-0 left-0 right-0 h-16 ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#101626] border-slate-800'} border-t flex items-center justify-around px-3 z-40`}>
          {primaryBottomNav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 py-1 relative transition ${
                  active ? 'text-cyan-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] tracking-tight mt-1">{item.name}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1 right-4 w-2 h-2 rounded-full bg-red-500"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Global Slide-In Simulation Drawer */}
      <DataModeDrawer />

      {/* Global ⌘K Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />

      {/* Global Decision-Ready Share & Export System Modal */}
      <ExportDecisionBriefModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
