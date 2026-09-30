import React from 'react';
import { EVENTS_DATA } from '../data/soarData';
import { Layers, ArrowRight, Calendar } from 'lucide-react';

interface EventPreviewProps {
  onNavigateTab: (tab: string) => void;
}

export const EventPreview: React.FC<EventPreviewProps> = ({ onNavigateTab }) => {
  return (
    <section className="py-8 sm:py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>5 Acara Disertai</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-black tracking-tight text-slate-900">
              Acara Kontinjen KPMBP
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              5 acara seni persembahan & dakwah di Festival SOAR IPMA 2026.
            </p>
          </div>

          <button
            onClick={() => {
              onNavigateTab('events');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs transition-colors border border-blue-200 self-start sm:self-auto cursor-pointer"
          >
            <span>Buka Semua Acara</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Minimal 5 Events Preview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {EVENTS_DATA.map((event, index) => {
            const badgeColors = [
              'bg-blue-50 text-blue-800 border-blue-200',
              'bg-indigo-50 text-indigo-800 border-indigo-200',
              'bg-rose-50 text-rose-800 border-rose-200',
              'bg-amber-50 text-amber-800 border-amber-200',
              'bg-emerald-50 text-emerald-800 border-emerald-200',
            ];
            const badgeColor = badgeColors[index % badgeColors.length];

            const eventDate = event.id === 'teater-islamik'
              ? '17 Okt (Seremban)'
              : '16–17 Okt (KMB)';

            return (
              <div
                key={event.id}
                onClick={() => {
                  onNavigateTab('events');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-3.5 transition-all hover:shadow-sm cursor-pointer flex flex-col justify-between group space-y-2.5"
              >
                <div className="space-y-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor} uppercase tracking-wider inline-block`}>
                    {event.category}
                  </span>

                  <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{eventDate}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:text-blue-700">
                  <span>Lihat Acara</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
