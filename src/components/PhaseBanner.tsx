import React, { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Megaphone, 
  Sliders, 
  Calendar, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { SoarPhaseConfig, OperationsPhaseState, SoarPhaseId } from '../types';
import { SOAR_PHASES } from '../data/soarData';

interface PhaseBannerProps {
  phaseState: OperationsPhaseState;
  onSelectTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdmin: (tab?: string) => void;
}

export const PhaseBanner: React.FC<PhaseBannerProps> = ({
  phaseState,
  onSelectTab,
  isAdminLoggedIn,
  onOpenAdmin,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [previewPhaseId, setPreviewPhaseId] = useState<SoarPhaseId | null>(null);

  const activePhase = SOAR_PHASES.find((p) => p.id === phaseState.activePhaseId) || SOAR_PHASES[0];
  const displayedPhase = previewPhaseId
    ? SOAR_PHASES.find((p) => p.id === previewPhaseId) || activePhase
    : activePhase;

  const activeIndex = SOAR_PHASES.findIndex((p) => p.id === activePhase.id);
  const isPreviewing = previewPhaseId !== null && previewPhaseId !== activePhase.id;

  const handleCtaClick = () => {
    onSelectTab(displayedPhase.ctaTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="bg-white border-b border-slate-200 shadow-xs relative overflow-hidden" id="phase-operations-hub">
      {/* Decorative top accent line with dynamic gradient */}
      <div className="h-1.5 w-full bg-linear-to-r from-blue-600 via-indigo-600 to-emerald-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500 font-display">
              Operasi Kontinjen KPMBP
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              Fasa {activePhase.phaseNumber} / 06
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Tarikh Pertandingan SOAR: 15–18 Oktober 2026
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <span>{isExpanded ? 'Ringkaskan Fasa' : 'Garis Masa 6 Fasa'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isAdminLoggedIn && (
              <button
                onClick={() => onOpenAdmin('phases')}
                className="text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg border border-amber-300 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-700" />
                <span>Urus Fasa (Admin)</span>
              </button>
            )}
          </div>
        </div>

        {/* 6-Phase Progress Stepper (Compact on mobile, full on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
          {SOAR_PHASES.map((phase, idx) => {
            const isCurrent = phase.id === activePhase.id;
            const isPast = idx < activeIndex;
            const isSelected = displayedPhase.id === phase.id;

            return (
              <button
                key={phase.id}
                onClick={() => {
                  if (previewPhaseId === phase.id) {
                    setPreviewPhaseId(null);
                  } else {
                    setPreviewPhaseId(phase.id);
                  }
                }}
                className={`relative text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20'
                    : isCurrent
                    ? 'border-emerald-400 bg-emerald-50/40'
                    : isPast
                    ? 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`font-mono text-[11px] font-extrabold ${
                    isCurrent ? 'text-emerald-700' : isSelected ? 'text-blue-700' : isPast ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    FASA {phase.phaseNumber}
                  </span>
                  {isCurrent ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white leading-none">
                      AKTIF
                    </span>
                  ) : isPast ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                </div>
                <div className={`font-bold line-clamp-1 ${
                  isCurrent ? 'text-slate-900' : isSelected ? 'text-blue-900' : isPast ? 'text-slate-700' : 'text-slate-500'
                }`}>
                  {phase.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {phase.period}
                </div>
              </button>
            );
          })}
        </div>

        {/* Primary Phase Card */}
        <div className={`rounded-2xl border p-5 sm:p-6 bg-linear-to-br ${displayedPhase.colorScheme.lightBg} ${displayedPhase.colorScheme.border} transition-all`}>
          {isPreviewing && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>
                  Sedang melihat maklumat <strong>Fasa {displayedPhase.phaseNumber}: {displayedPhase.title}</strong> (Pratonton). Fasa semasa kontinjen ialah <strong>Fasa {activePhase.phaseNumber}</strong>.
                </span>
              </div>
              <button
                onClick={() => setPreviewPhaseId(null)}
                className="text-amber-800 hover:text-amber-950 font-bold underline"
              >
                Kembali ke Fasa Aktif
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold border ${displayedPhase.colorScheme.badgeBg}`}>
                  {displayedPhase.statusBadge}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {displayedPhase.period}
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-100/80 border border-amber-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                  Kejohanan SOAR: 15–18 Oktober 2026
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
                Fasa {displayedPhase.phaseNumber}: {displayedPhase.title}
              </h2>
              <p className="text-sm font-medium text-slate-600">
                {displayedPhase.subtitle}
              </p>

              {/* Priority Focus Callout */}
              <div className="bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-xl p-3 text-xs sm:text-sm text-slate-800 flex items-start gap-2.5">
                <Target className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Fokus Operasi Semasa: </span>
                  <span>{displayedPhase.priorityFocus}</span>
                </div>
              </div>
            </div>

            {/* Action CTA Box */}
            <div className="lg:text-right shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <button
                onClick={handleCtaClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>{displayedPhase.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onSelectTab(displayedPhase.recommendedTab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors"
              >
                <span>Buka Tab Berkaitan</span>
              </button>
            </div>
          </div>

          {/* Admin Announcement Alert Box (If present for active phase) */}
          {phaseState.announcement && phaseState.announcement.trim() !== '' && !isPreviewing && (
            <div className="mt-4 bg-white/90 border border-blue-200 rounded-xl p-3.5 flex items-start gap-3 shadow-xs">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                <Megaphone className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs sm:text-sm text-slate-800">
                <div className="font-bold text-blue-900 mb-0.5 flex items-center gap-1.5">
                  <span>Peringatan Penyelaras Kontinjen KPMBP</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <p className="leading-relaxed text-slate-700">{phaseState.announcement}</p>
                {phaseState.updatedAt && (
                  <div className="text-[10px] text-slate-400 mt-1">
                    Dikemaskini: {new Date(phaseState.updatedAt).toLocaleDateString('ms-MY', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expandable Key Deliverables / Objectives */}
          {isExpanded && (
            <div className="mt-5 pt-5 border-t border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-display">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Objektif Utama & Keperluan Fasa {displayedPhase.phaseNumber}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {displayedPhase.keyObjectives.map((obj, i) => (
                  <div
                    key={i}
                    className="bg-white/90 rounded-lg p-2.5 border border-slate-200/70 text-xs text-slate-700 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3 italic">
                {displayedPhase.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
