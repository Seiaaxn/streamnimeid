// src/pages/ProfilePage.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Edit3, Camera, LogOut, Lock, ChevronRight, Check, X, LogIn, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '../contex/AuthContext';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, logout, updateProfile, updateAvatar, changePassword } = useAuth();
    const fileInputRef = useRef(null);

    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', bio: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');

    const [showPassModal, setShowPassModal] = useState(false);
    const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
    const [passLoading, setPassLoading] = useState(false);
    const [passError, setPassError] = useState('');
    const [passSuccess, setPassSuccess] = useState('');

    const [avatarLoading, setAvatarLoading] = useState(false);

    const openEdit = () => {
        setEditForm({ username: user.username || '', bio: user.bio || '' });
        setEditError('');
        setEditSuccess('');
        setEditMode(true);
    };

    const handleSaveProfile = async () => {
        setEditLoading(true);
        setEditError('');
        try {
            await updateProfile({ username: editForm.username, bio: editForm.bio });
            setEditSuccess('Profil berhasil diperbarui!');
            setTimeout(() => { setEditMode(false); setEditSuccess(''); }, 1500);
        } catch (err) {
            setEditError(err.message || 'Gagal memperbarui profil');
        } finally {
            setEditLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file maksimal 5MB');
            return;
        }
        setAvatarLoading(true);
        try {
            await updateAvatar(file);
        } catch (err) {
            alert('Gagal mengupload foto: ' + err.message);
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passForm.current || !passForm.newPass || !passForm.confirm) {
            setPassError('Semua field harus diisi');
            return;
        }
        if (passForm.newPass !== passForm.confirm) {
            setPassError('Password baru tidak cocok');
            return;
        }
        if (passForm.newPass.length < 6) {
            setPassError('Password minimal 6 karakter');
            return;
        }
        setPassLoading(true);
        setPassError('');
        try {
            await changePassword(passForm.current, passForm.newPass);
            setPassSuccess('Password berhasil diubah!');
            setTimeout(() => { setShowPassModal(false); setPassForm({ current: '', newPass: '', confirm: '' }); setPassSuccess(''); }, 1500);
        } catch (err) {
            const msg = err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
                ? 'Password lama salah'
                : err.message || 'Gagal mengubah password';
            setPassError(msg);
        } finally {
            setPassLoading(false);
        }
    };

    const handleLogout = async () => {
        if (confirm('Yakin ingin keluar?')) {
            await logout();
            navigate('/');
        }
    };

    // Guest view
    if (!user) {
        return (
            <div className="min-h-screen bg-dark-bg pb-20">
                <header className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur border-b border-dark-border">
                    <div className="px-4 h-14 flex items-center">
                        <h1 className="text-lg font-bold text-white">Profil</h1>
                    </div>
                </header>
                <div className="flex flex-col items-center justify-center px-6 pt-20 gap-6">
                    <div className="w-24 h-24 rounded-full bg-dark-card flex items-center justify-center">
                        <User size={40} className="text-gray-600" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-white font-semibold text-lg mb-1">Belum Login</h2>
                        <p className="text-gray-500 text-sm">Login untuk mengakses profil dan fitur lengkap</p>
                    </div>
                    <div className="w-full space-y-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-3.5 bg-primary-400 text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                        >
                            <LogIn size={18} />
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full py-3.5 bg-dark-card border border-dark-border text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2"
                        >
                            <UserPlus size={18} />
                            Daftar Akun Baru
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const avatarUrl = user.photoURL;
    const initial = (user.username || 'U').charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            <header className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur border-b border-dark-border">
                <div className="px-4 h-14 flex items-center justify-between">
                    <h1 className="text-lg font-bold text-white">Profil</h1>
                    <button
                        onClick={openEdit}
                        className="flex items-center gap-1.5 text-primary-400 text-sm font-medium"
                    >
                        <Edit3 size={15} />
                        Edit
                    </button>
                </div>
            </header>

            <div className="px-4 pt-6 space-y-5">
                {/* Avatar + Info */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-400/20 flex items-center justify-center border-2 border-primary-400/30">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-primary-400">{initial}</span>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={avatarLoading}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center shadow-lg border-2 border-dark-bg"
                        >
                            {avatarLoading ? (
                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Camera size={14} className="text-black" />
                            )}
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>

                    <div className="text-center">
                        <h2 className="text-xl font-bold text-white">{user.username}</h2>
                        <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
                        {user.bio && <p className="text-gray-400 text-sm mt-2 max-w-xs">{user.bio}</p>}
                    </div>
                </div>

                {/* Info Cards */}
                <div className="bg-dark-card rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-400/10 flex items-center justify-center">
                            <User size={16} className="text-primary-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-medium">Username</p>
                            <p className="text-white text-sm font-medium">{user.username}</p>
                        </div>
                    </div>
                    <div className="w-full h-px bg-dark-border" />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-400/10 flex items-center justify-center">
                            <Mail size={16} className="text-primary-400" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-medium">Email</p>
                            <p className="text-white text-sm font-medium">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-dark-card rounded-2xl overflow-hidden">
                    <button
                        onClick={() => { setPassError(''); setPassSuccess(''); setPassForm({current:'',newPass:'',confirm:''}); setShowPassModal(true); }}
                        className="w-full flex items-center justify-between px-4 py-4 hover:bg-dark-surface transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Lock size={16} className="text-blue-400" />
                            </div>
                            <span className="text-white text-sm font-medium">Ubah Password</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-600" />
                    </button>
                    <div className="w-full h-px bg-dark-border mx-auto" />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-4 py-4 hover:bg-dark-surface transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <LogOut size={16} className="text-red-400" />
                            </div>
                            <span className="text-red-400 text-sm font-medium">Keluar</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-600" />
                    </button>
                </div>

                {/* Firebase badge */}
                <div className="flex items-center justify-center gap-1.5 text-gray-600 text-xs pb-2">
                    <Shield size={12} />
                    <span>Data tersimpan di Firebase</span>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {editMode && (
                <div className="fixed inset-0 z-50 flex items-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditMode(false)} />
                    <div className="relative w-full bg-dark-bg rounded-t-3xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Edit Profil</h3>
                            <button onClick={() => setEditMode(false)} className="p-1.5 rounded-full hover:bg-dark-card">
                                <X size={18} className="text-gray-400" />
                            </button>
                        </div>

                        {editError && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-xl">{editError}</p>}
                        {editSuccess && <p className="text-green-400 text-sm bg-green-500/10 px-3 py-2 rounded-xl">{editSuccess}</p>}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Username</label>
                                <input
                                    value={editForm.username}
                                    onChange={e => setEditForm(f => ({...f, username: e.target.value}))}
                                    placeholder="Username kamu"
                                    className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl px-4 py-3.5 outline-none focus:border-primary-400/60"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1.5">Bio</label>
                                <textarea
                                    value={editForm.bio}
                                    onChange={e => setEditForm(f => ({...f, bio: e.target.value}))}
                                    placeholder="Ceritakan sedikit tentang dirimu..."
                                    rows={3}
                                    className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl px-4 py-3.5 outline-none focus:border-primary-400/60 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setEditMode(false)} className="flex-1 py-3.5 bg-dark-card border border-dark-border text-gray-400 font-semibold rounded-xl text-sm">
                                Batal
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={editLoading}
                                className="flex-1 py-3.5 bg-primary-400 text-black font-bold rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {editLoading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPassModal && (
                <div className="fixed inset-0 z-50 flex items-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPassModal(false)} />
                    <div className="relative w-full bg-dark-bg rounded-t-3xl p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Ubah Password</h3>
                            <button onClick={() => setShowPassModal(false)} className="p-1.5 rounded-full hover:bg-dark-card">
                                <X size={18} className="text-gray-400" />
                            </button>
                        </div>

                        {passError && <p className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-xl">{passError}</p>}
                        {passSuccess && <p className="text-green-400 text-sm bg-green-500/10 px-3 py-2 rounded-xl">{passSuccess}</p>}

                        <div className="space-y-4">
                            {['current', 'newPass', 'confirm'].map((field, i) => (
                                <div key={field}>
                                    <label className="block text-xs text-gray-500 mb-1.5">
                                        {field === 'current' ? 'Password Lama' : field === 'newPass' ? 'Password Baru' : 'Konfirmasi Password Baru'}
                                    </label>
                                    <input
                                        type="password"
                                        value={passForm[field]}
                                        onChange={e => setPassForm(f => ({...f, [field]: e.target.value}))}
                                        placeholder={field === 'current' ? 'Password saat ini' : 'Min. 6 karakter'}
                                        className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl px-4 py-3.5 outline-none focus:border-primary-400/60"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowPassModal(false)} className="flex-1 py-3.5 bg-dark-card border border-dark-border text-gray-400 font-semibold rounded-xl text-sm">
                                Batal
                            </button>
                            <button
                                onClick={handleChangePassword}
                                disabled={passLoading}
                                className="flex-1 py-3.5 bg-primary-400 text-black font-bold rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {passLoading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
                    
