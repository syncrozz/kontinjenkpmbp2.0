import React, { useState, useEffect } from 'react';
import { EVENTS_DATA, SUBMISSION_DEADLINES, SubmissionDeadlineItem } from '../data/soarData';
import { EventDetail } from '../types';
import { EventModal } from './EventModal';
import { Clock, ChevronRight, Edit3, ShieldAlert, CheckCircle2, Plus, Trash2, RotateCcw, Save, X } from 'lucide-react';

interface SubmissionDeadlinesSectionProps {
  isAdminLoggedIn?: boolean;
  onOpenAdmin?: () => void;
  onOpenCalculator?: () => void;
}

export const SubmissionDeadlinesSection: React.FC<SubmissionDeadlinesSectionProps> = ({
  isAdminLoggedIn = false,
  onOpenAdmin,
  onOpenCalculator
}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);

  // Deadlines State
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

  useEffect(() => {
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
    const sorted = [...newList].sort((a, b) => a.priority - b.priority);
    setDeadlines(sorted);
    localStorage.setItem('kpmbp_soar_deadlines', JSON.stringify(sorted));
    window.dispatchEvent(new Event('deadlinesUpdated'));
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
      updated = deadlines.map((item, i) => (i === editingIndex ? formData : item));
      showNotification('✅ Item deadline telah dikemaskini!');
    } else {
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

  return (
    <section className="py-8 bg-slate-100/80 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Highlight Banner: Submission Deadlines Table */}
        <div className="bg-white border-2 border-amber-300 rounded-2xl overflow-hidden shadow-md relative">
          <div className="bg-amber-500 text-slate-950 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-amber-600/20">
            <div className="flex items-center gap-2 font-black text-sm sm:text-base uppercase tracking-wide">
              <Clock className="w-5 h-5 text-slate-950" />
              <span>Jadual Keutamaan & Deadline Penyerahan Bahan (Due Dates)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold bg-slate-950 text-amber-400 px-3 py-1 rounded-full">
                {deadlines.length} Serahan Penting
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/80 text-slate-700 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-center w-28">Keutamaan</th>
                  <th className="py-3 px-4 w-44">Acara</th>
                  <th className="py-3 px-4">Keperluan yang perlu dihantar</th>
                  <th className="py-3 px-4 w-52">Due Date</th>
                  {isAdminLoggedIn && <th className="py-3 px-4 w-28 text-center">Tindakan Admin</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {deadlines.map((dl, idx) => {
                  const targetEvent = EVENTS_DATA.find((e) => e.id === dl.eventId);
                  const priorityIcons = ['🥇 1', '🥈 2', '🥉 3'];
                  return (
                    <tr
                      key={dl.priority + dl.requirement + idx}
                      className="hover:bg-amber-50/60 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center font-black text-slate-900">
                        <span className="inline-flex items-center justify-center bg-slate-100 group-hover:bg-amber-200 text-slate-900 font-black px-2.5 py-1 rounded-lg border border-slate-200">
                          {priorityIcons[dl.priority - 1] || `#${dl.priority}`}
                        </span>
                      </td>
                      <td
                        onClick={() => targetEvent && setSelectedEvent(targetEvent)}
                        className="py-3.5 px-4 font-bold text-slate-900 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5 text-blue-700 group-hover:underline">
                          <span>{dl.event}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </td>
                      <td
                        onClick={() => targetEvent && setSelectedEvent(targetEvent)}
                        className="py-3.5 px-4 text-slate-800 font-semibold cursor-pointer"
                      >
                        {dl.requirement}
                      </td>
                      <td
                        onClick={() => targetEvent && setSelectedEvent(targetEvent)}
                        className="py-3.5 px-4 font-black text-slate-950 cursor-pointer"
                      >
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                          <span>{dl.dueDate}</span>
                        </span>
                      </td>
                      {isAdminLoggedIn && (
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsEditingDeadlines(true);
                                handleStartEdit(idx);
                              }}
                              className="p-1.5 rounded-md text-slate-700 hover:text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                              title="Kemaskini item"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(idx);
                              }}
                              className="p-1.5 rounded-md text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="Padam item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal for Event Details */}
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 underline cursor-pointer"
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
                        const match = EVENTS_DATA.find(ev => ev.title.toLowerCase() === selectedTitle.toLowerCase() || ev.category.toLowerCase() === selectedTitle.toLowerCase());
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
                    className="text-xs font-extrabold text-slate-600 hover:text-rose-700 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer"
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
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(idx)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
