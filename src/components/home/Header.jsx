// src/components/home/Header.jsx
import { Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ scrolled }) => {
    return (
        <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
            scrolled
                ? 'border-b border-dark-border'
                : 'bg-gradient-to-b from-black/70 to-transparent'
        }`} style={scrolled ? { background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(20px)' } : {}}>
            <div className="flex items-center justify-between px-4 h-14">
                <div className="flex items-center gap-2">
                    {/* Logo mark */}
                    <div className="w-7 h-7 rounded-lg bg-primary-400 flex items-center justify-center">
                        <span className="text-black font-black text-xs">▶</span>
                    </div>
                    <span className="text-base font-bold tracking-tight">
                        <span className="text-white">anime</span>
                        <span className="text-primary-400">play</span>
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <Link
                        to="/search"
                        className="p-2 hover:bg-white/8 rounded-full transition-colors"
                    >
                        <Search size={19} className="text-gray-300" />
                    </Link>
                    <button className="p-2 hover:bg-white/8 rounded-full transition-colors relative">
                        <Bell size={19} className="text-gray-300" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary-400 rounded-full" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
