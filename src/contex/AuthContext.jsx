import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config'; 
import * as authSvc from '../firebase/authService';

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

  useEffect(() => {
    // Listener status login
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const snap = await getDoc(doc(db, 'users', fbUser.uid));
          if (snap.exists()) setProfile(snap.data());
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Bungkus fungsi dari authService agar bisa dipakai di UI
  const register = (username, email, password) => authSvc.registerUser(username, email, password);
  const login = (email, password) => authSvc.loginUser(email, password);
  const logout = () => authSvc.logoutUser();

  const user = firebaseUser ? {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    username: profile?.username || firebaseUser.displayName || 'User',
    photoURL: profile?.photoURL || firebaseUser.photoURL || null,
    bio: profile?.bio || '',
  } : null;

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
