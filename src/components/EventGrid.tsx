import React, { useState } from 'react';
import { EVENTS_DATA } from '../data/soarData';
import { EventDetail } from '../types';
import { EventModal } from './EventModal';
import { Users, MapPin, Calendar, ChevronRight, Award, Theater, Music, Sparkles, Guitar, Video, Layers, Search, PhoneCall, UserCheck } from 'lucide-react';

interface EventGridProps {
  searchQuery: string;
  onOpenCalculator: () => void;
}

export const EventGrid: React.FC<EventGridProps> = ({ searchQuery, onOpenCalculator }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);

  const filteredEvents = EVENTS_DATA.filter((event) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const matchesQuery =
      event.title.toLowerCase().includes(query) ||
      event.theme.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query) ||
      (event.advisors && event.advisors.some(adv => adv.toLowerCase().includes(query))) ||
      (event.leadAdvisor && event.leadAdvisor.toLowerCase().includes(query));

    return matchesQuery;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Theater':
        return <Theater className="w-6 h-6 text-blue-600" />;
      case 'Music':
        return <Music className="w-6 h-6 text-indigo-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-600" />;
      case 'Guitar':
        return <Guitar className="w-6 h-6 text-sky-600" />;
      case 'Video':
        return <Video className="w-6 h-6 text-rose-600" />;
      default:
        return <Award className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section className="py-12 bg-slate-50 text-slate-900 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Layers className="w-4 h-4" />
              <span>Direktori Acara Pertandingan</span>
            </div>
          </div>

          <button
            onClick={onOpenCalculator}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-blue-700 font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow-sm"
          >
            <Award className="w-4 h-4 text-blue-600" />
            <span>Kalkulator Rubrik Penilaian</span>
          </button>
        </div>

        {/* Events Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            <Search className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="font-semibold text-slate-800">Tiada acara dijumpai untuk carian ini.</p>
            <p className="text-xs text-slate-500 mt-1">Cuba kata kunci lain atau tukar kategori penapis.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => {
              const pastelStyles = [
                {
                  bg: 'bg-emerald-50/80 hover:bg-emerald-50/95',
                  border: 'border-emerald-200 hover:border-emerald-400',
                  iconBg: 'bg-emerald-100 border-emerald-200',
                  badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  tagBg: 'bg-emerald-100/90 text-emerald-950 border-emerald-300',
                  themeText: 'text-emerald-800',
                  accentText: 'text-emerald-700',
                  hoverShadow: 'hover:shadow-emerald-500/15'
                },
                {
                  bg: 'bg-amber-50/80 hover:bg-amber-50/95',
                  border: 'border-amber-200 hover:border-amber-400',
                  iconBg: 'bg-amber-100 border-amber-200',
                  badge: 'bg-amber-100 text-amber-800 border-amber-200',
                  tagBg: 'bg-amber-100/90 text-amber-950 border-amber-300',
                  themeText: 'text-amber-800',
                  accentText: 'text-amber-700',
                  hoverShadow: 'hover:shadow-amber-500/15'
                },
                {
                  bg: 'bg-indigo-50/80 hover:bg-indigo-50/95',
                  border: 'border-indigo-200 hover:border-indigo-400',
                  iconBg: 'bg-indigo-100 border-indigo-200',
                  badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                  tagBg: 'bg-indigo-100/90 text-indigo-950 border-indigo-300',
                  themeText: 'text-indigo-800',
                  accentText: 'text-indigo-700',
                  hoverShadow: 'hover:shadow-indigo-500/15'
                },
                {
                  bg: 'bg-sky-50/80 hover:bg-sky-50/95',
                  border: 'border-sky-200 hover:border-sky-400',
                  iconBg: 'bg-sky-100 border-sky-200',
                  badge: 'bg-sky-100 text-sky-800 border-sky-200',
                  tagBg: 'bg-sky-100/90 text-sky-950 border-sky-300',
                  themeText: 'text-sky-800',
                  accentText: 'text-sky-700',
                  hoverShadow: 'hover:shadow-sky-500/15'
                },
                {
                  bg: 'bg-rose-50/80 hover:bg-rose-50/95',
                  border: 'border-rose-200 hover:border-rose-400',
                  iconBg: 'bg-rose-100 border-rose-200',
                  badge: 'bg-rose-100 text-rose-800 border-rose-200',
                  tagBg: 'bg-rose-100/90 text-rose-950 border-rose-300',
                  themeText: 'text-rose-800',
                  accentText: 'text-rose-700',
                  hoverShadow: 'hover:shadow-rose-500/15'
                }
              ];

              const style = pastelStyles[idx % pastelStyles.length];

              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`group ${style.bg} border ${style.border} rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl ${style.hoverShadow} flex flex-col justify-between cursor-pointer relative overflow-hidden`}
                >
                  {/* Top Event Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${style.iconBg} border group-hover:scale-110 transition-transform`}>
                        {getIcon(event.iconName)}
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${style.badge} border`}>
                        {event.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                        {event.title}
                      </h3>
                      <p className={`text-xs font-bold ${style.themeText} mt-1`}>
                        Tema: "{event.theme}"
                      </p>
                    </div>

                    <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Bottom Event Specs */}
                  <div className="mt-6 pt-4 border-t border-slate-200/60 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${style.tagBg} font-bold border text-xs shadow-xs`}>
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{event.participantsCount}</span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 text-slate-800 font-semibold border border-slate-200 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span className="truncate">{event.dateStr}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>

                    {/* PIC / Penasihat Acara */}
                    {event.advisors && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <div className="flex items-start gap-1.5 text-xs text-slate-700">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900">PIC Acara: </span>
                            <span className="text-slate-600">{event.advisors.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={`pt-1 flex items-center justify-end gap-1 text-xs font-bold ${style.accentText} group-hover:translate-x-1 transition-transform`}>
                      <span>Info Lanjut</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Selected Event Modal */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onOpenCalculator={onOpenCalculator}
      />
    </section>
  );
};
