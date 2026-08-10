import React from 'react';
import { SOAR_METADATA } from '../data/soarData';
import { KpmbpLogo } from './KpmbpLogo';
import { Calendar, Compass, ShieldAlert, CheckSquare, Calculator, Layers, Bus, UserPlus, Lock, Unlock, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAdmin?: () => void;
  isAdminLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  const tabs: { id: string; label: string; icon: any; highlight?: boolean }[] = [
    { id: 'overview', label: 'Dashboard', icon: Compass },
    { id: 'events', label: 'Acara (5)', icon: Layers },
    { id: 'schedule', label: 'Tentatif', icon: Calendar },
    { id: 'calculator', label: 'Kalkulator', icon: Calculator },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm w-full overflow-hidden">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-xs font-medium py-1 px-3 sm:px-4 text-center text-white flex items-center justify-center gap-1.5 sm:gap-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-200 animate-pulse shrink-0" />
        <span className="truncate max-w-[85vw] sm:max-w-none">SOAR IPMA 2026: <strong>"{SOAR_METADATA.theme}"</strong> &bull; {SOAR_METADATA.dates}</span>
        <span className="hidden sm:inline-block bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold text-white shrink-0">
          @ Kolej MARA Banting
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <KpmbpLogo className="w-9 h-9 sm:w-11 sm:h-11 group-hover:scale-105 transition-transform drop-shadow-md shrink-0" />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-display font-extrabold text-sm sm:text-lg text-slate-900 leading-none tracking-tight">
                  KONTINJEN KPMBP
                </h1>
                <span className="text-[9px] sm:text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  SOAR '26
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-blue-600 font-medium tracking-wide hidden md:block mt-0.5">
                Kolej Profesional MARA Bandar Penawar
              </p>
            </div>
          </div>

          {/* Right Section: Desktop Nav Tabs & Admin Mode */}
          <div className="flex items-center gap-2">
            {/* Main Navigation Tabs (Desktop) */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 py-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.label}
                    className={`group relative h-9 px-3.5 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 rounded-xl font-bold'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl font-semibold'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className={`whitespace-nowrap transition-all duration-300 ease-in-out ml-1.5 ${
                      isActive ? 'block' : 'hidden lg:block'
                    }`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Single Admin Mode button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                title="Mod Pentadbir (Admin Mode)"
                className={`group relative h-9 px-3 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs ${
                  isAdminLoggedIn
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-300/60'
                    : 'bg-slate-900 text-amber-300 hover:bg-slate-800 ring-2 ring-amber-400/40 hover:scale-102'
                }`}
              >
                {isAdminLoggedIn ? (
                  <Unlock className="w-4 h-4 shrink-0 text-emerald-200" />
                ) : (
                  <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                )}
                <span className="whitespace-nowrap">
                  {isAdminLoggedIn ? 'Admin Active' : 'Admin Mode'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Mobile Sub-Navigation Tabs Bar */}
        <div className="md:hidden border-t border-slate-100 py-1.5">
          <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={`mobile-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
