import React, { useState, useMemo } from 'react';
import { EventDetail } from '../types';
import { getEventDeadlines } from '../data/soarData';
import { STRUCTURED_COMPETITION_DOCUMENTS, StructuredReferenceItem } from '../data/competitionReferenceData';
import { PenaltyIconTooltip } from './PenaltyIconTooltip';
import { 
  X, 
  Users, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  PhoneCall, 
  Clock, 
  BookOpen,
  ShieldCheck, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface EventModalProps {
  event: EventDetail | null;
  onClose: () => void;
  onOpenCalculator?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose, onOpenCalculator, onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'deadlines' | 'rubric' | 'contacts'>('overview');

  // Find matching structured reference document item for this event (must be called unconditionally before any early return)
  const matchingDocItem: StructuredReferenceItem | null = useMemo(() => {
    if (!event) return null;
    const eventName = (event.category || event.title || '').toLowerCase();
    
    for (const cat of STRUCTURED_COMPETITION_DOCUMENTS) {
      for (const item of cat.items) {
        const target = (item.targetEvent || '').toLowerCase();
        if (
          (eventName.includes('teater') && target.includes('teater')) ||
          (eventName.includes('dakwah') && target.includes('dakwah')) ||
          (eventName.includes('zapin') && target.includes('zapin')) ||
          (eventName.includes('duo') && (target.includes('duo') || target.includes('muzik'))) ||
          (eventName.includes('band') && (target.includes('band') || target.includes('muzik')))
        ) {
          return item;
        }
      }
    }
    return null;
  }, [event]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between relative">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                {event.category}
              </span>
              <span className="text-xs text-slate-500 italic">
                "{event.theme}"
              </span>
              {matchingDocItem && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {matchingDocItem.documentVersion}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {event.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Sub-Navigation Tabs */}
        <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ringkasan</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Syarat & Peraturan</span>
          </button>

          <button
            onClick={() => setActiveTab('deadlines')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'deadlines'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Tarikh Penyerahan</span>
          </button>

          {event.rubrics && (
            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'rubric'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Rubrik & Markah</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Penasihat Acara</span>
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700 flex-1">
          
          {/* TAB 1: RINGKASAN & MAKLUMAT PENTING */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Key Facts Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Kouta Peserta</div>
                    <div className="font-bold text-slate-900">{event.participantsCount}</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Lokasi Pentas</div>
                    <div className="font-bold text-slate-900 text-xs truncate">{event.venue}</div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Tarikh Pertandingan</div>
                    <div className="font-bold text-slate-900 text-xs">{event.dateStr}</div>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Ringkasan Acara
                </h3>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {event.description}
                </p>
              </div>

              {/* Performance Elements / Options */}
              {event.elementsInfo && (
                <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-700" />
                    <span>Elemen Pertandingan & Format</span>
                  </h3>
                  
                  {event.elementsInfo.mandatory && event.elementsInfo.mandatory.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {event.elementsInfo.mandatory.map((mItem, mIdx) => (
                        <span key={mIdx} className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {mItem}
                        </span>
                      ))}
                    </div>
                  )}

                  {event.elementsInfo.additionalOptions && (
                    <div className="pt-2 border-t border-indigo-200/60 text-xs text-indigo-900 space-y-1">
                      <div className="font-bold">{event.elementsInfo.additionalTitle || 'Pilihan Format Tambahan:'}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {event.elementsInfo.additionalOptions.map((opt, oIdx) => (
                          <span key={oIdx} className="bg-white border border-indigo-200 px-2 py-0.5 rounded text-xs text-indigo-950">
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Specific Requirements Box */}
              {matchingDocItem?.eventRequirements && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Spesifikasi Khusus Acara
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <strong className="text-slate-900 block">Had Masa & Kouta:</strong>
                      <span>{matchingDocItem.eventRequirements.quotaRule} • {matchingDocItem.eventRequirements.durationLimits}</span>
                    </div>
                    {matchingDocItem.eventRequirements.syariahAttireRule && (
                      <div>
                        <strong className="text-slate-900 block">Busana Patuh Syariah:</strong>
                        <span>{matchingDocItem.eventRequirements.syariahAttireRule}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SYARAT & PERATURAN */}
          {activeTab === 'rules' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Fasal & Syarat Pertandingan
                </h3>
                {matchingDocItem && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    Ref: {matchingDocItem.officialDocumentRef}
                  </span>
                )}
              </div>

              {matchingDocItem?.clauses && matchingDocItem.clauses.length > 0 ? (
                <div className="space-y-2.5">
                  {matchingDocItem.clauses.map((clause) => (
                    <div key={clause.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap flex-1">
                          {clause.clauseNumber && (
                            <span className="text-[10px] font-black text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                              {clause.clauseNumber}
                            </span>
                          )}
                          {clause.mandatory && (
                            <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                              WAJIB
                            </span>
                          )}
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{clause.heading}</span>
                        </div>
                        {clause.penaltyNote && (
                          <div className="shrink-0">
                            <PenaltyIconTooltip penaltyText={clause.penaltyNote} align="right" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{clause.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500 text-center py-6">
                  Syarat rasmi tertakluk kepada dokumen penganjur Festival SOAR IPMA 2026.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TARIKH PENYERAHAN */}
          {activeTab === 'deadlines' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Tarikh Akhir Penyerahan Dokumen Acara
                </h3>
              </div>

              {matchingDocItem?.submissionDeadlines && matchingDocItem.submissionDeadlines.length > 0 ? (
                <div className="space-y-2.5">
                  {matchingDocItem.submissionDeadlines.map((dl, idx) => (
                    <div key={idx} className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{dl.item}</span>
                        <span className="bg-amber-200 text-amber-950 text-[10px] px-2 py-0.5 rounded font-black">
                          {dl.date}
                        </span>
                      </div>
                      {dl.time && <div className="text-[11px] font-semibold text-amber-800">Waktu Tutup: {dl.time}</div>}
                      <div className="text-slate-600 text-[11px]">Saluran: <strong>{dl.submissionChannel}</strong></div>
                      {dl.penaltyIfLate && (
                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">Penalti Kelewatan:</span>
                          <PenaltyIconTooltip penaltyText={dl.penaltyIfLate} label="Penalti Kelewatan" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {event.submissionItems?.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] flex items-center justify-center font-bold">{idx + 1}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RUBRIK & MARKAH */}
          {activeTab === 'rubric' && event.rubrics && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 flex-wrap gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Rubrik Penjurian (Jumlah: 100%)
                </h3>
                {onOpenCalculator && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCalculator();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Simulasi Kalkulator Markah</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.rubrics.map((rubric, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{rubric.name}</span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {rubric.percentage}%
                      </span>
                    </div>
                    {rubric.description && (
                      <p className="text-[11px] text-slate-600 leading-snug">{rubric.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PEGAWAI & PENASIHAT ACARA */}
          {activeTab === 'contacts' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Pegawai & Pensyarah Penasihat
                </h3>
                {onNavigateTab && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('contact');
                    }}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    Direktori Penuh Kontinjen &rarr;
                  </button>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="text-[10px] font-bold text-blue-700 uppercase">Ketua Penasihat Acara</div>
                    <div className="font-bold text-slate-900 text-sm">{event.leadAdvisor || 'Penyelaras Acara'}</div>
                  </div>

                  {event.leadAdvisorPhone && (
                    <a
                      href={event.leadAdvisorWhatsApp || `https://wa.me/${event.leadAdvisorPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>WhatsApp Penasihat</span>
                    </a>
                  )}
                </div>

                {event.advisors && event.advisors.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                    <span className="text-slate-400">Pasukan Penasihat: </span>
                    <span className="font-medium text-slate-800">{event.advisors.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>

          {onOpenCalculator && event.rubrics && (
            <button
              onClick={() => {
                onClose();
                onOpenCalculator();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Buka Kalkulator Markah</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
