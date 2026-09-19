import React, { useState } from 'react';
import { 
  Award, 
  Users, 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  PhoneCall, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { ContingentUserProfile, ChecklistItem } from '../../types';
import { SOAR_METADATA, CONTINGENT_BREAKDOWN, EVENTS_DATA } from '../../data/soarData';

interface AdvisorWorkspaceProps {
  currentUser: ContingentUserProfile;
  checklistItems: ChecklistItem[];
  onToggleChecklist?: (id: string) => void;
  submissionsCount: number;
}

export const AdvisorWorkspace: React.FC<AdvisorWorkspaceProps> = ({
  currentUser,
  checklistItems,
  onToggleChecklist,
  submissionsCount
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('teater-islamik');
  const [expandedSection, setExpandedSection] = useState<'welfare' | 'rubric' | 'checklist' | 'directory'>('rubric');

  const selectedEvent = EVENTS_DATA.find((e) => e.id === selectedEventId) || EVENTS_DATA[0];

  // Officer checklist items ('Pegawai' and 'Semua')
  const officerChecklist = checklistItems.filter(
    (item) => item.targetRole === 'Pegawai' || item.targetRole === 'Semua'
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold border border-amber-300/30">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>PUSAT OPERASI ADVISOR & PEGAWAI PENGIRING</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight font-display">
              {currentUser.name || 'Pensyarah Pengiring / Jurulatih Kontinjen'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
              Pengurusan Kebajikan 41 Pax Kontinjen & Penyeliaan Teknikal 5 Acara Pertandingan
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shrink-0 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-amber-200 uppercase font-bold tracking-wider block">Jumlah Kontinjen</span>
              <span className="text-xl font-black text-white">41 Orang</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-300/40 flex items-center justify-center text-amber-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Welfare & Breakdown of 41 Pax */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <span>Penyeliaan Kebajikan Kontinjen (41 Pax)</span>
          </h4>
          <span className="text-xs font-bold text-slate-500">
            KMB Banting & JKKN Seremban
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {CONTINGENT_BREAKDOWN.map((group, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-900">{group.role}</span>
                <span className="text-base font-black text-amber-700 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                  {group.count} Pax
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{group.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Event Rubric & Judging Criteria Matrix */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>Analisis Rubrik & Pemarkahan Penjurian 5 Acara</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih acara untuk melihat pecahan peratusan dan komponen penilaian rasmi juri.
            </p>
          </div>
        </div>

        {/* Event Selector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {EVENTS_DATA.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedEventId === ev.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {ev.title}
            </button>
          ))}
        </div>

        {/* Rubric Display */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
            <span className="font-extrabold text-amber-900">{selectedEvent.title} - "{selectedEvent.theme}"</span>
            <span className="text-slate-600 font-semibold">{selectedEvent.participantsCount} &bull; {selectedEvent.venue}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedEvent.rubric?.map((r, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">{r.component}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-md">
                    {r.percentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Officer & Escort Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-600" />
              <span>Senarai Semak Khusus Pegawai Pengiring ({officerChecklist.length})</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Tugasan pengurusan dokumen, kebajikan, dan logistik kontinjen.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {officerChecklist.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleChecklist && onToggleChecklist(item.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                item.completed
                  ? 'bg-amber-50/50 border-amber-200 text-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 shrink-0" />
                )}
                <span className={`text-xs font-semibold ${item.completed ? 'line-through text-slate-400 font-normal' : ''}`}>
                  {item.title}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Official Directory of Lead Advisors */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-amber-600" />
          <span>Direktori Ketua Penasihat & Urus Setia Kontinjen KPMBP</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div>
              <span className="font-extrabold text-slate-900 block">Muzlinda</span>
              <span className="text-slate-500 text-[11px] block">Ketua Penasihat Teater Islamik</span>
            </div>
            <a
              href="https://wasap.my/60192046144"
              target="_blank"
              rel="noreferrer"
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp (019-2046144)</span>
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div>
              <span className="font-extrabold text-slate-900 block">Khairi</span>
              <span className="text-slate-500 text-[11px] block">Ketua Penasihat Muzik & BOTB</span>
            </div>
            <a
              href="https://wasap.my/60145313756"
              target="_blank"
              rel="noreferrer"
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp (014-5313756)</span>
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div>
              <span className="font-extrabold text-slate-900 block">Halimatul</span>
              <span className="text-slate-500 text-[11px] block">Ketua Penasihat Street Dakwah</span>
            </div>
            <a
              href="https://wasap.my/60177804852"
              target="_blank"
              rel="noreferrer"
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp (017-7804852)</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
