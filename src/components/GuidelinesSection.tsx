import React, { useState } from 'react';
import { RULES_GUIDELINES } from '../data/soarData';
import { ShieldAlert, FileText, CheckCircle2, ChevronDown, ChevronUp, AlertOctagon, Cpu, HelpCircle, Search } from 'lucide-react';

export const GuidelinesSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({});
  const [faqSearch, setFaqSearch] = useState('');

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Apakah syariah dan etika pemakaian yang ditetapkan untuk Kontinjen KPMBP?',
      a: 'Semua peserta hendaklah berpakaian kemas, sopan, dan menutup aurat mematuhi etika pakaian syariah IPMA MARA. Untuk Tarian Zapin dan Teater, busana hendaklah menepati konsep tradisional / Islamik tanpa mencetuskan sebarang kontroversi.'
    },
    {
      q: 'Apakah syarat ketat penggunaan AI (Kecerdasan Buatan) dalam Street Dakwah Video?',
      a: 'AI TIDAK DIBENARKAN sama sekali untuk menghasilkan skrip, jalan cerita, atau kandungan visual generated utama. AI hanya dibenarkan bagi tujuan pemprosesan teknikal seperti penstabilan video (stabilization) atau pengurangan hingar latar audio (noise reduction).'
    },
    {
      q: 'Berapakah bilangan peserta kontinjen KPMBP yang dibenarkan?',
      a: 'Jumlah keseluruhan kontinjen ialah 41 orang, terdiri daripada 35 orang Pelajar, 4 orang Pegawai Pengiring, dan 2 orang Pemandu rasmi.'
    },
    {
      q: 'Bagaimanakah lokasi pementasan Teater Islamik dilaksanakan?',
      a: 'Teater Islamik "Masar Al-Masajid" dipentaskan khas di Dewan JKKN Negeri Sembilan, Seremban pada 17 Oktober 2026. Bas kontinjen KPMBP akan membawa 15 peserta teater dari Kolej MARA Banting ke Seremban mengikut jadual yang ditetapkan.'
    },
    {
      q: 'Adakah keputusan panel penilai boleh dirayu?',
      a: 'Tidak. Berdasarkan tadbir urus rasmi SOAR IPMA 2026, semua keputusan panel juri profesional adalah MUKTAMAD.'
    }
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <section className="py-12 bg-slate-50 text-slate-900 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-950 text-xs font-bold uppercase tracking-wider shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Tadbir Urus & Peraturan Rasmi</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Garis Panduan, Etika & Syarat AI
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Pematuhan syarat pertandingan, etika persembahan, tadbir urus pusat, serta kekangan penggunaan teknologi digital sepanjang SOAR IPMA 2026.
          </p>
        </div>

        {/* Highlight Banner: AI Policy */}
        <div className="bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-200 rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-sm">
          <div className="md:col-span-2 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center mx-auto md:mx-0">
              <Cpu className="w-7 h-7 text-rose-600 animate-pulse" />
            </div>
          </div>

          <div className="md:col-span-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-rose-600 text-white px-2 py-0.5 rounded uppercase">
                Amaran Syarat AI Strict
              </span>
              <span className="text-xs text-amber-800 font-semibold">Street Dakwah & Media Digital</span>
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Kandungan Utama Generatif AI DILARANG SAMA SEKALI
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Semua skrip, jalan cerita, rakaman vokal, dan video mestilah karya asli pelajar KPMBP. AI <strong>TIDAK DIBENARKAN</strong> untuk menghasilkan visual/skrip automatik. Penggunaan AI hanya terhad kepada penyuntingan audio/video teknikal (penstabilan gambar & audio noise reduction).
            </p>
          </div>
        </div>

        {/* Rules Accordion */}
        <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Peraturan Utama Tadbir Urus</span>
          </h3>

          <div className="space-y-3">
            {RULES_GUIDELINES.map((rule, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{rule.title}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-slate-100 space-y-2 text-xs sm:text-sm text-slate-600 animate-fadeIn">
                      {rule.content.map((point, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQs Search & Accordion */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>Soalan Lazim Kontinjen (FAQ)</span>
            </h3>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari soalan lazim..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = !!openFaqIndices[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleFaq(idx)}
                  className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm hover:border-blue-300 transition-all cursor-pointer select-none"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-blue-900 text-xs sm:text-sm pr-2">
                      <span>{faq.q}</span>
                    </h4>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                  </div>
                  {isOpen && (
                    <p className="text-slate-600 text-xs sm:text-xs leading-relaxed pl-5 border-l-2 border-blue-500 pt-1 animate-fadeIn">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
