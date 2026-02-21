// src/firebase/historyService.js
import {
  collection, doc, setDoc, getDocs, deleteDoc,
  query, orderBy, limit, serverTimestamp, getDoc, writeBatch
} from 'firebase/firestore';
import { db } from './config';

// Add or update watch history for a user
export const addToFirebaseHistory = async (uid, item) => {
  try {
    // Use episodeUrl as doc ID (encoded)
    const docId = btoa(item.episodeUrl || item.url).replace(/[^a-zA-Z0-9]/g, '').slice(0, 100);
    const ref = doc(db, 'users', uid, 'history', docId);

    await setDoc(ref, {
      title: item.title || '',
      image: item.image || '',
      url: item.url || '',
      episodeUrl: item.episodeUrl || item.url || '',
      episodeTitle: item.episodeTitle || '',
      episode: item.episode || '',
      category: item.category || 'anime',
      source: item.source || '',
      watchedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('Error adding to history:', err);
  }
};

// Get watch history
export const getFirebaseHistory = async (uid, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'users', uid, 'history'),
      orderBy('watchedAt', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error getting history:', err);
    return [];
  }
};

// Remove one item
export const removeFromFirebaseHistory = async (uid, docId) => {
  try {
    await deleteDoc(doc(db, 'users', uid, 'history', docId));
  } catch (err) {
    console.error('Error removing history item:', err);
  }
};

// Clear all history
export const clearFirebaseHistory = async (uid) => {
  try {
    const q = query(collection(db, 'users', uid, 'history'));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  } catch (err) {
    console.error('Error clearing history:', err);
  }
};
