import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Key, 
  ShieldCheck, 
  Users, 
  CheckSquare, 
  Trash2, 
  Edit3, 
  Plus, 
  Download, 
  Search, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Copy, 
  FileSpreadsheet, 
  LogOut,
  Sparkles,
  Calendar,
  Phone,
  Mail,
  Video,
  Link as LinkIcon,
  Filter,
  RotateCcw,
  Delete,
  Clock,
  Compass,
  Target,
  Megaphone,
  Sliders,
  ArrowRight,
  ShieldAlert,
  LayoutGrid,
  Check,
  Award,
  Layers,
  UserCheck
} from 'lucide-react';
import { TalentFormData } from './TalentForm';
import { 
  ChecklistItem, 
  OperationsPhaseState, 
  SoarPhaseId, 
  DashboardModuleVisibility,
  ContingentUserRole,
  ContingentUserProfile
} from '../types';
import { 
  INITIAL_CHECKLIST, 
  EVENTS_DATA, 
  SUBMISSION_DEADLINES, 
  SubmissionDeadlineItem, 
  SOAR_PHASES,
  DASHBOARD_MODULE_DEFS,
  PHASE_MODULE_PRESETS,
  DEFAULT_MODULE_VISIBILITY,
  CONTINGENT_ACCESS_ROLES,
  DEFAULT_PUBLIC_USER
} from '../data/soarData';
import { 
  subscribeToTalentSubmissions, 
  deleteTalentSubmissionFromFirestore, 
  subscribeToChecklist, 
  saveChecklistItemToFirestore, 
  deleteChecklistItemFromFirestore, 
  saveAllChecklistToFirestore,
  saveOperationsPhaseToFirestore 
} from '../lib/firebase';
import { RoleSelectorGate } from './access/RoleSelectorGate';
import { MemberWorkspace } from './access/MemberWorkspace';
import { EventPicWorkspace } from './access/EventPicWorkspace';
import { AdvisorWorkspace } from './access/AdvisorWorkspace';
import { AccessManagementView } from './access/AccessManagementView';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  currentUser?: ContingentUserProfile;
  onUpdateCurrentUser?: (profile: ContingentUserProfile) => void;
  onLogout?: () => void;
  onUpdateChecklist?: () => void;
  initialTab?: 'phases' | 'submissions' | 'checklist' | 'deadlines' | 'access';
  phaseState: OperationsPhaseState;
  onUpdatePhase: (newState: OperationsPhaseState) => void;
  onNavigateTab?: (tabId: string) => void;
}

// Sample initial submissions if none exist so admin has data to inspect immediately
const SAMPLE_SUBMISSIONS = [
  {
    namaPenuh: 'MUHAMMAD FARHAN BIN ISMAIL',
    noIc: '040815-01-5431',
    noIdPelajar: 'PDA-2502-021',
    programPengajian: 'Diploma in Information Technology (DIT)',
    semester: 'Semester 3',
    noTelefon: '019-7654321',
    email: 'm.farhan@bpenawar.kpm.edu.my',
    acaraDiminati: ['Battle of the Band', 'Symphonic Duo'],
    bakatUtama: 'Bermain Alat Muzik',
    ringkasanBakat: 'Main Lead Guitar & Keyboard sejak sekolah menengah. Pernah menyertai Gig IPMA 2023.',
    tempohPenglibatan: '3-5 tahun',
    pernahPertandingan: 'Ya',
    namaPertandingan: 'Battle of the Bands Daerah Kota Tinggi',
    tahunPertandingan: '2023',
    peringkatPertandingan: 'Daerah',
    pencapaianPertandingan: 'Johan',
    pernahMewakili: ['Sekolah', 'Daerah', 'Kolej'],
    ceritaPengalaman: 'Pemain gitar utama band sekolah & kolej. Pernah memenangi persembahan instrumental terbaik.',
    teaterPernahBerlakon: 'Tidak',
    teaterWatakBiasa: 'Hero',
    teaterPeranan: [],
    teaterPengalaman: '',
    botbInstrumen: ['Guitar Lead', 'Keyboard'],
    botbGenre: 'Rock',
    duoInstrumenUtama: 'Gitar Akustik',
    duoInstrumenKedua: 'Vokal Harmoni',
    duoTahapPenguasaan: 'Mahir',
    zapinPernahMenari: 'Tidak',
    zapinTahunPengalaman: '',
    dakwahPenglibatan: [],
    dakwahPengalaman: '',
    linkVideo: 'https://www.youtube.com/watch?v=demo123456',
    linkSosial: '@farhan_guitarist',
    komitmenUjiBakat: true,
    komitmenLatihanBerkala: true,
    komitmenLatihanHujungMinggu: true,
    komitmenMenyertai: true,
    akuanBersetuju: true,
    submittedAt: '2026-08-07T14:30:00.000Z'
  },
  {
    namaPenuh: 'NUR AISHA BINTI RAZAK',
    noIc: '050210-01-8892',
    noIdPelajar: 'PLC-2602-015',
    programPengajian: 'Diploma in Integrated Logistics (DIL)',
    semester: 'Semester 2',
    noTelefon: '013-8821900',
    email: 'aisha.razak@bpenawar.kpm.edu.my',
    acaraDiminati: ['Teater Islamik (Masar Al-Masajid)'],
    bakatUtama: 'Lakonan',
    ringkasanBakat: 'Memegang watak utama teater sekolah & berpengalaman menulis skrip drama pendek.',
    tempohPenglibatan: '1-3 tahun',
    pernahPertandingan: 'Ya',
    namaPertandingan: 'Festival Teater Sekolah Negeri Johor',
    tahunPertandingan: '2022',
    peringkatPertandingan: 'Negeri',
    pencapaianPertandingan: 'Pelakon Wanita Terbaik',
    pernahMewakili: ['Sekolah', 'Negeri'],
    ceritaPengalaman: 'Berlakon teater komedi & drama berunsur keagamaan.',
    teaterPernahBerlakon: 'Ya',
    teaterWatakBiasa: 'Heroine',
    teaterPeranan: ['Pelakon', 'Penulis Skrip'],
    teaterPengalaman: 'Pernah mengarang skrip drama Masar Al-Masajid bertema kedamaian.',
    botbInstrumen: [],
    botbGenre: 'Pop',
    duoInstrumenUtama: '',
    duoInstrumenKedua: '',
    duoTahapPenguasaan: 'Pemula',
    zapinPernahMenari: 'Tidak',
    zapinTahunPengalaman: '',
    dakwahPenglibatan: [],
    dakwahPengalaman: '',
    linkVideo: 'https://www.youtube.com/watch?v=aisha_acting',
    linkSosial: '@aisha_theatre',
    komitmenUjiBakat: true,
    komitmenLatihanBerkala: true,
    komitmenLatihanHujungMinggu: true,
    komitmenMenyertai: true,
    akuanBersetuju: true,
    submittedAt: '2026-08-08T09:15:00.000Z'
  }
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  currentUser,
  onUpdateCurrentUser,
  onLogout,
  onUpdateChecklist,
  initialTab = 'phases',
  phaseState,
  onUpdatePhase,
  onNavigateTab
}) => {
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const [adminTab, setAdminTab] = useState<'phases' | 'submissions' | 'checklist' | 'deadlines' | 'access'>(initialTab);

  const activeRole: ContingentUserRole = currentUser?.role || (isAdminLoggedIn ? 'admin' : 'public');

  const handleSelectRole = (role: ContingentUserRole, name?: string, eventAssigned?: string) => {
    setIsSwitchingRole(false);
    if (role === 'admin') {
      setIsAdminLoggedIn(true);
    } else {
      setIsAdminLoggedIn(false);
    }

    const roleDef = CONTINGENT_ACCESS_ROLES.find(r => r.role === role) || CONTINGENT_ACCESS_ROLES[0];
    const newProfile: ContingentUserProfile = {
      role,
      name: name || roleDef.title,
      title: roleDef.title,
      badge: roleDef.label,
      eventAssigned,
      accessGrantedAt: new Date().toISOString()
    };

    if (onUpdateCurrentUser) {
      onUpdateCurrentUser(newProfile);
    }

    showToast(`Akses Disahkan: ${roleDef.label}`);
  };

  // Sync tab if initialTab changes
  useEffect(() => {
    if (initialTab) {
      setAdminTab(initialTab);
    }
  }, [initialTab]);

  // Phase Control State
  const [announcementInput, setAnnouncementInput] = useState(phaseState?.announcement || '');
  const [coordinatorInput, setCoordinatorInput] = useState(phaseState?.updatedBy || 'Penyelaras Kontinjen KPMBP');

  useEffect(() => {
    if (phaseState) {
      setAnnouncementInput(phaseState.announcement || '');
      setCoordinatorInput(phaseState.updatedBy || 'Penyelaras Kontinjen KPMBP');
    }
  }, [phaseState]);

  // Submissions State & IC privacy shield
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [searchSub, setSearchSub] = useState('');
  const [filterAcara, setFilterAcara] = useState('Semua');
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [showFullIC, setShowFullIC] = useState<boolean>(false);

  // Checklist State
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);

  // Checklist Add/Edit Modal State
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemTitle, setItemTitle] = useState('');
  const [itemCategory, setItemCategory] = useState<'Logistik' | 'Dokumen' | 'Peralatan' | 'Kebajikan' | 'Teknikal'>('Dokumen');
  const [itemRole, setItemRole] = useState<'Pegawai' | 'Pelajar' | 'Pemandu' | 'Semua'>('Semua');

  // Deadlines State
  const [deadlines, setDeadlines] = useState<SubmissionDeadlineItem[]>(() => {
    const saved = localStorage.getItem('kpmbp_soar_deadlines');
    if (saved) {
      try {
        const parsed: SubmissionDeadlineItem[] = JSON.parse(saved);
        const hasOutdated = parsed.some(
          (item) =>
            item.dueDate.includes('1 Sept 2026') ||
            item.dueDate.includes('15 Sept 2026') ||
            item.dueDate.includes('1 September') ||
            item.dueDate.includes('15 September')
        );
        if (hasOutdated) {
          localStorage.setItem('kpmbp_soar_deadlines', JSON.stringify(SUBMISSION_DEADLINES));
          return SUBMISSION_DEADLINES;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return SUBMISSION_DEADLINES;
  });

  const [editingDeadlineIdx, setEditingDeadlineIdx] = useState<number | null>(null);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [deadlineForm, setDeadlineForm] = useState<SubmissionDeadlineItem>({
    priority: 1,
    event: 'Teater Islamik',
    eventId: 'teater-islamik',
    requirement: '',
    dueDate: ''
  });

  // Toast feedback
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Operations Phase & Dashboard Modules State (SES v4.5)
  const currentVisibleModules: DashboardModuleVisibility = {
    ...DEFAULT_MODULE_VISIBILITY,
    ...(phaseState?.visibleModules || {})
  };

  const ANNOUNCEMENT_PRESETS = [
    {
      label: 'Fasa 03: Latihan & Rubrik',
      text: 'Peringatan Penyelaras: Kontinjen KPMBP kini berada dalam Fasa 03 (Latihan & Persiapan Pasukan) menuju ke kejohanan SOAR 2026 pada 15–18 Oktober 2026. Sila pastikan semua pasukan melengkapkan jadual latihan intensif dan semakan rubrik penjurian!'
    },
    {
      label: 'Fasa 03: Penyerahan Video',
      text: 'Peringatan Penting: Rakaman video rasmi Street Dakwah hendaklah diserahkan sebelum 1 Oktober 2026, jam 5:00 petang. Sila berhubung dengan penyelaras teknikal sekiranya ada kekangan.'
    },
    {
      label: 'Fasa 04: Logistik & Taklimat',
      text: 'Perhatian Kontinjen: Sila semak senarai semak logistik peribadi, borang kebenaran dan instrumen sebelum sesi taklimat akhir pergerakan ke Kolej MARA Banting.'
    },
    {
      label: 'Fasa 05: Operasi SOAR',
      text: 'Selamat Bertanding Kontinjen KPMBP! Patuhi jadual tentatif harian dan arahan pengurus pasukan sepanjang berada di KMB Banting & JKKN Seremban. Harumkan nama kolej!'
    }
  ];

  const handleToggleModule = async (moduleKey: keyof DashboardModuleVisibility) => {
    const newModules: DashboardModuleVisibility = {
      ...currentVisibleModules,
      [moduleKey]: !currentVisibleModules[moduleKey]
    };
    const updatedState: OperationsPhaseState = {
      ...phaseState,
      visibleModules: newModules,
      updatedAt: new Date().toISOString(),
      updatedBy: coordinatorInput.trim() || 'Penyelaras Kontinjen KPMBP'
    };
    try {
      const res = await saveOperationsPhaseToFirestore(updatedState);
      if (res?.phaseState) {
        onUpdatePhase(res.phaseState);
      } else {
        onUpdatePhase(updatedState);
      }
      showToast(`Modul "${moduleKey}" kini ${newModules[moduleKey] ? 'DIPAPARKAN' : 'DISEMBUNYIKAN'} di dashboard utama!`);
    } catch (err: any) {
      showToast(`Ralat: ${err?.message || 'Gagal mengemas kini modul.'}`);
    }
  };

  const handleApplyPresetForPhase = async (phaseId: SoarPhaseId) => {
    const preset = PHASE_MODULE_PRESETS[phaseId] || DEFAULT_MODULE_VISIBILITY;
    const updatedState: OperationsPhaseState = {
      ...phaseState,
      visibleModules: preset,
      updatedAt: new Date().toISOString(),
      updatedBy: coordinatorInput.trim() || 'Penyelaras Kontinjen KPMBP'
    };
    try {
      const res = await saveOperationsPhaseToFirestore(updatedState);
      if (res?.phaseState) {
        onUpdatePhase(res.phaseState);
      } else {
        onUpdatePhase(updatedState);
      }
      showToast(`Modul disyorkan bagi Fasa ${SOAR_PHASES.find(p => p.id === phaseId)?.phaseNumber} telah diterapkan!`);
    } catch (err: any) {
      showToast(`Ralat: ${err?.message || 'Gagal menerapkan pratetap fasa.'}`);
    }
  };

  const handleShowAllModules = async () => {
    const allVisible: DashboardModuleVisibility = {
      events: true,
      contingentOverview: true,
      schedule: true,
      calculator: true,
      checklist: true,
      talent: true,
      guidelines: true,
      deadlines: true
    };
    const updatedState: OperationsPhaseState = {
      ...phaseState,
      visibleModules: allVisible,
      updatedAt: new Date().toISOString(),
      updatedBy: coordinatorInput.trim() || 'Penyelaras Kontinjen KPMBP'
    };
    try {
      const res = await saveOperationsPhaseToFirestore(updatedState);
      if (res?.phaseState) {
        onUpdatePhase(res.phaseState);
      } else {
        onUpdatePhase(updatedState);
      }
      showToast('Semua modul kini dipaparkan di dashboard utama!');
    } catch (err: any) {
      showToast(`Ralat: ${err?.message || 'Gagal mengemas kini modul.'}`);
    }
  };

  // Operations Phase Actions
  const handleSwitchPhase = async (phaseId: SoarPhaseId, applyPreset = true) => {
    const targetPhase = SOAR_PHASES.find((p) => p.id === phaseId);
    const updatedModules = applyPreset 
      ? (PHASE_MODULE_PRESETS[phaseId] || currentVisibleModules)
      : currentVisibleModules;

    const updatedState: OperationsPhaseState = {
      ...phaseState,
      activePhaseId: phaseId,
      visibleModules: updatedModules,
      updatedAt: new Date().toISOString(),
      updatedBy: coordinatorInput.trim() || 'Penyelaras Kontinjen KPMBP'
    };
    try {
      const res = await saveOperationsPhaseToFirestore(updatedState);
      if (res?.phaseState) {
        onUpdatePhase(res.phaseState);
      } else {
        onUpdatePhase(updatedState);
      }
      showToast(`Fasa operasi berjaya ditukar ke: Fasa ${targetPhase?.phaseNumber} - ${targetPhase?.title}!`);
    } catch (err: any) {
      showToast(`Ralat: ${err?.message || 'Gagal menukar fasa operasi.'}`);
    }
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedState: OperationsPhaseState = {
      ...phaseState,
      announcement: announcementInput.trim(),
      updatedAt: new Date().toISOString(),
      updatedBy: coordinatorInput.trim() || 'Penyelaras Kontinjen KPMBP'
    };
    try {
      const res = await saveOperationsPhaseToFirestore(updatedState);
      if (res?.phaseState) {
        onUpdatePhase(res.phaseState);
      } else {
        onUpdatePhase(updatedState);
      }
      showToast('Pengumuman / Arahan rasmi fasa berjaya disimpan!');
    } catch (err: any) {
      showToast(`Ralat: ${err?.message || 'Gagal menyimpan pengumuman fasa.'}`);
    }
  };

  const handleStartAddDeadline = () => {
    setEditingDeadlineIdx(null);
    setDeadlineForm({
      priority: deadlines.length + 1,
      event: 'Teater Islamik',
      eventId: 'teater-islamik',
      requirement: '',
      dueDate: ''
    });
    setShowDeadlineModal(true);
  };

  const handleStartEditDeadline = (idx: number) => {
    setEditingDeadlineIdx(idx);
    setDeadlineForm({ ...deadlines[idx] });
    setShowDeadlineModal(true);
  };

  const handleSaveDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deadlineForm.requirement.trim() || !deadlineForm.dueDate.trim()) {
      alert('Sila lengkapkan semua medan keperluan dan tarikh akhir (Due Date).');
      return;
    }

    let updated: SubmissionDeadlineItem[];
    if (editingDeadlineIdx !== null) {
      updated = deadlines.map((item, i) => (i === editingDeadlineIdx ? deadlineForm : item));
      showToast('Alert deadline berjaya dikemas kini!');
    } else {
      updated = [...deadlines, deadlineForm];
      showToast('Alert deadline baru berjaya ditambah!');
    }

    const sorted = [...updated].sort((a, b) => a.priority - b.priority);
    setDeadlines(sorted);
    localStorage.setItem('kpmbp_soar_deadlines', JSON.stringify(sorted));
    window.dispatchEvent(new Event('deadlinesUpdated'));
    setShowDeadlineModal(false);
  };

  const handleDeleteDeadline = (idx: number) => {
    if (confirm('Adakah anda pasti untuk memadam item deadline ini?')) {
      const updated = deadlines.filter((_, i) => i !== idx);
      const sorted = [...updated].sort((a, b) => a.priority - b.priority);
      setDeadlines(sorted);
      localStorage.setItem('kpmbp_soar_deadlines', JSON.stringify(sorted));
      window.dispatchEvent(new Event('deadlinesUpdated'));
      showToast('Item deadline telah dipadam.');
    }
  };

  const handleResetDeadlinesDefault = () => {
    if (confirm('Tetapkan semula senarai deadline kepada asal (Default)?')) {
      setDeadlines(SUBMISSION_DEADLINES);
      localStorage.setItem('kpmbp_soar_deadlines', JSON.stringify(SUBMISSION_DEADLINES));
      window.dispatchEvent(new Event('deadlinesUpdated'));
      showToast('Senarai deadline di-reset ke asal.');
    }
  };

  // Real-time subscriptions for Submissions & Checklist
  useEffect(() => {
    // Subscribe to talent submissions from Firestore
    const unsubSubmissions = subscribeToTalentSubmissions((firestoreSubs) => {
      if (firestoreSubs) {
        setSubmissions(firestoreSubs as any);
        try {
          localStorage.setItem('kpmbp_talent_submissions', JSON.stringify(firestoreSubs));
        } catch {}
      } else {
        // Fallback to local storage only if offline
        try {
          const savedSubs = localStorage.getItem('kpmbp_talent_submissions');
          if (savedSubs) {
            setSubmissions(JSON.parse(savedSubs));
          }
        } catch {}
      }
    });

    // Subscribe to checklist items from Firestore
    const unsubChecklist = subscribeToChecklist((firestoreItems) => {
      if (firestoreItems) {
        const formatted = firestoreItems.map(item => ({
          id: item.id || item.firestoreId,
          category: item.category || 'Dokumen',
          title: item.title || '',
          targetRole: item.targetRole || 'Semua',
          completed: Boolean(item.completed)
        }));
        setChecklistItems(formatted);
        try {
          localStorage.setItem('kpmbp_soar_checklist', JSON.stringify(formatted));
        } catch {}
      }
    });

    return () => {
      unsubSubmissions();
      unsubChecklist();
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '5313') {
      setIsAdminLoggedIn(true);
      setPinInput('');
      setLoginError('');
      showToast('Log Masuk Pentadbir Berjaya!');
    } else {
      setLoginError('PIN Pentadbir Salah. Sila cuba lagi.');
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pinInput.length < 10) {
      setPinInput((prev) => prev + digit);
      setLoginError('');
    }
  };

  const handleKeypadBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setLoginError('');
  };

  const handleKeypadClear = () => {
    setPinInput('');
    setLoginError('');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsSwitchingRole(false);
    if (onLogout) {
      onLogout();
    } else if (onUpdateCurrentUser) {
      onUpdateCurrentUser(DEFAULT_PUBLIC_USER);
    }
    showToast('Telah kembali ke Akses Awam.');
    onClose();
  };

  // Submissions Actions
  const handleDeleteSubmission = (index: number) => {
    if (confirm('Adakah anda pasti untuk memadam rekod borang ini?')) {
      const target = submissions[index] as any;
      if (target?.firestoreId) {
        deleteTalentSubmissionFromFirestore(target.firestoreId).catch((e) => {
          console.warn('Firestore deletion error:', e);
        });
      }
      const updated = submissions.filter((_, i) => i !== index);
      setSubmissions(updated);
      localStorage.setItem('kpmbp_talent_submissions', JSON.stringify(updated));
      setSelectedSubmission(null);
      showToast('Rekod borang berjaya dipadam.');
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(submissions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kpmbp_talent_submissions_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Fail JSON pendaftaran berjaya dimuat turun.');
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const headers = ['Nama', 'ID Pelajar', 'IC', 'Program', 'Semester', 'No Tel', 'Email', 'Acara Diminati', 'Bakat Utama', 'Link Video', 'Tarikh Hantar'];
    const rows = submissions.map(s => [
      `"${s.namaPenuh || ''}"`,
      `"${s.noIdPelajar || ''}"`,
      `"${s.noIc || ''}"`,
      `"${s.programPengajian || ''}"`,
      `"${s.semester || ''}"`,
      `"${s.noTelefon || ''}"`,
      `"${s.email || ''}"`,
      `"${(s.acaraDiminati || []).join('; ')}"`,
      `"${s.bakatUtama || ''}"`,
      `"${s.linkVideo || ''}"`,
      `"${s.submittedAt ? new Date(s.submittedAt).toLocaleString() : ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `senarai_bakat_kpmbp_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Fail CSV pendaftaran berjaya dimuat turun.');
  };

  // Checklist Actions
  const handleSaveChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) return;

    let updatedItem: ChecklistItem;
    let updatedList: ChecklistItem[];

    if (editingItem) {
      // Edit mode
      updatedItem = { ...editingItem, title: itemTitle.trim(), category: itemCategory, targetRole: itemRole };
      updatedList = checklistItems.map((item) =>
        item.id === editingItem.id ? updatedItem : item
      );
      showToast('Tugasan checklist berjaya dikemas kini.');
    } else {
      // Add mode
      updatedItem = {
        id: 'admin-' + Date.now(),
        title: itemTitle.trim(),
        category: itemCategory,
        targetRole: itemRole,
        completed: false
      };
      updatedList = [updatedItem, ...checklistItems];
      showToast('Tugasan baru berjaya ditambah ke checklist.');
    }

    setChecklistItems(updatedList);
    localStorage.setItem('kpmbp_soar_checklist', JSON.stringify(updatedList));
    saveChecklistItemToFirestore(updatedItem).catch((err) => {
      console.warn('Firestore checklist save error:', err);
    });

    if (onUpdateChecklist) onUpdateChecklist();

    setShowItemModal(false);
    setEditingItem(null);
    setItemTitle('');
  };

  const handleDeleteChecklistItem = (id: string) => {
    if (confirm('Adakah anda pasti untuk memadam item checklist ini?')) {
      const updated = checklistItems.filter((i) => i.id !== id);
      setChecklistItems(updated);
      localStorage.setItem('kpmbp_soar_checklist', JSON.stringify(updated));
      deleteChecklistItemFromFirestore(id).catch((err) => {
        console.warn('Firestore checklist delete error:', err);
      });
      if (onUpdateChecklist) onUpdateChecklist();
      showToast('Item checklist dipadam.');
    }
  };

  const handleToggleChecklistStatus = (id: string) => {
    const target = checklistItems.find((item) => item.id === id);
    if (!target) return;
    const updatedItem = { ...target, completed: !target.completed };
    const updated = checklistItems.map((item) =>
      item.id === id ? updatedItem : item
    );
    setChecklistItems(updated);
    localStorage.setItem('kpmbp_soar_checklist', JSON.stringify(updated));
    saveChecklistItemToFirestore(updatedItem).catch((err) => {
      console.warn('Firestore checklist toggle error:', err);
    });
    if (onUpdateChecklist) onUpdateChecklist();
  };

  const handleResetChecklistToDefault = () => {
    if (confirm('Sahkan reset senarai semak logistik kepada item asal (Default)?')) {
      setChecklistItems(INITIAL_CHECKLIST);
      localStorage.setItem('kpmbp_soar_checklist', JSON.stringify(INITIAL_CHECKLIST));
      saveAllChecklistToFirestore(INITIAL_CHECKLIST);
      if (onUpdateChecklist) onUpdateChecklist();
      showToast('Checklist telah di-reset ke senarai asal.');
    }
  };

  if (!isOpen) return null;

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      (s.namaPenuh || '').toLowerCase().includes(searchSub.toLowerCase()) ||
      (s.noIdPelajar || '').toLowerCase().includes(searchSub.toLowerCase()) ||
      (s.programPengajian || '').toLowerCase().includes(searchSub.toLowerCase());

    const matchesAcara =
      filterAcara === 'Semua' || (s.acaraDiminati || []).includes(filterAcara);

    return matchesSearch && matchesAcara;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-blue-500/30 flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header Modal Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-cyan-300">
              {activeRole === 'admin' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : activeRole === 'advisor' ? (
                <Award className="w-5 h-5 text-amber-400" />
              ) : activeRole === 'pic' ? (
                <Layers className="w-5 h-5 text-purple-400" />
              ) : activeRole === 'member' ? (
                <UserCheck className="w-5 h-5 text-cyan-400" />
              ) : (
                <Lock className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white font-display">
                  {activeRole === 'admin'
                    ? 'Pusat Pentadbiran Kontinjen'
                    : activeRole === 'advisor'
                    ? 'Pusat Operasi Advisor'
                    : activeRole === 'pic'
                    ? 'Pusat Kawalan Event PIC'
                    : activeRole === 'member'
                    ? 'Portal Ahli Kontinjen KPMBP'
                    : 'Sistem Akses Kontinjen SOAR 2026'}
                </h3>
                {activeRole !== 'public' && (
                  <span className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold border ${
                    activeRole === 'admin'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : activeRole === 'advisor'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : activeRole === 'pic'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  }`}>
                    {currentUser?.badge || (activeRole === 'admin' ? 'Master Admin' : activeRole)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300">
                {activeRole !== 'public'
                  ? `Pengguna: ${currentUser?.name || 'Pegawai / Ahli Kontinjen'}`
                  : 'Pengesahan peranan bagi urus setia, penasihat, PIC acara & peserta'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            {activeRole !== 'public' && (
              <>
                <button
                  onClick={() => setIsSwitchingRole((prev) => !prev)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold transition-all border border-white/15 cursor-pointer"
                  title="Tukar Peranan Pengguna"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSwitchingRole ? 'Kembali' : 'Tukar Peranan'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-extrabold transition-all border border-rose-400/50 shadow-md shadow-rose-950/40 cursor-pointer shrink-0"
                  title="Log Keluar ke Akses Awam"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  <span className="whitespace-nowrap">Log Keluar</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer shrink-0"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ROLE-BASED WORKSPACES */}
        {activeRole === 'public' || isSwitchingRole ? (
          <RoleSelectorGate
            onSelectRole={handleSelectRole}
            currentRole={activeRole}
          />
        ) : activeRole === 'member' ? (
          <MemberWorkspace
            currentUser={currentUser || { role: 'member', name: 'Ahli Kontinjen KPMBP', title: 'Peserta / Krew', badge: 'Ahli Kontinjen' }}
            phaseState={phaseState}
            onNavigateTab={(tab) => {
              onClose();
              if (onNavigateTab) onNavigateTab(tab);
            }}
            onOpenAdminWorkspace={(tab) => {
              setAdminTab((tab as any) || 'phases');
            }}
          />
        ) : activeRole === 'pic' ? (
          <EventPicWorkspace
            currentUser={currentUser || { role: 'pic', name: 'Event PIC', title: 'Pegawai Pengurus Acara', badge: 'Event PIC' }}
            submissions={submissions}
          />
        ) : activeRole === 'advisor' ? (
          <AdvisorWorkspace
            currentUser={currentUser || { role: 'advisor', name: 'Advisor Kontinjen', title: 'Pensyarah Pengiring', badge: 'Advisor' }}
            checklistItems={checklistItems}
            onToggleChecklist={handleToggleChecklistStatus}
            submissionsCount={submissions.length}
          />
        ) : (
          /* CASE 2: AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50">
            
            {/* Top Admin Nav Tabs */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setAdminTab('phases')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'phases'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Kawalan Fasa Operasi (6 Fasa)</span>
                </button>

                <button
                  onClick={() => setAdminTab('submissions')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'submissions'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Submisi Pendaftaran Bakat ({submissions.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('checklist')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'checklist'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Pengurusan Checklist ({checklistItems.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('deadlines')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'deadlines'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-950" />
                  <span>Edit Due Date Submission ({deadlines.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('access')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'access'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Akses & Kuasa Sesi</span>
                </button>

                <button
                  onClick={() => setIsSwitchingRole(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
                  title="Uji Peranan Akses Kontinjen Lain"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Uji Peranan Lain</span>
                </button>
              </div>

              {adminTab === 'submissions' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFullIC(!showFullIC)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-all cursor-pointer"
                    title={showFullIC ? 'Sembunyikan sebahagian nombor IC' : 'Paparkan nombor IC penuh'}
                  >
                    {showFullIC ? <EyeOff className="w-3.5 h-3.5 text-slate-600" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
                    <span>{showFullIC ? 'Topengkan IC' : 'Papar IC Penuh'}</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Eksport CSV</span>
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JSON</span>
                  </button>
                </div>
              )}

              {adminTab === 'checklist' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setItemTitle('');
                      setItemCategory('Dokumen');
                      setItemRole('Semua');
                      setShowItemModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Tugasan Baru</span>
                  </button>
                  <button
                    onClick={handleResetChecklistToDefault}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Checklist</span>
                  </button>
                </div>
              )}

              {adminTab === 'deadlines' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartAddDeadline}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Due Date Baru</span>
                  </button>
                  <button
                    onClick={handleResetDeadlinesDefault}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB CONTENT 0: OPERATIONS PHASE CONTROL (SES v4.5) */}
            {adminTab === 'phases' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Intro Hero Card */}
                <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-blue-800/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                        <Compass className="w-3.5 h-3.5 text-blue-300" />
                        <span>Sistem Kawalan Fasa Operasi Global Kontinjen KPMBP</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight font-display">
                        Fasa Semasa: Fasa {SOAR_PHASES.find(p => p.id === phaseState?.activePhaseId)?.phaseNumber || '01'} - {SOAR_PHASES.find(p => p.id === phaseState?.activePhaseId)?.title}
                      </h3>
                      <p className="text-xs text-blue-200 max-w-2xl leading-relaxed">
                        Perubahan fasa di sini berkuat kuasa serta-merta untuk seluruh kontinjen. Ia mengawal maklumat keutamaan, fokus tindakan (CTA), dan garis masa yang dipaparkan kepada semua pelajar dan pegawai.
                      </p>
                    </div>
                    <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                      <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-extrabold shadow-inner">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        Fasa {SOAR_PHASES.find(p => p.id === phaseState?.activePhaseId)?.phaseNumber || '01'} Aktif
                      </span>
                      {phaseState?.updatedAt && (
                        <span className="text-[10px] text-blue-300">
                          Kemaskini: {new Date(phaseState.updatedAt).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Announcement Editor Form */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                        <Megaphone className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Peringatan & Arahan Rasmi Penyelaras Kontinjen (Live Banner)
                        </h4>
                        <p className="text-xs text-slate-500">
                          Arahan ini akan disiarkan secara langsung kepada semua pelawat dan peserta portal bagi fasa aktif.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSaveAnnouncement} className="space-y-3">
                    <div>
                      <textarea
                        rows={3}
                        value={announcementInput}
                        onChange={(e) => setAnnouncementInput(e.target.value)}
                        placeholder="Contoh: Peringatan Penyelaras: Kontinjen KPMBP kini berada dalam Fasa 03 (Latihan & Persiapan Pasukan) menuju ke kejohanan SOAR 2026 pada 15–18 Oktober 2026..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* Quick Announcement Presets */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Templat Pengumuman Pantas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {ANNOUNCEMENT_PRESETS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAnnouncementInput(p.text)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors cursor-pointer"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-600 shrink-0">Dikeluarkan oleh:</span>
                        <input
                          type="text"
                          value={coordinatorInput}
                          onChange={(e) => setCoordinatorInput(e.target.value)}
                          placeholder="Penyelaras Kontinjen KPMBP"
                          className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Simpan & Siarkan Pengumuman</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Dashboard Modules Visibility Control */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                        <LayoutGrid className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>Kawalan Paparan Modul Dashboard Utama (Portal Overview)</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {Object.values(currentVisibleModules).filter(Boolean).length} / {DASHBOARD_MODULE_DEFS.length} Modul Aktif
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500">
                          Tentukan modul yang dipaparkan pada suapan halaman utama mengikut fasa operasi. Modul yang ditutup tetap boleh diakses melalui menu navigasi di atas.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleApplyPresetForPhase(phaseState?.activePhaseId || 'phase_03')}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Cadangan Fasa Semasa</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleShowAllModules}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Paparkan Semua</span>
                      </button>
                    </div>
                  </div>

                  {/* Modules Switch Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DASHBOARD_MODULE_DEFS.map((mod) => {
                      const isVisible = !!currentVisibleModules[mod.key];

                      return (
                        <div
                          key={mod.key}
                          onClick={() => handleToggleModule(mod.key)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isVisible
                              ? 'bg-blue-50/40 border-blue-300 shadow-2xs'
                              : 'bg-slate-50/60 border-slate-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-900">
                                {mod.title}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                                {mod.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {mod.description}
                            </p>
                            <div className="text-[10px] text-blue-600 font-medium pt-0.5 flex items-center gap-1">
                              <span>Akses Navigasi:</span>
                              <span className="font-bold underline">Tab {mod.tabTarget}</span>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <div className="shrink-0 pt-0.5">
                            <div
                              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                                isVisible ? 'bg-emerald-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center ${
                                  isVisible ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              >
                                {isVisible && <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 6 Operational Phases Grid */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 font-display">
                      Pilihan 6 Fasa Operasi Kontinjen (Tukar Status Global)
                    </h4>
                    <span className="text-xs text-slate-500">
                      Klik butang <strong>"Aktifkan Fasa Ini"</strong> untuk mengubah fasa portal utama
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SOAR_PHASES.map((phase) => {
                      const isActive = phase.id === phaseState?.activePhaseId;

                      return (
                        <div
                          key={phase.id}
                          className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                            isActive
                              ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-black bg-slate-100 text-slate-700 border border-slate-200">
                                FASA {phase.phaseNumber}
                              </span>
                              {isActive ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-xs">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  SEDANG AKTIF
                                </span>
                              ) : (
                                <span className="text-[11px] font-semibold text-slate-400">
                                  {phase.period}
                                </span>
                              )}
                            </div>

                            <div>
                              <h5 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                                {phase.title}
                              </h5>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {phase.subtitle}
                              </p>
                            </div>

                            <div className="bg-white rounded-xl p-3 border border-slate-100 text-xs text-slate-700 space-y-2">
                              <div>
                                <span className="font-bold text-slate-900">Keutamaan: </span>
                                <span className="text-slate-600">{phase.priorityFocus}</span>
                              </div>
                              <div className="pt-2 border-t border-slate-100">
                                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block mb-1">
                                  Objektif Utama:
                                </span>
                                <ul className="space-y-1">
                                  {phase.keyObjectives.slice(0, 2).map((obj, oi) => (
                                    <li key={oi} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                                      <span className="text-blue-600 font-bold">•</span>
                                      <span className="line-clamp-1">{obj}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="text-[11px] text-slate-500">
                              Tab Fokus: <span className="font-bold text-slate-700">{phase.recommendedTab}</span>
                            </div>

                            {isActive ? (
                              <button
                                disabled
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 cursor-default flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Fasa Semasa</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSwitchPhase(phase.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <span>Aktifkan Fasa Ini</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 1: SUBMISSIONS MANAGER */}
            {adminTab === 'submissions' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                
                {/* Search & Filter bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari mengikut Nama, ID Pelajar, Program..."
                      value={searchSub}
                      onChange={(e) => setSearchSub(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <select
                      value={filterAcara}
                      onChange={(e) => setFilterAcara(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Semua">Semua Acara</option>
                      <option value="Teater Islamik (Masar Al-Masajid)">Teater Islamik</option>
                      <option value="Battle of the Band">Battle of the Band</option>
                      <option value="Symphonic Duo">Symphonic Duo</option>
                      <option value="Tarian Zapin">Tarian Zapin</option>
                      <option value="Street Dakwah">Street Dakwah</option>
                    </select>
                  </div>
                </div>

                {/* Submissions Table / Cards */}
                {filteredSubmissions.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs space-y-2">
                    <Users className="w-8 h-8 text-slate-300 mx-auto" />
                    <div className="font-bold text-slate-700 text-sm">Tiada Rekod Pendaftaran Dijumpai</div>
                    <p>Cuba tukar kata kunci carian atau tapis mengikut acara lain.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3.5">#</th>
                            <th className="p-3.5">Pelajar & ID</th>
                            <th className="p-3.5">Program & Sem</th>
                            <th className="p-3.5">Acara Diminati</th>
                            <th className="p-3.5">Bakat Utama</th>
                            <th className="p-3.5">Link Video</th>
                            <th className="p-3.5 text-right">Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredSubmissions.map((sub, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3.5 font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                              <td className="p-3.5">
                                <div className="font-bold text-slate-900">{sub.namaPenuh}</div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  {sub.noIdPelajar} • IC: {showFullIC ? (sub.noIc || '-') : (sub.noIc ? sub.noIc.slice(0, 9) + '••••' : '-')} • {sub.noTelefon}
                                </div>
                              </td>
                              <td className="p-3.5">
                                <div>{sub.programPengajian}</div>
                                <div className="text-[10px] text-blue-600 font-semibold">{sub.semester}</div>
                              </td>
                              <td className="p-3.5">
                                <div className="flex flex-wrap gap-1">
                                  {(sub.acaraDiminati || []).map((ac: string) => (
                                    <span key={ac} className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                      {ac.replace(' (Masar Al-Masajid)', '')}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="p-3.5 font-semibold text-slate-800">
                                {sub.bakatUtama}
                              </td>
                              <td className="p-3.5">
                                {sub.linkVideo ? (
                                  <a
                                    href={sub.linkVideo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold text-[11px]"
                                  >
                                    <Video className="w-3.5 h-3.5" />
                                    <span>Tonton</span>
                                  </a>
                                ) : (
                                  <span className="text-slate-400 italic text-[10px]">Tiada link</span>
                                )}
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedSubmission(sub)}
                                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] border border-blue-200 flex items-center gap-1 transition-all"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Detail</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubmission(idx)}
                                    className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all"
                                    title="Padam Rekod"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: CHECKLIST MANAGER */}
            {adminTab === 'checklist' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                
                <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-blue-950 text-sm">Akses Pengurusan Checklist Logistik</div>
                    <p>
                      Sebagai Pentadbir, anda boleh menambah tugasan baru, mengemas kini tajuk/kategori/peranan, memadam tugasan yang tidak relevan, atau mengubah status siap tugasan kontinjen KPMBP. Semua perubahan disimpan secara terus dalam penyimpanan sistem.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-100 border-b border-slate-200 font-bold text-xs text-slate-800 flex justify-between items-center">
                    <span>Senarai Tugasan Logistik Rasmi ({checklistItems.length})</span>
                    <span className="text-emerald-700 font-mono text-[11px]">
                      {checklistItems.filter(i => i.completed).length} / {checklistItems.length} Selesai
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {checklistItems.map((item) => (
                      <div key={item.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => handleToggleChecklistStatus(item.id)}
                            className="mt-0.5 text-slate-400 hover:text-blue-600 cursor-pointer"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-slate-300 rounded-md"></div>
                            )}
                          </button>

                          <div className="space-y-1">
                            <div className={`font-semibold text-xs text-slate-900 ${item.completed ? 'line-through text-slate-400' : ''}`}>
                              {item.title}
                            </div>
                            <div className="flex flex-wrap gap-1.5 text-[10px]">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-200">
                                {item.category}
                              </span>
                              <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold border border-blue-200">
                                Peranan: {item.targetRole}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setItemTitle(item.title);
                              setItemCategory(item.category);
                              setItemRole(item.targetRole);
                              setShowItemModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-all"
                            title="Edit Item"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteChecklistItem(item.id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all"
                            title="Padam Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: DEADLINES MANAGER */}
            {adminTab === 'deadlines' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                
                <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 text-xs text-amber-950 leading-relaxed flex items-start gap-3 shadow-xs">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-amber-950 text-sm">Pengurusan Alert & Due Date Penyerahan Bahan Kontinjen</div>
                    <p className="mt-0.5 text-amber-900 font-medium">
                      Sebagai Pentadbir, anda boleh mengemas kini tarikh akhir (Due Date), menambah keperluan serahan baharu, menetapkan tahap keutamaan, atau memadamkan alert lama. Maklumat ini akan dipaparkan secara langsung pada Jadual Keutamaan Halaman Utama untuk makluman seluruh kontinjen KPMBP.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 bg-amber-500 text-slate-950 font-black text-xs flex justify-between items-center border-b border-amber-600/20">
                    <span className="flex items-center gap-2 uppercase tracking-wide">
                      <Clock className="w-4 h-4 text-slate-950" />
                      <span>Senarai Alert Due Date Pertandingan ({deadlines.length})</span>
                    </span>
                    <button
                      onClick={handleStartAddDeadline}
                      className="bg-slate-950 text-amber-400 hover:bg-slate-800 text-[11px] font-bold px-3 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Baru</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-800">
                      <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3.5 text-center w-24">Keutamaan</th>
                          <th className="p-3.5 w-44">Acara Pertandingan</th>
                          <th className="p-3.5">Keperluan yang Perlu Dihantar</th>
                          <th className="p-3.5 w-48">Due Date</th>
                          <th className="p-3.5 text-right w-28">Tindakan Admin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {deadlines.map((dl, idx) => {
                          const priorityBadges = ['🥇 1', '🥈 2', '🥉 3'];
                          return (
                            <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                              <td className="p-3.5 text-center font-black">
                                <span className="inline-flex items-center justify-center bg-slate-100 text-slate-900 font-black px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                                  {priorityBadges[dl.priority - 1] || `#${dl.priority}`}
                                </span>
                              </td>
                              <td className="p-3.5 font-bold text-blue-900">
                                {dl.event}
                              </td>
                              <td className="p-3.5 font-semibold text-slate-800">
                                {dl.requirement}
                              </td>
                              <td className="p-3.5 font-black text-slate-950">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-300 font-extrabold text-xs">
                                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                  <span>{dl.dueDate}</span>
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleStartEditDeadline(idx)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-blue-700 border border-slate-200 transition-all cursor-pointer"
                                    title="Edit Item"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDeadline(idx)}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer"
                                    title="Padam Item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: ACCESS & AUTHORIZATION MANAGEMENT */}
            {adminTab === 'access' && (
              <AccessManagementView onShowToast={showToast} />
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: SUBMISSION DETAIL MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-auto">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Butiran Penuh Calon Bakat
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedSubmission.namaPenuh}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedSubmission.noIdPelajar} • IC: {showFullIC ? (selectedSubmission.noIc || '-') : (selectedSubmission.noIc ? selectedSubmission.noIc.slice(0, 9) + '••••' : '-')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowFullIC(!showFullIC)}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline"
                  >
                    {showFullIC ? 'Topengkan' : 'Papar'}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              
              {/* Personal Info */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">Bahagian A: Maklumat Peribadi</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><strong>Program:</strong> {selectedSubmission.programPengajian}</div>
                  <div><strong>Semester:</strong> {selectedSubmission.semester}</div>
                  <div><strong>No Telefon:</strong> {selectedSubmission.noTelefon}</div>
                  <div><strong>Email:</strong> {selectedSubmission.email}</div>
                </div>
              </div>

              {/* Acara & Bakat */}
              <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-200 space-y-2">
                <div className="font-bold text-blue-950 border-b border-blue-200 pb-1">Bahagian B & C: Acara & Bakat Utama</div>
                <div><strong>Acara Diminati:</strong> {(selectedSubmission.acaraDiminati || []).join(', ')}</div>
                <div><strong>Bakat Utama:</strong> {selectedSubmission.bakatUtama}</div>
                <div><strong>Tempoh Penglibatan:</strong> {selectedSubmission.tempohPenglibatan}</div>
                <div><strong>Ringkasan Bakat:</strong> {selectedSubmission.ringkasanBakat || 'Tiada'}</div>
              </div>

              {/* Pengalaman */}
              <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200 space-y-2">
                <div className="font-bold text-amber-950 border-b border-amber-200 pb-1">Bahagian D: Pengalaman Pertandingan</div>
                <div><strong>Pernah Pertandingan:</strong> {selectedSubmission.pernahPertandingan}</div>
                {selectedSubmission.pernahPertandingan === 'Ya' && (
                  <div>
                    <strong>Butiran:</strong> {selectedSubmission.namaPertandingan} ({selectedSubmission.tahunPertandingan}) - {selectedSubmission.peringkatPertandingan} [{selectedSubmission.pencapaianPertandingan}]
                  </div>
                )}
                <div><strong>Pernah Mewakili:</strong> {(selectedSubmission.pernahMewakili || []).join(', ') || 'Tiada'}</div>
                <div><strong>Cerita Pengalaman:</strong> {selectedSubmission.ceritaPengalaman || 'Tiada'}</div>
              </div>

              {/* Media links */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">Link Media & Video</div>
                <div>
                  <strong>Link Video Bakat:</strong>{' '}
                  {selectedSubmission.linkVideo ? (
                    <a href={selectedSubmission.linkVideo} target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">
                      {selectedSubmission.linkVideo}
                    </a>
                  ) : 'Tiada'}
                </div>
                <div><strong>Link Sosial:</strong> {selectedSubmission.linkSosial || 'Tiada'}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT CHECKLIST ITEM MODAL */}
      {showItemModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-bold text-base text-slate-900">
                {editingItem ? 'Kemaskini Tugasan Checklist' : 'Tambah Tugasan Checklist Baru'}
              </h4>
              <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChecklistItem} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tajuk / Perihalan Tugasan <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taklimat keselamatan bersama pemandu bas KPMBP"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori</label>
                  <select
                    value={itemCategory}
                    onChange={(e: any) => setItemCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Dokumen">Dokumen</option>
                    <option value="Logistik">Logistik</option>
                    <option value="Peralatan">Peralatan</option>
                    <option value="Kebajikan">Kebajikan</option>
                    <option value="Teknikal">Teknikal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Peranan Sasaran</label>
                  <select
                    value={itemRole}
                    onChange={(e: any) => setItemRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="Semua">Semua</option>
                    <option value="Pegawai">Pegawai</option>
                    <option value="Pelajar">Pelajar</option>
                    <option value="Pemandu">Pemandu</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  {editingItem ? 'Kemaskini' : 'Tambah Tugasan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT DEADLINE MODAL */}
      {showDeadlineModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>{editingDeadlineIdx !== null ? 'Kemaskini Alert Due Date' : 'Tambah Alert Due Date Baru'}</span>
              </h4>
              <button onClick={() => setShowDeadlineModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeadline} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Tahap Keutamaan</label>
                  <select
                    value={deadlineForm.priority}
                    onChange={(e) => setDeadlineForm({ ...deadlineForm, priority: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value={1}>🥇 Keutamaan 1</option>
                    <option value={2}>🥈 Keutamaan 2</option>
                    <option value={3}>🥉 Keutamaan 3</option>
                    <option value={4}>4 (Keutamaan Rendah)</option>
                    <option value={5}>5 (Keutamaan Rendah)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Acara Pertandingan</label>
                  <select
                    value={deadlineForm.event}
                    onChange={(e) => {
                      const selectedTitle = e.target.value;
                      const match = EVENTS_DATA.find(ev => ev.title.toLowerCase() === selectedTitle.toLowerCase() || ev.category.toLowerCase() === selectedTitle.toLowerCase());
                      setDeadlineForm({
                        ...deadlineForm,
                        event: selectedTitle,
                        eventId: match ? match.id : selectedTitle.toLowerCase().replace(/\s+/g, '-')
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Teater Islamik">Teater Islamik</option>
                    <option value="BOTB">BOTB</option>
                    <option value="Symphonic Duo">Symphonic Duo</option>
                    <option value="Tarian Zapin">Tarian Zapin</option>
                    <option value="Short Film (Street Dakwah)">Short Film (Street Dakwah)</option>
                    <option value="Semua Acara / Umum">Semua Acara / Umum</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-700">Keperluan yang Perlu Dihantar <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nama & ID peserta / Skrip & Video"
                  value={deadlineForm.requirement}
                  onChange={(e) => setDeadlineForm({ ...deadlineForm, requirement: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-slate-700">Tarikh Akhir (Due Date) <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 Sept 2026 / 15 Sept 2026"
                  value={deadlineForm.dueDate}
                  onChange={(e) => setDeadlineForm({ ...deadlineForm, dueDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDeadlineModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  {editingDeadlineIdx !== null ? 'Kemaskini' : 'Tambah Due Date'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
