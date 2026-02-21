// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

const STORAGE_KEY = 'animeplay_users';
const SESSION_KEY = 'animeplay_session';

const getUsers = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
};

const saveUsers = (users) => localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const session = localStorage.getItem(SESSION_KEY);
            if (session) {
                const parsed = JSON.parse(session);
                // Re-validate session against user db
                const users = getUsers();
                const found = users.find(u => u.id === parsed.id);
                if (found) setUser(found);
                else localStorage.removeItem(SESSION_KEY);
            }
        } catch {
            localStorage.removeItem(SESSION_KEY);
        }
        setLoading(false);
    }, []);

    const register = (username, email, password) => {
        const users = getUsers();
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('Email sudah terdaftar');
        }
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            throw new Error('Username sudah digunakan');
        }
        if (password.length < 6) throw new Error('Password minimal 6 karakter');

        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password, // In real app, hash this
            avatar: null,
            bio: '',
            createdAt: new Date().toISOString(),
        };
        saveUsers([...users, newUser]);
        setUser(newUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        return newUser;
    };

    const login = (emailOrUsername, password) => {
        const users = getUsers();
        const found = users.find(
            u => (u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
                  u.username.toLowerCase() === emailOrUsername.toLowerCase()) &&
                 u.password === password
        );
        if (!found) throw new Error('Email/username atau password salah');
        setUser(found);
        localStorage.setItem(SESSION_KEY, JSON.stringify(found));
        return found;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
    };

    const updateProfile = ({ username, bio, avatar }) => {
        const users = getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx === -1) throw new Error('User tidak ditemukan');

        if (username && username !== user.username) {
            const exists = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.id !== user.id);
            if (exists) throw new Error('Username sudah digunakan');
        }

        const updated = {
            ...users[idx],
            ...(username ? { username } : {}),
            ...(bio !== undefined ? { bio } : {}),
            ...(avatar !== undefined ? { avatar } : {}),
        };

        users[idx] = updated;
        saveUsers(users);
        setUser(updated);
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
        return updated;
    };

    const changePassword = (oldPassword, newPassword) => {
        const users = getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx === -1) throw new Error('User tidak ditemukan');
        if (users[idx].password !== oldPassword) throw new Error('Password lama salah');
        if (newPassword.length < 6) throw new Error('Password minimal 6 karakter');

        users[idx].password = newPassword;
        saveUsers(users);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile, changePassword }}>
            {children}
        </AuthContext.Provider>
    );
};
  
