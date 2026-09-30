import React, { useState, useMemo, useEffect } from 'react';
import { 
  STRUCTURED_COMPETITION_DOCUMENTS, 
  ReferenceCategory, 
  ReferenceClause,
  TraceableChecklistItem,
  getStructuredReferenceStats,
  getAllSubmissionDeadlines,
  getAllTraceableChecklistItems
} from '../data/competitionReferenceData';
import { PenaltyIconTooltip } from './PenaltyIconTooltip';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ClipboardList, 
  Target, 
  FileText, 
  CheckCircle2, 
  AlertOctagon, 
  Cpu, 
  Search, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  HelpCircle, 
  ExternalLink,
  BookOpen,
  Filter,
  Layers,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  Award,
  CheckSquare,
  Square,
  FileCheck2,
  Building2,
  ListTodo
} from 'lucide-react';

interface GuidelinesSectionProps {
  initialCategory?: ReferenceCategory;
  initialEventFilter?: string;
  onSelectEvent?: (eventId: string) => void;
}

export const GuidelinesSection: React.FC<GuidelinesSectionProps> = ({
  initialCategory = 'official_organizer_rules',
  initialEventFilter = 'Semua Acara',
  onSelectEvent
}) => {
  // Navigation mode within Guidelines
  const [activeSubTab, setActiveSubTab] = useState<'documents' | 'traceability_checklist' | 'deadlines' | 'faq'>('documents');
  const [activeCategory, setActiveCategory] = useState<ReferenceCategory>(initialCategory);
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>(initialEventFilter);
  const [onlyMandatory, setOnlyMandatory] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Checklist provenance filter
  const [checklistProvenanceFilter, setChecklistProvenanceFilter] = useState<'all' | 'official_organizer_rule' | 'internal_operational_requirement'>('all');

  // Checklist checked state persisted in localStorage
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('kpmbp_guideline_checklist_checked');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kpmbp_guideline_checklist_checked', JSON.stringify(checkedTasks));
    } catch (e) {
      console.error(e);
    }
  }, [checkedTasks]);

  const toggleTaskCheck = (taskId: string) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'org-gen-01': true
  });
  const [copiedClauseId, setCopiedClauseId] = useState<string | null>(null);

  // FAQ State
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({});
  const [faqSearch, setFaqSearch] = useState('');

  const stats = useMemo(() => getStructuredReferenceStats(), []);

  const eventFilters = [
    'Semua Acara',
    'Teater Islamik',
    'Street Dakwah',
    'Symphonic Duo',
    'Battle of the Band',
    'Tarian Zapin',
    'Umum Kontinjen'
  ];

  const currentCategoryData = useMemo(() => {
    return STRUCTURED_COMPETITION_DOCUMENTS.find(c => c.category === activeCategory) || STRUCTURED_COMPETITION_DOCUMENTS[0];
  }, [activeCategory]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    currentCategoryData.items.forEach(item => {
      allExpanded[item.sectionId] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    currentCategoryData.items.forEach(item => {
      allCollapsed[item.sectionId] = false;
    });
    setExpandedSections(allCollapsed);
  };

  const handleCopyClause = (clause: ReferenceClause, sectionTitle: string, docRef: string, docVer: string) => {
    const textToCopy = `[RUJUKAN RASMI SOAR IPMA 2026]\nKategori: ${currentCategoryData.categoryLabel}\nBahagian: ${sectionTitle}\nFasal: ${clause.clauseNumber || ''} - ${clause.heading}\nDokumen Rujukan: ${docRef} (${docVer})\nPunca Kuasa: ${clause.sourceType === 'internal_operational_requirement' ? 'Keperluan Operasi Dalaman KPMBP' : 'Syarat Rasmi Penganjur MARA'}\n\nKandungan:\n${clause.text}\n${clause.details ? clause.details.join('\n') : ''}\n${clause.penaltyNote ? `\nPenalti: ${clause.penaltyNote}` : ''}\n${clause.deadline ? `\nTarikh Akhir: ${clause.deadline}` : ''}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedClauseId(clause.id);
      setTimeout(() => setCopiedClauseId(null), 2500);
    }
  };

  // Filter items in active category
  const filteredSections = useMemo(() => {
    return currentCategoryData.items.map(section => {
      // Event filter check
      if (selectedEventFilter !== 'Semua Acara') {
        const target = (section.targetEvent || '').toLowerCase();
        const filter = selectedEventFilter.toLowerCase();
        const matchesEvent = target.includes(filter) || 
          (filter.includes('battle') && target.includes('muzik')) ||
          (filter.includes('symphonic') && target.includes('muzik'));
        if (!matchesEvent) return null;
      }

      // Filter clauses by search query and mandatory flag
      const matchingClauses = section.clauses.filter(clause => {
        if (onlyMandatory && !clause.mandatory) return false;
        if (!searchQuery.trim()) return true;

        const q = searchQuery.toLowerCase();
        return (
          clause.heading.toLowerCase().includes(q) ||
          clause.text.toLowerCase().includes(q) ||
          (clause.clauseNumber && clause.clauseNumber.toLowerCase().includes(q)) ||
          (clause.penaltyNote && clause.penaltyNote.toLowerCase().includes(q)) ||
          (clause.details && clause.details.some(d => d.toLowerCase().includes(q)))
        );
      });

      // If search query exists and no clauses match, but section title matches, keep all matching clauses
      if (searchQuery.trim() && matchingClauses.length === 0) {
        const q = searchQuery.toLowerCase();
        if (
          section.sectionTitle.toLowerCase().includes(q) ||
          section.officialDocumentRef.toLowerCase().includes(q) ||
          (section.targetRole && section.targetRole.toLowerCase().includes(q))
        ) {
          return {
            ...section,
            clauses: section.clauses.filter(c => !onlyMandatory || c.mandatory)
          };
        }
        return null;
      }

      if (matchingClauses.length === 0 && (searchQuery.trim() || onlyMandatory)) {
        return null;
      }

      return {
        ...section,
        clauses: matchingClauses
      };
    }).filter(Boolean) as typeof currentCategoryData.items;
  }, [currentCategoryData, selectedEventFilter, onlyMandatory, searchQuery]);

  const totalVisibleClauses = useMemo(() => {
    return filteredSections.reduce((acc, sec) => acc + sec.clauses.length, 0);
  }, [filteredSections]);

  // All traceable checklist items
  const allChecklistItems = useMemo(() => {
    return getAllTraceableChecklistItems(selectedEventFilter);
  }, [selectedEventFilter]);

  const filteredChecklistItems = useMemo(() => {
    return allChecklistItems.filter(item => {
      if (checklistProvenanceFilter !== 'all' && item.sourceType !== checklistProvenanceFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.taskText.toLowerCase().includes(q) ||
        item.sourceDocument.toLowerCase().includes(q) ||
        (item.sourceClause && item.sourceClause.toLowerCase().includes(q)) ||
        item.responsibleRole.toLowerCase().includes(q)
      );
    });
  }, [allChecklistItems, checklistProvenanceFilter, searchQuery]);

  // Deadlines list
  const allDeadlines = useMemo(() => {
    return getAllSubmissionDeadlines();
  }, []);

  // FAQs data
  const faqs = [
    {
      q: 'Di manakah pementasan Teater Islamik dijalankan dan apakah had masanya?',
      a: 'Pementasan Teater Islamik Masar Al-Masajid dijalankan di Auditorium D’Sury, Kompleks JKKN Seremban, Negeri Sembilan. Masa persembahan lakonan adalah 15 hingga 25 minit, ditambah 15 minit untuk persiapan dan pengemasan props pentas (Jumlah keseluruhan 40 minit). Kumpulan yang melanggar ketetapan masa akan dipotong markah.',
      tag: 'Teater Islamik'
    },
    {
      q: 'Apakah dasar rasmi penggunaan Kecerdasan Buatan (AI) bagi video Street Dakwah?',
      a: 'Buku Syarat Rasmi Fasal 5.3 melarang keras penggunaan generatif AI untuk skrip, visual babak video, dan suara sintetik. Hanya penstabilan video teknikal dan penapisan audio dibenarkan. Penggunaan AI generatif akan mengakibatkan pembatalan penyertaan (disqualification).',
      tag: 'Street Dakwah'
    },
    {
      q: 'Berapakah kuota rasmi keseluruhan Kontinjen KPM Bandar Penawar?',
      a: 'Kuota rasmi yang diluluskan oleh BPT MARA ialah maksimum 41 orang (35 pelajar bertanding pelbagai acara, 4 orang pensyarah pengiring/penasihat, dan 2 orang pemandu pengangkutan rasmi kolej).',
      tag: 'Umum Kontinjen'
    },
    {
      q: 'Apakah tarikh akhir penyerahan bahan rasmi bagi Teater dan Street Dakwah?',
      a: '10 September 2026 (11:59 Malam) bagi skrip teater, senarai nama pelakon, dan pendaftaran peserta. 1 Oktober 2026 (Jam 5:00 Petang Tepat) ialah tarikh tutup mutlak bagi muat naik video Street Dakwah Full HD 1080p.',
      tag: 'Tarikh Akhir'
    },
    {
      q: 'Bolehkah keputusan markah panel juri profesional dipertikaikan?',
      a: 'Fasal 1.3 menetapkan bahawa keputusan panel juri profesional yang dilantik oleh BPT MARA, JKKN, dan YADIM adalah MUKTAMAD dan sebarang bantahan atau rayuan terhadap markah tidak akan dilayan.',
      tag: 'Penjurian'
    }
  ];

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return faqs;
    const q = faqSearch.toLowerCase();
    return faqs.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.tag.toLowerCase().includes(q));
  }, [faqs, faqSearch]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5 text-blue-300" />
              <span>SISTEM RUJUKAN DOKUMEN BERSTRUKTUR & PERATURAN RASMI SOAR IPMA 2026</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Dokumen Rasmi Berkuat Kuasa
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Pusat Rujukan & Syarat Pertandingan
            </h2>
            <p className="text-xs sm:text-sm text-blue-200/90 leading-relaxed max-w-4xl">
              Akses menyeluruh kepada <strong>Syarat Rasmi Penganjur MARA</strong>, <strong>Garis Panduan Dalaman Kontinjen KPMBP</strong>, <strong>Arahan Operasi Urus Setia</strong>, dan <strong>Senarai Semak Tugasan Boleh Dijejak (Traceable Tasks)</strong> dengan pematuhan mutlak kepada versi dokumen yang diwartakan.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-blue-300 block text-[10px] uppercase font-black tracking-wider">Total Fasal Rujukan</span>
              <span className="font-display text-xl font-black text-white">{stats.totalClauses} Fasal</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-rose-300 block text-[10px] uppercase font-black tracking-wider">Klausa Mandatori [Wajib]</span>
              <span className="font-display text-xl font-black text-rose-300">{stats.mandatoryClauses} Syarat</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-amber-300 block text-[10px] uppercase font-black tracking-wider">Tugasan Penganjur MARA</span>
              <span className="font-display text-xl font-black text-amber-300">{stats.officialOrganizerChecklistItems} Tugasan</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-indigo-300 block text-[10px] uppercase font-black tracking-wider">Tugasan Operasi KPMBP</span>
              <span className="font-display text-xl font-black text-indigo-300">{stats.internalOperationalChecklistItems} SOP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveSubTab('documents')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'documents'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Fasal & Syarat Berstruktur</span>
        </button>

        <button
          onClick={() => setActiveSubTab('traceability_checklist')}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'traceability_checklist'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>Senarai Semak & Kebolehhijauan (Traceable)</span>
          <span className="bg-white/20 text-current text-[10px] px-2 py-0.5 rounded-full font-black">
            {stats.totalChecklistItems}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('deadlines')}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'deadlines'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Jadual Tarikh Akhir Rasmi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('faq')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'faq'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Soalan Lazim (FAQ)</span>
        </button>
      </div>

      {/* =========================================================================
          VIEW 1: STRUCTURED DOCUMENTS & RULES
         ========================================================================= */}
      {activeSubTab === 'documents' && (
        <div className="space-y-6">
          {/* 4 Pillars Category Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {STRUCTURED_COMPETITION_DOCUMENTS.map((cat, idx) => {
              const isActive = activeCategory === cat.category;
              const totalItems = cat.items.reduce((sum, item) => sum + item.clauses.length, 0);

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.category)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white/80 hover:bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${cat.badgeColor}`}>
                        Kategori {idx + 1}
                      </span>
                      <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                        {totalItems} Fasal
                      </span>
                    </div>

                    <h3 className={`font-display text-sm sm:text-base font-extrabold tracking-tight ${
                      isActive ? 'text-blue-900' : 'text-slate-900'
                    }`}>
                      {cat.categoryLabel}
                    </h3>
                    
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {cat.authoritySource}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-600">
                      {cat.items.length} Bahagian
                    </span>
                    <span className={`text-[11px] font-extrabold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                      {isActive ? 'Aktif Dipaparkan' : 'Pilih'} &rarr;
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Category Authority & Document Metadata Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-md border ${currentCategoryData.badgeColor}`}>
                    {currentCategoryData.categoryEnglish.toUpperCase()}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">
                    {currentCategoryData.categoryLabel}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>Pihak Berkuasa / Sumber:</strong> {currentCategoryData.authoritySource}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                <button
                  onClick={expandAll}
                  className="text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Buka Semua
                </button>
                <button
                  onClick={collapseAll}
                  className="text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Tutup Semua
                </button>
              </div>
            </div>

            {/* Official Document Reference & Version Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Dokumen Rujukan Rasmi:</span>
                <span className="font-extrabold text-slate-900">{currentCategoryData.documentRef}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Versi & Tarikh Penerbitan:</span>
                <span className="font-extrabold text-blue-900">{currentCategoryData.documentVersion} ({currentCategoryData.publicationDate})</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Status Dokumen Terkini:</span>
                <span className="inline-flex items-center gap-1 font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {currentCategoryData.documentStatus}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentCategoryData.description}
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari fasal, kata kunci (cth: 'masa', 'skrip', 'AI', 'kuota')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Batal
                  </button>
                )}
              </div>

              <button
                onClick={() => setOnlyMandatory(!onlyMandatory)}
                className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  onlyMandatory
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Hanya Klausa Mandatori [WAJIB]</span>
              </button>
            </div>

            {/* Event Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1 mr-1 shrink-0">
                <Filter className="w-3 h-3 text-slate-400" />
                <span>Acara:</span>
              </span>
              {eventFilters.map(evt => {
                const isSelected = selectedEventFilter === evt;
                return (
                  <button
                    key={evt}
                    onClick={() => setSelectedEventFilter(evt)}
                    className={`px-3 py-1 rounded-lg font-bold shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {evt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Count & Current Filter Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Menunjukkan <strong>{totalVisibleClauses}</strong> fasal rujukan dalam <strong>{filteredSections.length}</strong> bahagian
              {selectedEventFilter !== 'Semua Acara' && ` (Ditapis: ${selectedEventFilter})`}
            </span>
            {copiedClauseId && (
              <span className="text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                Petikan rujukan rasmi disalin ke papan keratan!
              </span>
            )}
          </div>

          {/* Structured Sections & Clauses Accordion List */}
          {filteredSections.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
              <Info className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">Tiada fasal ditemui</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tiada syarat atau garis panduan yang sepadan dengan carian "{searchQuery}" atau penapis acara "{selectedEventFilter}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedEventFilter('Semua Acara');
                  setOnlyMandatory(false);
                }}
                className="text-xs font-bold text-blue-600 underline cursor-pointer"
              >
                Set Semula Penapis
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSections.map((section) => {
                const isOpen = !!expandedSections[section.sectionId];

                return (
                  <div
                    key={section.sectionId}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
                  >
                    {/* Section Title Header Bar */}
                    <div
                      onClick={() => toggleSection(section.sectionId)}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white hover:bg-slate-100/70 transition-colors cursor-pointer border-b border-slate-100"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {section.targetEvent && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                              {section.targetEvent}
                            </span>
                          )}
                          {section.targetRole && (
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded">
                              {section.targetRole}
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            {section.documentStatus}
                          </span>
                        </div>

                        <h3 className="font-display text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                          <span>{section.sectionTitle}</span>
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                            <strong>{section.officialDocumentRef}</strong>
                          </span>
                          <span className="text-slate-400">&bull;</span>
                          <span className="text-blue-700 font-semibold">{section.documentVersion} ({section.publicationDate})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Section Body */}
                    {isOpen && (
                      <div className="p-4 sm:p-5 space-y-4 bg-slate-50/50">
                        {/* Event-Specific Requirements Box (if available) */}
                        {section.eventRequirements && (
                          <div className="bg-white border border-blue-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
                            <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-900">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                              <span>Spesifikasi & Keperluan Khusus Acara (Event-Specific Requirements)</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div className="space-y-1">
                                <span className="font-bold text-slate-800 block text-[11px]">Ketetapan Had Kuota & Durasi:</span>
                                <p className="text-slate-600 leading-relaxed">
                                  {section.eventRequirements.quotaRule}
                                  {section.eventRequirements.durationLimits && ` • ${section.eventRequirements.durationLimits}`}
                                </p>
                              </div>

                              {section.eventRequirements.stagingOrVenue && (
                                <div className="space-y-1">
                                  <span className="font-bold text-slate-800 block text-[11px]">Pentas / Lokasi Acara:</span>
                                  <p className="text-slate-600 leading-relaxed">
                                    {section.eventRequirements.stagingOrVenue}
                                  </p>
                                </div>
                              )}

                              {section.eventRequirements.syariahAttireRule && (
                                <div className="space-y-1">
                                  <span className="font-bold text-slate-800 block text-[11px]">Kod Busana & Pematuhan Syariah:</span>
                                  <p className="text-slate-600 leading-relaxed">
                                    {section.eventRequirements.syariahAttireRule}
                                  </p>
                                </div>
                              )}

                              {section.eventRequirements.aiPolicyRule && (
                                <div className="space-y-1">
                                  <span className="font-bold text-rose-800 block text-[11px]">Dasar Integriti AI (AI Policy):</span>
                                  <p className="text-rose-700 leading-relaxed font-medium">
                                    {section.eventRequirements.aiPolicyRule}
                                  </p>
                                </div>
                              )}
                            </div>

                            {section.eventRequirements.technicalSpecifications && (
                              <div className="pt-2 border-t border-slate-100">
                                <span className="font-bold text-slate-800 block text-[11px] mb-1">Syarat Teknikal & Elemen Mandatori:</span>
                                <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-600">
                                  {section.eventRequirements.technicalSpecifications.map((spec, sIdx) => (
                                    <li key={sIdx}>{spec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Submission Deadlines Box (if available) */}
                        {section.submissionDeadlines && section.submissionDeadlines.length > 0 && (
                          <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 space-y-2.5 shadow-2xs">
                            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-900">
                              <Clock className="w-4 h-4 text-amber-700" />
                              <span>Tarikh Akhir Penyerahan Rasmi (Official Submission Deadlines)</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {section.submissionDeadlines.map((dl, dlIdx) => (
                                <div key={dlIdx} className="bg-white border border-amber-200 rounded-lg p-3 text-xs space-y-1">
                                  <div className="flex items-center justify-between font-extrabold text-slate-900">
                                    <span>{dl.item}</span>
                                    <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded font-black">
                                      {dl.date}
                                    </span>
                                  </div>
                                  {dl.time && <div className="text-[11px] font-bold text-amber-800">Waktu Tutup: {dl.time}</div>}
                                  <div className="text-slate-600 text-[11px]">Saluran: <strong>{dl.submissionChannel}</strong></div>
                                  {dl.penaltyIfLate && (
                                    <div className="pt-1 flex items-center gap-1.5">
                                      <PenaltyIconTooltip penaltyText={dl.penaltyIfLate} label="Penalti Kelewatan" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Clauses List */}
                        <div className="space-y-3">
                          {section.clauses.map((clause) => {
                            return (
                              <div
                                key={clause.id}
                                className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs hover:border-blue-300 transition-all"
                              >
                                {/* Clause Header & Meta */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      {clause.clauseNumber && (
                                        <span className="text-xs font-black text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                                          {clause.clauseNumber}
                                        </span>
                                      )}
                                      {clause.mandatory && (
                                        <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                                          <AlertOctagon className="w-3 h-3 text-rose-600" />
                                          <span>Mandatori / Wajib</span>
                                        </span>
                                      )}
                                      {clause.sourceType && (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                          clause.sourceType === 'official_organizer_rule'
                                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                        }`}>
                                          {clause.sourceType === 'official_organizer_rule' ? 'Punca Kuasa: Penganjur MARA' : 'Keperluan Operasi KPMBP'}
                                        </span>
                                      )}
                                    </div>

                                    <h4 className="font-display text-sm sm:text-base font-black text-slate-900 pt-0.5">
                                      {clause.heading}
                                    </h4>
                                  </div>

                                  {/* Top Right Action Buttons: Penalty Icon + Salin Petikan */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    {clause.penaltyNote && (
                                      <PenaltyIconTooltip penaltyText={clause.penaltyNote} align="right" />
                                    )}
                                    <button
                                      onClick={() => handleCopyClause(clause, section.sectionTitle, section.officialDocumentRef, section.documentVersion)}
                                      className="text-xs font-bold text-slate-500 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                                      title="Salin petikan rujukan rasmi fasal ini"
                                    >
                                      {copiedClauseId === clause.id ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                                          <span className="text-emerald-700">Disalin</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span className="hidden sm:inline">Salin Petikan</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {/* Main Text */}
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                                  {clause.text}
                                </p>

                                {/* Bullet Details */}
                                {clause.details && clause.details.length > 0 && (
                                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-1.5">
                                    {clause.details.map((d, dIdx) => (
                                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                        <span>{d}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 2: TRACEABILITY CHECKLIST (Tugasan Boleh Dijejak)
         ========================================================================= */}
      {activeSubTab === 'traceability_checklist' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-display flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-blue-600" />
                  <span>Matriks Tugasan & Kebolehhijauan Dokumen (Task Traceability Matrix)</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Setiap tugasan mempunyai punca kuasa yang jelas: sama ada <strong>Syarat Rasmi Penganjur MARA</strong> (Buku Syarat) atau <strong>Keperluan Operasi Dalaman KPMBP</strong> (SOP SES).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Kemajuan: {Object.values(checkedTasks).filter(Boolean).length} / {filteredChecklistItems.length} Selesai
                </span>
              </div>
            </div>

            {/* Filter controls */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              {/* Provenance Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Punca Kuasa:</span>
                <button
                  onClick={() => setChecklistProvenanceFilter('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    checklistProvenanceFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({allChecklistItems.length})
                </button>
                <button
                  onClick={() => setChecklistProvenanceFilter('official_organizer_rule')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    checklistProvenanceFilter === 'official_organizer_rule'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  Penganjur MARA
                </button>
                <button
                  onClick={() => setChecklistProvenanceFilter('internal_operational_requirement')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    checklistProvenanceFilter === 'internal_operational_requirement'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                  }`}
                >
                  Operasi KPMBP
                </button>
              </div>

              {/* Event Filter */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Acara:</span>
                <select
                  value={selectedEventFilter}
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700"
                >
                  {eventFilters.map(evt => (
                    <option key={evt} value={evt}>{evt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Checklist Items Card Grid */}
          <div className="space-y-3">
            {filteredChecklistItems.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2">
                <Info className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">Tiada tugasan ditemui</h4>
                <p className="text-xs text-slate-500">Tiada tugasan yang sepadan dengan penapis yang dipilih.</p>
              </div>
            ) : (
              filteredChecklistItems.map((item) => {
                const isChecked = !!checkedTasks[item.id];
                const isOrganizer = item.sourceType === 'official_organizer_rule';

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleTaskCheck(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked
                        ? 'bg-slate-50 border-slate-200 opacity-80'
                        : isOrganizer
                        ? 'bg-white border-rose-200 hover:border-rose-400 shadow-2xs'
                        : 'bg-white border-indigo-200 hover:border-indigo-400 shadow-2xs'
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskCheck(item.id);
                      }}
                      className="mt-0.5 shrink-0 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Provenance Badge */}
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                          isOrganizer
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        }`}>
                          {isOrganizer ? 'Punca Kuasa: Penganjur MARA' : 'Keperluan Operasi KPMBP'}
                        </span>

                        {item.mandatory && (
                          <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            [WAJIB]
                          </span>
                        )}

                        {item.deadline && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {item.deadline}
                          </span>
                        )}

                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Tanggungjawab: {item.responsibleRole}
                        </span>
                      </div>

                      <p className={`text-xs sm:text-sm leading-relaxed ${
                        isChecked ? 'line-through text-slate-400' : 'text-slate-900 font-medium'
                      }`}>
                        {item.taskText}
                      </p>

                      {/* Source Document Traceability String */}
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                        <FileCheck2 className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>Rujukan Punca Kuasa: <strong>{item.sourceDocument}</strong> {item.sourceClause && `(${item.sourceClause})`}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: OFFICIAL SUBMISSION DEADLINES
         ========================================================================= */}
      {activeSubTab === 'deadlines' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-display flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>Jadual Tarikh Akhir Penyerahan Bahan Rasmi SOAR 2026</span>
            </h3>
            <p className="text-xs text-slate-600">
              Penetapan tarikh tutup bagi bahan pertandingan adalah muktamad. Kegagalan menghantar mengikut jadual mengakibatkan pemotongan markah atau ketidaklayakan karya untuk diadili.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allDeadlines.map((dlObj, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      {dlObj.targetEvent}
                    </span>
                    <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      {dlObj.deadline.date}
                    </span>
                  </div>

                  <h4 className="font-display text-sm sm:text-base font-extrabold text-slate-900">
                    {dlObj.deadline.item}
                  </h4>

                  <div className="text-xs text-slate-600 space-y-1">
                    {dlObj.deadline.time && (
                      <div>
                        <strong>Masa Had: </strong>
                        <span className="text-rose-700 font-bold">{dlObj.deadline.time}</span>
                      </div>
                    )}
                    <div>
                      <strong>Saluran Penghantaran: </strong>
                      <span>{dlObj.deadline.submissionChannel}</span>
                    </div>
                  </div>
                </div>

                {dlObj.deadline.penaltyIfLate && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-semibold text-rose-800">Penalti Kelewatan:</span>
                    <PenaltyIconTooltip penaltyText={dlObj.deadline.penaltyIfLate} label="Penalti Kelewatan" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: FAQS
         ========================================================================= */}
      {activeSubTab === 'faq' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-display flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <span>Soalan Lazim & Peraturan Khusus Festival SOAR 2026</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Jawapan ringkas dan tepat mengenai peraturan teknikal acara, kuota, tempat pementasan, dan etika pertandingan.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari soalan lazim..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = !!openFaqIndices[idx];

              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        {faq.tag}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {faq.q}
                      </h4>
                    </div>

                    <div className="text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-slate-50/70 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
