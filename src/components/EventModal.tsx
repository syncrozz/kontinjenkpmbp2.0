import React, { useMemo } from 'react';
import { EventDetail } from '../types';
import { getEventDeadlines } from '../data/soarData';
import { STRUCTURED_COMPETITION_DOCUMENTS, StructuredReferenceItem } from '../data/competitionReferenceData';
import { 
  X, 
  Users, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle, 
  FileText, 
  AlertCircle, 
  Info, 
  Sparkles, 
  ChevronRight, 
  PhoneCall, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  BookOpen,
  FileCheck2,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  ListTodo
} from 'lucide-react';

interface EventModalProps {
  event: EventDetail | null;
  onClose: () => void;
  onOpenCalculator?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose, onOpenCalculator, onNavigateTab }) => {
  if (!event) return null;

  // Find matching structured reference document item for this event
  const matchingDocItem: StructuredReferenceItem | null = useMemo(() => {
    if (!event) return null;
    const eventName = (event.category || event.title || '').toLowerCase();
    
    // Check organizer rules first
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

  // Find matching prep tasks item
  const matchingTaskItem: StructuredReferenceItem | null = useMemo(() => {
    if (!event) return null;
    const eventName = (event.category || event.title || '').toLowerCase();
    const prepCat = STRUCTURED_COMPETITION_DOCUMENTS.find(c => c.category === 'event_preparation_tasks');
    if (!prepCat) return null;

    for (const item of prepCat.items) {
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
    return null;
  }, [event]);

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
              {matchingDocItem && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {matchingDocItem.documentStatus}
                </span>
              )}
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

          {/* OFFICIAL DOCUMENT REFERENCE & VERSION CARD */}
          {matchingDocItem && (
            <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-slate-50 border border-blue-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-black text-blue-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  Rujukan Dokumen Rasmi Penganjur MARA
                </span>
                <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded">
                  {matchingDocItem.documentVersion}
                </span>
              </div>
              <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                {matchingDocItem.officialDocumentRef}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-600 text-[11px] pt-1">
                <span>Tarikh Penerbitan: <strong>{matchingDocItem.publicationDate}</strong></span>
                <span>&bull;</span>
                <span>Status Dokumen: <strong className="text-emerald-700">{matchingDocItem.documentStatus}</strong></span>
              </div>
            </div>
          )}

          {/* Event Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              Ringkasan Acara
            </h3>
            <p className="text-slate-800 leading-relaxed text-sm">
              {event.description}
            </p>
          </div>

          {/* EVENT-SPECIFIC REQUIREMENTS (Spesifikasi Khusus Acara) */}
          {matchingDocItem?.eventRequirements && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Spesifikasi & Keperluan Khusus Acara (Event-Specific Requirements)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block text-[11px]">Kuota & Had Masa:</span>
                  <p className="text-slate-900 font-medium mt-0.5">
                    {matchingDocItem.eventRequirements.quotaRule}
                    {matchingDocItem.eventRequirements.durationLimits && ` • ${matchingDocItem.eventRequirements.durationLimits}`}
                  </p>
                </div>

                {matchingDocItem.eventRequirements.syariahAttireRule && (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700 block text-[11px]">Kod Busana Patuh Syariah:</span>
                    <p className="text-slate-900 font-medium mt-0.5">
                      {matchingDocItem.eventRequirements.syariahAttireRule}
                    </p>
                  </div>
                )}

                {matchingDocItem.eventRequirements.aiPolicyRule && (
                  <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 sm:col-span-2">
                    <span className="font-bold text-rose-800 block text-[11px]">Larangan AI Generatif (AI Strict Prohibition):</span>
                    <p className="text-rose-900 font-semibold mt-0.5">
                      {matchingDocItem.eventRequirements.aiPolicyRule}
                    </p>
                  </div>
                )}
              </div>

              {matchingDocItem.eventRequirements.technicalSpecifications && (
                <div className="text-xs bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                  <span className="font-bold text-indigo-950 block text-[11px] mb-1">Keperluan Teknikal Mandatori:</span>
                  <ul className="space-y-1">
                    {matchingDocItem.eventRequirements.technicalSpecifications.map((spec, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2 text-indigo-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* OFFICIAL SUBMISSION DEADLINES SECTION */}
          {(matchingDocItem?.submissionDeadlines || event.submissionItems) && (
            <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  Tarikh Akhir Penyerahan Rasmi & Deadlines
                </h3>
                <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
                  {getEventDeadlines(event).map((dl, dIdx) => (
                    <span key={dIdx} className="bg-amber-500 text-slate-950 px-3 py-1 rounded-lg text-xs font-black shadow-xs">
                      {dl.label.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {matchingDocItem?.submissionDeadlines && matchingDocItem.submissionDeadlines.length > 0 ? (
                <div className="space-y-2.5">
                  {matchingDocItem.submissionDeadlines.map((dl, idx) => (
                    <div key={idx} className="bg-white border border-amber-200 rounded-lg p-3 text-xs space-y-1 shadow-2xs">
                      <div className="flex items-center justify-between font-extrabold text-slate-900">
                        <span>{dl.item}</span>
                        <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded font-black">
                          {dl.date}
                        </span>
                      </div>
                      {dl.time && <div className="text-[11px] font-bold text-amber-800">Waktu Tutup: {dl.time}</div>}
                      <div className="text-slate-600 text-[11px]">Saluran Penyerahan: <strong>{dl.submissionChannel}</strong></div>
                      {dl.penaltyIfLate && (
                        <div className="text-rose-700 text-[11px] font-semibold bg-rose-50 p-1.5 rounded mt-1">
                          Penalti Kelewatan: {dl.penaltyIfLate}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {event.submissionItems?.map((item, idx) => (
                    <div key={idx} className="bg-white border border-amber-200 rounded-lg p-2.5 flex items-center gap-2 text-xs font-bold text-slate-900 shadow-xs">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-[10px] flex items-center justify-center font-black shrink-0">{idx + 1}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EVENT-SPECIFIC COMPETITION RULES (Fasal Pertandingan) */}
          {matchingDocItem?.clauses && matchingDocItem.clauses.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Fasal & Syarat Pertandingan Khusus Acara
              </h3>

              <div className="space-y-2.5">
                {matchingDocItem.clauses.map((clause) => (
                  <div key={clause.id} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      {clause.clauseNumber && (
                        <span className="text-[10px] font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {clause.clauseNumber}
                        </span>
                      )}
                      {clause.mandatory && (
                        <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          [WAJIB]
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-900">{clause.heading}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{clause.text}</p>
                    {clause.penaltyNote && (
                      <div className="text-[11px] text-rose-800 bg-rose-50 p-2 rounded-lg border border-rose-200 font-semibold">
                        Penalti: {clause.penaltyNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RELEVANT CHECKLIST ITEMS WITH PROVENANCE TRACEABILITY */}
          {(matchingDocItem?.checklistItems || matchingTaskItem?.checklistItems) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ListTodo className="w-4 h-4 text-emerald-600" />
                Senarai Semak Tugasan Boleh Dijejak (Traceable Checklist Items)
              </h3>
              <p className="text-[11px] text-slate-600">
                Tugasan berikut dijejak secara telus kepada dokumen sumber penganjur atau SOP operasi kolej:
              </p>

              <div className="space-y-2">
                {[
                  ...(matchingDocItem?.checklistItems || []),
                  ...(matchingTaskItem?.checklistItems || [])
                ].map((chk) => {
                  const isOrganizer = chk.sourceType === 'official_organizer_rule';
                  return (
                    <div key={chk.id} className="bg-white border border-slate-200 rounded-lg p-3 text-xs space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                          isOrganizer
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        }`}>
                          {isOrganizer ? 'Punca Kuasa: Penganjur MARA' : 'Keperluan Operasi KPMBP'}
                        </span>
                        {chk.deadline && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {chk.deadline}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-900 font-medium">{chk.taskText}</p>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1">
                        <FileCheck2 className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>Dokumen Punca: <strong>{chk.sourceDocument}</strong> {chk.sourceClause && `(${chk.sourceClause})`}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Performance / Required Elements Section */}
          {event.elementsInfo && (
            <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-700" />
                {event.id === 'street-dakwah' ? 'Elemen Wajib Video & Syarat Pertandingan' : 'Elemen Pertandingan Pementasan'}
              </h3>
              
              {/* Mandatory Pills */}
              {event.elementsInfo.mandatory && event.elementsInfo.mandatory.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wide text-indigo-950">
                    Syarat / Elemen Wajib:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.elementsInfo.mandatory.map((mItem, mIdx) => (
                      <span key={mIdx} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {mItem}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Options */}
              {event.elementsInfo.additionalOptions && (
                <div className="space-y-1.5 pt-2 border-t border-indigo-100">
                  <div className="text-[11px] font-extrabold uppercase tracking-wide text-indigo-950">
                    {event.elementsInfo.additionalTitle || 'Pilihan Elemen Tambahan (Pilih mengikut syarat):'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.elementsInfo.additionalOptions.map((opt, oIdx) => (
                      <span key={oIdx} className="bg-white border border-indigo-200 text-indigo-900 px-3 py-1 rounded-lg text-xs font-semibold shadow-2xs">
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assessment Rubrics Breakdown */}
          {event.rubrics && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                Komponen Penilaian & Rubrik Pemarkahan (Jumlah: 100%)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.rubrics.map((rubric, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{rubric.name}</span>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
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

          {/* Lecturers / Person in Charge (PIC) Contacts */}
          {event.lecturers && event.lecturers.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                Pensyarah Penasihat & Pegawai Pengiring Acara
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.lecturers.map((lec, lIdx) => (
                  <div key={lIdx} className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{lec.name}</div>
                      <div className="text-[11px] text-blue-600 font-semibold">{lec.role}</div>
                    </div>
                    {lec.phone && (
                      <a 
                        href={`https://wa.me/6${lec.phone.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1 text-xs font-bold"
                        title="Hubungi melalui WhatsApp"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}
                  </div>
                ))}
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

          {/* Cross-reference to Structured Competition Reference System */}
          {onNavigateTab && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onNavigateTab('guidelines');
                }}
                className="w-full p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-blue-900 font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white group-hover:scale-105 transition-transform">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-blue-950">Buka Fasal Penuh & Senarai Semak Boleh Dijejak</div>
                    <div className="text-[11px] text-blue-700 font-medium">Lihat dokumen penganjur, matriks tugasan, dan jadual serahan rasmi</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
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
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer"
          >
            Tutup Maklumat
          </button>
        </div>

      </div>
    </div>
  );
};
