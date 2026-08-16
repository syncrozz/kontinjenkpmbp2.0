import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const SUBMISSIONS_COLLECTION = 'talent_submissions';
export const CHECKLIST_COLLECTION = 'soar_checklist';

export interface FirestoreQuotaStatus {
  isQuotaExceeded: boolean;
  message?: string;
}

let quotaExceededState = false;
const quotaListeners: Array<(status: FirestoreQuotaStatus) => void> = [];

export function onQuotaStatusChange(listener: (status: FirestoreQuotaStatus) => void) {
  quotaListeners.push(listener);
  if (quotaExceededState) {
    listener({ isQuotaExceeded: true, message: 'Had kuota bacaan harian Firestore (Free Tier) telah dicapai.' });
  }
  return () => {
    const idx = quotaListeners.indexOf(listener);
    if (idx !== -1) quotaListeners.splice(idx, 1);
  };
}

function handleFirestoreListenerError(context: string, err: any) {
  const errMsg = err?.message || String(err);
  if (errMsg.includes('Quota') || errMsg.includes('quota') || errMsg.includes('resource-exhausted')) {
    quotaExceededState = true;
    console.warn(`[Firestore Quota Notice] ${context}: Had kuota percuma harian dicapai. Sistem beralih ke cache tempatan (localStorage).`);
    quotaListeners.forEach(l => l({ isQuotaExceeded: true, message: errMsg }));
  } else {
    console.warn(`[Firestore Notice] ${context}:`, errMsg);
  }
}

// Talent Submissions Firebase API
export async function addTalentSubmissionToFirestore(submissionData: any) {
  try {
    const colRef = collection(db, SUBMISSIONS_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...submissionData,
      submittedAt: submissionData.submittedAt || new Date().toISOString(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Simpanan Firestore tidak dapat diakses (menggunakan storan tempatan):', error);
    // Always backup to local storage
    try {
      const local = localStorage.getItem('kpmbp_talent_submissions');
      const list = local ? JSON.parse(local) : [];
      const newEntry = {
        ...submissionData,
        firestoreId: 'local-' + Date.now(),
        submittedAt: submissionData.submittedAt || new Date().toISOString(),
      };
      localStorage.setItem('kpmbp_talent_submissions', JSON.stringify([newEntry, ...list]));
    } catch (e) {
      console.warn('Gagal menyimpan fallback tempatan:', e);
    }
    return 'local-' + Date.now();
  }
}

export function subscribeToTalentSubmissions(callback: (submissions: any[]) => void) {
  try {
    const colRef = collection(db, SUBMISSIONS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const subs: any[] = [];
      snapshot.forEach((docSnap) => {
        subs.push({ firestoreId: docSnap.id, ...docSnap.data() });
      });
      // Sort descending by submittedAt
      subs.sort((a, b) => {
        const dateA = new Date(a.submittedAt || 0).getTime();
        const dateB = new Date(b.submittedAt || 0).getTime();
        return dateB - dateA;
      });
      callback(subs);
    }, (err) => {
      handleFirestoreListenerError('talent_submissions snapshot listener', err);
      // Fallback to local storage
      try {
        const saved = localStorage.getItem('kpmbp_talent_submissions');
        if (saved) {
          callback(JSON.parse(saved));
        }
      } catch (e) {
        console.warn('Gagal membaca cache pendaftaran:', e);
      }
    });
  } catch (err) {
    handleFirestoreListenerError('subscribeToTalentSubmissions init', err);
    try {
      const saved = localStorage.getItem('kpmbp_talent_submissions');
      if (saved) {
        callback(JSON.parse(saved));
      }
    } catch {}
    return () => {};
  }
}

export async function deleteTalentSubmissionFromFirestore(docId: string) {
  try {
    if (!docId.startsWith('local-')) {
      const docRef = doc(db, SUBMISSIONS_COLLECTION, docId);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.warn('Padaman Firestore gagal (mengemaskini storan tempatan):', error);
  }
}

// Checklist Items Firebase API
export function subscribeToChecklist(callback: (items: any[]) => void) {
  try {
    const colRef = collection(db, CHECKLIST_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ firestoreId: docSnap.id, ...docSnap.data() });
      });
      callback(items);
    }, (err) => {
      handleFirestoreListenerError('soar_checklist snapshot listener', err);
      // Fallback to local storage
      try {
        const saved = localStorage.getItem('kpmbp_soar_checklist');
        if (saved) {
          callback(JSON.parse(saved));
        }
      } catch (e) {
        console.warn('Gagal membaca cache senarai semak:', e);
      }
    });
  } catch (err) {
    handleFirestoreListenerError('subscribeToChecklist init', err);
    try {
      const saved = localStorage.getItem('kpmbp_soar_checklist');
      if (saved) {
        callback(JSON.parse(saved));
      }
    } catch {}
    return () => {};
  }
}

export async function saveChecklistItemToFirestore(item: any) {
  try {
    const docId = String(item.id || item.firestoreId);
    if (!docId.startsWith('custom-') && !docId.startsWith('local-')) {
      const docRef = doc(db, CHECKLIST_COLLECTION, docId);
      await setDoc(docRef, item, { merge: true });
    }
  } catch (error) {
    console.warn('Simpanan senarai semak Firestore gagal (disimpan di storan tempatan):', error);
  }
}

export async function deleteChecklistItemFromFirestore(id: string) {
  try {
    if (!id.startsWith('custom-') && !id.startsWith('local-')) {
      const docRef = doc(db, CHECKLIST_COLLECTION, id);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.warn('Padaman senarai semak Firestore gagal:', error);
  }
}

export async function saveAllChecklistToFirestore(items: any[]) {
  try {
    for (const item of items) {
      const docId = String(item.id);
      if (!docId.startsWith('custom-') && !docId.startsWith('local-')) {
        const docRef = doc(db, CHECKLIST_COLLECTION, docId);
        await setDoc(docRef, item, { merge: true });
      }
    }
  } catch (error) {
    console.warn('Penyelarasan semua senarai semak Firestore gagal:', error);
  }
}

