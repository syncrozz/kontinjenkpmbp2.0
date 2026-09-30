import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CurrentPhaseSummary } from './components/CurrentPhaseSummary';
import { EventPreview } from './components/EventPreview';
import { ImportantDatesPreview } from './components/ImportantDatesPreview';
import { ReferenceLinks } from './components/ReferenceLinks';
import { EventGrid } from './components/EventGrid';
import { ScheduleSection } from './components/ScheduleSection';
import { GuidelinesSection } from './components/GuidelinesSection';
import { ContactSection } from './components/ContactSection';
import { RubricCalculator } from './components/RubricCalculator';
import { LogisticsChecklist } from './components/LogisticsChecklist';
import { TalentForm } from './components/TalentForm';
import { ContingentOverview } from './components/ContingentOverview';
import { AdminPanel } from './components/AdminPanel';
import { PhaseAwareContingentDashboard } from './components/dashboard/PhaseAwareContingentDashboard';
import { Footer } from './components/Footer';
import { Search, Compass, Layers, Calendar, Calculator, CheckSquare, ShieldAlert, Sparkles, X, ShieldCheck, Award, UserCheck, ArrowRight } from 'lucide-react';
import { OperationsPhaseState, DashboardModuleVisibility, ContingentUserProfile } from './types';
import { DEFAULT_OPERATIONS_PHASE, DEFAULT_MODULE_VISIBILITY, DEFAULT_PUBLIC_USER } from './data/soarData';
import { subscribeToOperationsPhase, getInitialOperationsPhase } from './lib/firebase';
import { verifySessionOnBackend, logoutContingentSession } from './lib/contingentAuth';
import { VersionUpdateNotification } from './components/common/VersionUpdateNotification';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Operations Phase State (Default: Phase 03 - Latihan & Persiapan Pasukan, configurable by Admin)
  const [operationsPhase, setOperationsPhase] = useState<OperationsPhaseState>(getInitialOperationsPhase);

  // Dynamic Dashboard Modules Visibility derived from current phase state (SES v4.5)
  const visibleModules: DashboardModuleVisibility = {
    ...DEFAULT_MODULE_VISIBILITY,
    ...(operationsPhase.visibleModules || {})
  };

  // Contingent Access & Roles State
  const [currentUser, setCurrentUser] = useState<ContingentUserProfile>(() => {
    try {
      const saved = localStorage.getItem('kpmbp_contingent_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PUBLIC_USER;
  });

  // Admin / Contingent Workspace modal state
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    // If returning user already has a saved authenticated session, open workspace immediately
    try {
      const saved = localStorage.getItem('kpmbp_contingent_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role && u.role !== 'public') return true;
      }
    } catch {}
    return false;
  });
  const isAdminLoggedIn = currentUser.role === 'admin';
  const [adminInitialTab, setAdminInitialTab] = useState<'phases' | 'submissions' | 'checklist' | 'deadlines'>('phases');

  // SUBSEQUENT ACCESS WORKFLOW:
  // 1. Open Platform -> 2. Restore Existing Authentication Session -> 3. Verify Current Authorization -> 4. Open Contingent Workspace
  useEffect(() => {
    verifySessionOnBackend().then((profile) => {
      if (profile && profile.role !== 'public') {
        setCurrentUser(profile);
        setIsAdminOpen(true); // Automatically open the Contingent Workspace
      } else if (!profile && currentUser.role !== 'public') {
        // Session invalid on backend -> return cleanly to public state
        setCurrentUser(DEFAULT_PUBLIC_USER);
        setIsAdminOpen(false);
        try {
          localStorage.removeItem('kpmbp_contingent_user');
        } catch {}
      }
    });
  }, []);

  const handleUpdateCurrentUser = (profile: ContingentUserProfile) => {
    setCurrentUser(profile);
    try {
      localStorage.setItem('kpmbp_contingent_user', JSON.stringify(profile));
    } catch {}
    if (profile.role !== 'public') {
      setIsAdminOpen(true);
    }
  };

  const handleLogoutUser = async () => {
    await logoutContingentSession();
    setCurrentUser(DEFAULT_PUBLIC_USER);
    setIsAdminOpen(false);
    try {
      localStorage.removeItem('kpmbp_contingent_user');
    } catch {}
  };

  // Real-time synchronization with Firestore (with local fallback)
  useEffect(() => {
    const unsubscribe = subscribeToOperationsPhase((newPhase) => {
      if (newPhase) {
        setOperationsPhase(newPhase);
      }
    });
    return () => unsubscribe();
  }, []);

  // Offline detection state (Section 17: Non-intrusive offline indicator)
  const [isOnline, setIsOnline] = useState<boolean>(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Contextual festival emergency trigger (Section 18: Active only Oct 15–18, 2026)
  const isFestivalDates = useMemo(() => {
    const now = new Date();
    return now.getFullYear() === 2026 && now.getMonth() === 9 && now.getDate() >= 15 && now.getDate() <= 18;
  }, []);

  const handleOpenCalculator = () => {
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEvent = () => {
    setActiveTab('events');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Offline Status Alert (Section 17: Non-intrusive offline indicator) */}
      {!isOnline && (
        <div className="bg-slate-800 text-slate-200 text-xs py-1 px-4 flex items-center justify-center gap-2 border-b border-slate-700">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Luar talian — beberapa maklumat mungkin belum dikemas kini (Mod Bacaan Cache).</span>
        </div>
      )}

      {/* Contextual Festival Emergency Banner (Section 18: Active only Oct 15–18, 2026) */}
      {isFestivalDates && (
        <div className="bg-rose-950 text-rose-200 text-xs py-1 px-4 flex items-center justify-center gap-2 border-b border-rose-800 font-bold">
          <span>🚨 Festival Sedang Berlangsung — Talian Bantuan Kecemasan Pegawai Bertugas:</span>
          <a
            href="https://wasap.my/60145313756?text=KECEMASAN%20SOAR%20KPMBP"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            Hubungi Hotline WhatsApp &rarr;
          </a>
        </div>
      )}

      {/* Sticky Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAdmin={() => {
          setAdminInitialTab('phases');
          setIsAdminOpen(true);
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        currentUser={currentUser}
        phaseState={operationsPhase}
      />

      {/* Contingent Role Active Notification Banner */}
      {currentUser.role !== 'public' && (
        <div className={`border-b text-xs font-medium px-4 py-2 flex items-center justify-between transition-all ${
          currentUser.role === 'admin'
            ? 'bg-emerald-900 text-emerald-100 border-emerald-800'
            : currentUser.role === 'advisor'
            ? 'bg-amber-900 text-amber-100 border-amber-800'
            : currentUser.role === 'pic'
            ? 'bg-purple-900 text-purple-100 border-purple-800'
            : 'bg-cyan-900 text-cyan-100 border-cyan-800'
        }`}>
          <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
                currentUser.role === 'admin'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : currentUser.role === 'advisor'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : currentUser.role === 'pic'
                  ? 'bg-purple-400 text-slate-950 shadow-sm'
                  : 'bg-cyan-400 text-slate-950 shadow-sm'
              }`}>
                {currentUser.badge}
              </span>
              <span className="text-slate-200">
                Selamat kembali, <strong className="text-white">{currentUser.name}</strong> ({currentUser.title})
                {currentUser.eventAssigned && (
                  <span className="ml-1 text-amber-300 font-bold">• Tugasan Acara: {currentUser.eventAssigned}</span>
                )}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setActiveTab('contingent_dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-black text-xs transition-all border border-white/20 cursor-pointer shadow-xs"
                title="Buka Papan Pemuka Fasa Operasi Kontinjen"
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>Dashboard Ahli</span>
              </button>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1 font-bold underline hover:text-white cursor-pointer text-xs"
              >
                <span>
                  {currentUser.role === 'admin'
                    ? 'Pusat Operasi Admin'
                    : currentUser.role === 'advisor'
                    ? 'Workspace Advisor'
                    : currentUser.role === 'pic'
                    ? `Workspace PIC (${currentUser.eventAssigned || 'Acara'})`
                    : 'Workspace Ahli'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-white/40">|</span>
              <button
                onClick={handleLogoutUser}
                className="text-rose-300 hover:text-rose-100 font-bold cursor-pointer text-xs"
                title="Log keluar daripada sesi ini"
              >
                Log Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. PUBLIC HOMEPAGE (ENTRY POINT: RUJUK) */}
        {activeTab === 'overview' && (
          <>
            {/* Step 1: Hero / Identity & Live Countdown */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenEvent={handleOpenEvent}
            />

            {/* Step 2: Current Phase Summary (Concise active phase focus) */}
            <CurrentPhaseSummary
              phaseState={operationsPhase}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isAdminLoggedIn={isAdminLoggedIn}
              onOpenAdmin={(tab) => {
                setAdminInitialTab((tab as any) || 'phases');
                setIsAdminOpen(true);
              }}
            />

            {/* Step 3: Event Preview (Compact summary of the 5 events with CTA) */}
            <EventPreview
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Step 4: Important Dates Preview (Key dates, deadlines, and schedule CTA) */}
            <ImportantDatesPreview
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Step 5: Reference Links (Direct links to Dokumen, Jadual, Hubungi) */}
            <ReferenceLinks
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenContingentAccess={() => setIsAdminOpen(true)}
            />
          </>
        )}

        {/* 2. PUBLIC ACARA TAB (Authoritative Home for Events & Event Rubrics) */}
        {activeTab === 'events' && (
          <EventGrid
            searchQuery={searchQuery}
            onOpenCalculator={handleOpenCalculator}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 3. PUBLIC JADUAL TAB (Authoritative Home for Tentatif 4 Hari & Tarikh Penyerahan) */}
        {activeTab === 'schedule' && (
          <ScheduleSection
            searchQuery={searchQuery}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdmin={() => {
              setAdminInitialTab('deadlines');
              setIsAdminOpen(true);
            }}
            onOpenCalculator={handleOpenCalculator}
          />
        )}

        {/* 4. PUBLIC DOKUMEN TAB (Authoritative Home for Official Rules & Clauses) */}
        {activeTab === 'guidelines' && <GuidelinesSection />}

        {/* 5. PUBLIC HUBUNGI TAB (Authoritative Home for Contacts & Secretariat) */}
        {activeTab === 'contact' && (
          <ContactSection
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 6. MEMBER WORKSPACE (Dedicated Operational Hub for Authenticated Contingent) */}
        {activeTab === 'contingent_dashboard' && (
          <PhaseAwareContingentDashboard
            currentUser={currentUser}
            phaseState={operationsPhase}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdminWorkspace={(tab) => {
              setAdminInitialTab((tab as any) || 'phases');
              setIsAdminOpen(true);
            }}
            onOpenRoleSelector={() => {
              setIsAdminOpen(true);
            }}
          />
        )}

        {/* 7. OPERATIONAL TOOLS (Maintained for Workspaces and Contextual Links) */}
        {activeTab === 'calculator' && <RubricCalculator />}

        {activeTab === 'checklist' && (
          <LogisticsChecklist
            onOpenAdmin={() => {
              setAdminInitialTab('checklist');
              setIsAdminOpen(true);
            }}
            isAdminLoggedIn={isAdminLoggedIn}
          />
        )}

        {activeTab === 'talent' && <TalentForm />}
      </main>

      {/* Admin Panel & Contingent Access Workspaces Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={(val) => {
          if (!val) handleLogoutUser();
        }}
        currentUser={currentUser}
        onUpdateCurrentUser={handleUpdateCurrentUser}
        onLogout={handleLogoutUser}
        phaseState={operationsPhase}
        onUpdatePhase={setOperationsPhase}
        initialTab={adminInitialTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer (Simplified essential references & attribution) */}
      <Footer onSelectTab={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Seamless Version & Asset Update Notification Banner */}
      <VersionUpdateNotification />
    </div>
  );
}
