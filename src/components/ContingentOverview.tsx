import React, { useState } from 'react';
import { CONTINGENT_BREAKDOWN } from '../data/soarData';
import { GraduationCap, UserCheck, Bus, Shield, PhoneCall, CheckCircle2, MapPin, Building, ChevronRight } from 'lucide-react';

export const ContingentOverview: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('Pelajar (Peserta)');

  const getRoleIcon = (icon: string, isActive: boolean = false) => {
    const colorClass = isActive ? 'text-white' : '';
    switch (icon) {
      case 'GraduationCap':
        return <GraduationCap className={`w-4 h-4 ${isActive ? colorClass : 'text-blue-600'}`} />;
      case 'UserCheck':
        return <UserCheck className={`w-4 h-4 ${isActive ? colorClass : 'text-indigo-600'}`} />;
      case 'Bus':
        return <Bus className={`w-4 h-4 ${isActive ? colorClass : 'text-sky-600'}`} />;
      default:
        return <Shield className={`w-4 h-4 ${isActive ? colorClass : 'text-blue-600'}`} />;
    }
  };

  const activeItem = CONTINGENT_BREAKDOWN.find((item) => item.role === selectedRole) || CONTINGENT_BREAKDOWN[0];

  return (
    <section className="py-12 bg-slate-50 text-slate-900 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5" />
            <span>Struktur Rasmi Kontinjen KPMBP</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Pengurusan & Komposisi 41 Ahli Kontinjen
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Pelaksanaan SOAR IPMA 2026 memerlukan penyelarasan logistik bersepadu membabitkan pengangkutan, penginapan, sajian makanan, jadual pertandingan, dan kebajikan semua peserta KPM Bandar Penawar.
          </p>
        </div>

        {/* 3 Tabs Navigation with Compact Pill Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {CONTINGENT_BREAKDOWN.map((item, idx) => {
            const isActive = selectedRole === item.role;
            const themeList = [
              { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-950', badgeBg: 'bg-rose-200/80', ring: 'ring-rose-400', activeBg: 'bg-rose-100' },
              { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-950', badgeBg: 'bg-amber-200/80', ring: 'ring-amber-400', activeBg: 'bg-amber-100' },
              { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-950', badgeBg: 'bg-sky-200/80', ring: 'ring-sky-400', activeBg: 'bg-sky-100' },
            ];
            const theme = themeList[idx % themeList.length];

            return (
              <button
                key={item.role}
                onClick={() => setSelectedRole(item.role)}
                className={`rounded-full px-3.5 py-1.5 border text-xs font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  theme.bg
                } ${theme.border} ${theme.text} ${
                  isActive
                    ? `ring-2 ring-offset-1 ${theme.ring} shadow-md scale-[1.02] ${theme.activeBg}`
                    : 'hover:opacity-90 shadow-sm opacity-85'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <div
                    className={`p-1 rounded-full shrink-0 ${theme.badgeBg}`}
                  >
                    {getRoleIcon(item.icon, false)}
                  </div>
                  <span className="truncate">
                    {item.role}
                  </span>
                </div>

                {/* Inner count pill */}
                <span
                  className={`px-2 py-0.5 text-[11px] font-extrabold rounded-full shrink-0 ${theme.badgeBg} ${theme.text}`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Tab Content Details Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 shrink-0">
                {getRoleIcon(activeItem.icon, false)}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                    {activeItem.role}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-950 border border-rose-300 shadow-sm">
                    <span>{activeItem.count}</span>
                    <span className="text-[10px] font-bold opacity-80">Orang</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {activeItem.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4 text-blue-600" />
              <span>Tanggungjawab Utama Ahli:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeItem.responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{resp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logistics & Locations Highlight Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-sm">
          
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Lokasi & Penyelarasan Logistik</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Semua peserta KPMBP akan menginap di <strong>Kolej MARA Banting (KMB)</strong>. Bagi acara Teater Islamik pada 17 Oktober 2026, bas kontinjen akan diselaraskan ke <strong>Dewan JKKN Negeri Sembilan, Seremban</strong>.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Kolej MARA Banting (KMB)</div>
                  <div className="text-slate-500">Penginapan, Makan Minum, BOTB, Zapin, Duo</div>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                  Pusat Utama
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">JKKN Seremban, N.Sembilan</div>
                  <div className="text-slate-500">Pentas Pertandingan Teater Islamik (17 Okt)</div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                  Pentas Teater
                </span>
              </div>
            </div>
          </div>

          {/* Quick Officers & Emergency Contacts */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                TALIAN KECEMASAN & RUJUKAN
              </h4>
              <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">24 JAM</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Pegawai Pengiring Utama</div>
                  <div className="text-slate-500 text-[11px]">Urusan Kebajikan & Disiplin Kontinjen</div>
                </div>
                <a
                  href="https://wasap.my/60145313756"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-xs"
                >
                  WhatsApp
                </a>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Pemandu Bas</div>
                  <div className="text-slate-500 text-[11px]">Pergerakan Kenderaan KPMBP - Seremban</div>
                </div>
                <a
                  href="https://wasap.my/60197894925"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-xs"
                >
                  WhatsApp
                </a>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Bilik Gerakan SOAR KMB</div>
                  <div className="text-slate-500 text-[11px]">Urus Setia Induk MARA</div>
                </div>
                <span className="text-[11px] font-mono text-blue-700 font-bold">Kaunter KMB</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dedicated Penasihat Acara (PIC Acara) Directory Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pengurusan Acara</span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-slate-900">
                Penasihat Acara (PIC Acara) Direct WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Senarai jurulatih/penasihat mengikut acara pertandingan dan talian terus Ketua Penasihat.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                event: 'Teater Islamik',
                advisors: 'Muzlinda, Rabi, Nazhan, Nizam, Syifa, Afif',
                leadName: 'Muzlinda',
                phone: '60192046144',
                whatsapp: 'https://wasap.my/60192046144',
                color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
              },
              {
                event: 'Short Film (Street Dakwah)',
                advisors: 'Halimah',
                leadName: 'Halimatul',
                phone: '60177804852',
                whatsapp: 'https://wasap.my/60177804852',
                color: 'bg-rose-50 border-rose-200 text-rose-900',
              },
              {
                event: 'Tarian Zapin',
                advisors: 'Saba & Tam',
                leadName: 'Saba',
                phone: '60127142990',
                whatsapp: 'https://wasap.my/60127142990',
                color: 'bg-amber-50 border-amber-200 text-amber-900',
              },
              {
                event: 'BOTB (Battle of the Band)',
                advisors: 'Syafiq & Pip',
                leadName: 'Syafiq',
                phone: '60133312425',
                whatsapp: 'https://wasap.my/60133312425',
                color: 'bg-sky-50 border-sky-200 text-sky-900',
              },
              {
                event: 'Symphony Duo',
                advisors: 'Khairi & Din',
                leadName: 'Khairi',
                phone: '60145313756',
                whatsapp: 'https://wasap.my/60145313756',
                color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
              },
            ].map((pic, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{pic.event}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${pic.color}`}>
                      PIC Acara
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div>
                      <span className="text-slate-500">Penasihat: </span>
                      <span className="font-semibold text-slate-800">{pic.advisors}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={pic.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Official Open Graph / Web Banner Showcase (Hidden from UI per user request) */}
        <div className="hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-1">
                <span>Banner Open Graph (OG) & Media Sosial</span>
              </div>
              <h3 className="font-display font-extrabold text-base text-white">
                Banner Rasmi Kontinjen KPMBP
              </h3>
              <p className="text-slate-300 text-xs">
                Digunakan untuk perkongsian pautan di WhatsApp, Facebook, dan media sosial.
              </p>
            </div>
            <a
              href="/og-image.svg"
              target="_blank"
              download="kontinjen-kpmbp-og-banner.svg"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
            >
              Muat Turun Banner (SVG)
            </a>
          </div>

          <div className="rounded-xl overflow-hidden border border-blue-500/30 shadow-2xl bg-black/40">
            <img 
              src="/og-image.svg" 
              alt="Banner Open Graph Rasmi Kontinjen KPMBP" 
              className="w-full h-auto object-cover max-h-[380px]"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
