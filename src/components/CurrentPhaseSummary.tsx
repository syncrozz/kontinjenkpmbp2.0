import React from 'react';
import { SOAR_PHASES } from '../data/soarData';
import { OperationsPhaseState } from '../types';
import { Target, ArrowRight, Megaphone, Sliders } from 'lucide-react';

interface CurrentPhaseSummaryProps {
  phaseState: OperationsPhaseState;
  onSelectTab: (tab: string) => void;
  isAdminLoggedIn?: boolean;
  onOpenAdmin?: (tab?: string) => void;
}

export const CurrentPhaseSummary: React.FC<CurrentPhaseSummaryProps> = ({
  phaseState,
  onSelectTab,
  isAdminLoggedIn = false,
  onOpenAdmin
}) => {
  const activePhase = SOAR_PHASES.find((p) => p.id === phaseState.activePhaseId) || SOAR_PHASES[0];

  const handleCtaClick = () => {
    onSelectTab(activePhase.ctaTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="bg-white border-b border-slate-200 py-5" id="current-phase-summary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Reference Current Phase Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
          
          {/* Header Row: Active Indicator & Phase Name */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                Fasa Semasa ({activePhase.phaseNumber}/06)
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline">&bull;</span>
              <span className="text-xs text-slate-500 font-medium">
                {activePhase.period}
              </span>
            </div>

            {isAdminLoggedIn && onOpenAdmin && (
              <button
                onClick={() => onOpenAdmin('phases')}
                className="text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3 h-3 text-amber-700" />
                <span>Urus Fasa (Admin)</span>
              </button>
            )}
          </div>

          {/* Phase Title, Summary & Single CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-display">
                {activePhase.title}
              </h2>
              
              <div className="flex items-start gap-2 text-xs text-slate-700">
                <Target className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-slate-900">Fokus semasa: </strong>
                  <span>{activePhase.priorityFocus}</span>
                </p>
              </div>
            </div>

            {/* Single Contextual CTA */}
            <div className="shrink-0">
              <button
                onClick={handleCtaClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <span>{activePhase.ctaText || 'Lihat Maklumat'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Optional Short Announcement */}
          {phaseState.announcement && phaseState.announcement.trim() !== '' && (
            <div className="mt-1 bg-white border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700">
              <Megaphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-blue-900 mr-1">Pesanan:</strong>
                <span>{phaseState.announcement}</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
