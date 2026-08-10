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
    console.error('Error adding talent submission to Firestore:', error);
    throw error;
  }
}

export function subscribeToTalentSubmissions(callback: (submissions: any[]) => void) {
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
    console.error('Error in talent submissions snapshot listener:', err);
  });
}

export async function deleteTalentSubmissionFromFirestore(docId: string) {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting submission from Firestore:', error);
    throw error;
  }
}

// Checklist Items Firebase API
export function subscribeToChecklist(callback: (items: any[]) => void) {
  const colRef = collection(db, CHECKLIST_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    const items: any[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ firestoreId: docSnap.id, ...docSnap.data() });
    });
    callback(items);
  }, (err) => {
    console.error('Error in checklist snapshot listener:', err);
  });
}

export async function saveChecklistItemToFirestore(item: any) {
  try {
    const docId = item.id || item.firestoreId;
    const docRef = doc(db, CHECKLIST_COLLECTION, docId);
    await setDoc(docRef, item, { merge: true });
  } catch (error) {
    console.error('Error saving checklist item to Firestore:', error);
    throw error;
  }
}

export async function deleteChecklistItemFromFirestore(id: string) {
  try {
    const docRef = doc(db, CHECKLIST_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting checklist item from Firestore:', error);
    throw error;
  }
}

export async function saveAllChecklistToFirestore(items: any[]) {
  try {
    for (const item of items) {
      const docId = item.id;
      const docRef = doc(db, CHECKLIST_COLLECTION, docId);
      await setDoc(docRef, item, { merge: true });
    }
  } catch (error) {
    console.error('Error syncing all checklist items to Firestore:', error);
  }
}
