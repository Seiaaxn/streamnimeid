// src/pages/ProfilePage.jsx
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    User, Mail, Lock, Camera, Edit3, LogOut, ChevronRight,
    Check, Eye, EyeOff, Heart, BookOpen, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AvatarDisplay = ({ user, size = 'lg' }) => {
    const sizeClass = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-10 h-10 text-sm';
    const initial = user?.username?.[0]?.toUpperCase() || '?';
    if (user?.avatar) {
        return <img src={user.avatar} alt={user.username} className={`${sizeClass} rounded-full object-cover border-2 border-primary-400/30`} />;
    }
    return (
        <div className={`${sizeClass} rounded-full bg-gradient-to-br from-primary-400 to-primary-300 flex items-center justify-center font-bold text-black`}>
            {initial}
        </div>
    );
};

const EditNameModal = ({ user, onSave, onClose }) => {
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio || '');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        if (!username.trim()) { setError('Username tidak boleh kosong'); return; }
        if (username.trim().length < 3) { setError('Username minimal 3 karakter'); return; }
        setSaving(true);
        try { onSave({ username: username.trim(), bio: bio.trim() }); onClose(); }
        catch (err) { setError(err.message); }
        finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-end" onClick={onClose}>
            <div className="w-full bg-dark-surface rounded-t-3xl p-6 pb-8" onClick={e => e.stopPropagation()}>
                <div className="w-10 h-1 bg-dark-border rounded-full mx-auto mb-5" />
                <h3 className="text-base font-bold text-white mb-5">Edit Profil</h3>
                {error && <div className="mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2"><AlertCircle size={14}/>{error}</div>}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5 font-medium">Username</label>
                        <div className="relative">
                            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"/>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl pl-9 pr-4 py-3 outline-none focus:border-primary-400/60 transition-colors"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5 font-medium">Bio</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Ceritakan sedikit tentang dirimu..." rows={3} maxLength={120} className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-primary-400/60 transition-colors resize-none placeholder:text-gray-700"/>
                        <p className="text-[10px] text-gray-600 text-right mt-1">{bio.length}/120</p>
                    </div>
                </div>
                <div className="flex gap-3 mt-5">
                    <button onClick={onClose} className="flex-1 py-3 bg-dark-card text-gray-400 rounded-xl text-sm font-medium">Batal</button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-primary-400 text-black rounded-xl text-sm font-bold disabled:opacity-60">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                </div>
            </div>
        </div>
    );
};

const ChangePasswordModal = ({ onSave, onClose }) => {
    const [form, setForm] = useState({ old: '', newPass: '', confirm: '' });
    const [show, setShow] = useState({ old: false, new: false, confirm: false });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        if (!form.old || !form.newPass || !form.confirm) { setError('Semua field harus diisi'); return; }
        if (form.newPass !== form.confirm) { setError('Konfirmasi password tidak cocok'); return; }
        if (form.newPass.length < 6) { setError('Password baru minimal 6 karakter'); return; }
        setSaving(true);
        try { onSave(form.old, form.newPass); onClose(); }
        catch (err) { setError(err.message); }
        finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-end" onClick={onClose}>
            <div className="w-full bg-dark-surface rounded-t-3xl p-6 pb-8" onClick={e => e.stopPropagation()}>
                <div className="w-10 h-1 bg-dark-border rounded-full mx-auto mb-5" />
                <h3 className="text-base font-bold text-white mb-5">Ganti Password</h3>
                {error && <div className="mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2"><AlertCircle size={14}/>{error}</div>}
                <div className="space-y-4">
                    {[{key:'old',label:'Password Lama',sk:'old'},{key:'newPass',label:'Password Baru',sk:'new'},{key:'confirm',label:'Konfirmasi Password Baru',sk:'confirm'}].map(f => (
                        <div key={f.key}>
                            <label className="block text-xs text-gray-500 mb-1.5 font-medium">{f.label}</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"/>
                                <input type={show[f.sk] ? 'text':'password'} value={form[f.key]} onChange={e => setForm({...form,[f.key]:e.target.value})} className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl pl-9 pr-10 py-3 outline-none focus:border-primary-400/60 transition-colors"/>
                                <button type="button" onClick={() => setShow({...show,[f.sk]:!show[f.sk]})} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600">{show[f.sk] ? <EyeOff size={15}/> : <Eye size={15}/>}</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-3 mt-5">
                    <button onClick={onClose} className="flex-1 py-3 bg-dark-card text-gray-400 rounded-xl text-sm font-medium">Batal</button>
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-primary-400 text-black rounded-xl text-sm font-bold disabled:opacity-60">{saving ? 'Menyimpan...' : 'Ganti Password'}</button>
                </div>
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout, updateProfile, updateAvatar, changePassword } = useAuth();
    const fileRef = useRef(null);
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState('');

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { showToast('Ukuran foto maks 2MB'); return; }
        try {
            await updateAvatar(file);
            showToast('Foto profil berhasil diubah!');
        } catch (err) {
            showToast(err.message || 'Gagal upload foto');
        }
    };

    const handleSaveProfile = (data) => { try { updateProfile(data); showToast('Profil berhasil diperbarui!'); } catch (err) { throw err; } };
    const handleChangePassword = (oldPass, newPass) => { try { changePassword(oldPass, newPass); showToast('Password berhasil diubah!'); } catch (err) { throw err; } };
    const handleLogout = () => { logout(); navigate('/login'); };

    if (!user) {
        return (
            <div className="min-h-screen bg-dark-bg pb-20 flex flex-col">
                <header className="sticky top-0 z-40 border-b border-dark-border" style={{background:'rgba(10,10,10,0.95)',backdropFilter:'blur(20px)'}}>
                    <div className="px-4 h-14 flex items-center"><h1 className="text-base font-bold text-white">Profil</h1></div>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-dark-card flex items-center justify-center mb-5">
                        <User size={32} className="text-gray-600"/>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2">Belum Login</h2>
                    <p className="text-gray-500 text-sm mb-8">Login untuk menyimpan progress dan preferensi kamu</p>
                    <div className="w-full space-y-3">
                        <Link to="/login" className="block w-full py-3.5 bg-primary-400 text-black font-bold rounded-xl text-sm text-center">Login</Link>
                        <Link to="/register" className="block w-full py-3.5 bg-dark-card border border-dark-border text-white font-medium rounded-xl text-sm text-center">Daftar Akun Baru</Link>
                    </div>
                </div>
            </div>
        );
    }

    const joinDate = user.createdAt ? new Intl.DateTimeFormat('id-ID', {day:'numeric',month:'long',year:'numeric'}).format(new Date(user.createdAt)) : '-';

    const menuGroups = [
        {
            title: 'Akun',
            items: [
                { icon: Edit3, label: 'Edit Profil', sub: 'Ubah nama dan bio', action: () => setModal('editName'), color: 'text-primary-400' },
                { icon: Camera, label: 'Ganti Foto Profil', sub: 'JPG, PNG maks 2MB', action: () => fileRef.current?.click(), color: 'text-blue-400' },
                { icon: Lock, label: 'Ganti Password', sub: 'Ubah password akun', action: () => setModal('changePass'), color: 'text-purple-400' },
            ]
        },
        {
            title: 'Navigasi',
            items: [
                { icon: Heart, label: 'My List', sub: 'Anime yang kamu simpan', action: () => navigate('/mylist'), color: 'text-red-400' },
                { icon: BookOpen, label: 'Jelajahi Anime', sub: 'Temukan anime & donghua baru', action: () => navigate('/explore'), color: 'text-orange-400' },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-dark-bg pb-24">
            {toast && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] px-4 py-2.5 bg-dark-surface border border-dark-border rounded-full text-white text-xs font-medium shadow-xl flex items-center gap-2">
                    <Check size={13} className="text-primary-400"/> {toast}
                </div>
            )}

            <header className="sticky top-0 z-40 border-b border-dark-border" style={{background:'rgba(10,10,10,0.95)',backdropFilter:'blur(20px)'}}>
                <div className="px-4 h-14 flex items-center justify-between">
                    <h1 className="text-base font-bold text-white">Profil</h1>
                    <button onClick={() => setModal('logout')} className="p-2 hover:bg-dark-card rounded-full transition-colors">
                        <LogOut size={18} className="text-red-400"/>
                    </button>
                </div>
            </header>

            <input type="file" ref={fileRef} accept="image/*" onChange={handleAvatarChange} className="hidden"/>

            {/* Profile Card */}
            <div className="px-4 pt-6 pb-4">
                <div className="bg-dark-card rounded-2xl p-5 border border-dark-border">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <AvatarDisplay user={user} size="lg"/>
                            <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-400 rounded-full flex items-center justify-center shadow-lg">
                                <Camera size={13} className="text-black"/>
                            </button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base font-bold text-white truncate">{user.username}</h2>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                            {user.bio && <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{user.bio}</p>}
                            <p className="text-[10px] text-gray-600 mt-2">Bergabung {joinDate}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Groups */}
            {menuGroups.map((group) => (
                <div key={group.title} className="px-4 mb-4">
                    <p className="text-[11px] text-gray-600 font-semibold uppercase tracking-wider mb-2 px-1">{group.title}</p>
                    <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
                        {group.items.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <button key={item.label} onClick={item.action} className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-dark-surface transition-colors ${idx < group.items.length-1 ? 'border-b border-dark-border' : ''}`}>
                                    <div className="w-8 h-8 rounded-xl bg-dark-surface flex items-center justify-center flex-shrink-0">
                                        <Icon size={15} className={item.color}/>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm text-white font-medium">{item.label}</p>
                                        <p className="text-[11px] text-gray-500 mt-0.5">{item.sub}</p>
                                    </div>
                                    <ChevronRight size={15} className="text-gray-600"/>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Logout */}
            <div className="px-4">
                <button onClick={() => setModal('logout')} className="w-full py-3.5 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-red-500/15 transition-colors">
                    <LogOut size={16}/> Keluar dari Akun
                </button>
            </div>

            {modal === 'editName' && <EditNameModal user={user} onSave={handleSaveProfile} onClose={() => setModal(null)}/>}
            {modal === 'changePass' && <ChangePasswordModal onSave={handleChangePassword} onClose={() => setModal(null)}/>}
            {modal === 'logout' && (
                <div className="fixed inset-0 z-[100] bg-black/70 flex items-end" onClick={() => setModal(null)}>
                    <div className="w-full bg-dark-surface rounded-t-3xl p-6 pb-8" onClick={e => e.stopPropagation()}>
                        <div className="w-10 h-1 bg-dark-border rounded-full mx-auto mb-5"/>
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                                <LogOut size={22} className="text-red-400"/>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1">Keluar dari Akun?</h3>
                            <p className="text-gray-500 text-sm">Kamu harus login kembali untuk mengakses akunmu</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setModal(null)} className="flex-1 py-3 bg-dark-card text-gray-400 rounded-xl text-sm font-medium">Batal</button>
                            <button onClick={handleLogout} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold">Ya, Keluar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
                            
