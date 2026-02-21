// src/contex/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  uploadAvatar,
  changeUserPassword
} from '../firebase/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (uid) => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) setProfile(snap.data());
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await refreshProfile(fbUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const register = async (username, email, password) => {
    return await registerUser(username, email, password);
  };

  const login = async (email, password) => {
    return await loginUser(email, password);
  };

  const logout = async () => {
    await logoutUser();
  };

  const updateProfile = async (data) => {
    if (!firebaseUser) throw new Error('Not logged in');
    await updateUserProfile(firebaseUser.uid, data);
    await refreshProfile(firebaseUser.uid);
  };

  const updateAvatar = async (file) => {
    if (!firebaseUser) throw new Error('Not logged in');
    const url = await uploadAvatar(firebaseUser.uid, file);
    setProfile(prev => ({ ...prev, photoURL: url }));
    return url;
  };

  const changePassword = async (currentPassword, newPassword) => {
    await changeUserPassword(currentPassword, newPassword);
  };

  const user = firebaseUser ? {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    username: profile?.username || firebaseUser.displayName || 'User',
    photoURL: profile?.photoURL || firebaseUser.photoURL || null,
    bio: profile?.bio || '',
    displayName: profile?.username || firebaseUser.displayName || 'User',
  } : null;

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loading,
      register,
      login,
      logout,
      updateProfile,
      updateAvatar,
      changePassword,
      refreshProfile: () => firebaseUser && refreshProfile(firebaseUser.uid),
    }}>
      {children}
    </AuthContext.Provider>
  );
};
      
