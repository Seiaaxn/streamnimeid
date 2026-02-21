// src/components/layout/MainLayout.jsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Heart, Search } from 'lucide-react';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { id: 'home', label: 'Home', icon: Home, path: '/' },
        { id: 'explore', label: 'Explore', icon: Compass, path: '/explore' },
        { id: 'search', label: 'Search', icon: Search, path: '/search' },
        { id: 'mylist', label: 'My List', icon: Heart, path: '/mylist' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-dark-bg pb-20">
            <Outlet />

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 border-t border-dark-border z-50 pb-safe" style={{background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)'}}>
                <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${active ? 'text-primary-400' : 'text-gray-600 hover:text-gray-400'}`}
                            >
                                <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${active ? 'bg-primary-400/10' : ''}`}>
                                    <Icon
                                        size={22}
                                        strokeWidth={active ? 2.5 : 2}
                                        className={`transition-transform duration-300 ${active ? 'scale-110' : ''}`}
                                    />
                                </div>
                                <span className={`text-[10px] font-medium tracking-wide ${active ? 'opacity-100' : 'opacity-50'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default MainLayout;
                                  
