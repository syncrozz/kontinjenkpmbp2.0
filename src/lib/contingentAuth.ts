import { signInWithGoogleAuth, signOutGoogleAuth } from './firebase';
import { ContingentUserProfile } from '../types';

export interface ContingentAuthSession {
  token: string;
  email: string;
  expiresAt: number;
  user: ContingentUserProfile;
}

export interface CheckEmailResult {
  registered: boolean;
  requiresActivation?: boolean;
  isLocked?: boolean;
  message?: string;
  session?: ContingentAuthSession;
  memberPreview?: {
    email: string;
    nama: string;
    role: 'member' | 'pic' | 'advisor' | 'admin';
    title: string;
    badge: string;
    eventAssigned?: string;
    noIcMasked?: string;
    isActivated?: boolean;
  };
}

export interface VerifyIcResult {
  success: boolean;
  message: string;
  locked?: boolean;
  remainingAttempts?: number;
  session?: ContingentAuthSession;
}

export interface AdminMemberItem {
  email: string;
  nama: string;
  role: 'member' | 'pic' | 'advisor' | 'admin';
  title: string;
  badge: string;
  eventAssigned?: string;
  program?: string;
  noIcMasked: string;
  activated: boolean;
  activatedAt?: string;
  activeSessionsCount: number;
  isLocked: boolean;
  failedAttempts: number;
  lockedUntil?: number;
}

export interface SecurityAuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  targetEmail: string;
  details?: string;
}

const STORAGE_SESSION_KEY = 'kpmbp_contingent_auth_session';

/**
 * Get cached session from localStorage if present
 */
export function getStoredSession(): ContingentAuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    const parsed: ContingentAuthSession = JSON.parse(raw);
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Save session to localStorage (NEVER stores IC or IC suffix)
 */
export function saveStoredSession(session: ContingentAuthSession): void {
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('kpmbp_contingent_user', JSON.stringify(session.user));
  } catch (e) {
    console.warn('Failed to save auth session to localStorage', e);
  }
}

/**
 * Clear session from localStorage
 */
export function clearStoredSession(): void {
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
    localStorage.removeItem('kpmbp_contingent_user');
  } catch (e) {
    console.warn('Failed to clear auth session', e);
  }
}

/**
 * Check if a Google email is in the authorized contingent membership roster
 */
export async function checkContingentEmail(email: string): Promise<CheckEmailResult> {
  try {
    const res = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        registered: data.registered || false,
        isLocked: data.isLocked || false,
        message: data.message || 'Emel Google tidak ditemui dalam senarai keahlian rasmi kontinjen.'
      };
    }
    return data;
  } catch (err: any) {
    console.warn('Network error checking email on backend:', err);
    return {
      registered: false,
      message: 'Ralat sambungan ke pelayan semasa menyemak emel kontinjen.'
    };
  }
}

/**
 * Validate 4-digit IC suffix securely on the backend with attempt rate limiting
 */
export async function verifyIcSuffixOnBackend(email: string, icSuffix: string): Promise<VerifyIcResult> {
  try {
    const res = await fetch('/api/auth/verify-ic-suffix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        icSuffix: icSuffix.trim()
      }),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn('Network error verifying IC suffix on backend:', err);
    return {
      success: false,
      message: 'Ralat sambungan ke pelayan semasa mengesahkan IC.'
    };
  }
}

/**
 * Validate existing stored session on revisit
 */
export async function verifySessionOnBackend(): Promise<ContingentUserProfile | null> {
  const stored = getStoredSession();
  if (!stored || !stored.token) return null;

  try {
    const res = await fetch('/api/auth/verify-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stored.token}`
      },
      body: JSON.stringify({
        token: stored.token
      }),
    });
    const data = await res.json();
    if (res.ok && data.valid && data.user) {
      return data.user;
    } else {
      // Session invalid, revoked, or expired on backend
      clearStoredSession();
      return null;
    }
  } catch (err) {
    // If offline or network glitch, honor cached valid session until explicit logout
    if (stored.expiresAt && Date.now() < stored.expiresAt) {
      return stored.user;
    }
    return null;
  }
}

/**
 * Complete Logout: Notify backend, sign out from Firebase Auth, and clear localStorage
 */
export async function logoutContingentSession(): Promise<void> {
  const stored = getStoredSession();
  if (stored?.token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${stored.token}`
        },
        body: JSON.stringify({ token: stored.token }),
      });
    } catch (e) {
      console.warn('Logout backend call failed:', e);
    }
  }
  await signOutGoogleAuth();
  clearStoredSession();
}

/**
 * Admin: Fetch full membership list with authorization status
 */
export async function fetchAdminMembers(): Promise<{
  success: boolean;
  members: AdminMemberItem[];
  totalActiveSessions: number;
  totalMembers: number;
  activatedCount: number;
  error?: string;
}> {
  const stored = getStoredSession();
  if (!stored?.token) {
    return { success: false, members: [], totalActiveSessions: 0, totalMembers: 0, activatedCount: 0, error: "Tiada token admin." };
  }

  try {
    const res = await fetch('/api/admin/members', {
      headers: {
        'Authorization': `Bearer ${stored.token}`
      }
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, members: [], totalActiveSessions: 0, totalMembers: 0, activatedCount: 0, error: err.message };
  }
}

/**
 * Admin: Revoke access for a contingent member immediately
 */
export async function revokeMemberAccessOnBackend(targetEmail: string): Promise<{ success: boolean; message: string }> {
  const stored = getStoredSession();
  if (!stored?.token) {
    return { success: false, message: "Akses tidak dibenarkan." };
  }

  try {
    const res = await fetch('/api/admin/revoke-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stored.token}`
      },
      body: JSON.stringify({ email: targetEmail })
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err.message || "Ralat membatalkan akses." };
  }
}

/**
 * Admin: Unlock a temporarily locked member account
 */
export async function unlockMemberOnBackend(targetEmail: string): Promise<{ success: boolean; message: string }> {
  const stored = getStoredSession();
  if (!stored?.token) {
    return { success: false, message: "Akses tidak dibenarkan." };
  }

  try {
    const res = await fetch('/api/admin/unlock-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stored.token}`
      },
      body: JSON.stringify({ email: targetEmail })
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err.message || "Ralat membuka sekatan." };
  }
}

/**
 * Admin: Emergency Revoke All Active Sessions
 */
export async function revokeAllSessionsOnBackend(): Promise<{ success: boolean; message: string }> {
  const stored = getStoredSession();
  if (!stored?.token) {
    return { success: false, message: "Akses tidak dibenarkan." };
  }

  try {
    const res = await fetch('/api/admin/revoke-all-sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stored.token}`
      }
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return { success: false, message: err.message || "Ralat menamatkan sesi." };
  }
}

/**
 * Admin: Fetch security audit logs
 */
export async function fetchAuditLogsOnBackend(): Promise<{ success: boolean; logs: SecurityAuditLogItem[] }> {
  const stored = getStoredSession();
  if (!stored?.token) {
    return { success: false, logs: [] };
  }

  try {
    const res = await fetch('/api/admin/audit-logs', {
      headers: {
        'Authorization': `Bearer ${stored.token}`
      }
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, logs: [] };
  }
}
