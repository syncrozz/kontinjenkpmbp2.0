import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  UserX, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Users, 
  Key, 
  Terminal,
  Activity,
  History,
  Check
} from 'lucide-react';
import { 
  fetchAdminMembers, 
  revokeMemberAccessOnBackend, 
  unlockMemberOnBackend, 
  revokeAllSessionsOnBackend, 
  fetchAuditLogsOnBackend,
  AdminMemberItem,
  SecurityAuditLogItem 
} from '../../lib/contingentAuth';

interface AccessManagementViewProps {
  onShowToast: (msg: string) => void;
}

export const AccessManagementView: React.FC<AccessManagementViewProps> = ({ onShowToast }) => {
  const [members, setMembers] = useState<AdminMemberItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLogItem[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'members' | 'audit' | 'policies'>('members');

  const loadData = async () => {
    setLoading(true);
    const res = await fetchAdminMembers();
    if (res.success && res.members) {
      setMembers(res.members);
      setTotalSessions(res.totalActiveSessions);
    }
    const logsRes = await fetchAuditLogsOnBackend();
    if (logsRes.success && logsRes.logs) {
      setAuditLogs(logsRes.logs);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRevoke = async (member: AdminMemberItem) => {
    if (!confirm(`Sahkan penarikan balik akses bagi: ${member.nama} (${member.email})?\n\nSemua sesi aktif beliau akan ditamatkan dan status keahlian akan dinyahaktifkan serta-merta.`)) {
      return;
    }

    setActionInProgress(member.email);
    const res = await revokeMemberAccessOnBackend(member.email);
    setActionInProgress(null);

    if (res.success) {
      onShowToast(res.message || 'Akses berjaya ditarik balik.');
      loadData();
    } else {
      alert(res.message || 'Gagal menarik balik akses.');
    }
  };

  const handleUnlock = async (member: AdminMemberItem) => {
    setActionInProgress(member.email);
    const res = await unlockMemberOnBackend(member.email);
    setActionInProgress(null);

    if (res.success) {
      onShowToast(`Sekatan akaun ${member.email} telah dibuka.`);
      loadData();
    } else {
      alert(res.message || 'Gagal membuka sekatan akaun.');
    }
  };

  const handleEmergencyRevokeAll = async () => {
    if (!confirm('AMARAN KESELAMATAN:\n\nAdakah anda pasti mahu menamatkan SEMUA sesi aktif pengguna lain dalam kontinjen?\n\nTindakan ini akan memaksa semua pengguna log masuk semula.')) {
      return;
    }

    setActionInProgress('emergency_all');
    const res = await revokeAllSessionsOnBackend();
    setActionInProgress(null);

    if (res.success) {
      onShowToast(res.message);
      loadData();
    } else {
      alert(res.message || 'Gagal menamatkan sesi.');
    }
  };

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.eventAssigned || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === 'all' || m.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const activatedCount = members.filter(m => m.activated).length;
  const lockedCount = members.filter(m => m.isLocked).length;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50 text-slate-800">
      
      {/* Top Header & Metrics Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Pengurusan Kuasa & Keselamatan Akses Kontinjen
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Memantau sesi token aktif, penguatkuasaan had percubaan IC, pembatalan akses (revocation), dan log audit keselamatan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>Segar Semula</span>
            </button>

            <button
              onClick={handleEmergencyRevokeAll}
              disabled={actionInProgress === 'emergency_all'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              title="Tamatkan semua sesi aktif bagi semua pengguna lain serta-merta"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Tamatkan Semua Sesi (Kill-Switch)</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Jumlah Ahli Rasmi</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{members.length}</div>
            <div className="text-[10px] text-slate-500">Berdaftar di Pelayan</div>
          </div>

          <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Telah Diaktifkan</div>
            <div className="text-2xl font-black text-emerald-800 mt-0.5">{activatedCount}</div>
            <div className="text-[10px] text-emerald-600">Selesai verifikasi 1st access</div>
          </div>

          <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200">
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Sesi Token Aktif</div>
            <div className="text-2xl font-black text-blue-800 mt-0.5">{totalSessions}</div>
            <div className="text-[10px] text-blue-600">Sesi pelayan sah semasa</div>
          </div>

          <div className={`p-3.5 rounded-2xl border ${lockedCount > 0 ? 'bg-rose-50/80 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Akaun Dikunci</div>
            <div className={`text-2xl font-black mt-0.5 ${lockedCount > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
              {lockedCount}
            </div>
            <div className="text-[10px] text-slate-500">Melebihi had 5 percubaan</div>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => setActiveSubTab('members')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'members'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Senarai Ahli & Kuasa Akses ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'audit'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Jejak Audit Keselamatan ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('policies')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'policies'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Pematuhan 10 Prinsip Keselamatan</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: MEMBERS AUTHORIZATION LIST */}
      {activeSubTab === 'members' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, emel, atau acara..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['all', 'admin', 'pic', 'advisor', 'member'].map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => setFilterRole(roleKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer uppercase text-[10px] ${
                    filterRole === roleKey
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {roleKey === 'all' ? 'Semua' : roleKey}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Nama & Peranan</th>
                    <th className="px-4 py-3">Emel Google</th>
                    <th className="px-4 py-3">Kad Pengenalan (Masked)</th>
                    <th className="px-4 py-3">Status Pengaktifan</th>
                    <th className="px-4 py-3">Sesi Aktif</th>
                    <th className="px-4 py-3 text-right">Tindakan Pentadbiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((member) => {
                    const isProcessing = actionInProgress === member.email;
                    return (
                      <tr key={member.email} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Name & Role */}
                        <td className="px-4 py-3.5">
                          <div className="font-extrabold text-slate-900 text-sm">{member.nama}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                              member.role === 'admin'
                                ? 'bg-emerald-100 text-emerald-800'
                                : member.role === 'pic'
                                ? 'bg-purple-100 text-purple-800'
                                : member.role === 'advisor'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-cyan-100 text-cyan-800'
                            }`}>
                              {member.badge}
                            </span>
                            <span className="text-slate-500 text-[11px] truncate max-w-[180px]">
                              {member.eventAssigned || member.title}
                            </span>
                          </div>
                        </td>

                        {/* Google Email */}
                        <td className="px-4 py-3.5">
                          <div className="font-mono text-[11px] text-slate-700">{member.email}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Google OAuth Primary</div>
                        </td>

                        {/* Masked IC */}
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-slate-800 font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200 text-[11px]">
                            {member.noIcMasked}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          {member.isLocked ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-200">
                              <Lock className="w-3 h-3 text-rose-600" />
                              <span>Dikunci ({member.failedAttempts}/5)</span>
                            </span>
                          ) : member.activated ? (
                            <div>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Diaktifkan</span>
                              </span>
                              {member.activatedAt && (
                                <div className="text-[9px] text-slate-400 mt-0.5">
                                  {new Date(member.activatedAt).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' })}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Perlu 1st Suffix</span>
                            </span>
                          )}
                        </td>

                        {/* Active Sessions Count */}
                        <td className="px-4 py-3.5">
                          {member.activeSessionsCount > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                              <span>{member.activeSessionsCount} sesi</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </td>

                        {/* Admin Action Buttons */}
                        <td className="px-4 py-3.5 text-right space-x-1.5">
                          {member.isLocked && (
                            <button
                              onClick={() => handleUnlock(member)}
                              disabled={isProcessing}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer"
                              title="Buka sekatan akaun kerana had percubaan IC"
                            >
                              <Unlock className="w-3 h-3 inline mr-1" />
                              Buka Kunci
                            </button>
                          )}

                          {member.activated && (
                            <button
                              onClick={() => handleRevoke(member)}
                              disabled={isProcessing}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 font-bold text-[11px] transition-all cursor-pointer"
                              title="Tarik balik kebenaran akses dan tamatkan semua sesi aktif ahli ini"
                            >
                              <UserX className="w-3 h-3 inline mr-1" />
                              Tarik Balik Akses
                            </button>
                          )}
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

      {/* SUB-TAB 2: SECURITY AUDIT TRAIL */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                Rekod Jejak Audit Keselamatan Autentikasi
              </h4>
              <p className="text-xs text-slate-500">
                Log audit setiap percubaan pengesahan, penutupan akaun, pembatalan akses, dan daftar keluar.
              </p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
              {auditLogs.length} Peristiwa
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                Tiada rekod audit keselamatan pada masa ini.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className={`p-1.5 rounded-lg mt-0.5 ${
                      log.action === 'ACTIVATION_SUCCESS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.action === 'ACTIVATION_FAILED'
                        ? 'bg-amber-100 text-amber-800'
                        : log.action === 'ACCOUNT_LOCKED'
                        ? 'bg-rose-100 text-rose-800'
                        : log.action === 'REVOKE_ACCESS' || log.action === 'REVOKE_ALL_SESSIONS'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Activity className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.action}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString('ms-MY')}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{log.details}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Sasaran: <strong>{log.targetEmail}</strong> | Pelaku: {log.actor}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SECURITY DIRECTIVE COMPLIANCE POLICIES */}
      {activeSubTab === 'policies' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-slate-900 text-sm">
              Status Pematuhan 10 Prinsip Keselamatan Kontinjen
            </h4>
            <p className="text-xs text-slate-500">
              Direktif pengesahan akses telah dikuatkuasakan di peringkat pelayan (backend) dan antara muka pengguna (UI).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {[
              {
                id: 1,
                title: 'Google OAuth sebagai Identiti Utama',
                desc: 'Akaun Google disahkan secara rasmi menggunakan popup Google OAuth sebelum semakan keahlian kontinjen dimulakan.'
              },
              {
                id: 2,
                title: 'Pengesahan Emel & Keahlian di Pelayan',
                desc: 'Senarai roster disimpan dan disahkan sepenuhnya di backend (server.ts) secara eksklusif.'
              },
              {
                id: 3,
                title: 'Jangan Percaya Flag Akses Frontend',
                desc: 'Semua permintaan data dilindungi dengan token sesi kriptografi berasaskan pelayan (Bearer Authorization).'
              },
              {
                id: 4,
                title: 'Tiada Storan No. IC Penuh di Frontend',
                desc: 'No. IC penuh tidak pernah disimpan dalam localStorage atau sessionStorage pelayar.'
              },
              {
                id: 5,
                title: 'Tiada Storan Suffix IC dalam Plain Text',
                desc: '4 digit akhir IC dibersihkan daripada memori input serta-merta dan tidak disimpan dalam storan pelayar.'
              },
              {
                id: 6,
                title: 'Data Sensitif Tidak Didedahkan Sebarangan',
                desc: 'Endpoint roster dipadam daripada pendedahan awam, dan paparan No. IC ditopengkan (masked) kepada format X-XXXX.'
              },
              {
                id: 7,
                title: 'Had Percubaan (Attempt Limiting)',
                desc: 'Maksimum 5 percubaan tidak tepat sebelum akaun dikunci selama 15 minit secara automatik di pelayan.'
              },
              {
                id: 8,
                title: 'Keupayaan Membatalkan Akses (Revocation)',
                desc: 'Penyelaras Admin mempunyai fungsi serta-merta untuk membatalkan akses ahli dan membunuh sesi aktif.'
              },
              {
                id: 9,
                title: 'Penguatkuasaan Kuasa atas Data Terlindung',
                desc: 'Semua endpoint pengurusan dilindungi oleh middleware sesi dan pengesahan peranan (admin/pic/advisor/member).'
              },
              {
                id: 10,
                title: 'Kekalkan Peraturan Keselamatan Firestore',
                desc: 'Peraturan firestore.rules kekal kukuh dan menyokong integriti data borang dan senarai semak.'
              },
              {
                id: 11,
                title: 'Ketahanan Sesi Semasa Kemas Kini Versi (Zero Re-Activation)',
                desc: 'Apabila versi baharu platform dideploy, sesi keahlian sah dikekalkan sepenuhnya. Pengguna tidak dipaksa memasukkan semula 4-digit IC hanya kerana pembaharuan frontend.'
              }
            ].map((rule) => (
              <div key={rule.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </span>
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900">
                    {rule.id}. {rule.title}
                  </h5>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {rule.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
