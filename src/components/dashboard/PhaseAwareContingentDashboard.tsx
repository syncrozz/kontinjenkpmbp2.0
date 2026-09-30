import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronDown, 
  ChevronUp, 
  Info, 
  FileText,
  Lock,
  Megaphone,
  Check,
  ListTodo,
  ExternalLink,
  LogOut,
  User
} from 'lucide-react';
import { 
  ContingentUserProfile, 
  OperationsPhaseState, 
  EventDetail,
  TraceableChecklistItem
} from '../../types';
import { 
  SOAR_PHASES, 
  EVENTS_DATA, 
  SOAR_METADATA 
} from '../../data/soarData';
import { 
  getAllTraceableChecklistItems 
} from '../../data/competitionReferenceData';

interface PhaseAwareContingentDashboardProps {
  currentUser: ContingentUserProfile;
  phaseState: OperationsPhaseState;
  onNavigateTab: (tabId: string) => void;
  onOpenAdminWorkspace?: (tab?: string) => void;
  onOpenRoleSelector?: () => void;
  isCompactModal?: boolean;
}

// Personal packing checklist for member readiness
const PERSONAL_PACKING_ITEMS: TraceableChecklistItem[] = [
  { 
    id: 'pack-mykad', 
    taskText: 'Kad Pengenalan (MyKad) & Kad Pelajar KPM fizikal (Wajib pengesahan penganjur)', 
    sourceType: 'official_organizer_rule', 
    sourceDocument: 'Syarat Am Penganjur SOAR 2026', 
    responsibleRole: 'Pelajar',
    deadline: '15 Okt 2026',
    mandatory: true 
  },
  { 
    id: 'pack-baju-korporat', 
    taskText: 'Baju Korporat KPM / Baju Rasmi Kontinjen KPMBP (Majlis Perasmian & Penutupan)', 
    sourceType: 'internal_operational_requirement', 
    sourceDocument: 'SOP Kontinjen KPMBP', 
    responsibleRole: 'Semua',
    deadline: '15 Okt 2026',
    mandatory: true 
  },
  { 
    id: 'pack-borang-waris', 
    taskText: 'Borang Kebenaran Waris / Ibu Bapa yang lengkap bertandatangan', 
    sourceType: 'internal_operational_requirement', 
    sourceDocument: 'Pekeliling Kebajikan KPMBP', 
    responsibleRole: 'Pelajar',
    deadline: '10 Okt 2026',
    mandatory: true 
  },
  { 
    id: 'pack-kostum-prop', 
    taskText: 'Kostum persembahan, instrumen peribadi & prop pentas yang disahkan patuh syariah', 
    sourceType: 'official_organizer_rule', 
    sourceDocument: 'Garis Panduan Busana & Alatan', 
    responsibleRole: 'Pelajar',
    deadline: '12 Okt 2026',
    mandatory: true 
  },
  { 
    id: 'pack-kesihatan', 
    taskText: 'Ubat-ubatan peribadi & kelengkapan kesihatan khusus (maklumkan kepada pegawai pengiring)', 
    sourceType: 'internal_operational_requirement', 
    sourceDocument: 'SOP Kesihatan & Kebajikan KPMBP', 
    responsibleRole: 'Pelajar',
    deadline: '14 Okt 2026' 
  },
  { 
    id: 'pack-ibadah', 
    taskText: 'Kelengkapan ibadah lengkap (sejadah peribadi, telekung / kain pelekat, songkok)', 
    sourceType: 'internal_operational_requirement', 
    sourceDocument: 'Kod Etika & Sahsiah KPMBP', 
    responsibleRole: 'Semua',
    deadline: '14 Okt 2026' 
  },
  { 
    id: 'pack-gadget', 
    taskText: 'Pengecas telefon / Powerbank & kabel komunikasi rasmi untuk talian kecemasan', 
    sourceType: 'internal_operational_requirement', 
    sourceDocument: 'SOP Perhubungan Luar', 
    responsibleRole: 'Semua',
    deadline: '15 Okt 2026' 
  }
];

// Phase 03 Rehearsal Schedule by Event
const REHEARSAL_SCHEDULE = [
  {
    eventKeyword: 'teater',
    eventTitle: 'Teater Islamik (Masar Al-Masajid)',
    dayTime: 'Setiap Isnin & Rabu (8:30 PM - 11:00 PM)',
    venue: 'Dewan Serbaguna KPMBP',
    focus: 'Latihan skrip watak, blocking pentas & sebutan naratif.',
    leadAdvisor: 'Muzlinda',
    phone: '019-2046144',
    whatsapp: 'https://wasap.my/60192046144'
  },
  {
    eventKeyword: 'battle',
    eventTitle: 'Battle of the Band (Rock Malaya)',
    dayTime: 'Setiap Selasa & Khamis (8:00 PM - 10:30 PM)',
    venue: 'Studio Muzik KPMBP',
    focus: 'Keserasian tempo, dinamik instrumen & kawalan vokal lagu wajib.',
    leadAdvisor: 'Syam',
    phone: '013-7554902',
    whatsapp: 'https://wasap.my/60137554902'
  },
  {
    eventKeyword: 'symphonic',
    eventTitle: 'Symphonic Duo',
    dayTime: 'Setiap Rabu (5:00 PM - 7:00 PM) & Sabtu (10:00 AM)',
    venue: 'Bilik Akustik KPMBP',
    focus: 'Harmoni duet vokal dan teknik susunan instrumen akustik.',
    leadAdvisor: 'Khairi',
    phone: '014-5313756',
    whatsapp: 'https://wasap.my/60145313756'
  },
  {
    eventKeyword: 'zapin',
    eventTitle: 'Tarian Zapin',
    dayTime: 'Setiap Selasa & Jumaat (8:30 PM - 11:00 PM)',
    venue: 'Studio Tari KPMBP',
    focus: 'Ketepatan ragam zapin asli, keseragaman langkah & postur.',
    leadAdvisor: 'Saba',
    phone: '012-7142990',
    whatsapp: 'https://wasap.my/60127142990'
  },
  {
    eventKeyword: 'dakwah',
    eventTitle: 'Street Dakwah (From Chaos to Calm)',
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
  onOpenRoleSelector,
  isCompactModal = false
}) => {
  const activePhase = SOAR_PHASES.find((p) => p.id === phaseState.activePhaseId) || SOAR_PHASES[2];

  const userStorageKey = useMemo(() => {
    return currentUser?.name 
      ? 'kpmbp_member_action_checked_' + encodeURIComponent(currentUser.name.trim().toLowerCase())
      : 'kpmbp_member_action_checked_default';
  }, [currentUser?.name]);

  // 1. Task Checkbox Completion State persisted in localStorage (User-isolated)
  const [checkedActionIds, setCheckedActionIds] = useState<Record<string, boolean>>(() => {
    try {
      const initialKey = currentUser?.name 
        ? 'kpmbp_member_action_checked_' + encodeURIComponent(currentUser.name.trim().toLowerCase())
        : 'kpmbp_member_action_checked_default';
      const saved = localStorage.getItem(initialKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      'pack-mykad': true,
      'pack-borang-waris': true
    };
  });

  // Re-sync when switching users
  useEffect(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        setCheckedActionIds(JSON.parse(saved));
      } else {
        setCheckedActionIds({
          'pack-mykad': true,
          'pack-borang-waris': true
        });
      }
    } catch {}
  }, [userStorageKey]);

  const [showCompletedTasks, setShowCompletedTasks] = useState<boolean>(false);
  const [showFullChecklistModal, setShowFullChecklistModal] = useState<boolean>(false);

  const toggleActionItem = (id: string) => {
    setCheckedActionIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(userStorageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 2. Identify the member's assigned event(s)
  const assignedEventText = (currentUser.eventAssigned || '').toLowerCase();

  const matchedEvents: EventDetail[] = useMemo(() => {
    if (!currentUser.eventAssigned || assignedEventText.includes('umum') || assignedEventText.includes('semua')) {
      return [];
    }
    return EVENTS_DATA.filter((e) => {
      const t = e.title.toLowerCase();
      const c = e.category.toLowerCase();
      return (
        t.includes(assignedEventText) ||
        assignedEventText.includes(t) ||
        c.includes(assignedEventText) ||
        assignedEventText.includes(c) ||
        (assignedEventText.includes('teater') && e.id === 'teater-islamik') ||
        (assignedEventText.includes('zapin') && e.id === 'tarian-zapin') ||
        (assignedEventText.includes('band') && e.id === 'battle-of-the-band') ||
        (assignedEventText.includes('duo') && e.id === 'symphonic-duo') ||
        (assignedEventText.includes('dakwah') && e.id === 'street-dakwah')
      );
    });
  }, [currentUser.eventAssigned, assignedEventText]);

  // Primary event (if any matched)
  const primaryEvent = matchedEvents.length > 0 ? matchedEvents[0] : null;

  // Matching rehearsal info for primary event
  const matchedRehearsal = useMemo(() => {
    if (!primaryEvent && !currentUser.eventAssigned) return null;
    const term = (primaryEvent?.title || currentUser.eventAssigned || '').toLowerCase();
    return REHEARSAL_SCHEDULE.find((r) => term.includes(r.eventKeyword));
  }, [primaryEvent, currentUser.eventAssigned]);

  // 3. Collect Real Member Tasks from Traceable Items + Packing Items
  const memberTasks = useMemo(() => {
    // If user has specific event, fetch event's traceable tasks
    const eventFilter = primaryEvent ? primaryEvent.title : 'Umum Kontinjen';
    const traceableItems = getAllTraceableChecklistItems(eventFilter);

    // Merge packing items for members and all roles
    const combined = [
      ...PERSONAL_PACKING_ITEMS,
      ...traceableItems
    ];

    // Filter duplicates by id
    const seen = new Set<string>();
    return combined.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [primaryEvent]);

  // Split tasks into:
  // - Perlu Dibuat Sekarang (Now: Active & pending)
  // - Selesai (Completed)
  const pendingTasks = memberTasks.filter((t) => !checkedActionIds[t.id]);
  const completedTasks = memberTasks.filter((t) => checkedActionIds[t.id]);

  const totalTasksCount = memberTasks.length;
  const completedTasksCount = completedTasks.length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // 4. Relevant Upcoming Dates (NEXT)
  const upcomingMilestones = useMemo(() => {
    const list = [];
    if (matchedRehearsal) {
      list.push({
        date: 'Setiap Minggu',
        title: `Sesi Latihan / Raptai: ${matchedRehearsal.dayTime}`,
        venue: matchedRehearsal.venue,
        tag: 'Latihan Pasukan'
      });
    }
    list.push({
      date: '10 September 2026',
      title: 'Tarikh Akhir Submisi Dokumen & Borang Rasmi',
      venue: 'Portal Rasmi & Sekretariat',
      tag: 'Penyerahan'
    });
    list.push({
      date: '15 Oktober 2026 (2.00 ptg)',
      title: 'Ketibaan & Pendaftaran Kontinjen di Kolej MARA Banting',
      venue: 'Kolej MARA Banting, Selangor',
      tag: 'Hari 1 Festival'
    });
    if (primaryEvent) {
      list.push({
        date: primaryEvent.dateStr || '16–17 Oktober 2026',
        title: `Pentas Pertandingan: ${primaryEvent.title}`,
        venue: primaryEvent.venue,
        tag: 'Pentas Acara'
      });
    }
    return list.slice(0, 3);
  }, [matchedRehearsal, primaryEvent]);

  // =========================================================================
  // PUBLIC ACCESS GUARD (If role === 'public')
  // =========================================================================
  if (currentUser.role === 'public') {
    return (
      <div className={`space-y-6 ${isCompactModal ? 'p-2' : 'max-w-3xl mx-auto px-4 sm:px-6 py-12'}`}>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 inline-block">
              Ruang Khusus Ahli Kontinjen
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              Log Masuk Dashboard Ahli
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dashboard Ahli menyediakan senarai tindakan peribadi (*Now*), tugasan persiapan acara (*Next*), dan senarai semak logistik bagi kontinjen KPMBP.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                if (onOpenRoleSelector) {
                  onOpenRoleSelector();
                } else if (onOpenAdminWorkspace) {
                  onOpenAdminWorkspace('access');
                }
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sahkan Identiti / Log Masuk Ahli Kontinjen</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED MEMBER DASHBOARD (NOW → NEXT → REFERENCE)
  // =========================================================================
  return (
    <div className={`space-y-6 ${isCompactModal ? 'p-2' : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
      
      {/* GREETING & CONTEXT HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
              currentUser.role === 'admin'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : currentUser.role === 'advisor'
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : currentUser.role === 'pic'
                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
            }`}>
              {currentUser.badge || 'AHLI KONTINJEN'}
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs font-semibold text-slate-600">
              Fasa {activePhase.phaseNumber}: {activePhase.title}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Hai, {currentUser.name}
          </h1>

          <p className="text-xs text-slate-500 font-medium">
            {currentUser.title || 'Peserta Kontinjen'}
            {currentUser.eventAssigned && (
              <span className="text-blue-700 font-bold ml-1">
                &bull; Acara: {currentUser.eventAssigned}
              </span>
            )}
          </p>
        </div>

        {/* Quick Jump to Public or Workspace */}
        <div className="flex items-center gap-2 shrink-0">
          {currentUser.role === 'admin' && onOpenAdminWorkspace && (
            <button
              onClick={() => onOpenAdminWorkspace('phases')}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300 transition-colors cursor-pointer"
            >
              Urus Admin &rarr;
            </button>
          )}
          <button
            onClick={() => onNavigateTab('overview')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Laman Utama &rarr;
          </button>
        </div>
      </div>

      {/* ANNOUNCEMENT BROADCAST (IF ANY) */}
      {phaseState.announcement && phaseState.announcement.trim() !== '' && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <Megaphone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-800">
            <strong className="text-amber-950 block mb-0.5">Peringatan Urus Setia Kontinjen:</strong>
            <p className="leading-relaxed">{phaseState.announcement}</p>
          </div>
        </div>
      )}

      {/* =========================================================================
          1. CURRENT FOCUS (NOW)
         ========================================================================= */}
      <section className="bg-linear-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200 rounded-2xl p-5 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-blue-200/60">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-wider text-blue-900 font-display">
              Fokus Sekarang (Now)
            </h2>
          </div>
          <span className="text-[11px] font-bold text-blue-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-blue-200">
            Fasa {activePhase.phaseNumber} / 06
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {primaryEvent ? primaryEvent.title : (currentUser.eventAssigned || 'Kontinjen KPMBP')}
            </h3>

            {primaryEvent && (
              <button
                onClick={() => onNavigateTab('events')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span>Buka Maklumat Acara</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="bg-white/90 border border-blue-100 rounded-xl p-3 text-xs text-slate-700 space-y-1 shadow-2xs">
            <div>
              <strong className="text-slate-900">Fokus Fasa Semasa: </strong>
              <span>{activePhase.priorityFocus}</span>
            </div>

            {matchedRehearsal && (
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900">Jadual Latihan: </span>
                    <span>{matchedRehearsal.dayTime} ({matchedRehearsal.venue})</span>
                  </div>
                </div>

                {matchedRehearsal.phone && (
                  <a
                    href={matchedRehearsal.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline shrink-0"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>WhatsApp Penasihat ({matchedRehearsal.leadAdvisor})</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. MY ACTIONS (TINDAKAN SAYA) — CORE INTERACTIVE SECTION
         ========================================================================= */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm sm:text-base font-black text-slate-900 font-display">
                Tindakan Saya ({pendingTasks.length} Belum Selesai)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tandakan tugasan yang telah anda selesaikan bagi memastikan pematuhan pasukan.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs self-start sm:self-auto">
            <span className="font-bold text-slate-600">
              {completedTasksCount} / {totalTasksCount} Selesai ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
          <div 
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Items List */}
        {memberTasks.length === 0 ? (
          // SES Compliant Empty State
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">
              Tiada tindakan diperlukan buat masa ini.
            </h4>
            <p className="text-xs text-slate-500">
              Semua tugasan persediaan dan senarai semak telah dikemaskini.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Pending Tasks */}
            {pendingTasks.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tahniah! Semua tugasan aktif telah ditandakan selesai.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleActionItem(task.id)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/70 transition-all flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => {}} // handled by parent onClick
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 group-hover:text-blue-900 leading-snug">
                          {task.taskText}
                        </span>
                        {task.deadline && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                            {task.deadline}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        <span>Punca: <strong>{task.sourceDocument}</strong></span>
                        {task.mandatory && (
                          <span className="text-rose-600 font-bold">&bull; [Wajib]</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Collapsible Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                  className="flex items-center justify-between w-full text-xs font-bold text-slate-500 hover:text-slate-800 py-1 cursor-pointer"
                >
                  <span>Tugasan Telah Selesai ({completedTasks.length})</span>
                  {showCompletedTasks ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showCompletedTasks && (
                  <div className="space-y-1.5 pt-2">
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleActionItem(task.id)}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center gap-3 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => {}}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-xs text-slate-600 line-through">
                          {task.taskText}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* =========================================================================
          3. MY EVENT (ACARA SAYA)
         ========================================================================= */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 font-display">
              Acara Saya
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('events')}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Lihat Semua Acara &rarr;
          </button>
        </div>

        {primaryEvent ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                  {primaryEvent.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {primaryEvent.title}
                </h3>
                <p className="text-xs text-slate-500 italic">
                  "{primaryEvent.theme}"
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
                <div>Peranan: <strong className="text-slate-900">{currentUser.title}</strong></div>
                <div>Kouta: <strong className="text-slate-900">{primaryEvent.participantsCount}</strong></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/70 text-slate-700">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Pentas: <strong>{primaryEvent.venue}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Tarikh: <strong>{primaryEvent.dateStr}</strong></span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => onNavigateTab('events')}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Buka Butiran Acara & Syarat &rarr;
              </button>

              {primaryEvent.rubric && (
                <button
                  onClick={() => onNavigateTab('calculator')}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition-colors cursor-pointer"
                >
                  Rubrik Penjurian (Kalkulator)
                </button>
              )}
            </div>
          </div>
        ) : (
          // SES Empty State if no specific event assigned
          <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
            <p>
              Tiada acara khusus ditugaskan kepada profil anda (Peranan: <strong>{currentUser.title}</strong>).
            </p>
            <button
              onClick={() => onNavigateTab('events')}
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Lihat 5 Acara Kontinjen</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* =========================================================================
          4. NEXT IMPORTANT DATES (SETERUSNYA)
         ========================================================================= */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 font-display">
              Seterusnya (Next)
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('schedule')}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Lihat Jadual Penuh 4 Hari &rarr;
          </button>
        </div>

        {upcomingMilestones.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            Tiada jadual khusus untuk anda buat masa ini.
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingMilestones.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {item.tag}
                    </span>
                    <span className="font-extrabold text-blue-900 font-mono">
                      {item.date}
                    </span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">
                    {item.title}
                  </div>
                </div>

                <div className="text-slate-500 text-[11px] sm:text-right shrink-0">
                  {item.venue}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          5. REFERENCE & WORKSPACE (TERTIARY / ACCESSIBLE ON DEMAND)
         ========================================================================= */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 font-display">
              Pautan Rujukan & Profil
            </h2>
          </div>
        </div>

        {/* 4 Clean Quick Jumps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <button
            onClick={() => onNavigateTab('guidelines')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer space-y-1"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <div className="font-bold text-slate-900">Dokumen & Syarat</div>
            <div className="text-[10px] text-slate-500">Peraturan & Etika Rasmi</div>
          </button>

          <button
            onClick={() => onNavigateTab('contact')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer space-y-1"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <div className="font-bold text-slate-900">Direktori Pegawai</div>
            <div className="text-[10px] text-slate-500">WhatsApp Penasihat & PIC</div>
          </button>

          <button
            onClick={() => onNavigateTab('schedule')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer space-y-1"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <div className="font-bold text-slate-900">Jadual & Deadlines</div>
            <div className="text-[10px] text-slate-500">Tentatif Penuh KMB & JKKN</div>
          </button>

          <button
            onClick={() => onNavigateTab('events')}
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors cursor-pointer space-y-1"
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <div className="font-bold text-slate-900">5 Acara Kontinjen</div>
            <div className="text-[10px] text-slate-500">Syarat & Format Pentas</div>
          </button>
        </div>

        {/* Profile Details & Session Sign Out */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span>Sesi Log Masuk: <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.badge})</span>
          </div>

          <button
            onClick={() => {
              if (onOpenRoleSelector) {
                onOpenRoleSelector();
              } else if (onOpenAdminWorkspace) {
                onOpenAdminWorkspace('access');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            <span>Tukar Peranan / Kemaskini Sesi</span>
          </button>
        </div>
      </section>

    </div>
  );
};
