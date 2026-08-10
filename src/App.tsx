import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ContingentOverview } from './components/ContingentOverview';
import { EventGrid } from './components/EventGrid';
import { ScheduleSection } from './components/ScheduleSection';
import { RubricCalculator } from './components/RubricCalculator';
import { LogisticsChecklist } from './components/LogisticsChecklist';
import { GuidelinesSection } from './components/GuidelinesSection';
import { TalentForm } from './components/TalentForm';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { Search, Compass, Layers, Calendar, Calculator, CheckSquare, ShieldAlert, Sparkles, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Admin Mode state
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

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
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

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
            <EventGrid searchQuery={searchQuery} onOpenCalculator={handleOpenCalculator} />
            <ContingentOverview />
            <ScheduleSection searchQuery={searchQuery} />
            <RubricCalculator />
            <LogisticsChecklist onOpenAdmin={() => setIsAdminOpen(true)} isAdminLoggedIn={isAdminLoggedIn} />
            <TalentForm />
            <GuidelinesSection />
          </>
        )}

        {activeTab === 'talent' && <TalentForm />}

        {activeTab === 'events' && (
          <EventGrid searchQuery={searchQuery} onOpenCalculator={handleOpenCalculator} />
        )}

        {activeTab === 'schedule' && <ScheduleSection searchQuery={searchQuery} />}

        {activeTab === 'calculator' && <RubricCalculator />}

        {activeTab === 'checklist' && (
          <LogisticsChecklist onOpenAdmin={() => setIsAdminOpen(true)} isAdminLoggedIn={isAdminLoggedIn} />
        )}

        {activeTab === 'guidelines' && <GuidelinesSection />}
      </main>

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
      />

      {/* Footer */}
      <Footer onSelectTab={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
