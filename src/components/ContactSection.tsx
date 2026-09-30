import React from 'react';
import { EVENTS_DATA, SOAR_METADATA } from '../data/soarData';
import { 
  PhoneCall, 
  MapPin, 
  Mail, 
  Building, 
  ShieldCheck, 
  Users, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface ContactSectionProps {
  onNavigateTab?: (tab: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onNavigateTab }) => {
  return (
    <section className="py-10 sm:py-12 bg-slate-50 text-slate-900 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Pusat Perhubungan & Direktori Rasmi</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Hubungi Pengurusan Kontinjen KPMBP
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Saluran pertanyaan rasmi, direktori pensyarah penasihat mengikut acara, maklumat penginapan, dan talian kecemasan bagi Kontinjen Kolej Profesional MARA Bandar Penawar ke Festival SOAR IPMA 2026.
          </p>
        </div>

        {/* Top Highlight Cards: Sekretariat & Lokasi Rasmi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Pengurusan Utama */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Sekretariat Kontinjen</h3>
                <p className="text-[11px] text-slate-500">Kolej Profesional MARA Bandar Penawar</p>
              </div>
            </div>
            
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Jalan Ungku Abdul Aziz, 81930 Bandar Penawar, Johor</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span>kpmbp@mara.gov.my</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kekuatan Kontinjen: <strong>41 Pax (35 Pelajar + 6 Pegawai)</strong></span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wasap.my/60145313756?text=Pertanyaan%20Portal%20Kontinjen%20KPMBP%20SOAR%202026"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Penyelaras Kontinjen</span>
              </a>
            </div>
          </div>

          {/* Card 2: Pusat Penginapan (KMB) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Lokasi Tuan Rumah & Penginapan</h3>
                <p className="text-[11px] text-slate-500">Kolej MARA Banting (KMB)</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p className="font-medium text-slate-900">Kolej MARA Banting, Selangor</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Pusat pendaftaran, penginapan rasmi kontinjen, Dewan Al-Khawarizmi (Pentas Utama), dan lokasi acara Duo, Zapin, BOTB, serta Street Dakwah.
              </p>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tarikh Daftar Masuk:</span>
                  <span className="font-bold text-slate-800">15 Okt 2026 (2.00 ptg)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Daftar Keluar:</span>
                  <span className="font-bold text-slate-800">18 Okt 2026 (2.00 ptg)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Pentas Teater Islamik (JKKN) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Pentas Teater Islamik</h3>
                <p className="text-[11px] text-slate-500">Auditorium D'Sury, JKKN Seremban</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p className="font-medium text-slate-900">Kompleks JKKN Negeri Sembilan</p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Lokasi pementasan rasmi Teater Masar Al-Masajid. Pergerakan bas dari KMB ke Seremban disediakan mengikut jadual raptai dan hari pertandingan.
              </p>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Raptai Pentas:</span>
                  <span className="font-bold text-slate-800">16 Okt (2.45 ptg)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pertandingan Rasmi:</span>
                  <span className="font-bold text-amber-700 font-bold">17 Okt (8.30 pagi)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Direktori Pensyarah Penasihat & PIC 5 Acara */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Direktori Pegawai & Pensyarah Penasihat Acara
              </h3>
              <p className="text-xs text-slate-600">
                Sila hubungi ketua penasihat acara masing-masing untuk urusan latihan intensif, kebajikan, dan keperluan teknikal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EVENTS_DATA.map((ev) => (
              <div key={ev.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
                <div className="space-y-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      {ev.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {ev.participantsCount}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {ev.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 italic">
                    "{ev.theme}"
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-blue-700">Ketua Penasihat Acara</div>
                        <div className="font-bold text-slate-900 text-xs">{ev.leadAdvisor || 'Penyelaras Acara'}</div>
                      </div>

                      {ev.leadAdvisorPhone ? (
                        <a
                          href={ev.leadAdvisorWhatsApp || `https://wa.me/${ev.leadAdvisorPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors"
                          title={`Hubungi ${ev.leadAdvisor} di WhatsApp`}
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400">Talian Urus Setia</span>
                      )}
                    </div>

                    {ev.advisors && ev.advisors.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                        <span className="text-slate-400">Pasukan Penasihat: </span>
                        <span className="font-semibold text-slate-700">{ev.advisors.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Talian Bantuan & Etika */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Talian Kecemasan & Kebajikan Pelajar</span>
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              Memerlukan Bantuan Segera Semasa Festival?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Sebarang isu kecemasan perubatan, disiplin, kehilangan barang peribadi, atau jadual pengangkutan hendaklah dimaklumkan serta-merta kepada Pegawai Pengiring Bertugas atau Pengurusan Bilik Gerakan Kontinjen KPMBP.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <a
              href="https://wasap.my/60145313756?text=KECEMASAN%20SOAR%20KPMBP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline Kecemasan 24 Jam</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
