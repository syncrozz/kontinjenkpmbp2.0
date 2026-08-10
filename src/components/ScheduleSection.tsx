import React, { useState } from 'react';
import { SCHEDULE_DATA } from '../data/soarData';
import { Calendar, Clock, MapPin, Filter, CheckCircle2, AlertCircle, ChevronRight, Tag } from 'lucide-react';

interface ScheduleSectionProps {
  searchQuery?: string;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ searchQuery = '' }) => {
  const [activeDay, setActiveDay] = useState<number>(0); // 0 = Semua Hari, 1..4 = Hari 1..4

  const query = searchQuery.trim().toLowerCase();

  const filteredSchedule = SCHEDULE_DATA.filter((item) => {
    const matchesDay = activeDay === 0 || item.day === activeDay;
    if (!query) return matchesDay;

    const matchesQuery =
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.venue.toLowerCase().includes(query) ||
      item.date.toLowerCase().includes(query) ||
      item.time.toLowerCase().includes(query) ||
      (query.includes('penutup') && item.title.toLowerCase().includes('penutup')) ||
      (query.includes('perasmian') && item.title.toLowerCase().includes('perasmian'));

    return matchesDay && matchesQuery;
  });

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Teater':
        return 'bg-sky-50 text-sky-950 border-sky-300';
      case 'Muzik':
        return 'bg-amber-50 text-amber-950 border-amber-300';
      case 'Tarian':
        return 'bg-rose-50 text-rose-950 border-rose-300';
      case 'Dakwah':
        return 'bg-rose-50 text-rose-950 border-rose-300';
      case 'Logistik':
        return 'bg-amber-50 text-amber-950 border-amber-300';
      case 'Majlis':
        return 'bg-sky-50 text-sky-950 border-sky-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <section className="py-12 bg-slate-50 text-slate-900 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <Calendar className="w-4 h-4" />
              <span>Jadual Rasmi Program SOAR IPMA 2026</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Tentatif Festival 4 Hari (15–18 Oktober 2026)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Rujukan masa, lokasi, saringan, pergerakan, dan majlis penutup.
            </p>
          </div>

          {/* Day Tabs - Top Full Width 'Semua Hari' & Bottom 4 Days Row */}
          <div className="w-full bg-slate-100/70 border border-slate-200/80 p-2 rounded-2xl shadow-sm space-y-2">
            {/* Top Row: Semua Hari */}
            {(() => {
              const isAllActive = activeDay === 0;
              return (
                <button
                  onClick={() => setActiveDay(0)}
                  className={`w-full rounded-xl px-4 py-2 border text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer ${
                    isAllActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/80 ring-offset-1 scale-[1.005]'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span className="font-black text-xs sm:text-sm">Semua Hari (15 – 18 Oktober 2026)</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shrink-0 ${
                    isAllActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {SCHEDULE_DATA.length} Event
                  </span>
                </button>
              );
            })()}

            {/* Bottom Row: Hari 1 hingga Hari 4 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 1, label: 'Hari 1', count: SCHEDULE_DATA.filter(s => s.day === 1).length },
                { id: 2, label: 'Hari 2', count: SCHEDULE_DATA.filter(s => s.day === 2).length },
                { id: 3, label: 'Hari 3', count: SCHEDULE_DATA.filter(s => s.day === 3).length },
                { id: 4, label: 'Hari 4', count: SCHEDULE_DATA.filter(s => s.day === 4).length },
              ].map((dayTab) => {
                const isActive = activeDay === dayTab.id;
                return (
                  <button
                    key={dayTab.id}
                    onClick={() => setActiveDay(dayTab.id)}
                    className={`rounded-xl px-3.5 py-2 border text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer text-center ${
                      isActive
                        ? 'bg-sky-500 text-white border-sky-500 shadow-md ring-2 ring-sky-300/80 ring-offset-1 scale-[1.01]'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>{dayTab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Timeline Items List */}
        <div className="space-y-4">
          {filteredSchedule.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm">
              Tiada program dijadualkan untuk penapis ini.
            </div>
          ) : (
            filteredSchedule.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md group"
              >
                {/* Left: Date & Time */}
                <div className="md:w-64 shrink-0 space-y-1">
                  <div className="text-xs font-extrabold text-blue-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                  <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 font-mono">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{item.time}</span>
                  </div>
                </div>

                {/* Middle: Content */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeColor(item.category)}`}>
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-600 shrink-0" />
                      <strong className="text-slate-700">{item.venue}</strong>
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Right: Badge / Indicator */}
                <div className="shrink-0 text-right hidden md:block">
                  <span className="text-[11px] text-slate-400 font-mono font-medium">
                    Hari ke-{item.day}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};
