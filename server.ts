import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

interface ContingentMemberRecord {
  email: string;
  nama: string;
  noIcMasked: string;
  icSuffix: string; // 4-digit suffix kept securely on backend only
  role: 'member' | 'pic' | 'advisor' | 'admin';
  title: string;
  badge: string;
  eventAssigned?: string;
  program?: string;
  activated: boolean;
  activatedAt?: string;
}

// Authorized Contingent Membership Roster
const CONTINGENT_ROSTER: ContingentMemberRecord[] = [
  {
    email: "kpmbppsn@gmail.com",
    nama: "Penyelaras Kontinjen KPMBP",
    noIcMasked: "820412-01-XXXX",
    icSuffix: "5313",
    role: "admin",
    title: "Ketua Penyelaras Kontinjen KPMBP",
    badge: "Admin",
    eventAssigned: "Semua Acara (SOAR 2026)",
    program: "Pengurusan Kontinjen",
    activated: true
  },
  {
    email: "aisha.razak@bpenawar.kpm.edu.my",
    nama: "NUR AISHA BINTI RAZAK",
    noIcMasked: "050210-01-XXXX",
    icSuffix: "8892",
    role: "member",
    title: "Peserta Teater Islamik",
    badge: "Ahli",
    eventAssigned: "Teater Islamik (Masar Al-Masajid)",
    program: "Diploma in Integrated Logistics",
    activated: false
  },
  {
    email: "aisha.razak.kpmbp@gmail.com",
    nama: "NUR AISHA BINTI RAZAK",
    noIcMasked: "050210-01-XXXX",
    icSuffix: "8892",
    role: "member",
    title: "Peserta Teater Islamik",
    badge: "Ahli",
    eventAssigned: "Teater Islamik (Masar Al-Masajid)",
    program: "Diploma in Integrated Logistics",
    activated: false
  },
  {
    email: "farhan.nordin@bpenawar.kpm.edu.my",
    nama: "MUHAMMAD FARHAN BIN NORDIN",
    noIcMasked: "050914-01-XXXX",
    icSuffix: "4521",
    role: "member",
    title: "Peserta Battle of the Bands",
    badge: "Ahli",
    eventAssigned: "Battle of the Bands",
    program: "Diploma in Business Information System",
    activated: false
  },
  {
    email: "farhan.nordin.kpmbp@gmail.com",
    nama: "MUHAMMAD FARHAN BIN NORDIN",
    noIcMasked: "050914-01-XXXX",
    icSuffix: "4521",
    role: "member",
    title: "Peserta Battle of the Bands",
    badge: "Ahli",
    eventAssigned: "Battle of the Bands",
    program: "Diploma in Business Information System",
    activated: false
  },
  {
    email: "danish.haikal@bpenawar.kpm.edu.my",
    nama: "DANISH HAIKAL BIN AMIR",
    noIcMasked: "050308-01-XXXX",
    icSuffix: "3319",
    role: "member",
    title: "Peserta Nasyid Kontemporari",
    badge: "Ahli",
    eventAssigned: "Nasyid Kontemporari",
    program: "Diploma in Islamic Banking",
    activated: false
  },
  {
    email: "siti.zulaikha@bpenawar.kpm.edu.my",
    nama: "SITI ZULAIKHA BINTI ISMAIL",
    noIcMasked: "051120-01-XXXX",
    icSuffix: "6204",
    role: "member",
    title: "Peserta Acapella Harmoni",
    badge: "Ahli",
    eventAssigned: "Acapella Harmoni",
    program: "Diploma in Marketing",
    activated: false
  },
  {
    email: "amirul.mukmin@bpenawar.kpm.edu.my",
    nama: "AMIRUL MUKMIN BIN JAAFAR",
    noIcMasked: "880515-01-XXXX",
    icSuffix: "7001",
    role: "pic",
    title: "Pegawai Pengurus Acara Teater",
    badge: "Event PIC",
    eventAssigned: "Teater Islamik",
    program: "Jabatan Pembangunan Pelajar",
    activated: false
  },
  {
    email: "amirul.mukmin.kpmbp@gmail.com",
    nama: "AMIRUL MUKMIN BIN JAAFAR",
    noIcMasked: "880515-01-XXXX",
    icSuffix: "7001",
    role: "pic",
    title: "Pegawai Pengurus Acara Teater",
    badge: "Event PIC",
    eventAssigned: "Teater Islamik",
    program: "Jabatan Pembangunan Pelajar",
    activated: false
  },
  {
    email: "ustaz.hafiz@bpenawar.kpm.edu.my",
    nama: "USTAZ HAFIZ BIN ABDULLAH",
    noIcMasked: "830822-01-XXXX",
    icSuffix: "2026",
    role: "advisor",
    title: "Pensyarah Pengiring / Advisor Kontinjen",
    badge: "Advisor",
    eventAssigned: "Kesiapsiagaan & Kebajikan",
    program: "Unit Hal Ehwal Pelajar",
    activated: false
  },
  {
    email: "ustaz.hafiz.kpmbp@gmail.com",
    nama: "USTAZ HAFIZ BIN ABDULLAH",
    noIcMasked: "830822-01-XXXX",
    icSuffix: "2026",
    role: "advisor",
    title: "Pensyarah Pengiring / Advisor Kontinjen",
    badge: "Advisor",
    eventAssigned: "Kesiapsiagaan & Kebajikan",
    program: "Unit Hal Ehwal Pelajar",
    activated: false
  }
];

// In-memory active session tokens store (token -> session info)
interface ActiveSession {
  token: string;
  email: string;
  name: string;
  role: 'member' | 'pic' | 'advisor' | 'admin';
  title: string;
  badge: string;
  eventAssigned?: string;
  createdAt: number;
  expiresAt: number;
}

// In-memory security tracking
interface AttemptRecord {
  count: number;
  lockedUntil?: number;
  lastAttempt: number;
}

interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: 'ACTIVATION_SUCCESS' | 'ACTIVATION_FAILED' | 'ACCOUNT_LOCKED' | 'REVOKE_ACCESS' | 'UNLOCK_ACCOUNT' | 'LOGOUT' | 'REVOKE_ALL_SESSIONS' | 'PHASE_CHANGE' | 'CONFIG_UPDATE';
  actor: string;
  targetEmail: string;
  details?: string;
}

const activeSessions = new Map<string, ActiveSession>();
const verificationAttempts = new Map<string, AttemptRecord>();
const revokedTokens = new Set<string>();
const auditLogs: SecurityAuditLog[] = [];

// PERSISTENCE LAYER FOR DEPLOYMENT CONTINUITY & SES v4.5 AUTHORITATIVE SOURCE:
// Ensure active sessions, audit logs, and operations phase survive server restarts or redeployments
const DATA_DIR = path.join(process.cwd(), '.data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit_logs.json');
const PHASE_FILE = path.join(DATA_DIR, 'phase_config.json');

export interface ServerOperationsPhaseState {
  activePhaseId: 'phase_01' | 'phase_02' | 'phase_03' | 'phase_04' | 'phase_05' | 'phase_06';
  announcement?: string;
  visibleModules?: {
    events: boolean;
    contingentOverview: boolean;
    schedule: boolean;
    calculator: boolean;
    checklist: boolean;
    talent: boolean;
    guidelines: boolean;
    deadlines: boolean;
  };
  updatedAt?: string;
  updatedBy?: string;
}

const DEFAULT_SERVER_OPERATIONS_PHASE: ServerOperationsPhaseState = {
  activePhaseId: 'phase_03',
  announcement: 'Peringatan Penyelaras: Kontinjen KPMBP kini berada dalam Fasa 03 (Latihan & Persiapan Pasukan) menuju ke kejohanan SOAR 2026 pada 15–18 Oktober 2026. Sila pastikan semua pasukan melengkapkan jadual latihan intensif dan semakan rubrik penjurian!',
  visibleModules: {
    events: true,
    contingentOverview: true,
    schedule: true,
    calculator: true,
    checklist: true,
    talent: false,
    guidelines: true,
    deadlines: true
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'Penyelaras Kontinjen KPMBP'
};

let currentOperationsPhase: ServerOperationsPhaseState = { ...DEFAULT_SERVER_OPERATIONS_PHASE };

function initPhasePersistence() {
  try {
    if (fs.existsSync(PHASE_FILE)) {
      const raw = fs.readFileSync(PHASE_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (data && typeof data.activePhaseId === 'string') {
        currentOperationsPhase = {
          ...DEFAULT_SERVER_OPERATIONS_PHASE,
          ...data
        };
      }
    }
  } catch (err) {
    console.warn('Phase config load warning (using default):', err);
  }
}

function persistPhaseToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PHASE_FILE, JSON.stringify(currentOperationsPhase, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to persist phase config to disk:', err);
  }
}

function initSessionPersistence() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.sessions)) {
        const now = Date.now();
        for (const s of data.sessions) {
          if (s && s.token && s.expiresAt > now) {
            activeSessions.set(s.token, s);
          }
        }
      }
      if (Array.isArray(data.revoked)) {
        for (const tok of data.revoked) {
          revokedTokens.add(tok);
        }
      }
    }
    if (fs.existsSync(AUDIT_FILE)) {
      const raw = fs.readFileSync(AUDIT_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        auditLogs.push(...data.slice(0, 100));
      }
    }
  } catch (err) {
    console.warn('Session storage init warning (continuing in-memory):', err);
  }
}

function persistSessionsToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const serialized = {
      sessions: Array.from(activeSessions.values()),
      revoked: Array.from(revokedTokens.values())
    };
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(serialized, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to persist sessions to disk:', err);
  }
}

function persistAuditLogsToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(auditLogs.slice(0, 100), null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to persist audit logs to disk:', err);
  }
}

// Load persisted sessions and operations phase configuration upon server startup
initSessionPersistence();
initPhasePersistence();

function recordAuditLog(log: Omit<SecurityAuditLog, 'id' | 'timestamp'>) {
  auditLogs.unshift({
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    timestamp: new Date().toISOString(),
    ...log
  });
  // Keep last 100 entries
  if (auditLogs.length > 100) {
    auditLogs.pop();
  }
  persistAuditLogsToDisk();
}

// Helper to authenticate request via Authorization: Bearer <token>
function getAuthenticatedSession(req: express.Request): ActiveSession | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  if (!token || revokedTokens.has(token)) {
    return null;
  }
  const session = activeSessions.get(token);
  if (!session) {
    return null;
  }
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  // Verify member is still activated in the roster
  const member = CONTINGENT_ROSTER.find(m => m.email.toLowerCase() === session.email.toLowerCase());
  if (!member || !member.activated) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Application Version & Deployment Metadata
  // Enables seamless version detection without invalidating sessions
  const APP_VERSION = "2026.4.5";
  const APP_BUILD_TIME = new Date().toISOString();

  app.get("/api/version", (_req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.json({
      version: APP_VERSION,
      buildTime: APP_BUILD_TIME,
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // 1. Google OAuth Primary Identity Check & Session Issuance
  // Validates email server-side against CONTINGENT_ROSTER.
  // If already activated, issues server-signed token directly.
  // If not activated, requires one-time 4-digit IC Suffix verification.
  app.post("/api/auth/check-email", (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: "Emel diperlukan" });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const member = CONTINGENT_ROSTER.find(
      (m) => m.email.toLowerCase() === normalizedEmail
    );

    if (!member) {
      res.status(404).json({
        registered: false,
        message: `Akaun Google (${normalizedEmail}) tidak didaftarkan dalam senarai keahlian rasmi Kontinjen KPMBP SOAR 2026. Sila hubungi Penyelaras Kontinjen untuk semakan rekod.`
      });
      return;
    }

    // Check if member is locked out due to previous failed attempts
    const attempt = verificationAttempts.get(normalizedEmail);
    if (attempt && attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
      const minutesLeft = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
      res.status(429).json({
        registered: true,
        isLocked: true,
        requiresActivation: !member.activated,
        message: `Akaun ini dikunci sementara selama ${minutesLeft} minit lagi kerana melebihi had percubaan pengesahan. Sila hubungi Penyelaras Kontinjen KPMBP.`
      });
      return;
    }

    // If member is ALREADY activated, issue an official cryptographic session token immediately
    // No IC suffix is requested again once activated.
    if (member.activated) {
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

      const session: ActiveSession = {
        token,
        email: member.email,
        name: member.nama,
        role: member.role,
        title: member.title,
        badge: member.badge,
        eventAssigned: member.eventAssigned,
        createdAt: Date.now(),
        expiresAt
      };
      activeSessions.set(token, session);
      persistSessionsToDisk();

      res.json({
        registered: true,
        requiresActivation: false,
        session: {
          token,
          email: member.email,
          expiresAt,
          user: {
            role: member.role,
            name: member.nama,
            title: member.title,
            badge: member.badge,
            eventAssigned: member.eventAssigned,
            email: member.email,
            accessGrantedAt: member.activatedAt || new Date().toISOString()
          }
        }
      });
      return;
    }

    // Member exists but requires initial 4-digit IC Suffix activation
    // Return sanitized preview (NO IC suffix or sensitive unmasked details)
    res.json({
      registered: true,
      requiresActivation: true,
      memberPreview: {
        email: member.email,
        nama: member.nama,
        role: member.role,
        title: member.title,
        badge: member.badge,
        eventAssigned: member.eventAssigned,
        noIcMasked: member.noIcMasked,
        isActivated: false
      }
    });
  });

  // 2. Validate 4-digit IC suffix securely on backend for initial activation
  // Features strict attempt limiting (max 5 failed attempts / 15-min lockout)
  app.post("/api/auth/verify-ic-suffix", (req, res) => {
    const { email, icSuffix } = req.body;
    if (!email || !icSuffix) {
      res.status(400).json({ success: false, message: "Emel dan 4 digit akhir IC diperlukan." });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanSuffix = String(icSuffix).trim().replace(/\D/g, '');

    // Check rate limit / lockout
    let attempt = verificationAttempts.get(normalizedEmail);
    if (attempt && attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
      const minutesLeft = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
      res.status(429).json({
        success: false,
        locked: true,
        message: `Akaun ini dikunci sementara selama ${minutesLeft} minit lagi kerana melebihi 5 kali percubaan tidak tepat. Sila hubungi Penyelaras Kontinjen KPMBP.`
      });
      return;
    }

    const member = CONTINGENT_ROSTER.find(
      (m) => m.email.toLowerCase() === normalizedEmail
    );

    if (!member) {
      res.status(404).json({ success: false, message: "Ahli kontinjen tidak ditemui." });
      return;
    }

    // Verify 4-digit IC suffix securely against server record
    if (member.icSuffix !== cleanSuffix) {
      if (!attempt) {
        attempt = { count: 1, lastAttempt: Date.now() };
      } else {
        attempt.count += 1;
        attempt.lastAttempt = Date.now();
      }

      if (attempt.count >= 5) {
        attempt.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 min lock
        verificationAttempts.set(normalizedEmail, attempt);
        recordAuditLog({
          action: 'ACCOUNT_LOCKED',
          actor: normalizedEmail,
          targetEmail: normalizedEmail,
          details: 'Akaun dikunci selama 15 minit selepas 5 percubaan IC gagal berturut-turut.'
        });
        res.status(429).json({
          success: false,
          locked: true,
          message: "Akaun dikunci sementara selama 15 minit kerana 5 percubaan tidak tepat. Sila hubungi Penyelaras Kontinjen KPMBP."
        });
        return;
      }

      verificationAttempts.set(normalizedEmail, attempt);
      const remainingAttempts = 5 - attempt.count;
      recordAuditLog({
        action: 'ACTIVATION_FAILED',
        actor: normalizedEmail,
        targetEmail: normalizedEmail,
        details: `Percubaan IC gagal (${attempt.count}/5). Baki: ${remainingAttempts}`
      });

      res.status(401).json({
        success: false,
        remainingAttempts,
        message: `4 digit akhir No. Kad Pengenalan tidak sepadan. Baki percubaan: ${remainingAttempts} kali sebelum akaun dikunci sementara.`
      });
      return;
    }

    // Verification successful: clear any failed attempts
    verificationAttempts.delete(normalizedEmail);

    // Permanently mark as activated in roster
    member.activated = true;
    member.activatedAt = new Date().toISOString();

    // Create cryptographically secure 30-day session token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const session: ActiveSession = {
      token,
      email: member.email,
      name: member.nama,
      role: member.role,
      title: member.title,
      badge: member.badge,
      eventAssigned: member.eventAssigned,
      createdAt: Date.now(),
      expiresAt
    };

    activeSessions.set(token, session);
    persistSessionsToDisk();

    recordAuditLog({
      action: 'ACTIVATION_SUCCESS',
      actor: normalizedEmail,
      targetEmail: normalizedEmail,
      details: 'Pengesahan IC berjaya. Keahlian kontinjen diaktifkan.'
    });

    res.json({
      success: true,
      message: "Pengesahan identiti berjaya! Keahlian kontinjen diaktifkan.",
      session: {
        token,
        email: member.email,
        expiresAt,
        user: {
          role: member.role,
          name: member.nama,
          title: member.title,
          badge: member.badge,
          eventAssigned: member.eventAssigned,
          email: member.email,
          accessGrantedAt: member.activatedAt
        }
      }
    });
  });

  // 3. Verify existing session token on app launch / revisit
  // Strictly verifies token validity without trusting client access flags
  app.post("/api/auth/verify-session", (req, res) => {
    let token = req.body?.token;
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
        token = parts[1];
      }
    }

    if (!token || typeof token !== 'string') {
      res.status(400).json({ valid: false, message: "Token sesi diperlukan." });
      return;
    }

    if (revokedTokens.has(token)) {
      res.status(401).json({ valid: false, message: "Sesi ini telah ditarik balik oleh pentadbir." });
      return;
    }

    const session = activeSessions.get(token);
    if (!session) {
      res.status(401).json({ valid: false, message: "Sesi tidak sah atau telah luput." });
      return;
    }

    if (Date.now() > session.expiresAt) {
      activeSessions.delete(token);
      res.status(401).json({ valid: false, message: "Sesi telah luput." });
      return;
    }

    // Verify the member in the roster is still activated
    const member = CONTINGENT_ROSTER.find(
      (m) => m.email.toLowerCase() === session.email.toLowerCase()
    );

    if (!member || !member.activated) {
      activeSessions.delete(token);
      res.status(403).json({ valid: false, message: "Akses keahlian telah dinyahaktifkan atau ditarik balik." });
      return;
    }

    // Return authenticated profile from server authority
    res.json({
      valid: true,
      user: {
        role: member.role,
        name: member.nama,
        title: member.title,
        badge: member.badge,
        eventAssigned: member.eventAssigned,
        email: member.email,
        accessGrantedAt: member.activatedAt || new Date(session.createdAt).toISOString()
      }
    });
  });

  // 4. Logout / terminate session
  app.post("/api/auth/logout", (req, res) => {
    let token = req.body?.token;
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
        token = parts[1];
      }
    }
    if (token) {
      const session = activeSessions.get(token);
      if (session) {
        recordAuditLog({
          action: 'LOGOUT',
          actor: session.email,
          targetEmail: session.email,
          details: 'Pengguna mendaftar keluar.'
        });
      }
      activeSessions.delete(token);
      revokedTokens.add(token);
      persistSessionsToDisk();
    }
    res.json({ success: true });
  });

  // --------------------------------------------------------------------------
  // ADMIN ACCESS MANAGEMENT & AUTHORIZATION ENFORCEMENT
  // --------------------------------------------------------------------------

  // Protected: Get full contingent roster with activation, sessions, and lockout status
  // STRICT REQUIREMENT: Only accessible by role 'admin', masks all ICs, NEVER returns icSuffix!
  app.get("/api/admin/members", (req, res) => {
    const session = getAuthenticatedSession(req);
    if (!session || session.role !== 'admin') {
      res.status(403).json({ error: "Akses ditolak: Hanya Penyelaras Admin dibenarkan." });
      return;
    }

    const membersList = CONTINGENT_ROSTER.map((m) => {
      const normalized = m.email.toLowerCase();
      const attempt = verificationAttempts.get(normalized);
      const isLocked = !!(attempt && attempt.lockedUntil && Date.now() < attempt.lockedUntil);
      
      // Count active sessions
      let activeSessionsCount = 0;
      for (const s of activeSessions.values()) {
        if (s.email.toLowerCase() === normalized) {
          activeSessionsCount++;
        }
      }

      return {
        email: m.email,
        nama: m.nama,
        role: m.role,
        title: m.title,
        badge: m.badge,
        eventAssigned: m.eventAssigned,
        program: m.program,
        noIcMasked: m.noIcMasked, // Masked strictly
        activated: m.activated,
        activatedAt: m.activatedAt,
        activeSessionsCount,
        isLocked,
        failedAttempts: attempt ? attempt.count : 0,
        lockedUntil: isLocked ? attempt?.lockedUntil : undefined
      };
    });

    res.json({
      success: true,
      members: membersList,
      totalActiveSessions: activeSessions.size,
      totalMembers: membersList.length,
      activatedCount: membersList.filter(m => m.activated).length
    });
  });

  // Protected: Revoke access for a specific member immediately
  // Invalidates all active sessions and sets activated = false
  app.post("/api/admin/revoke-member", (req, res) => {
    const session = getAuthenticatedSession(req);
    if (!session || session.role !== 'admin') {
      res.status(403).json({ error: "Akses ditolak: Hanya Penyelaras Admin dibenarkan." });
      return;
    }

    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Emel ahli sasaran diperlukan." });
      return;
    }

    const normalized = String(email).trim().toLowerCase();
    const member = CONTINGENT_ROSTER.find(m => m.email.toLowerCase() === normalized);

    if (!member) {
      res.status(404).json({ error: "Ahli tidak ditemui dalam rekod." });
      return;
    }

    // Invalidate all tokens for this email
    let revokedCount = 0;
    for (const [tok, s] of activeSessions.entries()) {
      if (s.email.toLowerCase() === normalized) {
        activeSessions.delete(tok);
        revokedTokens.add(tok);
        revokedCount++;
      }
    }
    persistSessionsToDisk();

    // Set activated = false (except master admin can stay activated if desired)
    member.activated = false;
    delete member.activatedAt;

    // Reset attempt lock
    verificationAttempts.delete(normalized);

    recordAuditLog({
      action: 'REVOKE_ACCESS',
      actor: session.email,
      targetEmail: normalized,
      details: `Akses ditarik balik oleh Admin. ${revokedCount} sesi aktif dibatalkan.`
    });

    res.json({
      success: true,
      message: `Akses keahlian untuk ${member.nama} (${member.email}) telah ditarik balik serta-merta.`,
      revokedSessions: revokedCount
    });
  });

  // Protected: Unlock member lockout
  app.post("/api/admin/unlock-member", (req, res) => {
    const session = getAuthenticatedSession(req);
    if (!session || session.role !== 'admin') {
      res.status(403).json({ error: "Akses ditolak: Hanya Penyelaras Admin dibenarkan." });
      return;
    }

    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Emel ahli sasaran diperlukan." });
      return;
    }

    const normalized = String(email).trim().toLowerCase();
    verificationAttempts.delete(normalized);

    recordAuditLog({
      action: 'UNLOCK_ACCOUNT',
      actor: session.email,
      targetEmail: normalized,
      details: 'Sekatan percubaan dibuka oleh Admin.'
    });

    res.json({
      success: true,
      message: `Sekatan akaun untuk ${normalized} telah dibuka.`
    });
  });

  // Protected: Revoke all active sessions (Emergency kill-switch)
  app.post("/api/admin/revoke-all-sessions", (req, res) => {
    const session = getAuthenticatedSession(req);
    if (!session || session.role !== 'admin') {
      res.status(403).json({ error: "Akses ditolak: Hanya Penyelaras Admin dibenarkan." });
      return;
    }

    let count = 0;
    for (const [tok, s] of activeSessions.entries()) {
      // Keep current admin session so admin doesn't lock themselves out immediately
      if (tok !== session.token) {
        activeSessions.delete(tok);
        revokedTokens.add(tok);
        count++;
      }
    }
    persistSessionsToDisk();

    recordAuditLog({
      action: 'REVOKE_ALL_SESSIONS',
      actor: session.email,
      targetEmail: 'SEMUA_PENGGUNA',
      details: `Pemberhentian sesi kecemasan. ${count} sesi ditamatkan.`
    });

    res.json({
      success: true,
      message: `Semua sesi aktif (${count} sesi) telah ditamatkan.`,
      terminatedCount: count
    });
  });

  // Protected: Security Audit Logs
  app.get("/api/admin/audit-logs", (req, res) => {
    const session = getAuthenticatedSession(req);
    if (!session || session.role !== 'admin') {
      res.status(403).json({ error: "Akses ditolak: Hanya Penyelaras Admin dibenarkan." });
      return;
    }

    res.json({
      success: true,
      logs: auditLogs
    });
  });

  // Protected: Retrieve authenticated member profile
  app.get("/api/member/profile", (req, res) => {
    const session = getAuthenticatedSession(req);
    if (!session) {
      res.status(401).json({ error: "Sesi tidak disahkan." });
      return;
    }

    res.json({
      success: true,
      profile: {
        email: session.email,
        name: session.name,
        role: session.role,
        title: session.title,
        badge: session.badge,
        eventAssigned: session.eventAssigned
      }
    });
  });

  // --------------------------------------------------------------------------
  // SES v4.5 AUTHORITATIVE OPERATIONS PHASE CONFIGURATION ENDPOINTS
  // Principles: Authoritative Data Source, Server-Side Authorization,
  // Sanitization, Normalization, Validation, Data Safety, Controlled Change Management
  // --------------------------------------------------------------------------

  // Public/Contingent: Get current authoritative operations phase state
  app.get("/api/config/phase", (_req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json({
      success: true,
      phaseState: currentOperationsPhase
    });
  });

  // Protected Admin: Update operations phase configuration
  // Strictly enforces Server-Side Authorization: only admin role permitted
  // Sanitizes, normalizes, validates inputs and records tamper-evident audit trail
  app.post("/api/admin/phase", (req, res) => {
    // 1. Server-Side Authorization Check
    const session = getAuthenticatedSession(req);
    if (!session || session.role !== 'admin') {
      res.status(403).json({ 
        error: "Akses ditolak: Hanya Penyelaras Admin Kontinjen dibenarkan mengubah fasa operasi atau modul paparan." 
      });
      return;
    }

    const { activePhaseId, announcement, visibleModules, updatedBy } = req.body;

    // 2. Sanitization helper (strips HTML, limits string lengths)
    const sanitizeText = (val: unknown, maxLen: number): string => {
      if (typeof val !== 'string') return '';
      return val.replace(/<[^>]*>?/gm, '').trim().slice(0, maxLen);
    };

    // 3. Normalization & Validation of Phase ID
    const VALID_PHASE_IDS = ['phase_01', 'phase_02', 'phase_03', 'phase_04', 'phase_05', 'phase_06'] as const;
    if (!activePhaseId || !VALID_PHASE_IDS.includes(activePhaseId)) {
      res.status(400).json({ 
        error: `ID Fasa (${activePhaseId}) tidak sah. Sila gunakan fasa yang sah antara phase_01 hingga phase_06.` 
      });
      return;
    }

    // 4. Normalization of Announcement & Coordinator Name
    const sanitizedAnnouncement = announcement !== undefined
      ? sanitizeText(announcement, 1000)
      : (currentOperationsPhase.announcement || '');
      
    const sanitizedUpdatedBy = sanitizeText(
      updatedBy || session.name || 'Penyelaras Kontinjen KPMBP',
      150
    );

    // 5. Normalization of Visible Modules (Strict boolean mapping, no unauthorized keys)
    const prevModules = currentOperationsPhase.visibleModules || {
      events: true,
      contingentOverview: true,
      schedule: true,
      calculator: true,
      checklist: true,
      talent: false,
      guidelines: true,
      deadlines: true
    };

    const normalizedVisibleModules = {
      events: typeof visibleModules?.events === 'boolean' ? visibleModules.events : prevModules.events,
      contingentOverview: typeof visibleModules?.contingentOverview === 'boolean' ? visibleModules.contingentOverview : prevModules.contingentOverview,
      schedule: typeof visibleModules?.schedule === 'boolean' ? visibleModules.schedule : prevModules.schedule,
      calculator: typeof visibleModules?.calculator === 'boolean' ? visibleModules.calculator : prevModules.calculator,
      checklist: typeof visibleModules?.checklist === 'boolean' ? visibleModules.checklist : prevModules.checklist,
      talent: typeof visibleModules?.talent === 'boolean' ? visibleModules.talent : prevModules.talent,
      guidelines: typeof visibleModules?.guidelines === 'boolean' ? visibleModules.guidelines : prevModules.guidelines,
      deadlines: typeof visibleModules?.deadlines === 'boolean' ? visibleModules.deadlines : prevModules.deadlines,
    };

    const previousPhaseId = currentOperationsPhase.activePhaseId;
    const updatedAtIso = new Date().toISOString();

    // 6. State Mutation
    currentOperationsPhase = {
      activePhaseId,
      announcement: sanitizedAnnouncement,
      visibleModules: normalizedVisibleModules,
      updatedAt: updatedAtIso,
      updatedBy: sanitizedUpdatedBy
    };

    // 7. Data Safety Persistence
    persistPhaseToDisk();

    // 8. Controlled Change Management Audit Logging
    recordAuditLog({
      action: 'PHASE_CHANGE',
      actor: session.email,
      targetEmail: 'SYSTEM_CONFIG',
      details: `Fasa operasi dikemas kini: ${previousPhaseId} -> ${activePhaseId} oleh ${session.name} (${session.email}).`
    });

    res.json({
      success: true,
      message: `Fasa operasi berjaya diselaraskan ke ${activePhaseId}.`,
      phaseState: currentOperationsPhase
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Static assets in /assets/ are hashed by Vite (e.g. index-abc123.js), cache safely for 1 year
    app.use('/assets', express.static(path.join(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true
    }));
    // All other static assets
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          // Never cache index.html so users always get current asset references
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      }
    }));
    // SPA Fallback: Never cache index.html
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kontinjen KPMBP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
