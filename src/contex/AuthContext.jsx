import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const STORAGE_KEY = 'snid_auth_user';
const USERS_KEY = 'snid_users';
const readUser = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; } };
const saveUser = (u) => localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
const clearUser = () => localStorage.removeItem(STORAGE_KEY);
const readUsers = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; } };
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = readUser();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    const users = readUsers();
    if (Object.values(users).find(u => u.email === email)) throw new Error('Email sudah digunakan');
    const uid = 'uid_' + Date.now();
    const newUser = { uid, username, email, password, photoURL: null, bio: '', createdAt: new Date().toISOString() };
    users[uid] = newUser;
    saveUsers(users);
    const { password: _, ...safeUser } = newUser;
    saveUser(safeUser);
    setUser(safeUser);
    return safeUser;
  };

  const login = async (email, password) => {
    const users = readUsers();
    const found = Object.values(users).find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Email atau password salah');
    const { password: _, ...safeUser } = found;
    saveUser(safeUser);
    setUser(safeUser);
    return safeUser;
  };

  const logout = async () => { clearUser(); setUser(null); };

  const updateProfile = async ({ username, bio }) => {
    if (!user) throw new Error('Tidak login');
    const users = readUsers();
    if (users[user.uid]) { users[user.uid] = { ...users[user.uid], username, bio }; saveUsers(users); }
    const updated = { ...user, username, bio };
    saveUser(updated); setUser(updated);
  };

  const updateAvatar = async (file) => {
    if (!user) throw new Error('Tidak login');
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) return reject(new Error('File terlalu besar (maks 5MB)'));
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const users = readUsers();
        if (users[user.uid]) { users[user.uid] = { ...users[user.uid], photoURL: dataUrl }; saveUsers(users); }
        const updated = { ...user, photoURL: dataUrl };
        saveUser(updated); setUser(updated); resolve(dataUrl);
      };
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsDataURL(file);
    });
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error('Tidak login');
    const users = readUsers();
    const stored = users[user.uid];
    if (!stored || stored.password !== currentPassword) throw new Error('Password lama salah');
    users[user.uid] = { ...stored, password: newPassword };
    saveUsers(users);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const users = readUsers();
    const stored = users[user.uid];
    if (stored) { const { password: _, ...safeUser } = stored; saveUser(safeUser); setUser(safeUser); }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile, updateAvatar, changePassword, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
