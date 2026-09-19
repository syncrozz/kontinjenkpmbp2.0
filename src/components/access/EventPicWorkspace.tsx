import React, { useState } from 'react';
import { 
  Layers, 
  Users, 
  Clock, 
  Calendar, 
  MapPin, 
  PhoneCall, 
  FileText, 
  Award, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  PlaySquare,
  Sparkles
} from 'lucide-react';
import { ContingentUserProfile, EventDetail } from '../../types';
import { EVENTS_DATA, SUBMISSION_DEADLINES, SubmissionDeadlineItem } from '../../data/soarData';

interface EventPicWorkspaceProps {
  currentUser: ContingentUserProfile;
  submissions: any[];
}

export const EventPicWorkspace: React.FC<EventPicWorkspaceProps> = ({
  currentUser,
  submissions
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    currentUser.eventAssigned || 'teater-islamik'
  );

  const activeEvent = EVENTS_DATA.find((e) => e.id === selectedEventId) || EVENTS_DATA[0];

  // Filter submissions where student picked this event
  const eventSubmissions = submissions.filter((sub) => {
    const list = sub.acaraDiminati || [];
    // Match event category or title loosely
    if (activeEvent.id === 'teater-islamik') {
      return list.some((a: string) => a.toLowerCase().includes('teater'));
    }
    if (activeEvent.id === 'symphonic-duo') {
      return list.some((a: string) => a.toLowerCase().includes('duo') || a.toLowerCase().includes('symphonic'));
    }
    if (activeEvent.id === 'tarian-zapin') {
      return list.some((a: string) => a.toLowerCase().includes('zapin') || a.toLowerCase().includes('tarian'));
    }
    if (activeEvent.id === 'battle-of-the-band') {
      return list.some((a: string) => a.toLowerCase().includes('band') || a.toLowerCase().includes('botb'));
    }
    if (activeEvent.id === 'street-dakwah') {
      return list.some((a: string) => a.toLowerCase().includes('dakwah') || a.toLowerCase().includes('short film'));
    }
    return false;
  });

  // Event deadlines
  const eventDeadlines = SUBMISSION_DEADLINES.filter((d) => d.eventId === activeEvent.id);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/20 text-purple-200 text-xs font-bold border border-purple-300/30">
              <Layers className="w-3.5 h-3.5 text-purple-300" />
              <span>PUSAT KAWALAN EVENT PIC</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight font-display">
              {currentUser.name || 'Pegawai Pengurus Acara (Event PIC)'}
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/90 font-medium">
              Penyeliaan Pasukan & Calon Uji Bakat: <strong>{activeEvent.title} ({activeEvent.category})</strong>
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shrink-0 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-purple-200 uppercase font-bold tracking-wider block">Calon Mendaftar</span>
              <span className="text-xl font-black text-white">{eventSubmissions.length} Orang</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-300/40 flex items-center justify-center text-purple-200">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Event Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {EVENTS_DATA.map((ev) => {
          const isSelected = ev.id === activeEvent.id;
          return (
            <button
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 ring-2 ring-purple-400/50'
                  : 'bg-white hover:bg-purple-50 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{ev.title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isSelected ? 'bg-purple-800 text-purple-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {ev.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Event Overview Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-900 text-lg">{activeEvent.title}</h4>
              <span className="text-xs font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full border border-purple-200">
                Tema: "{activeEvent.theme}"
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{activeEvent.description}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs">
            <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold border border-slate-200">
              Kuota: {activeEvent.participantsCount}
            </span>
            <span className="bg-purple-50 text-purple-800 px-3 py-1.5 rounded-xl font-bold border border-purple-200">
              Pentas: {activeEvent.venue}
            </span>
          </div>
        </div>

        {/* Lead Advisor Contact */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Ketua Penasihat Acara:</span>
            <span className="font-extrabold text-purple-900">{activeEvent.leadAdvisor}</span>
            <span className="text-slate-500">({activeEvent.leadAdvisorPhone})</span>
          </div>
          {activeEvent.leadAdvisorWhatsApp && (
            <a
              href={activeEvent.leadAdvisorWhatsApp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp Penasihat</span>
            </a>
          )}
        </div>
      </div>

      {/* Deadlines Specific to Event */}
      {eventDeadlines.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <h5 className="font-extrabold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Tarikh Akhir Submisi Acara Ini</span>
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {eventDeadlines.map((dl, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-1">
                <span className="font-extrabold text-slate-900 block">{dl.requirement}</span>
                <span className="text-rose-600 font-bold block">Tarikh Akhir: {dl.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Submissions for This Event */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Senarai Calon Pendaftaran Bakat ({eventSubmissions.length})</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Pelajar yang memohon dan berminat mewakili KPMBP dalam acara {activeEvent.title}.
            </p>
          </div>
        </div>

        {eventSubmissions.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-extrabold text-slate-600">
              Belum ada calon mendaftar secara khusus untuk acara ini.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Borang pendaftaran bakat terbuka di portal utama untuk pelajar menghantar permohonan.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {eventSubmissions.map((sub, index) => (
              <div
                key={sub.firestoreId || index}
                className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 bg-slate-50/50 hover:bg-purple-50/30 transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-sm">{sub.namaPenuh}</h5>
                    <p className="text-xs text-purple-700 font-semibold">
                      ID: {sub.noIdPelajar} &bull; {sub.programPengajian} ({sub.semester})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.noTelefon && (
                      <a
                        href={`https://wasap.my/6${sub.noTelefon.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-colors flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Hubungi Calon</span>
                      </a>
                    )}
                    {sub.linkVideo && (
                      <a
                        href={sub.linkVideo}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] transition-colors flex items-center gap-1"
                      >
                        <PlaySquare className="w-3 h-3" />
                        <span>Video Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="text-xs bg-white p-3 rounded-xl border border-slate-200 text-slate-700 space-y-1">
                  <p><strong>Bakat Utama:</strong> {sub.bakatUtama || 'Tidak dinyatakan'}</p>
                  <p><strong>Ringkasan Pengalaman:</strong> {sub.ringkasanBakat || sub.ceritaPengalaman || '-'}</p>
                  {sub.pencapaianPertandingan && (
                    <p className="text-emerald-700 font-bold">
                      <strong>Pencapaian:</strong> {sub.pencapaianPertandingan} ({sub.namaPertandingan})
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rubric Breakdown for Event */}
      {activeEvent.rubric && activeEvent.rubric.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Rubrik & Kriteria Penjurian Rasmi Acara ({activeEvent.title})</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeEvent.rubric.map((r, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">{r.component}</span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded-md">
                    {r.percentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
