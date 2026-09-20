import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ContingentOverview } from './components/ContingentOverview';
import { EventGrid } from './components/EventGrid';
import { ScheduleSection } from './components/ScheduleSection';
import { RubricCalculator } from './components/RubricCalculator';
import { LogisticsChecklist } from './components/LogisticsChecklist';
import { GuidelinesSection } from './components/GuidelinesSection';
import { TalentForm } from './components/TalentForm';
import { SubmissionDeadlinesSection } from './components/SubmissionDeadlinesSection';
import { AdminPanel } from './components/AdminPanel';
import { PhaseBanner } from './components/PhaseBanner';
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

  const handleOpenCalculator = () => {
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEvent = () => {
    setActiveTab('events');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
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
                <span>Dashboard Fasa Ahli</span>
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

      {/* Global Search Results Alert Bar */}
      {searchQuery.trim() !== '' && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 text-xs text-blue-900 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              <span>
                Menapis hasil carian untuk: <strong>"{searchQuery}"</strong>
              </span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200"
            >
              <span>Kosongkan Carian</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Global Contingent Operations Phase Hub */}
      <PhaseBanner
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

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <>
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenEvent={handleOpenEvent}
            />

            {/* Configurable Primary Dashboard Modules (SES v4.5) */}
            {visibleModules.events && (
              <EventGrid
                searchQuery={searchQuery}
                onOpenCalculator={handleOpenCalculator}
                isAdminLoggedIn={isAdminLoggedIn}
                onOpenAdmin={() => {
                  setAdminInitialTab('phases');
                  setIsAdminOpen(true);
                }}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {visibleModules.contingentOverview && <ContingentOverview />}

            {visibleModules.schedule && <ScheduleSection searchQuery={searchQuery} />}

            {visibleModules.calculator && <RubricCalculator />}

            {visibleModules.checklist && (
              <LogisticsChecklist
                onOpenAdmin={() => {
                  setAdminInitialTab('checklist');
                  setIsAdminOpen(true);
                }}
                isAdminLoggedIn={isAdminLoggedIn}
              />
            )}

            {visibleModules.talent && <TalentForm />}

            {visibleModules.guidelines && <GuidelinesSection />}

            {/* Informative Status Banner for Active Modules */}
            {Object.values(visibleModules).some((v) => v === false) && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-slate-100/90 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span>
                      Modul paparan dashboard telah dilaraskan mengikut keutamaan <strong>Fasa Operasi Semasa</strong>. Semua borang pendaftaran, senarai semak, dan dokumen rasmi tetap boleh diakses penuh pada bila-bila masa melalui menu navigasi di atas.
                    </span>
                  </div>
                  {isAdminLoggedIn && (
                    <button
                      onClick={() => {
                        setAdminInitialTab('phases');
                        setIsAdminOpen(true);
                      }}
                      className="text-blue-700 hover:text-blue-900 font-bold underline shrink-0 cursor-pointer text-left sm:text-right"
                    >
                      Ubah Paparan Modul (Admin)
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

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

        {activeTab === 'talent' && <TalentForm />}

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

        {activeTab === 'schedule' && <ScheduleSection searchQuery={searchQuery} />}

        {activeTab === 'calculator' && <RubricCalculator />}

        {activeTab === 'checklist' && (
          <LogisticsChecklist onOpenAdmin={() => setIsAdminOpen(true)} isAdminLoggedIn={isAdminLoggedIn} />
        )}

        {activeTab === 'guidelines' && <GuidelinesSection />}
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

      {/* Submission Deadlines Section - Controlled by deadlines module toggle or active overview */}
      {visibleModules.deadlines && (
        <SubmissionDeadlinesSection
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdmin={() => {
            setAdminInitialTab('deadlines');
            setIsAdminOpen(true);
          }}
          onOpenCalculator={handleOpenCalculator}
        />
      )}

      {/* Footer */}
      <Footer onSelectTab={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Seamless Version & Asset Update Notification Banner */}
      <VersionUpdateNotification />
    </div>
  );
}
