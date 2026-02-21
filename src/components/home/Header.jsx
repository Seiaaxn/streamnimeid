// src/components/home/Header.jsx
import { Search, Bell, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contex/AuthContext';

const Header = ({ scrolled }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
            scrolled
                ? 'border-b border-dark-border'
                : 'bg-gradient-to-b from-black/70 to-transparent'
        }`} style={scrolled ? { background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(20px)' } : {}}>
            <div className="flex items-center justify-between px-4 h-14">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary-400 flex items-center justify-center">
                        <span className="text-black font-black text-xs">▶</span>
                    </div>
                    <span className="text-base font-bold tracking-tight">
                        <span className="text-white">streamn</span>
                        <span className="text-primary-400">imeid</span>
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <Link to="/search" className="p-2 hover:bg-white/8 rounded-full transition-colors">
                        <Search size={19} className="text-gray-300" />
                    </Link>
                    {user ? (
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-400/30 ml-1"
                        >
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary-400/20 flex items-center justify-center">
                                    <span className="text-primary-400 text-xs font-bold">{(user.username || 'U').charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-400 text-black text-xs font-bold rounded-full ml-1"
                        >
                            <LogIn size={13} />
                            Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
