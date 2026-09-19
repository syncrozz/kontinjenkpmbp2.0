import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  PhoneCall, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  ArrowRight, 
  Layers, 
  Calculator, 
  CheckSquare, 
  ChevronRight, 
  Info, 
  FileText,
  Video,
  Bus,
  HeartHandshake,
  Circle,
  Megaphone,
  Filter
} from 'lucide-react';
import { 
  ContingentUserProfile, 
  OperationsPhaseState, 
  SoarPhaseId, 
  SoarPhaseConfig, 
  EventDetail 
} from '../../types';
import { 
  SOAR_PHASES, 
  EVENTS_DATA, 
  SOAR_METADATA, 
  SUBMISSION_DEADLINES 
} from '../../data/soarData';

interface PhaseAwareContingentDashboardProps {
  currentUser: ContingentUserProfile;
  phaseState: OperationsPhaseState;
  onNavigateTab: (tabId: string) => void;
  onOpenAdminWorkspace?: (tab?: string) => void;
  isCompactModal?: boolean;
}

// Personal packing checklist for Phase 04 / member readiness
const PERSONAL_PACKING_ITEMS = [
  { id: 'p1', text: 'Kad Pengenalan (MyKad) & Kad Pelajar KPM (Wajib fizikal)', category: 'Dokumen', checked: true },
  { id: 'p2', text: 'Baju Korporat KPM / Baju Rasmi Kontinjen (Perasmian & Pembukaan)', category: 'Pakaian', checked: false },
  { id: 'p3', text: 'Kasut Hitam Bertutup & Stoking Gelap (Etika pentas & kolej)', category: 'Pakaian', checked: false },
  { id: 'p4', text: 'Borang Kebenaran Waris / Ibu Bapa bertandatangan lengkap', category: 'Dokumen', checked: true },
  { id: 'p5', text: 'Instrumen peribadi / Prop pentas / Kostum persembahan acara', category: 'Peralatan', checked: false },
  { id: 'p6', text: 'Ubat-ubatan peribadi & kelengkapan kesihatan khusus', category: 'Kesihatan', checked: false },
  { id: 'p7', text: 'Kelengkapan ibadah (telekung / sejadah / kain pelekat / songkok)', category: 'Ibadah', checked: true },
  { id: 'p8', text: 'Pengecas telefon / Powerbank & alatan komunikasi kecemasan', category: 'Teknikal', checked: false }
];

// Phase 03 Rehearsal Schedule by Event
const REHEARSAL_SCHEDULE = [
  {
    event: 'Teater Islamik (Masar Al-Masajid)',
    dayTime: 'Setiap Isnin & Rabu (8:30 PM - 11:00 PM)',
    venue: 'Dewan Serbaguna KPMBP',
    focus: 'Latihan skrip watak, blocking pentas, dan sebutan naratif.',
    leadAdvisor: 'Muzlinda',
    phone: '019-2046144',
    whatsapp: 'https://wasap.my/60192046144'
  },
  {
    event: 'Battle of the Band (Rock Malaya)',
    dayTime: 'Setiap Selasa & Khamis (8:00 PM - 10:30 PM)',
    venue: 'Studio Muzik KPMBP',
    focus: 'Keserasian tempo, dinamik instrumen & kawalan vokal lagu wajib.',
    leadAdvisor: 'Syam',
    phone: '013-7554902',
    whatsapp: 'https://wasap.my/60137554902'
  },
  {
    event: 'Symphonic Duo',
    dayTime: 'Setiap Rabu (5:00 PM - 7:00 PM) & Sabtu (10:00 AM)',
    venue: 'Bilik Akustik KPMBP',
    focus: 'Harmoni duet vokal dan teknik susunan instrumen akustik.',
    leadAdvisor: 'Khairi',
    phone: '014-5313756',
    whatsapp: 'https://wasap.my/60145313756'
  },
  {
    event: 'Tarian Zapin',
    dayTime: 'Setiap Selasa & Jumaat (8:30 PM - 11:00 PM)',
    venue: 'Studio Tari KPMBP',
    focus: 'Ketepatan ragam zapin asli, keseragaman langkah & postur.',
    leadAdvisor: 'Saba',
    phone: '012-7142990',
    whatsapp: 'https://wasap.my/60127142990'
  },
  {
    event: 'Street Dakwah (From Chaos to Calm)',
    dayTime: 'Sesi Rakaman Luar & Editing Mingguan',
    venue: 'Luar Kawasan Kolej (Tempat Umum)',
    focus: 'Rakaman temu ramah 3 responden, dalil sahih & video HD.',
    leadAdvisor: 'Halimatul',
    phone: '017-7804852',
    whatsapp: 'https://wasap.my/60177804852'
  }
];

export const PhaseAwareContingentDashboard: React.FC<PhaseAwareContingentDashboardProps> = ({
  currentUser,
  phaseState,
  onNavigateTab,
  onOpenAdminWorkspace,
  isCompactModal = false
}) => {
  const activePhase = SOAR_PHASES.find((p) => p.id === phaseState.activePhaseId) || SOAR_PHASES[2];
  
  // Member can preview other phases' priorities or return to active
  const [selectedPhaseId, setSelectedPhaseId] = useState<SoarPhaseId>(activePhase.id);

  // Sync selected phase with external phase updates if not manually previewing another
  useEffect(() => {
    setSelectedPhaseId(activePhase.id);
  }, [activePhase.id]);

  const displayedPhase = SOAR_PHASES.find((p) => p.id === selectedPhaseId) || activePhase;
  const isPreviewingOtherPhase = displayedPhase.id !== activePhase.id;

  // Selected event filter for personalized event guidance
  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    if (currentUser.eventAssigned) {
      const match = EVENTS_DATA.find((e) => 
        e.title.toLowerCase().includes(currentUser.eventAssigned!.toLowerCase()) ||
        e.category.toLowerCase().includes(currentUser.eventAssigned!.toLowerCase())
      );
      if (match) return match.id;
    }
    return 'teater-islamik';
  });

  const activeEvent = EVENTS_DATA.find((e) => e.id === selectedEventId) || EVENTS_DATA[0];

  // Personal packing checklist state
  const [packingChecklist, setPackingChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('kpmbp_member_personal_checklist');
      if (saved) return JSON.parse(saved);
    } catch {}
    return PERSONAL_PACKING_ITEMS;
  });

  const handleTogglePackingItem = (id: string) => {
    const updated = packingChecklist.map((item: any) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setPackingChecklist(updated);
    try {
      localStorage.setItem('kpmbp_member_personal_checklist', JSON.stringify(updated));
    } catch {}
  };

  const packingCompleted = packingChecklist.filter((i: any) => i.checked).length;
  const packingPercent = Math.round((packingCompleted / packingChecklist.length) * 100);

  // Relevant deadlines matching active or displayed phase
  const relevantDeadlines = SUBMISSION_DEADLINES.slice(0, 4);

  return (
    <div className={`space-y-6 ${isCompactModal ? 'p-1' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
      
      {/* 1. MEMBER SECURITY IDENTITY & PHASE BADGE HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden border border-blue-900/40">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                currentUser.role === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : currentUser.role === 'advisor'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : currentUser.role === 'pic'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{currentUser.badge || 'AHLI KONTINJEN DISAHKAN'}</span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Portal Ahli Berfasa (SES v5.0)</span>
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white">
                Selamat Bertugas, {currentUser.name || 'Warga Kontinjen KPMBP'}
              </h2>
              <p className="text-xs sm:text-sm text-blue-200/90 font-medium mt-0.5">
                {currentUser.title || 'Peserta / Krew Kontinjen SOAR 2026'} &bull; {SOAR_METADATA.theme}
              </p>
            </div>
          </div>

          {/* Active Phase Intelligence Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 flex items-center justify-between lg:justify-end gap-4 shrink-0">
            <div className="text-left lg:text-right">
              <div className="flex items-center gap-1.5 lg:justify-end text-[10px] uppercase font-extrabold tracking-wider text-amber-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>FASA OPERASI AKTIF</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white font-display">
                Fasa {activePhase.phaseNumber}: {activePhase.title}
              </div>
              <div className="text-[11px] text-blue-200">
                Tempoh: {activePhase.period}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600/40 border border-blue-400/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Real-time Broadcast Notice if available */}
        {phaseState.announcement && (
          <div className="mt-5 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-start gap-3">
            <Megaphone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-extrabold text-amber-300 uppercase tracking-wide mr-1.5">
                Arahan Rasmi Urus Setia:
              </span>
              <span className="text-slate-100 font-medium">
                "{phaseState.announcement}"
              </span>
              {phaseState.updatedBy && (
                <span className="text-[10px] text-slate-300 block mt-0.5 font-mono">
                  Dikeluarkan oleh: {phaseState.updatedBy}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. PHASE SELECTOR / LIFECYCLE HORIZONTAL PROGRESSION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              Garis Masa 6 Fasa Operasi Kontinjen
            </span>
          </div>
          {isPreviewingOtherPhase && (
            <button
              onClick={() => setSelectedPhaseId(activePhase.id)}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 cursor-pointer flex items-center gap-1"
            >
              <span>Kembali ke Fasa Aktif ({activePhase.phaseNumber})</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {SOAR_PHASES.map((p) => {
            const isLive = p.id === activePhase.id;
            const isSelected = p.id === displayedPhase.id;

            return (
              <button
                key={p.id}
                onClick={() => setSelectedPhaseId(p.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-600/20 scale-[1.02]'
                    : isLive
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100/80'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[10px] font-black uppercase font-mono px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isLive
                      ? 'bg-emerald-200/70 text-emerald-900 font-bold'
                      : 'bg-slate-200/70 text-slate-700'
                  }`}>
                    Fasa {p.phaseNumber}
                  </span>
                  {isLive && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Fasa Operasi Aktif" />
                  )}
                </div>

                <div className={`text-xs font-extrabold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {p.title}
                </div>

                <div className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  {p.period}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE PHASE PRIORITY BRIEFING CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                displayedPhase.colorScheme.badgeBg
              }`}>
                {displayedPhase.statusBadge}
              </span>
              {displayedPhase.id === activePhase.id && (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Sedang Berjalan
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-slate-900 font-display mt-1">
              Fokus Utama: {displayedPhase.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {displayedPhase.priorityFocus}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab(displayedPhase.ctaTab)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{displayedPhase.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Phase Key Objectives */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Objektif Kritikal Fasa {displayedPhase.phaseNumber}:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {displayedPhase.keyObjectives.map((obj, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-800"
              >
                <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="font-medium leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. DYNAMIC PHASE-SPECIFIC INTELLIGENCE MODULES */}
      {/* We prioritize information specifically tailored to the selected/active phase without duplicating existing database records */}

      {/* PHASE 01: AUDITIONS & TALENT SELECTION */}
      {displayedPhase.id === 'phase_01' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Prioriti Fasa 01: Saringan Uji Bakat & Kuota 35 Pelajar</span>
            </h4>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Borang Pendaftaran Dibuka
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="font-black text-emerald-900 text-xs block">Syarat Uji Bakat Online</span>
              <p className="text-xs text-slate-700">
                Sediakan pautan video demonstrasi persembahan (Google Drive / YouTube) berdurasi 1–3 minit untuk penilaian awal pensyarah penasihat.
              </p>
              <button
                onClick={() => onNavigateTab('talent')}
                className="mt-2 text-xs font-extrabold text-emerald-800 underline cursor-pointer flex items-center gap-1"
              >
                <span>Hantar Borang Bakat Sekarang</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
              <span className="font-black text-blue-900 text-xs block">Kuota Kontinjen KPMBP</span>
              <p className="text-xs text-slate-700">
                Maksimum 35 pelajar akan dipilih mewakili 5 acara pertandingan SOAR 2026. Saringan fizikal akan dijadualkan selepas pendaftaran ditutup.
              </p>
              <button
                onClick={() => onNavigateTab('events')}
                className="mt-2 text-xs font-extrabold text-blue-800 underline cursor-pointer flex items-center gap-1"
              >
                <span>Semak Kriteria 5 Acara</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
              <span className="font-black text-purple-900 text-xs block">Pusat Penilaian Penasihat</span>
              <p className="text-xs text-slate-700">
                Setiap acara diketuai oleh pensyarah penasihat khusus bagi memastikan pematuhan kualiti, vokal, penghayatan dan busana syariah.
              </p>
              <span className="text-[11px] text-purple-800 font-bold block mt-1">
                Teater (Muzlinda), Duo (Khairi), Zapin (Saba), BOTB (Syam), Dakwah (Halimatul).
              </span>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 02: CONFIRMATION & EVENT PLANNING */}
      {displayedPhase.id === 'phase_02' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Prioriti Fasa 02: Roster Sah & Deadline Penyerahan Awal</span>
            </h4>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Deadline: 10 Sept 2026
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-900 text-xs">Penyerahan Skrip Teater Islamik</span>
                <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold">10 Sept</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Wajib menyerahkan senarai nama peserta, watak pementasan, skrip penuh bertemakan "Masar Al-Masajid", dan spesifikasi produksi pentas.
              </p>
              <button
                onClick={() => onNavigateTab('events')}
                className="text-xs font-bold text-amber-800 underline cursor-pointer"
              >
                Lihat Peraturan Penuh Teater
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 text-xs">Pendaftaran Rasmi Street Dakwah</span>
                <span className="text-[10px] font-mono bg-blue-200 text-blue-900 px-2 py-0.5 rounded font-bold">10 Sept</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Penyerahan nama 4 orang peserta Street Dakwah kepada urus setia penganjur bersama konsep awal video bertemakan "From Chaos to Calm".
              </p>
              <button
                onClick={() => onNavigateTab('guidelines')}
                className="text-xs font-bold text-blue-800 underline cursor-pointer"
              >
                Semak Garis Panduan Syariah & AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 03: INTENSIVE REHEARSAL & PREPARATION (CURRENT ACTIVE DEFAULT) */}
      {displayedPhase.id === 'phase_03' && (
        <div className="space-y-6">
          {/* Main Phase 03 Hub */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span>Jadual Latihan Intensif Mingguan Kontinjen KPMBP</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sesi latihan berjadual setiap pasukan di dewan dan studio KPM Bandar Penawar.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('calculator')}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Simulasi Skor Rubrik</span>
                </button>
              </div>
            </div>

            {/* Rehearsal Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {REHEARSAL_SCHEDULE.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="font-black text-slate-900 text-xs block">
                      {item.event}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.dayTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.venue}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 pt-1 leading-relaxed">
                      {item.focus}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Penasihat: <strong>{item.leadAdvisor}</strong>
                    </span>
                    <a
                      href={item.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Phase 03 Milestone: Street Dakwah Video Submission */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md border border-purple-800/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/20 text-purple-200 text-xs font-bold border border-purple-300/30">
                  <Video className="w-3.5 h-3.5 text-purple-300" />
                  <span>PERINGATAN TARIKH AKHIR PRODUKSI FASA 03</span>
                </div>
                <h4 className="text-lg sm:text-xl font-black font-display">
                  Penyerahan Video Street Dakwah: 1 Oktober 2026 (5:00 Petang)
                </h4>
                <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-2xl">
                  Video wajib dirakam di lokasi umum luar kolej dalam resolusi Full HD. PENGGUNAAN AI TIDAK DIBENARKAN untuk menjana kandungan utama (hanya pemprosesan noise reduction / penstabilan video dibenarkan).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <button
                  onClick={() => onNavigateTab('guidelines')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all cursor-pointer"
                >
                  Semak Syarat AI
                </button>
                <button
                  onClick={() => onNavigateTab('calculator')}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
                >
                  Rubrik Street Dakwah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 04: FINAL PREPARATION & LOGISTICS READINESS */}
      {displayedPhase.id === 'phase_04' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-violet-600" />
                  <span>Senarai Semak Persediaan & Beg Peribadi Pelajar</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pastikan semua dokumen pengenalan dan pakaian rasmi lengkap sebelum hari pelepasan.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-violet-800 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
                  {packingCompleted} / {packingChecklist.length} Lengkap ({packingPercent}%)
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-indigo-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${packingPercent}%` }}
              />
            </div>

            {/* Interactive Checkbox Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {packingChecklist.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => handleTogglePackingItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    item.checked
                      ? 'bg-violet-50/40 border-violet-200 text-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.checked ? (
                      <CheckCircle2 className="w-5 h-5 text-violet-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className={`text-xs font-semibold block ${item.checked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {item.text}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Kategori: {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex justify-between items-center border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Peringatan: Tag beg bagasi dan label bilik asrama akan diedarkan semasa taklimat pelepasan.
              </span>
              <button
                onClick={() => onNavigateTab('checklist')}
                className="text-xs font-bold text-violet-700 hover:text-violet-900 underline cursor-pointer"
              >
                Lihat 38 Checklist Logistik Penuh
              </button>
            </div>
          </div>

          {/* Pelepasan Kontinjen Alert */}
          <div className="p-5 rounded-3xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-2xl shrink-0">
                <Bus className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h5 className="font-extrabold text-blue-950 text-sm">
                  Pelepasan Bas Kontinjen: 15 Oktober 2026 (Khamis), 8:00 Pagi
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Lapor diri di Lobi Kolej KPMBP. Taklimat keselamatan, pengesahan kehadiran 41 pax dan pelepasan ke Kolej MARA Banting (KMB).
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('schedule')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shrink-0 cursor-pointer"
            >
              Tentatif Perjalanan
            </button>
          </div>
        </div>
      )}

      {/* PHASE 05: LIVE EVENT OPERATIONS */}
      {displayedPhase.id === 'phase_05' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-600" />
              <span>Prioriti Fasa 05: Operasi Langsung & Jadual Call-Time Pentas</span>
            </h4>
            <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Festival Sedang Berlangsung
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-xs text-slate-900 block">Jumaat, 16 Oktober (KMB Banting)</span>
              <ul className="text-xs text-slate-700 space-y-1">
                <li>&bull; 09:00 AM - Pertandingan Tarian Zapin</li>
                <li>&bull; 02:30 PM - Pertandingan Symphonic Duo</li>
                <li>&bull; 08:30 PM - Saringan BOTB (Rock Malaya)</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <span className="font-bold text-xs text-amber-950 block">Sabtu, 17 Oktober (JKKN Seremban)</span>
              <ul className="text-xs text-slate-700 space-y-1">
                <li>&bull; 07:00 AM - Bas bertolak ke Seremban</li>
                <li>&bull; 08:30 AM - Pementasan Teater Islamik</li>
                <li>&bull; 02:00 PM - Showcase Street Dakwah</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="font-bold text-xs text-emerald-950 block">Ahad, 18 Oktober (Penutupan)</span>
              <ul className="text-xs text-slate-700 space-y-1">
                <li>&bull; 09:30 AM - Majlis Penutupan Rasmi</li>
                <li>&bull; 11:30 AM - Pengumuman Keputusan</li>
                <li>&bull; 02:00 PM - Perjalanan Pulang ke KPMBP</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigateTab('schedule')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
            >
              Lihat Tentatif Masa Penuh & Call-Time
            </button>
          </div>
        </div>
      )}

      {/* PHASE 06: POST-SOAR EVALUATION & DOCUMENTATION */}
      {displayedPhase.id === 'phase_06' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-slate-700" />
              <span>Prioriti Fasa 06: Keputusan Rasmi, Penilaian & Apresiasi</span>
            </h4>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
              Pasca Acara
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-xs text-slate-900 block">Kompilasi Keputusan Rasmi</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keputusan rasmi penjurian bagi 5 acara pertandingan SOAR IPMA 2026 akan dipaparkan dan diarkibkan untuk rekod kolej.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-xs text-slate-900 block">Sijil Penyertaan & Apresiasi</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pengedaran sijil penyertaan rasmi kepada semua 35 pelajar dan 4 pegawai pengiring, disusuli majlis apresiasi kontinjen.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. PERSONALIZED ASSIGNED EVENT SPOTLIGHT */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
              Penyelarasan Acara Peribadi
            </div>
            <h4 className="font-black text-base text-slate-900 flex items-center gap-2 mt-0.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Panduan Khusus Acara: {activeEvent.title}</span>
            </h4>
          </div>

          {/* Event Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Tukar Acara:</span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              {EVENTS_DATA.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Event Quick Intel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 text-[11px] block">Ketua Penasihat & Talian</span>
            <div className="font-extrabold text-slate-900 text-sm">{activeEvent.leadAdvisor}</div>
            <a
              href={activeEvent.leadAdvisorWhatsApp || `https://wasap.my/${activeEvent.leadAdvisorPhone}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1 mt-1 text-[11px]"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Hubungi di WhatsApp</span>
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 text-[11px] block">Venue & Tarikh Pentas</span>
            <div className="font-extrabold text-slate-900">{activeEvent.venue}</div>
            <div className="text-blue-700 font-medium">{activeEvent.dateStr}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 text-[11px] block">Kuota & Syarat Penyertaan</span>
            <div className="font-extrabold text-slate-900">{activeEvent.participantsCount}</div>
            <div className="text-slate-600 truncate">{activeEvent.theme}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('calculator')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>Lihat Rubrik Skor {activeEvent.title}</span>
            </button>
            <button
              onClick={() => onNavigateTab('events')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Garis Panduan Rasmi Penuh</span>
            </button>
          </div>

          {onOpenAdminWorkspace && (
            <button
              onClick={() => onOpenAdminWorkspace('phases')}
              className="text-xs font-extrabold text-blue-700 hover:text-blue-900 underline cursor-pointer flex items-center gap-1"
            >
              <span>Buka Kawalan Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 6. EMERGENCY CONTACTS DIRECTORY */}
      <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400">
            <PhoneCall className="w-4 h-4" />
            <h5 className="font-black text-xs uppercase tracking-wider">Talian Kecemasan & Pegawai Pengiring</h5>
          </div>
          <span className="text-[11px] text-slate-400">Kontinjen KPMBP SOAR 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-white block">Muzlinda</span>
              <span className="text-[10px] text-slate-400">Teater & Pengiring (019-2046144)</span>
            </div>
            <a
              href="https://wasap.my/60192046144"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px]"
            >
              WhatsApp
            </a>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-white block">Khairi</span>
              <span className="text-[10px] text-slate-400">Muzik & Duo (014-5313756)</span>
            </div>
            <a
              href="https://wasap.my/60145313756"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px]"
            >
              WhatsApp
            </a>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="font-extrabold text-white block">Halimatul</span>
              <span className="text-[10px] text-slate-400">Street Dakwah (017-7804852)</span>
            </div>
            <a
              href="https://wasap.my/60177804852"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px]"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
