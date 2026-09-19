import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  HeartHandshake,
  AlertCircle,
  FileCheck2,
  Bus
} from 'lucide-react';
import { ContingentUserProfile } from '../../types';
import { SOAR_METADATA } from '../../data/soarData';

interface MemberWorkspaceProps {
  currentUser: ContingentUserProfile;
  onOpenChecklistTab?: () => void;
}

const DEFAULT_MEMBER_CHECKLIST = [
  { id: 'm1', text: 'Kad Pengenalan (MyKad) & Kad Pelajar KPM (WAJIB dibawa secara fizikal)', checked: true },
  { id: 'm2', text: 'Baju Rasmi Kontinjen / Baju Korporat KPM (untuk majlis perasmian & pembukaan)', checked: false },
  { id: 'm3', text: 'Kasut Hitam Bertutup & Stoking Gelap (mematuhi kod etika persembahan & asrama)', checked: false },
  { id: 'm4', text: 'Borang Kebenaran Ibu Bapa / Penjaga bertandatangan lengkap', checked: true },
  { id: 'm5', text: 'Instrumen peribadi / Prop pentas / Kostum persembahan acara masing-masing', checked: false },
  { id: 'm6', text: 'Ubat-ubatan peribadi & kelengkapan kesihatan khusus (sekiranya ada)', checked: false },
  { id: 'm7', text: 'Kelengkapan ibadah (telekung / sejadah / kain pelekat / songkok)', checked: true },
  { id: 'm8', text: 'Pengecas telefon / Powerbank & alatan komunikasi kecemasan', checked: false }
];

export const MemberWorkspace: React.FC<MemberWorkspaceProps> = ({
  currentUser,
  onOpenChecklistTab
}) => {
  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('kpmbp_member_personal_checklist');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MEMBER_CHECKLIST;
  });

  useEffect(() => {
    try {
      localStorage.setItem('kpmbp_member_personal_checklist', JSON.stringify(checklist));
    } catch {}
  }, [checklist]);

  const toggleItem = (id: string) => {
    setChecklist((prev: any[]) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = checklist.filter((i: any) => i.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
      
      {/* Member Verification Pass Card */}
      <div className="bg-gradient-to-r from-cyan-700 via-blue-800 to-indigo-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-xs font-bold border border-cyan-300/30">
              <UserCheck className="w-3.5 h-3.5 text-cyan-300" />
              <span>PAS DIGITAL KONTINJEN DISAHKAN</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight font-display">
              {currentUser.name || 'Peserta Kontinjen KPMBP'}
            </h3>
            <p className="text-xs sm:text-sm text-cyan-100/90 font-medium">
              Festival Seni, Budaya & Dakwah IPMA MARA (SOAR 2026) &bull; Kolej MARA Banting
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shrink-0 flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-cyan-200 uppercase font-bold tracking-wider block">Status Logistik</span>
              <span className="text-sm font-extrabold text-white">41 Pax Kontinjen</span>
              <span className="text-[10px] text-cyan-200/80 block">35 Pelajar Sah</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/30 border border-cyan-300/40 flex items-center justify-center text-cyan-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Personal Packing Checklist (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-cyan-600" />
                  <span>Senarai Semak Persediaan Peribadi Pelajar</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tandakan item yang telah lengkap disediakan sebelum pergerakan bas.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                  {completedCount}/{checklist.length} Lengkap ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 pt-1">
              {checklist.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    item.checked
                      ? 'bg-cyan-50/50 border-cyan-200 text-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.checked ? (
                      <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${item.checked ? 'line-through text-slate-400 font-normal' : ''}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Timetable Milestones */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Milestone & Jadual Pergerakan Penting</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="font-extrabold text-blue-900 block">15 Oktober (Khamis) - 8:00 Pagi</span>
                <p className="text-slate-700 font-medium">Lapor diri di Lobi Kolej KPMBP. Taklimat keselamatan dan pelepasan bas kontinjen ke Kolej MARA Banting.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="font-extrabold text-blue-900 block">15 Oktober (Khamis) - 2:00 Petang</span>
                <p className="text-slate-700 font-medium">Tiba di KMB Banting. Pendaftaran kontinjen, pembahagian kunci bilik asrama, dan raptai ringkas pentas pembukaan.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                <span className="font-extrabold text-purple-900 block">16 Oktober (Jumaat)</span>
                <p className="text-slate-700 font-medium">Pertandingan Tarian Zapin & Symphonic Duo di KMB. Saringan 1 BOTB (Rock Malaya).</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="font-extrabold text-emerald-900 block">17 Oktober (Sabtu)</span>
                <p className="text-slate-700 font-medium">Pergerakan ke Auditorium D'Sury JKKN Seremban untuk Teater Masar Al-Masajid. Showcase Street Dakwah.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Emergency Contacts & Code of Conduct */}
        <div className="space-y-4">
          
          {/* Emergency Contacts */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Talian Pegawai Pengiring</span>
            </h4>
            <p className="text-xs text-slate-500">
              Hubungi segera sekiranya menghadapi kecemasan atau kelewatan:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Muzlinda (Teater & Pengiring)</span>
                  <a
                    href="https://wasap.my/60192046144"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
                <p className="text-slate-500 text-[11px]">019-2046144</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Khairi (Muzik & Duo)</span>
                  <a
                    href="https://wasap.my/60145313756"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
                <p className="text-slate-500 text-[11px]">014-5313756</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Halimatul (Street Dakwah)</span>
                  <a
                    href="https://wasap.my/60177804852"
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-colors"
                  >
                    WhatsApp
                  </a>
                </div>
                <p className="text-slate-500 text-[11px]">017-7804852</p>
              </div>
            </div>
          </div>

          {/* Contingent Pledge */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-5 text-white shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <h5 className="font-black text-xs uppercase tracking-wider">Ikrar Sahsiah Kontinjen</h5>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Kami warga Kontinjen KPM Bandar Penawar berikrar akan sentiasa menjaga disiplin, menjulang adab dan sahsiah terpuji, menepati masa, serta mempersembahkan mutu karya seni dakwah terbaik demi mengharumkan nama kolej di pentas SOAR IPMA 2026."
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
