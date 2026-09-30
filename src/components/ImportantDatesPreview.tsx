import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface ImportantDatesPreviewProps {
  onNavigateTab: (tab: string) => void;
}

export const ImportantDatesPreview: React.FC<ImportantDatesPreviewProps> = ({ onNavigateTab }) => {
  const dates = [
    {
      date: '15 Okt',
      title: 'Ketibaan & Pendaftaran',
      desc: 'Pendaftaran kontinjen di KMB & taklimat teknikal.'
    },
    {
      date: '16–17 Okt',
      title: 'Pentas Pertandingan',
      desc: '5 Acara di Dewan Al-Khawarizmi & JKKN Seremban.'
    },
    {
      date: '18 Okt',
      title: 'Majlis Penutupan',
      desc: 'Pengumuman pemenang & penyampaian anugerah.'
    }
  ];

  return (
    <section className="py-8 sm:py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Garis Masa Utama</span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-black tracking-tight text-slate-900">
              Tarikh Penting
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Garis masa festival 4 hari dan tarikh penting festival SOAR IPMA 2026.
            </p>
          </div>

          <button
            onClick={() => {
              onNavigateTab('schedule');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-xs transition-colors border border-slate-300 self-start sm:self-auto cursor-pointer"
          >
            <span>Lihat Jadual Penuh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Dates Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {dates.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                onNavigateTab('schedule');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white border border-slate-200 rounded-xl p-4 space-y-1.5 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-mono font-black text-blue-700">
                <span className="bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                  {item.date}
                </span>
                <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm pt-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
