import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { 
  checkServerVersion, 
  onVersionUpdate, 
  applyPlatformUpdate, 
  acknowledgeVersion,
  VersionCheckResult 
} from '../../lib/versionManager';

export const VersionUpdateNotification: React.FC = () => {
  const [updateInfo, setUpdateInfo] = useState<VersionCheckResult | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Initial check on mount
    checkServerVersion().then((result) => {
      if (result && result.hasUpdate) {
        setUpdateInfo(result);
      }
    });

    // Subscribe to background updates
    const unsubscribe = onVersionUpdate((result) => {
      setUpdateInfo(result);
      setDismissed(false);
    });

    return () => unsubscribe();
  }, []);

  if (!updateInfo || !updateInfo.hasUpdate || dismissed) {
    return null;
  }

  const handleApply = () => {
    setIsUpdating(true);
    // Soft reload: fetches fresh assets while strictly preserving contingent auth session & data
    applyPlatformUpdate(updateInfo.latestVersion);
  };

  const handleDismiss = () => {
    setDismissed(true);
    // User can update later or it will apply on their next natural revisit
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-full animate-fadeIn">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-blue-500/40 space-y-3 ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">Versi Baru Platform Dikesan</h4>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                  v{updateInfo.latestVersion}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Kemas kini aset dan ciri terkini tersedia.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security & Persistence Guarantee */}
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
          <span>Sesi keahlian & token kontinjen anda dipelihara sepenuhnya.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleApply}
            disabled={isUpdating}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
            <span>{isUpdating ? 'Memuat Aset Baharu...' : 'Muat Semula Aset'}</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            Nanti
          </button>
        </div>
      </div>
    </div>
  );
};
