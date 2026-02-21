// src/firebase/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as firebaseUpdateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc, setDoc, getDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from './config';

// Register
export const registerUser = async (username, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await firebaseUpdateProfile(user, { displayName: username });

  // Save to Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    username,
    email,
    bio: '',
    photoURL: null,
    createdAt: serverTimestamp(),
  });

  return user;
};

// Login
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Logout
export const logoutUser = async () => {
  await signOut(auth);
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

// Update profile (username, bio)
export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, 'users', uid);
  const updateData = {};
  if (data.username) {
    updateData.username = data.username;
    await firebaseUpdateProfile(auth.currentUser, { displayName: data.username });
  }
  if (data.bio !== undefined) updateData.bio = data.bio;
  await updateDoc(userRef, updateData);
};

// Upload avatar to Storage
export const uploadAvatar = async (uid, file) => {
  const storageRef = ref(storage, `avatars/${uid}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await firebaseUpdateProfile(auth.currentUser, { photoURL: url });
  await updateDoc(doc(db, 'users', uid), { photoURL: url });

  return url;
};

// Change password
export const changeUserPassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
};

// Auth state listener
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
    
