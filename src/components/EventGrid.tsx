import React, { useState } from 'react';
import { EVENTS_DATA, SUBMISSION_DEADLINES, SubmissionDeadlineItem, getEventDeadlines } from '../data/soarData';
import { EventDetail } from '../types';
import { EventModal } from './EventModal';
import { Users, MapPin, Calendar, ChevronRight, Award, Theater, Music, Sparkles, Guitar, Video, Layers, Search, PhoneCall, UserCheck, Clock, AlertTriangle, CheckCircle2, ShieldAlert, Edit3, Plus, Trash2, RotateCcw, Save, X } from 'lucide-react';

interface EventGridProps {
  searchQuery: string;
  onOpenCalculator: () => void;
  isAdminLoggedIn?: boolean;
  onOpenAdmin?: () => void;
}

export const EventGrid: React.FC<EventGridProps> = ({ searchQuery, onOpenCalculator, isAdminLoggedIn = false, onOpenAdmin }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);

  // Admin Deadlines State
  const [deadlines, setDeadlines] = useState<SubmissionDeadlineItem[]>(() => {
    const saved = localStorage.getItem('kpmbp_soar_deadlines');
    if (saved) {
      try {
        const parsed: SubmissionDeadlineItem[] = JSON.parse(saved);
        const hasOutdated = parsed.some(
          (item) =>
            item.dueDate.includes('1 Sept 2026') ||
            item.dueDate.includes('15 Sept 2026') ||
            item.dueDate.includes('1 September') ||
            item.dueDate.includes('15 September')
        );
        if (hasOutdated) {
          localStorage.setItem('kpmbp_soar_deadlines', JSON.stringify(SUBMISSION_DEADLINES));
          return SUBMISSION_DEADLINES;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return SUBMISSION_DEADLINES;
  });

  React.useEffect(() => {
    const loadDeadlines = () => {
      const saved = localStorage.getItem('kpmbp_soar_deadlines');
      if (saved) {
        try {
          const parsed: SubmissionDeadlineItem[] = JSON.parse(saved);
          const hasOutdated = parsed.some(
            (item) =>
              item.dueDate.includes('1 Sept 2026') ||
              item.dueDate.includes('15 Sept 2026') ||
              item.dueDate.includes('1 September') ||
              item.dueDate.includes('15 September')
          );
          if (hasOutdated) {
            setDeadlines(SUBMISSION_DEADLINES);
            localStorage.setItem('kpmbp_soar_deadlines', JSON.stringify(SUBMISSION_DEADLINES));
          } else {
            setDeadlines(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setDeadlines(SUBMISSION_DEADLINES);
      }
    };

    window.addEventListener('deadlinesUpdated', loadDeadlines);
    window.addEventListener('storage', loadDeadlines);
    return () => {
      window.removeEventListener('deadlinesUpdated', loadDeadlines);
      window.removeEventListener('storage', loadDeadlines);
    };
  }, []);

  const [isEditingDeadlines, setIsEditingDeadlines] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<SubmissionDeadlineItem>({
    priority: 1,
    event: 'Teater Islamik',
    eventId: 'teater-islamik',
    requirement: '',
    dueDate: ''
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const saveDeadlinesToStorage = (newList: SubmissionDeadlineItem[]) => {
    // Sort by priority
    const sorted = [...newList].sort((a, b) => a.priority - b.priority);
    setDeadlines(sorted);
    localStorage.setItem('kpmbp_soar_deadlines', JSON.stringify(sorted));
  };

  const handleStartAdd = () => {
    setEditingIndex(null);
    setFormData({
      priority: deadlines.length + 1,
      event: 'Teater Islamik',
      eventId: 'teater-islamik',
      requirement: '',
      dueDate: ''
    });
  };

  const handleStartEdit = (idx: number) => {
    setEditingIndex(idx);
    setFormData({ ...deadlines[idx] });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requirement.trim() || !formData.dueDate.trim()) {
      alert('Sila lengkapkan semua medan keperluan dan tarikh akhir (Due Date).');
      return;
    }

    let updated: SubmissionDeadlineItem[];
    if (editingIndex !== null) {
      // Update existing
      updated = deadlines.map((item, i) => (i === editingIndex ? formData : item));
      showNotification('✅ Item deadline telah dikemaskini!');
    } else {
      // Add new
      updated = [...deadlines, formData];
      showNotification('✅ Alert deadline baru telah berjaya ditambah!');
    }

    saveDeadlinesToStorage(updated);
    handleStartAdd();
  };

  const handleDeleteItem = (idx: number) => {
    if (window.confirm('Adakah anda pasti mahu memadamkan alert deadline ini?')) {
      const updated = deadlines.filter((_, i) => i !== idx);
      saveDeadlinesToStorage(updated);
      showNotification('🗑️ Alert deadline telah dipadam.');
      if (editingIndex === idx) handleStartAdd();
    }
  };

  const handleResetDefault = () => {
    if (window.confirm('Adakah anda pasti mahu menetapkan semula senarai deadline kepada asal (default)?')) {
      saveDeadlinesToStorage(SUBMISSION_DEADLINES);
      showNotification('🔄 Senarai deadline telah ditetapkan ke asal.');
      handleStartAdd();
    }
  };

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
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Acara & Pertandingan SOAR IPMA 2026
            </h2>
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

      {/* Admin Deadline Editor Modal */}
      {isEditingDeadlines && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-base">Pengurusan Alert & Deadline Penyerahan</h3>
                  <p className="text-xs text-slate-400">Kemaskini jadual keutamaan untuk alert seluruh kontinjen KPMBP</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingDeadlines(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {toastMsg && (
              <div className="bg-emerald-50 border-b border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{toastMsg}</span>
              </div>
            )}

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs sm:text-sm">
              {/* Form Section */}
              <form onSubmit={handleFormSubmit} className="bg-amber-50/70 border border-amber-200 p-4 sm:p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2.5">
                  <span className="font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                    <Plus className="w-4 h-4 text-amber-700" />
                    <span>{editingIndex !== null ? 'Kemaskini Alert Deadline' : 'Tambah Alert Deadline Baru'}</span>
                  </span>
                  {editingIndex !== null && (
                    <button
                      type="button"
                      onClick={handleStartAdd}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
                    >
                      Batal Edit / Tambah Baru
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Keutamaan (Priority #)</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value={1}>🥇 Keutamaan 1</option>
                      <option value={2}>🥈 Keutamaan 2</option>
                      <option value={3}>🥉 Keutamaan 3</option>
                      <option value={4}>4 (Keutamaan Rendah)</option>
                      <option value={5}>5 (Keutamaan Rendah)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-extrabold mb-1">Acara Pertandingan</label>
                    <select
                      value={formData.event}
                      onChange={(e) => {
                        const selectedTitle = e.target.value;
                        const match = EVENTS_DATA.find(e => e.title.toLowerCase() === selectedTitle.toLowerCase() || e.category.toLowerCase() === selectedTitle.toLowerCase());
                        setFormData({
                          ...formData,
                          event: selectedTitle,
                          eventId: match ? match.id : selectedTitle.toLowerCase().replace(/\s+/g, '-')
                        });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="Teater Islamik">Teater Islamik</option>
                      <option value="BOTB">BOTB</option>
                      <option value="Symphonic Duo">Symphonic Duo</option>
                      <option value="Tarian Zapin">Tarian Zapin</option>
                      <option value="Short Film (Street Dakwah)">Short Film (Street Dakwah)</option>
                      <option value="Semua Acara / Umum">Semua Acara / Umum Kontinjen</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-extrabold mb-1">Keperluan yang Perlu Dihantar</label>
                    <input
                      type="text"
                      placeholder="Cth: Nama & ID peserta / Skrip & Video"
                      value={formData.requirement}
                      onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-extrabold mb-1">Tarikh Akhir (Due Date)</label>
                    <input
                      type="text"
                      placeholder="Cth: 1 Sept 2026 / 15 Sept 2026"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingIndex !== null ? 'Simpan Perubahan' : 'Tambah Rekod Deadline'}</span>
                  </button>
                </div>
              </form>

              {/* List of Current Deadlines */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                    Senarai Alert Deadline Semasa ({deadlines.length})
                  </h4>

                  <button
                    onClick={handleResetDefault}
                    className="text-xs font-extrabold text-slate-600 hover:text-rose-700 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Set Semula ke Asal</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                  {deadlines.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black bg-slate-200 text-slate-900 px-2 py-0.5 rounded text-[11px]">
                            #{item.priority}
                          </span>
                          <span className="font-extrabold text-blue-800 text-xs">{item.event}</span>
                        </div>
                        <p className="font-semibold text-slate-900 text-xs">{item.requirement}</p>
                        <p className="font-extrabold text-amber-800 text-[11px]">Due: {item.dueDate}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(idx)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Padam"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setIsEditingDeadlines(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

