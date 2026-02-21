// src/firebase/commentService.js
import {
  collection, addDoc, query, orderBy, limit,
  getDocs, serverTimestamp, doc, updateDoc, increment,
  where, deleteDoc, getDoc
} from 'firebase/firestore';
import { db } from './config';

// Get comments for an episode/anime
export const getComments = async (contentId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('contentId', '==', contentId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error('Error getting comments:', err);
    return [];
  }
};

// Add a comment
export const addComment = async (contentId, user, text) => {
  if (!text.trim()) return null;
  const commentRef = await addDoc(collection(db, 'comments'), {
    contentId,
    uid: user.uid,
    username: user.displayName || user.username || 'Anon',
    photoURL: user.photoURL || null,
    text: text.trim(),
    likes: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
  });
  return commentRef.id;
};

// Like / unlike a comment
export const toggleLikeComment = async (commentId, uid) => {
  const ref = doc(db, 'comments', commentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const likedBy = data.likedBy || [];
  const hasLiked = likedBy.includes(uid);

  await updateDoc(ref, {
    likes: increment(hasLiked ? -1 : 1),
    likedBy: hasLiked
      ? likedBy.filter(id => id !== uid)
      : [...likedBy, uid]
  });
};

// Delete a comment (owner only)
export const deleteComment = async (commentId, uid) => {
  const ref = doc(db, 'comments', commentId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  if (snap.data().uid !== uid) return;
  await deleteDoc(ref);
};
    
