import React, { useState, useEffect } from 'react';
import { INITIAL_CHECKLIST } from '../data/soarData';
import { ChecklistItem } from '../types';
import { 
  subscribeToChecklist, 
  saveChecklistItemToFirestore, 
  deleteChecklistItemFromFirestore, 
  saveAllChecklistToFirestore 
} from '../lib/firebase';
import { CheckSquare, Square, CheckCircle2, RotateCcw, Filter, ShieldCheck, Bus, FileText, Package, Plus, Trash2, Lock, Unlock } from 'lucide-react';

interface LogisticsChecklistProps {
  onOpenAdmin?: () => void;
  isAdminLoggedIn?: boolean;
}

export const LogisticsChecklist: React.FC<LogisticsChecklistProps> = ({
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('kpmbp_soar_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_CHECKLIST;
      }
    }
    return INITIAL_CHECKLIST;
  });

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToChecklist((firestoreItems) => {
      if (firestoreItems && firestoreItems.length > 0) {
        // Map firestore items ensuring id field exists
        const formatted = firestoreItems.map(item => ({
          id: item.id || item.firestoreId,
          category: item.category || 'Dokumen',
          title: item.title || '',
          targetRole: item.targetRole || 'Semua',
          completed: Boolean(item.completed)
        }));
        setItems(formatted);
        localStorage.setItem('kpmbp_soar_checklist', JSON.stringify(formatted));
      }
    });

    return () => unsubscribe();
  }, []);

  const [filterRole, setFilterRole] = useState<string>('Semua');
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  // Custom new task modal state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Logistik' | 'Dokumen' | 'Peralatan' | 'Kebajikan' | 'Teknikal'>('Dokumen');
  const [newRole, setNewRole] = useState<'Pegawai' | 'Pelajar' | 'Pemandu' | 'Semua'>('Semua');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem('kpmbp_soar_checklist', JSON.stringify(items));
  }, [items]);

  const toggleCheck = (id: string) => {
    const targetItem = items.find((item) => item.id === id);
    if (!targetItem) return;

    const updatedItem = { ...targetItem, completed: !targetItem.completed };
    setItems((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );

    saveChecklistItemToFirestore(updatedItem).catch((e) => {
      console.warn('Firestore checklist save error:', e);
    });
  };

  const resetChecklist = () => {
    if (confirm('Adakah anda pasti untuk mendaftar semula senarai semak asal?')) {
      setItems(INITIAL_CHECKLIST);
      localStorage.setItem('kpmbp_soar_checklist', JSON.stringify(INITIAL_CHECKLIST));
      saveAllChecklistToFirestore(INITIAL_CHECKLIST);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ChecklistItem = {
      id: 'custom-' + Date.now(),
      category: newCategory,
      title: newTitle.trim(),
      targetRole: newRole,
      completed: false
    };

    setItems((prev) => [newItem, ...prev]);
    saveChecklistItemToFirestore(newItem).catch((e) => {
      console.warn('Firestore checklist save error:', e);
    });

    setNewTitle('');
    setShowAddForm(false);
  };

  const deleteTask = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    deleteChecklistItemFromFirestore(id).catch((e) => {
      console.warn('Firestore checklist delete error:', e);
    });
  };

  const filteredItems = items.filter((item) => {
    const matchesRole = filterRole === 'Semua' || item.targetRole === filterRole || item.targetRole === 'Semua';
    const matchesCategory = filterCategory === 'Semua' || item.category === filterCategory;
    return matchesRole && matchesCategory;
  });

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / (items.length || 1)) * 100);

  return (
    <section className="py-12 bg-slate-50 text-slate-900 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <CheckSquare className="w-4 h-4" />
              <span>Pengurusan Persediaan Kontinjen KPMBP</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Checklist Logistik, Dokumen & Peralatan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Senarai semak persediaan wajib sebelum dan semasa kontinjen KPMBP bertolak ke Kolej MARA Banting dan JKKN Seremban.
            </p>
          </div>
        </div>

        {/* Progress Tracker Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-slate-900">Kemajuan Persediaan Kontinjen</span>
            </div>
            <span className="font-mono font-black text-blue-600 text-base">
              {completedCount} / {items.length} Selesai ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Add Form Dropdown if active */}
        {showAddForm && (
          <form onSubmit={handleAddTask} className="bg-white border border-blue-200 rounded-2xl p-5 space-y-4 shadow-md animate-fadeIn">
            <h3 className="text-sm font-bold text-blue-800">Tambah Tugasan / Senarai Semak Baru:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Perihalkan tugas/dokumen..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Dokumen">Dokumen</option>
                  <option value="Logistik">Logistik</option>
                  <option value="Peralatan">Peralatan</option>
                  <option value="Kebajikan">Kebajikan</option>
                  <option value="Teknikal">Teknikal</option>
                </select>

                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Semua">Semua</option>
                  <option value="Pelajar">Pelajar</option>
                  <option value="Pegawai">Pegawai</option>
                  <option value="Pemandu">Pemandu</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Simpan Task
              </button>
            </div>
          </form>
        )}

        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-slate-500 font-medium shrink-0">Pihak Bertanggungjawab:</span>
            {['Semua', 'Pelajar', 'Pegawai', 'Pemandu'].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterRole === role
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:text-blue-600 border border-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-slate-500 font-medium shrink-0">Kategori:</span>
            {['Semua', 'Dokumen', 'Logistik', 'Peralatan', 'Kebajikan', 'Teknikal'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:text-blue-600 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs shadow-sm">
              Tiada senarai semak bagi penapis ini.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 shadow-sm ${
                  item.completed
                    ? 'bg-slate-100/70 border-slate-200 text-slate-400 line-through'
                    : 'bg-white border-slate-200 hover:border-blue-300 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button className="shrink-0 text-blue-600">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 hover:text-blue-600 transition-colors" />
                    )}
                  </button>

                  <div>
                    <span className="text-sm font-semibold">{item.title}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-800">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Tanggungjawab: <strong>{item.targetRole}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(item.id);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  title="Padam task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};
