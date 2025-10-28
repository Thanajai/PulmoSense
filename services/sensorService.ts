import { Session, SensorData } from '../types';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, writeBatch, query, orderBy } from 'firebase/firestore';

const SESSIONS_COLLECTION = 'sessions';

// Firestore helpers
export const saveSession = async (session: Omit<Session, 'id'>, userId: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, SESSIONS_COLLECTION), {
      ...session,
      // Convert Date objects to Timestamps for Firestore
      startTime: session.startTime,
      endTime: session.endTime,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving session to Firestore:", error);
    throw error;
  }
};

export const getSessions = async (userId: string): Promise<Session[]> => {
  try {
    const sessionsQuery = query(collection(db, 'users', userId, SESSIONS_COLLECTION), orderBy('startTime', 'desc'));
    const querySnapshot = await getDocs(sessionsQuery);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamps back to Date objects
        startTime: data.startTime.toDate(),
        endTime: data.endTime ? data.endTime.toDate() : null,
      } as Session;
    });
  } catch (error) {
    console.error("Error getting sessions from Firestore:", error);
    return [];
  }
};

export const clearSessions = async (userId: string): Promise<void> => {
  try {
    const sessionsRef = collection(db, 'users', userId, SESSIONS_COLLECTION);
    const querySnapshot = await getDocs(sessionsRef);

    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error clearing sessions from Firestore:", error);
  }
};

export const getInterpretation = (air_quality: number): { text: string; color: string } => {
  if (air_quality < 200) return { text: "Normal breath quality", color: "text-green-400" };
  if (air_quality >= 200 && air_quality <= 400) return { text: "Slight elevation detected", color: "text-yellow-400" };
  return { text: "High impurity levels detected", color: "text-red-400" };
};