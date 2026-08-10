import React, { useState, useEffect } from 'react';
import { SOAR_METADATA } from '../data/soarData';
import { Users, Award, MapPin, Clock, ArrowRight, Shield, CheckCircle2, ChevronRight, Music, Sparkles, UserPlus, Search, X } from 'lucide-react';

interface HeroSectionProps {
  onSelectTab: (tab: string) => void;
  onOpenEvent: (eventId: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectTab, onOpenEvent, searchQuery = '', setSearchQuery }) => {
  // Countdown to 15 October 2026
  const targetDate = new Date('2026-10-15T08:00:00').getTime();
  const [selectedVenueTab, setSelectedVenueTab] = useState<'kmb' | 'jkkn'>('kmb');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="relative bg-slate-50 text-slate-900 overflow-hidden py-4 lg:py-5 border-b border-slate-200">
      {/* Background Subtle Gradient Spheres */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Main Info Hero */}
          <div className="lg:col-span-7 space-y-2.5">
            {/* Prominent Talent Search CTA */}
            <div className="pt-1 w-full">
              <button
                onClick={() => onSelectTab('talent')}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 text-white font-black text-sm sm:text-base shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <UserPlus className="w-5 h-5 text-white" />
                <span>Isi Borang Pencarian Bakat SOAR '26</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Quick Action CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full pt-1">
              <button
                onClick={() => onSelectTab('events')}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 hover:bg-rose-100 font-extrabold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>5 Acara</span>
                <ArrowRight className="w-4 h-4 text-rose-600" />
              </button>

              <button
                onClick={() => onSelectTab('schedule')}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 hover:bg-amber-100 font-extrabold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Jadual 4 Hari</span>
              </button>

              <button
                onClick={() => onSelectTab('calculator')}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-sky-50 border border-sky-300 text-sky-950 hover:bg-sky-100 font-extrabold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Kalkulator Rubrik</span>
                <ChevronRight className="w-4 h-4 text-sky-600" />
              </button>
            </div>

            {/* Search Input Bar directly below the 3 buttons */}
            {setSearchQuery && (
              <div className="pt-2 w-full">
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari Maklumat berkaitan acara, PIC Penasihat dan lain-lain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 shadow-sm transition-all font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer"
                      title="Padam Carian"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Countdown Box & Stat Metrics */}
          <div className="lg:col-span-5">
            
            {/* Live Countdown Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-lg shadow-slate-200/50 relative overflow-hidden space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <Clock className="w-3.5 h-3.5" />
                  <span>COUNTDOWN</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Tarikh Event:</span>
                  <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-mono border border-red-200 font-extrabold">
                    15-18 OKT 2026
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                  <div className="text-xl sm:text-2xl font-black text-blue-600 font-mono">{timeLeft.days}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Hari</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                  <div className="text-xl sm:text-2xl font-black text-slate-800 font-mono">{timeLeft.hours}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Jam</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                  <div className="text-xl sm:text-2xl font-black text-slate-800 font-mono">{timeLeft.minutes}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Minit</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                  <div className="text-xl sm:text-2xl font-black text-indigo-600 font-mono">{timeLeft.seconds}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Saat</div>
                </div>
              </div>

              <p className="text-center text-[11px] text-slate-500 italic pb-1 border-b border-slate-100">
                Tema Rasmi: "{SOAR_METADATA.theme}"
              </p>

              {/* Venue Switcher Tabs inside Countdown Card */}
              <div className="pt-0.5">
                <div className="grid grid-cols-2 gap-1 w-full bg-slate-100/90 p-1 rounded-xl border border-slate-200 mb-2">
                  <button
                    onClick={() => setSelectedVenueTab('kmb')}
                    className={`py-1 px-3 rounded-lg text-xs font-extrabold transition-all text-center cursor-pointer ${
                      selectedVenueTab === 'kmb'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    Tuan Rumah
                  </button>
                  <button
                    onClick={() => setSelectedVenueTab('jkkn')}
                    className={`py-1 px-3 rounded-lg text-xs font-extrabold transition-all text-center cursor-pointer ${
                      selectedVenueTab === 'jkkn'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    Lokasi Teater
                  </button>
                </div>

                {/* Tab Content */}
                {selectedVenueTab === 'kmb' ? (
                  <div className="flex items-start gap-2 p-2 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Kolej MARA Banting</div>
                      <div className="text-[11px] text-slate-600 leading-snug">Penginapan Kontinjen &amp; Pentas Utama</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-2 rounded-xl bg-amber-50/70 border border-amber-100 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Lokasi Teater (JKKN)</div>
                      <div className="text-[11px] text-slate-600 leading-snug">JKKN Negeri Sembilan, Seremban (Acara Teater &bull; 17 Okt 2026)</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
