import React from 'react';
import { EventDetail } from '../types';
import { getEventDeadlines } from '../data/soarData';
import { X, Users, MapPin, Calendar, Award, CheckCircle, FileText, AlertCircle, Info, Sparkles, ChevronRight, PhoneCall, UserCheck, Clock, AlertTriangle } from 'lucide-react';

interface EventModalProps {
  event: EventDetail | null;
  onClose: () => void;
  onOpenCalculator?: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose, onOpenCalculator }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between relative">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                {event.category}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Tema: <strong className="text-slate-800">"{event.theme}"</strong>
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              {event.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 flex-1">
          
          {/* Key Facts Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500 font-medium uppercase">Bilangan Peserta</div>
                <div className="font-bold text-slate-900">{event.participantsCount}</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500 font-medium uppercase">Lokasi Pentas</div>
                <div className="font-bold text-slate-900 text-xs leading-tight">{event.venue}</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-500 font-medium uppercase">Tarikh Pementasan</div>
                <div className="font-bold text-slate-900 text-xs">{event.dateStr}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              Ringkasan Acara
            </h3>
            <p className="text-slate-800 leading-relaxed text-sm">
              {event.description}
            </p>
          </div>

          {/* Background History */}
          {event.backgroundHistory && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                Latar Belakang Acara
              </h3>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {event.backgroundHistory}
              </div>
            </div>
          )}

          {/* Submission Items & Deadline Section */}
          {event.submissionItems && (
            <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  Bahan Yang Perlu Dihantar & Deadline
                </h3>
                <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
                  {getEventDeadlines(event).map((dl, dIdx) => (
                    <span key={dIdx} className="bg-amber-500 text-slate-950 px-3 py-1 rounded-lg text-xs font-black shadow-xs">
                      {dl.label.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-700">
                Semua bahan rasmi berikut hendaklah disediakan dan dihantar mengikut tarikh akhir yang ditetapkan:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {event.submissionItems.map((item, idx) => (
                  <div key={idx} className="bg-white border border-amber-200 rounded-lg p-2.5 flex items-center gap-2 text-xs font-bold text-slate-900 shadow-xs">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-[10px] flex items-center justify-center font-black shrink-0">{idx + 1}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Elements Section */}
          {event.elementsInfo && (
            <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-700" />
                Elemen Pertandingan Pementasan
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-900">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg">
                  Lakonan — WAJIB
                </span>
                <span className="text-indigo-800 font-extrabold">+</span>
                <span className="bg-indigo-100 text-indigo-900 px-3 py-1 rounded-lg border border-indigo-300">
                  {event.elementsInfo.additionalTitle}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Pementasan WAJIB mempunyai Lakonan, serta sekurang-kurangnya 2 daripada elemen tambahan berikut:
              </p>
              <div className="flex flex-wrap gap-2">
                {event.elementsInfo.additionalOptions.map((opt, i) => (
                  <span key={i} className="bg-white border border-indigo-200 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-800 shadow-2xs">
                    • {opt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Performance Duration Section */}
          {event.durationInfo && (
            <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-700" />
                Tempoh Pementasan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-sky-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Masa Pementasan</div>
                  <div className="font-extrabold text-sky-900 text-sm mt-0.5">{event.durationInfo.performanceTime}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-sky-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Persiapan & Pembersihan</div>
                  <div className="font-extrabold text-sky-900 text-sm mt-0.5">{event.durationInfo.setupCleanupTime}</div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-sky-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Jumlah Masa Keseluruhan</div>
                  <div className="font-extrabold text-sky-900 text-sm mt-0.5">{event.durationInfo.totalTime}</div>
                </div>
              </div>
              {event.durationInfo.warning && (
                <p className="text-xs text-rose-800 font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  ⚠️ {event.durationInfo.warning}
                </p>
              )}
            </div>
          )}

          {/* Tentatif Acara 15 - 18 Oktober 2026 */}
          {event.eventTentative && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Tentatif 15 – 18 Oktober 2026
              </h3>
              <div className="space-y-3">
                {event.eventTentative.map((dayItem, dIdx) => (
                  <div key={dIdx} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="text-xs font-black text-blue-700 uppercase tracking-wide border-b border-slate-100 pb-1">
                      {dayItem.date}
                    </div>
                    <div className="space-y-1.5">
                      {dayItem.items.map((it, iIdx) => (
                        <div key={iIdx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 bg-slate-50 p-2 rounded-lg">
                          <span className="font-bold text-slate-900">{it.title}</span>
                          <div className="flex items-center gap-2 text-slate-500 shrink-0">
                            <span className="font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{it.time}</span>
                            <span>📍 {it.venue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Penasihat Acara (PIC Acara) & Contact */}
          {event.advisors && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-1">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    Penasihat Acara (PIC Acara)
                  </h3>
                  <div className="text-sm font-bold text-slate-800">
                    {event.advisors.join(', ')}
                  </div>
                </div>

                {event.leadAdvisorWhatsApp && (
                  <a
                    href={event.leadAdvisorWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow-sm"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Rules & Guidelines List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Garis Panduan & Syarat Rasmi
            </h3>
            <ul className="space-y-2">
              {event.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-xs sm:text-sm leading-snug">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Rubric Table if Available */}
          {event.rubric && event.rubric.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  Rubrik Penilaian & Wajaran Markah
                </h3>
                {onOpenCalculator && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCalculator();
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                  >
                    <span>Kira Markah Rubrik</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Komponen Penilaian</th>
                      <th className="py-2.5 px-3 text-center w-20">Peratus</th>
                      <th className="py-2.5 px-3">Kriteria & Fokus Penilai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {event.rubric.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{item.component}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-700 bg-blue-50/50">
                          {item.percentage}%
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Important Contingent Notes */}
          {event.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-800 text-xs uppercase">Nota Khas Kontinjen KPMBP</div>
                <div className="text-slate-700 text-xs mt-0.5 leading-relaxed">{event.notes}</div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Akur kepada keputusan Muktamad Panel Juri SOAR 2026
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20"
          >
            Tutup Maklumat
          </button>
        </div>

      </div>
    </div>
  );
};
