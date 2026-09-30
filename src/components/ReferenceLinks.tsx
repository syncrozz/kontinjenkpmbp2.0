import React from 'react';
import { Layers, Calendar, BookOpen, PhoneCall, ArrowRight } from 'lucide-react';

interface ReferenceLinksProps {
  onNavigateTab: (tab: string) => void;
}

export const ReferenceLinks: React.FC<ReferenceLinksProps> = ({ onNavigateTab }) => {
  const links = [
    {
      id: 'events',
      label: 'Acara',
      desc: 'Maklumat 5 acara, syarat pementasan & rubrik markah.',
      icon: Layers,
      color: 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-400'
    },
    {
      id: 'schedule',
      label: 'Jadual',
      desc: 'Tentatif 4 hari di KMB & JKKN serta tarikh serahan.',
      icon: Calendar,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400'
    },
    {
      id: 'guidelines',
      label: 'Dokumen',
      desc: 'Garis panduan rasmi penganjur MARA, etika & soalan lazim.',
      icon: BookOpen,
      color: 'bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-400'
    },
    {
      id: 'contact',
      label: 'Hubungi',
      desc: 'Direktori pensyarah penasihat & talian kecemasan.',
      icon: PhoneCall,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400'
    }
  ];

  return (
    <section className="py-8 sm:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 block mb-1">
            Pautan Pantas
          </span>
          <h2 className="font-display text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Perlu Rujuk?
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih bahagian rujukan pantas bagi kontinjen KPMBP.
          </p>
        </div>

        {/* 4 Clean Reference Jump Cards: [ Acara ] [ Jadual ] [ Dokumen ] [ Hubungi ] */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigateTab(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`text-left p-4 rounded-xl border transition-all hover:shadow-xs group cursor-pointer flex flex-col justify-between space-y-3 ${link.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-white shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-900 transition-colors">
                    {link.label}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug line-clamp-2">
                    {link.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
