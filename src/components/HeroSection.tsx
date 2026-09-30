import React, { useState, useEffect } from 'react';
import { SOAR_METADATA } from '../data/soarData';
import { Clock, ArrowRight, ChevronRight, Sparkles, Search, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onSelectTab: (tab: string) => void;
  onOpenEvent: (eventId: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectTab, searchQuery = '', setSearchQuery }) => {
  // Countdown to 15 October 2026
  const targetDate = new Date('2026-10-15T08:00:00').getTime();
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
    <div className="relative bg-slate-50 text-slate-900 overflow-hidden py-6 lg:py-8 border-b border-slate-200">
      {/* Background Subtle Gradient Spheres */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Info Hero: Identity, Clean Title, Primary CTAs & Search */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Platform Identity */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Pusat Rujukan Rasmi Kontinjen</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display">
                SOAR IPMA 2026
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Kolej Profesional MARA Bandar Penawar &bull; 15 – 18 Oktober 2026
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full pt-1">
              <button
                onClick={() => onSelectTab('events')}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 hover:bg-rose-100 font-extrabold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01] cursor-pointer"
              >
                <span>5 Acara</span>
                <ArrowRight className="w-4 h-4 text-rose-600" />
              </button>

              <button
                onClick={() => onSelectTab('schedule')}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 hover:bg-amber-100 font-extrabold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Jadual 4 Hari</span>
              </button>

              <button
                onClick={() => onSelectTab('guidelines')}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-sky-50 border border-sky-300 text-sky-950 hover:bg-sky-100 font-extrabold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01] cursor-pointer"
              >
                <span>Dokumen & Syarat</span>
                <ChevronRight className="w-4 h-4 text-sky-600" />
              </button>
            </div>

            {/* Instant Search Bar */}
            {setSearchQuery && (
              <div className="pt-1 w-full">
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari maklumat acara, syarat, tarikh, atau pegawai penasihat..."
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

                {searchQuery && (
                  <div className="flex items-center gap-2 pt-1.5 text-xs">
                    <span className="text-slate-500 font-medium">Buka hasil dalam:</span>
                    <button
                      onClick={() => onSelectTab('events')}
                      className="text-blue-600 hover:underline font-bold cursor-pointer"
                    >
                      Acara &rarr;
                    </button>
                    <span className="text-slate-300">&bull;</span>
                    <button
                      onClick={() => onSelectTab('schedule')}
                      className="text-amber-700 hover:underline font-bold cursor-pointer"
                    >
                      Jadual &rarr;
                    </button>
                    <span className="text-slate-300">&bull;</span>
                    <button
                      onClick={() => onSelectTab('guidelines')}
                      className="text-sky-700 hover:underline font-bold cursor-pointer"
                    >
                      Dokumen &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Live Countdown Box */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md shadow-slate-200/50 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Kiraan Detik Festival</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-mono border border-red-200 font-extrabold">
                    15–18 OKT 2026
                  </span>
                </div>
              </div>

              {/* Countdown Digits */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black text-blue-600 font-mono">{timeLeft.days}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Hari</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black text-slate-800 font-mono">{timeLeft.hours}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Jam</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black text-slate-800 font-mono">{timeLeft.minutes}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Minit</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <div className="text-xl sm:text-2xl font-black text-indigo-600 font-mono">{timeLeft.seconds}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Saat</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                <span className="italic text-slate-500 truncate">"{SOAR_METADATA.theme}"</span>
                <span className="font-semibold text-slate-700 shrink-0 ml-2">KMB & JKKN</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
