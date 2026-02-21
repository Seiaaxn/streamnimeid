// src/contex/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// ── lazy-load firebase agar build tidak gagal jika firebase belum install ─────
const getFirebase = async () => {
  try {
    const [
      { onAuthStateChanged },
      { doc, getDoc },
      { auth, db },
      authSvc,
    ] = await Promise.all([
      import('firebase/auth'),
      import('firebase/firestore'),
      import('../firebase/config.js'),
      import('../firebase/authService.js'),
    ]);
    return { onAuthStateChanged, doc, getDoc, auth, db, ...authSvc };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebase, setFirebase] = useState(null);

  // ── boot: load firebase, set up auth listener ────────────────────────────
  useEffect(() => {
    let unsub = () => {};
    getFirebase().then(fb => {
      setFirebase(fb);
      if (!fb) { setLoading(false); return; }

      unsub = fb.onAuthStateChanged(fb.auth, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          try {
            const snap = await fb.getDoc(fb.doc(fb.db, 'users', fbUser.uid));
            if (snap.exists()) setProfile(snap.data());
          } catch {}
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
    });
    return () => unsub();
  }, []);

  const refreshProfile = async () => {
    if (!firebase || !firebaseUser) return;
    try {
      const snap = await firebase.getDoc(firebase.doc(firebase.db, 'users', firebaseUser.uid));
      if (snap.exists()) setProfile(snap.data());
    } catch {}
  };

  // ── auth actions ──────────────────────────────────────────────────────────
  const register = async (username, email, password) => {
    if (!firebase) throw new Error('Firebase tidak tersedia');
    return await firebase.registerUser(username, email, password);
  };

  const login = async (email, password) => {
    if (!firebase) throw new Error('Firebase tidak tersedia');
    return await firebase.loginUser(email, password);
  };

  const logout = async () => {
    if (!firebase) return;
    await firebase.logoutUser();
  };

  const updateProfile = async (data) => {
    if (!firebase || !firebaseUser) throw new Error('Tidak login');
    await firebase.updateUserProfile(firebaseUser.uid, data);
    await refreshProfile();
  };

  const updateAvatar = async (file) => {
    if (!firebase || !firebaseUser) throw new Error('Tidak login');
    const url = await firebase.uploadAvatar(firebaseUser.uid, file);
    setProfile(prev => ({ ...prev, photoURL: url }));
    return url;
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!firebase) throw new Error('Firebase tidak tersedia');
    await firebase.changeUserPassword(currentPassword, newPassword);
  };

  // ── merged user object ────────────────────────────────────────────────────
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
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
    
