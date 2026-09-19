import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Layers, 
  Award, 
  Users, 
  Key, 
  Check, 
  Delete, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  ChevronRight,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import { ContingentUserRole, ContingentUserProfile } from '../../types';
import { CONTINGENT_ACCESS_ROLES, verifyContingentPasscode, EVENTS_DATA } from '../../data/soarData';
import { signInWithGoogleAuth } from '../../lib/firebase';
import { 
  checkContingentEmail, 
  verifyIcSuffixOnBackend, 
  saveStoredSession, 
  CheckEmailResult 
} from '../../lib/contingentAuth';

interface RoleSelectorGateProps {
  onSelectRole: (role: ContingentUserRole, name?: string, eventAssigned?: string) => void;
  currentRole?: ContingentUserRole;
}

export const RoleSelectorGate: React.FC<RoleSelectorGateProps> = ({
  onSelectRole,
  currentRole = 'public'
}) => {
  const [activeMode, setActiveMode] = useState<'google' | 'quick' | 'pin'>('google');
  
  // Google OAuth & Activation Flow State
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string>('');
  const [manualEmailInput, setManualEmailInput] = useState<string>('');
  const [checkResult, setCheckResult] = useState<CheckEmailResult | null>(null);
  const [icSuffixInput, setIcSuffixInput] = useState<string>('');
  const [activationError, setActivationError] = useState<string>('');
  const [activationSuccess, setActivationSuccess] = useState<string>('');
  const [isVerifyingIc, setIsVerifyingIc] = useState<boolean>(false);

  // Fallback PIN & Quick Mode State
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userNameInput, setUserNameInput] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('teater-islamik');

  // Step 2 & 3: Handle Google Sign-In with OAuth Popup
  const handleGoogleSignIn = async () => {
    setGoogleAuthLoading(true);
    setActivationError('');
    setCheckResult(null);

    try {
      const { user, error } = await signInWithGoogleAuth();
      if (error || !user || !user.email) {
        // If popup blocked or cancelled, offer direct email verification
        setActivationError(
          error?.includes('popup-closed') 
            ? 'Tetingkap popup Google ditutup sebelum selesai.' 
            : 'Sila masukkan emel Google anda di bawah atau pilih akaun contoh untuk semakan.'
        );
        setGoogleAuthLoading(false);
        return;
      }

      await processVerifiedEmail(user.email);
    } catch (err: any) {
      console.warn('Google Auth exception:', err);
      setActivationError('Ralat semasa menghubungkan akaun Google. Anda boleh menyemak menggunakan emel rasmi di bawah.');
    } finally {
      setGoogleAuthLoading(false);
    }
  };

  // Process normalized email against backend roster
  const processVerifiedEmail = async (email: string) => {
    const normalized = email.trim().toLowerCase();
    setAuthenticatedEmail(normalized);
    setGoogleAuthLoading(true);
    setActivationError('');

    const result = await checkContingentEmail(normalized);
    setCheckResult(result);
    setGoogleAuthLoading(false);

    if (result.isLocked) {
      setActivationError(
        result.message || 'Akaun ini dikunci sementara kerana melebihi had percubaan pengesahan. Sila hubungi Penyelaras Kontinjen KPMBP.'
      );
      return;
    }

    if (!result.registered) {
      setActivationError(
        result.message || `Akaun (${normalized}) tiada dalam senarai keahlian rasmi Kontinjen KPMBP SOAR 2026.`
      );
      return;
    }

    // If member is ALREADY activated on backend, the server immediately returns a cryptographically secure session
    if (result.session) {
      saveStoredSession(result.session);
      setActivationSuccess(`Identiti Google disahkan! Selamat kembali, ${result.session.user.name}.`);
      setTimeout(() => {
        onSelectRole(result.session!.user.role, result.session!.user.name, result.session!.user.eventAssigned);
      }, 700);
      return;
    }
  };

  // Step 5 & 6: Validate 4-digit IC Suffix securely on backend (initial activation only)
  const handleVerifyIcSuffix = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatedEmail) {
      setActivationError('Sila log masuk akaun Google dahulu.');
      return;
    }

    if (icSuffixInput.trim().length !== 4) {
      setActivationError('Sila masukkan tepat 4 digit akhir No. Kad Pengenalan anda.');
      return;
    }

    const enteredSuffix = icSuffixInput.trim();
    // Clear suffix from state immediately to prevent lingering in memory
    setIcSuffixInput('');
    setIsVerifyingIc(true);
    setActivationError('');

    const res = await verifyIcSuffixOnBackend(authenticatedEmail, enteredSuffix);
    setIsVerifyingIc(false);

    if (!res.success || !res.session) {
      setActivationError(res.message || '4 digit akhir IC tidak tepat. Sila semak semula.');
      return;
    }

    // Initial activation successful: server issues authenticated session token
    // (Never store full IC or IC suffix in localStorage)
    saveStoredSession(res.session);
    setActivationSuccess('Pengesahan berjaya! Keahlian kontinjen telah diaktifkan secara rasmi.');
    
    setTimeout(() => {
      onSelectRole(res.session!.user.role, res.session!.user.name, res.session!.user.eventAssigned);
    }, 900);
  };

  // Quick IC Keypad
  const handleIcSuffixKeypad = (digit: string) => {
    if (icSuffixInput.length < 4) {
      setIcSuffixInput(prev => prev + digit);
      setActivationError('');
    }
  };

  // Fallback PIN Handler
  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) {
      setLoginError('Sila masukkan PIN atau Kod Akses.');
      return;
    }

    const verified = verifyContingentPasscode(pinInput);
    if (verified) {
      setLoginError('');
      onSelectRole(
        verified.role, 
        userNameInput.trim() || undefined,
        verified.role === 'pic' ? selectedEventId : undefined
      );
    } else {
      setLoginError('PIN atau Kod Akses tidak sah.');
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (pinInput.length < 10) {
      setPinInput((prev) => prev + digit);
      setLoginError('');
    }
  };

  const handleQuickSelect = (role: ContingentUserRole) => {
    onSelectRole(
      role, 
      userNameInput.trim() || undefined,
      role === 'pic' ? selectedEventId : undefined
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Title & Introduction */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Sistem Kawalan Akses Rasmi Kontinjen KPMBP • SOAR 2026</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
            Akses Keahlian Kontinjen
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Daftar masuk menggunakan akaun Google rasmi anda dan aktifkan keahlian dengan 4 digit akhir No. Kad Pengenalan. Sesi anda akan kekal aktif secara automatik untuk lawatan seterusnya.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1.5 bg-slate-200/90 rounded-2xl max-w-lg mx-auto w-full gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveMode('google');
              setActivationError('');
            }}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'google'
                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4 text-rose-500" />
            <span>Google OAuth (Rasmi)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('quick')}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'quick'
                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Akses Pantas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('pin')}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeMode === 'pin'
                ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4 text-amber-600" />
            <span>PIN Sandaran</span>
          </button>
        </div>

        {/* PRIMARY TAB: GOOGLE OAUTH + 4-DIGIT IC ACTIVATION FLOW */}
        {activeMode === 'google' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all max-w-xl mx-auto w-full">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 sm:p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto border border-white/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg sm:text-xl font-black">
                Daftar Masuk Kontinjen KPMBP
              </h4>
              <p className="text-xs text-blue-100 max-w-md mx-auto">
                Pengesahan 2-Langkah: Akaun Google Disahkan + 4 Digit Akhir Kad Pengenalan
              </p>

              {/* Visual Workflow Explainer (First Access vs Subsequent Access) */}
              <div className="pt-2 text-left bg-blue-950/40 rounded-2xl p-3 border border-white/15 text-[11px] space-y-2.5">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 uppercase tracking-wider text-[10px]">
                    <Sparkles className="w-3 h-3" />
                    <span>Akses Kali Pertama (First Access):</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1 text-slate-200 mt-1 font-medium">
                    <span className="bg-white/15 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">1. Google Login</span>
                    <ArrowRight className="w-2.5 h-2.5 text-blue-300" />
                    <span className="bg-white/15 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">2. Semakan Emel</span>
                    <ArrowRight className="w-2.5 h-2.5 text-blue-300" />
                    <span className="bg-white/15 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">3. 4-Digit IC</span>
                    <ArrowRight className="w-2.5 h-2.5 text-blue-300" />
                    <span className="bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">4. Diaktifkan</span>
                    <ArrowRight className="w-2.5 h-2.5 text-blue-300" />
                    <span className="bg-blue-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-bold">5. Contingent Workspace</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-300 uppercase tracking-wider text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Akses Seterusnya (Subsequent Access):</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-1 text-slate-200 mt-1 font-medium">
                    <span className="bg-white/15 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">1. Buka Platform</span>
                    <ArrowRight className="w-2.5 h-2.5 text-emerald-300" />
                    <span className="bg-white/15 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">2. Pulihkan Sesi Sedia Ada</span>
                    <ArrowRight className="w-2.5 h-2.5 text-emerald-300" />
                    <span className="bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">3. Sahkan Kebenaran</span>
                    <ArrowRight className="w-2.5 h-2.5 text-emerald-300" />
                    <span className="bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-bold">4. Terus Buka Workspace</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7 space-y-6">

              {/* Feedback messages */}
              {activationSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 text-xs font-semibold animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-emerald-800">Pengesahan Berjaya!</p>
                    <p className="mt-0.5">{activationSuccess}</p>
                  </div>
                </div>
              )}

              {activationError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 text-xs font-semibold">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm text-rose-800">Perhatian Pengesahan</p>
                    <p className="mt-0.5">{activationError}</p>
                  </div>
                </div>
              )}

              {/* STEP 1: If Google Account not yet verified */}
              {!checkResult?.registered && (
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Langkah 1 daripada 2
                    </p>
                    <h5 className="text-sm font-bold text-slate-900">
                      Sahkan Akaun Google Anda
                    </h5>
                    <p className="text-xs text-slate-600">
                      Klik butang di bawah untuk log masuk dengan Google OAuth.
                    </p>
                  </div>

                  {/* Primary Google Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleAuthLoading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border-2 border-slate-200 hover:border-slate-300 shadow-sm active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {googleAuthLoading ? (
                      <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                    )}
                    <span>{googleAuthLoading ? 'Mengesahkan dengan Google...' : 'Log Masuk Menggunakan Google'}</span>
                  </button>

                  {/* Registered Account Quick Select & Manual Emel Lookup */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Atau Pilih Akaun Berdaftar Kontinjen:
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => processVerifiedEmail('kpmbppsn@gmail.com')}
                        className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50/80 hover:bg-emerald-50/60 transition-all cursor-pointer"
                      >
                        <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                          <span>Penyelaras (Admin)</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Admin</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">kpmbppsn@gmail.com</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => processVerifiedEmail('aisha.razak.kpmbp@gmail.com')}
                        className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-cyan-400 bg-slate-50/80 hover:bg-cyan-50/60 transition-all cursor-pointer"
                      >
                        <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                          <span>Aisha (Peserta Teater)</span>
                          <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded font-bold">Ahli</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">aisha.razak.kpmbp@gmail.com</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => processVerifiedEmail('farhan.nordin.kpmbp@gmail.com')}
                        className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-cyan-400 bg-slate-50/80 hover:bg-cyan-50/60 transition-all cursor-pointer"
                      >
                        <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                          <span>Farhan (Peserta BOTB)</span>
                          <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded font-bold">Ahli</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">farhan.nordin.kpmbp@gmail.com</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => processVerifiedEmail('amirul.mukmin.kpmbp@gmail.com')}
                        className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50/80 hover:bg-purple-50/60 transition-all cursor-pointer"
                      >
                        <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                          <span>Amirul (Event PIC)</span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">PIC</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">amirul.mukmin.kpmbp@gmail.com</div>
                      </button>
                    </div>

                    {/* Manual Emel Check Input */}
                    <div className="pt-2 flex gap-2">
                      <input
                        type="email"
                        placeholder="Masukkan emel Google berdaftar..."
                        value={manualEmailInput}
                        onChange={(e) => setManualEmailInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && manualEmailInput.trim()) {
                            processVerifiedEmail(manualEmailInput);
                          }
                        }}
                        className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (manualEmailInput.trim()) {
                            processVerifiedEmail(manualEmailInput);
                          }
                        }}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Semak
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Google Verified! Request 4-digit IC suffix for initial activation */}
              {checkResult?.registered && checkResult.memberPreview && (
                <div className="space-y-5">
                  
                  {/* Verified Member Badge Card */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                          {checkResult.memberPreview.badge}
                        </span>
                        <span className="text-xs font-bold text-blue-900 truncate">
                          {authenticatedEmail}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        {checkResult.memberPreview.nama}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {checkResult.memberPreview.title} • {checkResult.memberPreview.eventAssigned}
                      </p>
                      <p className="text-[11px] text-slate-500 pt-0.5">
                        No. Kad Pengenalan Berdaftar: <strong>{checkResult.memberPreview.noIcMasked}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCheckResult(null);
                        setAuthenticatedEmail('');
                        setIcSuffixInput('');
                        setActivationError('');
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-800 underline font-semibold shrink-0"
                    >
                      Tukar Emel
                    </button>
                  </div>

                  {/* Suffix Form */}
                  <form onSubmit={handleVerifyIcSuffix} className="space-y-4">
                    <div className="space-y-1.5 text-center">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center justify-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Pengesahan Keselamatan Dua Faktor</span>
                      </p>
                      <h5 className="text-sm font-bold text-slate-900">
                        Masukkan 4 Digit Terakhir No. Kad Pengenalan
                      </h5>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Sila masukkan 4 nombor terakhir IC anda (contoh: jika IC 050210-01-<strong>8892</strong>, masukkan <strong>8892</strong>) untuk mengaktifkan sesi.
                      </p>
                    </div>

                    {/* 4-Digit Display */}
                    <div className="flex justify-center gap-2.5 sm:gap-3 py-2">
                      {[0, 1, 2, 3].map((index) => {
                        const digit = icSuffixInput[index];
                        return (
                          <div
                            key={index}
                            className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 flex items-center justify-center font-mono text-2xl font-black transition-all ${
                              digit
                                ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm'
                                : index === icSuffixInput.length
                                ? 'border-blue-500 bg-white ring-4 ring-blue-100 animate-pulse'
                                : 'border-slate-200 bg-slate-50 text-slate-300'
                            }`}
                          >
                            {digit ? '•' : ''}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick Onscreen Keypad for 4-digit IC Suffix */}
                    <div className="max-w-xs mx-auto space-y-1.5">
                      <div className="grid grid-cols-3 gap-1.5">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                          <button
                            key={digit}
                            type="button"
                            onClick={() => handleIcSuffixKeypad(digit)}
                            className="py-2.5 bg-slate-100 hover:bg-blue-50 active:bg-blue-100 text-slate-800 font-extrabold text-sm rounded-xl border border-slate-200 transition-all cursor-pointer active:scale-95"
                          >
                            {digit}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setIcSuffixInput('');
                            setActivationError('');
                          }}
                          className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl border border-slate-200"
                        >
                          Padam
                        </button>
                        <button
                          type="button"
                          onClick={() => handleIcSuffixKeypad('0')}
                          className="py-2.5 bg-slate-100 hover:bg-blue-50 active:bg-blue-100 text-slate-800 font-extrabold text-sm rounded-xl border border-slate-200 cursor-pointer active:scale-95"
                        >
                          0
                        </button>
                        <button
                          type="button"
                          onClick={() => setIcSuffixInput(prev => prev.slice(0, -1))}
                          className="py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 flex items-center justify-center"
                        >
                          <Delete className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingIc || icSuffixInput.length !== 4}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isVerifyingIc ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                      <span>{isVerifyingIc ? 'Mengesahkan di Pelayan...' : 'Sahkan & Aktifkan Keahlian'}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Info Note on Session Persistence */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-600 text-[11px] flex items-start gap-2.5 leading-relaxed">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Kerahsiaan Dijamin:</strong> Pengesahan 4 digit IC disahkan terus di pelayan backend dan tidak didedahkan kepada pihak ketiga. Selepas diaktifkan, sesi anda akan kekal disimpan dan anda tidak perlu memasukkan PIN berulang kali.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: QUICK ROLE CARDS (FOR RAPID TESTING) */}
        {activeMode === 'quick' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-xs text-blue-900 flex items-center justify-between">
              <span>Mode Akses Pantas (Simulator untuk semakan fungsi modul tanpa login Google):</span>
              <button
                type="button"
                onClick={() => setActiveMode('google')}
                className="font-bold underline text-blue-700 hover:text-blue-900"
              >
                Guna Google OAuth Rasmi
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              
              {/* Ahli Kontinjen */}
              <div className="bg-white border-2 border-cyan-200 hover:border-cyan-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full border border-cyan-200">
                      Peserta & Krew
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Ahli Kontinjen</h4>
                    <p className="text-xs text-cyan-700 font-semibold">Peserta Pelajar (35 Pax)</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Jadual latihan fasa 3, kit dokumen, surat pelepasan, dan senarai semak individu.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('member')}
                  className="mt-4 w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Masuk Sebagai Ahli</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Event PIC */}
              <div className="bg-white border-2 border-purple-200 hover:border-purple-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                      Pengurus Acara
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Event PIC</h4>
                    <p className="text-xs text-purple-700 font-semibold">Pegawai Pengurus Acara</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Kawalan calon pendaftaran bakat, video uji bakat, dan alert tarikh akhir serahan.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('pic')}
                  className="mt-4 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Masuk Sebagai Event PIC</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Advisor */}
              <div className="bg-white border-2 border-amber-200 hover:border-amber-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                      Pengiring
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Advisor / Pengiring</h4>
                    <p className="text-xs text-amber-700 font-semibold">Pensyarah Pengiring Kontinjen</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Pemantauan kesiapsiagaan operasi kontinjen dan dokumen pengiring rasmi.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('advisor')}
                  className="mt-4 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Masuk Sebagai Advisor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Admin */}
              <div className="bg-white border-2 border-emerald-200 hover:border-emerald-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      Penyelaras
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Pusat Pentadbiran</h4>
                    <p className="text-xs text-emerald-700 font-semibold">Penyelaras Kontinjen KPMBP</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Kawalan 6 fasa operasi, paparan modul dashboard, dan data pendaftaran penuh.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickSelect('admin')}
                  className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Masuk Sebagai Admin</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MODE 3: BACKUP PIN ENTRY */}
        {activeMode === 'pin' && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-sm mx-auto w-full">
            <div className="text-center space-y-1">
              <h4 className="font-bold text-slate-900 text-base">
                Kemasukan PIN Sandaran
              </h4>
              <p className="text-xs text-slate-500">
                Gunakan PIN sandaran sekiranya sambungan internet terhad.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="flex justify-center">
                <input
                  type="password"
                  maxLength={10}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN"
                  className="w-40 text-center text-xl font-mono tracking-widest px-4 py-2.5 bg-slate-50 border-2 border-slate-300 rounded-xl font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleKeypadPress(digit)}
                    className="py-2.5 bg-slate-100 hover:bg-blue-50 text-slate-800 font-extrabold text-sm rounded-xl border border-slate-200 cursor-pointer active:scale-95"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPinInput('')}
                  className="py-2.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl border border-slate-200"
                >
                  Padam
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="py-2.5 bg-slate-100 text-slate-800 font-extrabold text-sm rounded-xl border border-slate-200 active:scale-95"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => setPinInput(prev => prev.slice(0, -1))}
                  className="py-2.5 bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 flex items-center justify-center"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Sahkan PIN
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
