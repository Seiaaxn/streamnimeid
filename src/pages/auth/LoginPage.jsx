// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Play, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contex/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError('Semua field harus diisi');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await login(form.email, form.password);
            navigate('/');
        } catch (err) {
            const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
                ? 'Email atau password salah'
                : err.code === 'auth/user-not-found'
                ? 'Akun tidak ditemukan'
                : err.code === 'auth/too-many-requests'
                ? 'Terlalu banyak percobaan, coba lagi nanti'
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

            <div className="flex-1 flex flex-col justify-center px-6 pb-12">
                <div className="text-center mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-400/30">
                        <Play size={24} className="text-black ml-1" fill="currentColor" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Selamat Datang</h1>
                    <p className="text-gray-500 text-sm">Login ke akun StreamnimeID kamu</p>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="Masukkan password"
                                className="w-full bg-dark-card border border-dark-border text-white text-sm rounded-xl pl-10 pr-11 py-3.5 outline-none focus:border-primary-400/60 transition-colors placeholder:text-gray-700"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-primary-400 text-black font-bold rounded-xl text-sm transition-all active:scale-95 disabled:opacity-60 mt-2 shadow-lg shadow-primary-400/20"
                    >
                        {loading ? 'Memproses...' : 'Masuk'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-primary-400 font-semibold hover:text-primary-300">
                        Daftar Sekarang
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
                                    
