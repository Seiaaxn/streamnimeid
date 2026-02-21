// src/pages/auth/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Play, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../../contex/AuthContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const passwordStrength = (p) => {
        if (!p) return 0;
        let score = 0;
        if (p.length >= 6) score++;
        if (p.length >= 10) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        return score;
    };

    const strength = passwordStrength(form.password);
    const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
    const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.username || !form.email || !form.password) {
            setError('Semua field harus diisi');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Konfirmasi password tidak cocok');
            return;
        }
        if (form.password.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await register(form.username, form.email, form.password);
            navigate('/');
        } catch (err) {
            const msg = err.code === 'auth/email-already-in-use'
                ? 'Email sudah terdaftar'
                : err.code === 'auth/weak-password'
                ? 'Password terlalu lemah'
                : err.code === 'auth/invalid-email'
                ? 'Format email tidak valid'
                : err.message || 'Terjadi kesalahan';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col">
            <div className="flex items-center gap-3 px-4 pt-12 pb-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-dark-card transition-colors">
                    <ArrowLeft size={20} className="text-gray-400" />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 pb-8">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-400/30">
                        <Play size={24} className="text-black ml-1" fill="currentColor" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Buat Akun</h1>
                    <p className="text-gray-500 text-sm">Bergabung dan nikmati anime gratis</p>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5 font-medium">Username</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type="text"
                                value={form.username}
                                onChange={e => setForm({...form, username: e.target.value})}
                                placeholder="Nama pengguna unikmu"
                                className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl pl-10 pr-4 py-3.5 outline-none focus:border-primary-400/60 transition-colors placeholder:text-gray-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5 font-medium">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({...form, email: e.target.value})}
                                placeholder="email@contoh.com"
                                className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl pl-10 pr-4 py-3.5 outline-none focus:border-primary-400/60 transition-colors placeholder:text-gray-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5 font-medium">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={form.password}
                                onChange={e => setForm({...form, password: e.target.value})}
                                placeholder="Min. 6 karakter"
                                className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl pl-10 pr-11 py-3.5 outline-none focus:border-primary-400/60 transition-colors placeholder:text-gray-700"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {form.password && (
                            <div className="mt-2 space-y-1">
                                <div className="flex gap-1">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor[strength] : 'bg-dark-border'}`} />
                                    ))}
                                </div>
                                <p className={`text-[10px] ${strength >= 3 ? 'text-green-400' : strength >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {strengthLabel[strength]}
                                </p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5 font-medium">Konfirmasi Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={form.confirmPassword}
                                onChange={e => setForm({...form, confirmPassword: e.target.value})}
                                placeholder="Ulangi password"
                                className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl pl-10 pr-11 py-3.5 outline-none focus:border-primary-400/60 transition-colors placeholder:text-gray-700"
                            />
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {form.confirmPassword && form.password === form.confirmPassword && (
                                    <Check size={14} className="text-green-400" />
                                )}
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-600 hover:text-gray-400">
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-primary-400 text-black font-bold rounded-xl text-sm transition-all active:scale-95 disabled:opacity-60 mt-2 shadow-lg shadow-primary-400/20"
                    >
                        {loading ? 'Membuat akun...' : 'Daftar Sekarang'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-primary-400 font-semibold hover:text-primary-300">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
        
