import React from 'react';
import { SOAR_METADATA } from '../data/soarData';
import { KpmbpLogo } from './KpmbpLogo';
import { ArrowUp, PhoneCall } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Col 1: Platform Identity */}
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <KpmbpLogo className="w-8 h-8 shrink-0 drop-shadow-sm" />
              <div>
                <span className="font-extrabold text-white text-sm block">
                  Kontinjen KPMBP
                </span>
                <span className="text-[10px] text-blue-400 font-bold">
                  SOAR IPMA 2026
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Pusat rujukan maklumat rasmi Kontinjen KPM Bandar Penawar.
            </p>
          </div>

          {/* Col 2: Pautan Rujukan Penting (Strict 5 Public Tabs) */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Rujukan Utama
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button 
                  onClick={() => onSelectTab('overview')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Laman Utama
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('events')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Acara (5 Kategori)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('schedule')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Jadual & Tarikh Penyerahan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('guidelines')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dokumen & Syarat Rasmi
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectTab('contact')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Hubungi Pengurusan
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Lokasi Festival */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Lokasi Festival
            </h4>
            <div className="space-y-2 text-slate-300">
              <div>
                <div className="font-semibold text-slate-200 text-xs">Kolej MARA Banting</div>
                <p className="text-[11px] text-slate-400">Pusat Penginapan & Pentas Utama (Selangor)</p>
              </div>
              <div>
                <div className="font-semibold text-slate-200 text-xs">JKKN Negeri Sembilan</div>
                <p className="text-[11px] text-slate-400">Auditorium D'Sury, Seremban (Teater &bull; 17 Okt)</p>
              </div>
            </div>
          </div>

          {/* Col 4: Contact / Support */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Bantuan & Hotline
            </h4>
            <p className="text-slate-400 text-xs">
              Kolej Profesional MARA Bandar Penawar, Johor
            </p>
            <div className="pt-1">
              <a
                href="https://wasap.my/60145313756?text=Pertanyaan%20Portal%20Kontinjen%20KPMBP"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 font-bold text-xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>WhatsApp Penyelaras</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Develop By Syncrozz */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              &copy; 2026 Kontinjen KPMBP &bull; Kolej Profesional MARA Bandar Penawar
            </span>
            <span className="text-slate-700 hidden sm:inline">&bull;</span>
            <span className="text-slate-400 font-medium">
              Develop By Syncrozz
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-blue-400 font-bold hover:underline cursor-pointer"
          >
            <span>Ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
