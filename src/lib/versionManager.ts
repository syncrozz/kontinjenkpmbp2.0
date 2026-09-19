/**
 * Platform Version & Asset Management Service
 * 
 * Objectives:
 * 1. Detect application version changes using the existing deployment architecture.
 * 2. Ensure updated assets can be loaded without stale cache traps.
 * 3. Preserve valid authentication sessions across version changes.
 * 4. Never clear contingent membership simply because the frontend version changed.
 * 5. Use hard refresh only as a recovery mechanism when dynamic imports fail or user explicitly accepts update.
 * 6. Never substitute hard refresh for server-side authorization.
 */

export interface VersionInfo {
  version: string;
  buildTime: string;
  environment: string;
  assetsHash?: string;
}

const CURRENT_CLIENT_VERSION = '2026.4.5';
const VERSION_STORAGE_KEY = 'kpmbp_platform_version_meta';

export interface VersionCheckResult {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  buildTime?: string;
  releaseNotes?: string;
}

type VersionUpdateListener = (info: VersionCheckResult) => void;
const listeners = new Set<VersionUpdateListener>();

let cachedServerVersion: VersionInfo | null = null;
let updateDetected = false;

/**
 * Register a listener for version updates
 */
export function onVersionUpdate(listener: VersionUpdateListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Fetch current version from server API
 */
export async function checkServerVersion(): Promise<VersionCheckResult | null> {
  try {
    const res = await fetch(`/api/version?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (!res.ok) return null;
    const data: VersionInfo = await res.json();
    cachedServerVersion = data;

    // Retrieve previous seen version
    let storedVersion = CURRENT_CLIENT_VERSION;
    try {
      const storedMeta = localStorage.getItem(VERSION_STORAGE_KEY);
      if (storedMeta) {
        const parsed = JSON.parse(storedMeta);
        if (parsed.version) storedVersion = parsed.version;
      }
    } catch {
      // Ignore localStorage errors
    }

    const hasNewVersion = Boolean(data.version && data.version !== storedVersion);

    const result: VersionCheckResult = {
      hasUpdate: hasNewVersion,
      currentVersion: storedVersion,
      latestVersion: data.version || CURRENT_CLIENT_VERSION,
      buildTime: data.buildTime
    };

    if (hasNewVersion && !updateDetected) {
      updateDetected = true;
      listeners.forEach((l) => l(result));
    }

    return result;
  } catch (err) {
    // Network errors or offline shouldn't trigger refresh or disruption
    return null;
  }
}

/**
 * Acknowledge version and save to localStorage WITHOUT affecting user session
 * CRITICAL: We preserve all contingent auth tokens and user data.
 */
export function acknowledgeVersion(newVersion: string): void {
  try {
    localStorage.setItem(VERSION_STORAGE_KEY, JSON.stringify({
      version: newVersion,
      acknowledgedAt: new Date().toISOString()
    }));
  } catch {}
}

/**
 * Soft update: Reloads the assets cleanly while strictly preserving the existing
 * authentication session token and user profile in storage.
 */
export function applyPlatformUpdate(targetVersion?: string): void {
  if (targetVersion) {
    acknowledgeVersion(targetVersion);
  }
  
  // Notice: We DO NOT call clearStoredSession() or clear contingent auth!
  // Session is completely safe and will be seamlessly validated upon reload.
  window.location.reload();
}

/**
 * Setup Global Dynamic Asset Chunk Failure Recovery
 * In Vite/SPAs, when a new deployment occurs, old JS chunk filenames may 404.
 * This handler catches Vite chunk load errors and reloads once gracefully,
 * without clearing contingent membership or requiring re-activation.
 */
export function setupAssetRecoveryListener(): void {
  if (typeof window === 'undefined') return;

  const CHUNK_RECOVERY_KEY = 'kpmbp_chunk_recovery_timestamp';

  window.addEventListener('error', (event) => {
    const errorMsg = event.message || '';
    const isChunkError = 
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('error loading dynamically imported module') ||
      errorMsg.includes('Loading chunk') ||
      errorMsg.includes('Unable to preload CSS');

    if (isChunkError) {
      const lastRecovery = sessionStorage.getItem(CHUNK_RECOVERY_KEY);
      const now = Date.now();
      
      // Prevent reload loops if real network outage (allow once per 30 seconds)
      if (!lastRecovery || now - parseInt(lastRecovery, 10) > 30000) {
        sessionStorage.setItem(CHUNK_RECOVERY_KEY, String(now));
        console.warn('New deployment assets detected. Recovering assets while preserving session...');
        window.location.reload();
      }
    }
  });

  // Background polling for new deployments every 5 minutes and upon tab refocus
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkServerVersion();
      }
    });

    window.addEventListener('focus', () => {
      checkServerVersion();
    });
  }

  // Periodic lightweight check (every 5 minutes)
  setInterval(() => {
    checkServerVersion();
  }, 5 * 60 * 1000);
}
