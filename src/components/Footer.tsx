import React from 'react';
import { SOAR_METADATA } from '../data/soarData';
import { KpmbpLogo } from './KpmbpLogo';
import { Sparkles, Heart, Building, PhoneCall, ArrowUp } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <KpmbpLogo className="w-9 h-9 shrink-0 drop-shadow-sm" />
              <span className="font-extrabold text-white text-sm">
                Kontinjen KPMBP
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Portal rujukan rasmi bersepadu bagi Kontinjen Kolej Profesional MARA Bandar Penawar untuk Festival SOAR IPMA 2026.
            </p>
            <div className="text-[11px] text-blue-400 font-semibold italic">
              "{SOAR_METADATA.theme}"
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Navigasi Pantas</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onSelectTab('talent')} className="hover:text-blue-400 font-bold text-amber-400 transition-colors">
                  ★ Borang Pencarian Bakat
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('overview')} className="hover:text-blue-400 transition-colors">
                  Ringkasan Kontinjen
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('events')} className="hover:text-blue-400 transition-colors">
                  5 Acara Pertandingan
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('schedule')} className="hover:text-blue-400 transition-colors">
                  Tentatif 4 Hari
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('calculator')} className="hover:text-blue-400 transition-colors">
                  Kalkulator Rubrik Markah
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('checklist')} className="hover:text-blue-400 transition-colors">
                  Checklist Persediaan
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Acara Utama */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">5 Acara Utama</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Teater Islamik (Masar Al-Masajid)</li>
              <li>Symphonic Duo (A Symphony of Two)</li>
              <li>Tarian Zapin (Kategori Terbuka)</li>
              <li>Battle of the Band (Rock Malaya & Global)</li>
              <li>Street Dakwah (From Chaos to Calm)</li>
            </ul>
          </div>

          {/* Col 4: Venues & Hotline */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Lokasi Festival</h4>
            <div className="space-y-1 text-slate-300">
              <div className="font-semibold text-slate-200">1. Kolej MARA Banting (KMB)</div>
              <p className="text-[11px] text-slate-500">Selangor &bull; Pusat Penginapan & Pentas Utama</p>
              
              <div className="font-semibold text-slate-200 pt-1">2. JKKN Negeri Sembilan</div>
              <p className="text-[11px] text-slate-500">Seremban &bull; Pentas Teater Islamik (17 Okt)</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              © 2026 Kontinjen KPMBP.{' '}
              <a
                href="https://wasap.my/60145313756"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-emerald-400 font-semibold"
              >
                By Syncrozz
              </a>
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-blue-400 font-bold hover:underline"
          >
            <span>Ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
