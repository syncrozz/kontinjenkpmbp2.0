import React, { useState } from 'react';
import { EVENTS_DATA } from '../data/soarData';
import { Calculator, Award, Sliders, RefreshCw, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export const RubricCalculator: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string>('street-dakwah');
  
  const currentEvent = EVENTS_DATA.find((e) => e.id === selectedEventId) || EVENTS_DATA[4];

  // Map component values (default 85 marks out of 100 for each component)
  const [scores, setScores] = useState<{ [key: string]: number }>({
    '0': 85,
    '1': 85,
    '2': 85,
    '3': 85,
    '4': 85,
    '5': 85
  });

  const handleScoreChange = (index: number, val: number) => {
    setScores((prev) => ({ ...prev, [index]: val }));
  };

  const handleReset = () => {
    setScores({ '0': 85, '1': 85, '2': 85, '3': 85, '4': 85, '5': 85 });
  };

  // Calculate total weighted score
  const calculateTotal = () => {
    if (!currentEvent.rubric) return 0;
    let total = 0;
    currentEvent.rubric.forEach((item, idx) => {
      const score = scores[idx] !== undefined ? scores[idx] : 85;
      total += (score * item.percentage) / 100;
    });
    return total;
  };

  const totalScore = calculateTotal();

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return { label: 'Cemerlang Tinggi (Emas)', color: 'text-amber-800 bg-amber-100 border-amber-300', advice: 'Tahniah! Mutu persembahan/karya sangat tinggi. Pertahankan konsistensi & disiplin.' };
    if (score >= 80) return { label: 'Sangat Baik (Perak)', color: 'text-sky-800 bg-sky-100 border-sky-300', advice: 'Pencapaian mantap! Beri perhatian ekstra pada komponen wajaran terbesar untuk raih markah cemerlang.' };
    if (score >= 70) return { label: 'Kepujian (Gangsa)', color: 'text-rose-800 bg-rose-100 border-rose-300', advice: 'Baik, namun perlu pembaikan teknikal & penghayatan tajuk untuk bersaing di peringkat akhir.' };
    return { label: 'Perlu Pembaikan', color: 'text-slate-800 bg-slate-100 border-slate-300', advice: 'Semak semula garis panduan rasmi dan lakukan simulasi latihan sebelum pementasan rasmi.' };
  };

  const gradeInfo = getPerformanceGrade(totalScore);

  return (
    <section className="py-12 bg-slate-50 text-slate-900 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <Calculator className="w-4 h-4" />
              <span>Simulasi & Self-Assessment Markah</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Kalkulator Rubrik Penilaian SOAR 2026
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Uji anggaran peratusan markah kontinjen KPMBP mengikut wajaran rubrik rasmi bagi setiap kategori pertandingan.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 border border-slate-200 shadow-sm transition-all self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Set Semula Slider</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Event Selection & Sliders */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Event Switcher Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">Pilih Acara Pertandingan:</label>
              <div className="flex flex-wrap gap-2">
                {EVENTS_DATA.map((ev, idx) => {
                  const isSelected = selectedEventId === ev.id;
                  const themeList = [
                    { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-950', badgeBg: 'bg-rose-200/80', ring: 'ring-rose-400' },
                    { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-950', badgeBg: 'bg-amber-200/80', ring: 'ring-amber-400' },
                    { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-950', badgeBg: 'bg-sky-200/80', ring: 'ring-sky-400' },
                  ];
                  const theme = themeList[idx % themeList.length];

                  return (
                    <button
                      key={ev.id}
                      onClick={() => {
                        setSelectedEventId(ev.id);
                        handleReset();
                      }}
                      className={`rounded-full px-3.5 py-1.5 border text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                        theme.bg
                      } ${theme.border} ${theme.text} ${
                        isSelected
                          ? `ring-2 ring-offset-1 ${theme.ring} shadow-md scale-[1.02]`
                          : 'hover:opacity-90 shadow-sm opacity-85'
                      }`}
                    >
                      <span>{ev.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${theme.badgeBg} ${theme.text}`}>
                        {ev.rubric?.length || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rubric Component Sliders */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{currentEvent.title}</h3>
                  <span className="text-xs text-blue-600 font-medium">Tema: "{currentEvent.theme}"</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs bg-rose-50 text-rose-950 font-black px-3 py-1 rounded-full border border-rose-300 shadow-sm">
                  <span>{currentEvent.rubric?.length || 0}</span>
                  <span className="text-[10px] font-bold opacity-80">Komponen</span>
                </span>
              </div>

              {currentEvent.rubric ? (
                <div className="space-y-5">
                  {currentEvent.rubric.map((item, idx) => {
                    const val = scores[idx] !== undefined ? scores[idx] : 85;
                    return (
                      <div key={idx} className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{item.component}</span>
                            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              Wajaran {item.percentage}%
                            </span>
                          </span>
                          <span className="font-mono font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
                            {val} / 100
                          </span>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={val}
                          onChange={(e) => handleScoreChange(idx, Number(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                        />

                        <p className="text-[11px] text-slate-600 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">Acara ini tidak mempunyai jadual rubrik khas.</div>
              )}

            </div>

          </div>

          {/* Right: Score Summary & Advice */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Jumlah Anggaran Markah Terkumpul
                </span>
                <div className="text-5xl font-black text-blue-600 font-mono tracking-tight">
                  {totalScore.toFixed(1)} <span className="text-xl text-slate-400 font-normal">%</span>
                </div>
                <div className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border ${gradeInfo.color}`}>
                  {gradeInfo.label}
                </div>
              </div>

              {/* Progress Visual Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, totalScore)}%` }}
                  ></div>
                </div>
              </div>

              {/* Strategic Advice Box */}
              <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-blue-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Syor Strategi Latihan KPMBP:</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {gradeInfo.advice}
                </p>
              </div>

              {/* Weightage Insight */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
                <div className="font-bold text-slate-800">Tips Pemarkahan Tinggi:</div>
                <p className="leading-relaxed">
                  Fokus latihan pada komponen dengan wajaran peratus terbesar (30% - 35%) seperti Kandungan & Tema, Ragam Zapin, Musikaliti, dan Mesej Islamik.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
